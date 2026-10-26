// Real HTTP regression test. Only a newly initialized, disposable local stack is allowed.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const root = new URL('../', import.meta.url);
const workdir = realpathSync(process.env.STORAGE_TEST_WORKDIR || '');
const cli = process.env.STORAGE_TEST_CLI;
assert(cli, 'Set STORAGE_TEST_CLI to the Supabase CLI executable.');
assert.match(workdir, /^\/private\/tmp\/pentulaskuri-storage-http-[a-zA-Z0-9_-]+$/);
const config = readFileSync(`${workdir}/supabase/config.toml`, 'utf8');
const project = config.match(/^project_id = "([^"]+)"/m)?.[1];
assert.match(project || '', /^pentulaskuri-storage-http-[a-zA-Z0-9_-]+$/);

function command(bin, args, options = {}) {
  try {
    return execFileSync(bin, args, {
      encoding: 'utf8', timeout: 30_000, maxBuffer: 2 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'], ...options,
    });
  } catch (error) {
    // CLI status contains credentials. Never include captured output in an exception.
    throw new Error(`${bin.split('/').at(-1)} failed (exit ${error.status ?? 'unknown'}).`);
  }
}
const endpoint = command('docker', ['context', 'inspect', '--format', '{{.Endpoints.docker.Host}}']).trim();
assert(!process.env.DOCKER_HOST && endpoint.startsWith('unix://'), 'Local Docker only.');
const status = JSON.parse(command(cli, ['status', '--workdir', workdir, '--output', 'json']));
const base = status.API_URL;
assert.equal(base, 'http://127.0.0.1:55321');
const anon = status.ANON_KEY;
const service = status.SERVICE_ROLE_KEY;
assert(anon && service, 'Local CLI status must include local JWT keys.');
const container = `supabase_db_${project}`;
function sql(input) {
  return command('docker', ['exec', '-i', container, 'psql', '-X', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-qAt'], {
    input: `SET client_min_messages = warning;\n${input}`,
  });
}
let checks = 0;
function check(condition, label) {
  assert(condition, label);
  checks += 1;
  console.log(`PASS ${label}`);
}
async function request(path, { token = anon, method = 'GET', body, mime, headers = {} } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { apikey: anon, Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': mime || 'application/json' } : {}), ...headers },
    body: body && (mime ? body : JSON.stringify(body)),
  });
  const raw = await response.text();
  let data;
  try { data = JSON.parse(raw); } catch { data = null; }
  return { ok: response.ok, status: response.status, data };
}
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
const storage = '/storage/v1';
const bucket = 'puppy-books';
const objectPath = (path) => path.split('/').map(encodeURIComponent).join('/');
const upload = (path, token, extra = {}) => request(`${storage}/object/${bucket}/${objectPath(path)}`, { method: 'POST', token, body: png, mime: 'image/png', ...extra });
const sign = (path, token, expiresIn = 300) => request(`${storage}/object/sign/${bucket}/${objectPath(path)}`, { method: 'POST', token, body: { expiresIn } });
const read = (path, token) => request(`${storage}/object/authenticated/${bucket}/${objectPath(path)}`, { token });
const remove = (path, token) => request(`${storage}/object/${bucket}`, { method: 'DELETE', token, body: { prefixes: [path] } });

// No production schema or credentials are accepted. This fixture lives only in the disposable stack.
sql(`
CREATE TABLE public.puppy_books (id uuid PRIMARY KEY, owner_id uuid NOT NULL REFERENCES auth.users);
ALTER TABLE public.puppy_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY books_owner ON public.puppy_books TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE TABLE public.memories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), book_id uuid REFERENCES public.puppy_books, photo_url text);
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY memories_owner ON public.memories TO authenticated USING (
  EXISTS (SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = auth.uid())
) WITH CHECK (EXISTS (SELECT 1 FROM public.puppy_books b WHERE b.id = book_id AND b.owner_id = auth.uid()));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.puppy_books, public.memories TO authenticated;
CREATE POLICY "Users can view puppy book images" ON storage.objects FOR SELECT USING (bucket_id = 'puppy-books');
CREATE POLICY "Users can upload images to puppy-books bucket" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their images in puppy-books bucket" ON storage.objects FOR UPDATE
  USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their images from puppy-books bucket" ON storage.objects FOR DELETE
  USING (bucket_id = 'puppy-books' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can upload blog images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'blog-admin@example.test')
);
CREATE POLICY "Admins can update blog images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'blog-admin@example.test')
);
CREATE POLICY "Admins can delete blog images" ON storage.objects FOR DELETE USING (
  bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'blog-admin@example.test')
);
NOTIFY pgrst, 'reload schema';
`);
check((await request(`${storage}/bucket`, { method: 'POST', token: service, body: { id: bucket, name: bucket, public: true } })).ok, 'create synthetic public bucket');
const users = [];
for (const label of ['a', 'b']) {
  const response = await request('/auth/v1/signup', { method: 'POST', body: { email: `storage-${label}-${randomUUID()}@example.test`, password: `${randomUUID()}Aa9!` } });
  assert(response.ok && response.data?.access_token, 'Local Auth signup failed.');
  users.push({ id: response.data.user.id, token: response.data.access_token });
}
const [a, b] = users;
const bookA = randomUUID();
const bookB = randomUUID();
for (const [user, id] of [[a, bookA], [b, bookB], [a, b.id], [b, a.id]]) {
  check((await request('/rest/v1/puppy_books', { method: 'POST', token: user.token, body: { id, owner_id: user.id } })).ok, 'save own book including collision fixture');
}
const profileA = `${a.id}/puppy-profile/a.png`;
const profileB = `${b.id}/puppy-profile/b.png`;
const memoryA = `${a.id}/books/${bookA}/memory.png`;
const legacyA = `${bookA}/legacy.png`;
const deprecatedA = `${bookA}/deprecated.png`;
const unknownA = `${bookA}/unknown.png`;
const collision = `${a.id}/collision.png`;
const blockedByBlog = await upload(profileA, a.token);
check(!blockedByBlog.ok && /permission denied for table users/.test(blockedByBlog.data?.message || ''), 'baseline reproduces cross-bucket Auth table permission failure');
const blogMigration = readFileSync(new URL('supabase/security/isolate_blog_image_admin_lookup.sql', root), 'utf8');
sql(blogMigration);
sql(blogMigration);
check((await request(`${storage}/bucket`, { method: 'POST', token: service, body: { id: 'blog-images', name: 'blog-images', public: true } })).ok, 'create synthetic blog bucket');
check(!(await request(`${storage}/object/blog-images/unauthorized.png`, { method: 'POST', token: a.token, body: png, mime: 'image/png' })).ok, 'ordinary owner gains no blog upload rights');
check(!(await request('/rest/v1/rpc/can_write_blog_images', { method: 'POST', token: a.token, body: { _bucket_id: 'blog-images' } })).ok, 'private blog helper is not a public RPC');
for (const [path, token] of [[profileA, a.token], [profileB, b.token], [legacyA, service], [deprecatedA, service], [unknownA, service], [collision, service]]) {
  check((await upload(path, token)).ok, 'seed synthetic image through Storage HTTP');
}
sql(`UPDATE storage.objects SET owner_id = '${a.id}', owner = '${a.id}' WHERE bucket_id = '${bucket}' AND name IN ('${legacyA}', '${collision}');
UPDATE storage.objects SET owner_id = NULL, owner = '${a.id}' WHERE bucket_id = '${bucket}' AND name = '${deprecatedA}';
UPDATE storage.objects SET owner_id = NULL, owner = NULL WHERE bucket_id = '${bucket}' AND name = '${unknownA}';`);
check((await request(`${storage}/object/public/${bucket}/${objectPath(profileA)}`)).ok, 'baseline public image is reproducibly accessible');
const migration = readFileSync(new URL('supabase/security/private_puppy_book_images.sql', root), 'utf8');
sql(migration);
sql(migration);

check(!(await request(`${storage}/object/public/${bucket}/${objectPath(profileA)}`)).ok, 'public URL denied after bucket closure');
check((await read(profileA, a.token)).ok, 'owner reads profile image');
check((await sign(profileA, a.token)).ok, 'owner signs profile image');
check(!(await read(profileA, b.token)).ok, 'other owner cannot read profile');
check(!(await sign(profileA, b.token)).ok, 'other owner cannot sign profile');
check(!(await sign(profileB, a.token)).ok, 'reverse owner collision cannot sign profile');
check(!(await sign(profileA, anon)).ok, 'unauthenticated signer denied');
check(!(await upload(`${a.id}/puppy-profile/foreign.png`, b.token)).ok, 'other owner cannot upload into profile directory');
check(!(await upload(profileA, b.token, { method: 'PUT' })).ok, 'other owner cannot overwrite image');
const deniedDelete = await remove(profileA, b.token);
check(!deniedDelete.ok || deniedDelete.data?.length === 0, 'other owner delete removes no objects');
check((await read(profileA, a.token)).ok, 'denied delete preserves image');
check((await sign(legacyA, a.token)).ok, 'legacy book image signs for verified uploader');
check((await sign(deprecatedA, a.token)).ok, 'deprecated owner UUID remains compatible');
check(!(await sign(legacyA, b.token)).ok, 'other owner cannot sign legacy image');
check(!(await sign(unknownA, a.token)).ok, 'unknown legacy uploader stays denied');
check(!(await sign(collision, b.token)).ok, 'book UUID matching another user does not grant access');
check(!(await upload(`${bookA}/new-legacy.png`, a.token)).ok, 'new legacy-shaped upload denied');
check((await upload(memoryA, a.token)).ok, 'owner uploads canonical memory image');
check(!(await upload(`${a.id}/puppy-profile/file.gif`, a.token, { mime: 'image/gif' })).ok, 'server rejects unsupported MIME type');
check(!(await upload(`${a.id}/puppy-profile/large.png`, a.token, { body: Buffer.alloc(5 * 1024 * 1024 + 1) })).ok, 'server rejects files over 5 MiB');
const memory = await request('/rest/v1/memories', { method: 'POST', token: a.token, headers: { Prefer: 'return=representation' }, body: { book_id: bookA, photo_url: memoryA } });
check(memory.ok && memory.data?.[0]?.photo_url === memoryA, 'Data API persists stable memory image path');
const foreignMemories = await request('/rest/v1/memories', { token: b.token });
check(foreignMemories.ok && foreignMemories.data?.length === 0, 'Data API hides other owner memories');
const signed = await sign(memoryA, a.token, 1);
assert(signed.ok && signed.data?.signedURL, 'Short-lived signing failed.');
check((await request(`${storage}${signed.data.signedURL}`)).ok, 'signed URL serves image');
await new Promise((resolve) => setTimeout(resolve, 3100));
check(!(await request(`${storage}${signed.data.signedURL}`)).ok, 'expired signed URL denied');
const ownDelete = await remove(memoryA, a.token);
check(ownDelete.ok && ownDelete.data?.length === 1, 'owner deletes complete memory image path');
check(!(await sign(memoryA, a.token)).ok, 'deleted image can no longer be signed');
check((await request(`/rest/v1/memories?id=eq.${memory.data[0].id}`, { method: 'DELETE', token: a.token })).ok, 'owner deletes memory after image');
console.log(`${checks} real local Auth, Data API and Storage HTTP checks passed. No cloud service was used.`);
