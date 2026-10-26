import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const root = new URL('../', import.meta.url);
const image = process.env.ACCESS_TEST_POSTGRES_IMAGE || 'postgres:17';
const baseline = process.argv
  .slice(2)
  .find((arg) => arg.startsWith('--baseline'));
if (
  process.argv.length > 3 ||
  (baseline &&
    !['--baseline', '--baseline=catalog', '--baseline=storage'].includes(
      baseline,
    )) ||
  (process.argv[2] && !baseline)
) {
  throw new Error(
    'Usage: node scripts/test-access-policies.mjs [--baseline[=catalog|storage]]',
  );
}

function docker(args, options = {}) {
  return execFileSync('docker', args, {
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 2 * 1024 * 1024,
    ...options,
  });
}

// Reject remote Docker hosts/contexts. No DATABASE_URL, Supabase env or credentials are read.
const endpoint = docker([
  'context',
  'inspect',
  '--format',
  '{{.Endpoints.docker.Host}}',
]).trim();
if (
  process.env.DOCKER_HOST ||
  (!endpoint.startsWith('unix://') && !endpoint.startsWith('npipe://'))
) {
  throw new Error(
    'Use a local Docker context without DOCKER_HOST. Remote Docker is refused.',
  );
}
// Resolve an already-cached image to an immutable ID. Never pull an image implicitly.
const imageId = docker([
  'image',
  'inspect',
  image,
  '--format',
  '{{.Id}}',
]).trim();
const containerName = `pentulaskuri-access-test-${randomUUID()}`;
let containerId;
let failure;
try {
  containerId = docker([
    'run',
    '--detach',
    '--rm',
    '--pull=never',
    '--network=none',
    '--read-only',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,size=256m',
    '--user=postgres',
    '--name',
    containerName,
    '--entrypoint=/bin/sh',
    imageId,
    '-c',
    'initdb -D /tmp/access-db --auth-local=trust --no-locale >/tmp/init.log 2>&1 && exec postgres -D /tmp/access-db -c listen_addresses= -c unix_socket_directories=/tmp',
  ]).trim();

  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      docker(
        ['exec', containerId, 'pg_isready', '-h', '/tmp', '-U', 'postgres'],
        { stdio: 'pipe', timeout: 2_000 },
      );
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  if (!ready)
    throw new Error(
      'The isolated PostgreSQL test server did not become ready.',
    );
  const version = docker(['exec', containerId, 'postgres', '--version']).trim();
  if (!/PostgreSQL\) 17\./.test(version))
    throw new Error(`A PostgreSQL 17 image is required: ${version}`);
  console.log(version);
  console.log(
    'Isolated synthetic database; network disabled; no host ports or volumes.',
  );
  docker([
    'exec',
    containerId,
    'createdb',
    '-h',
    '/tmp',
    '-U',
    'postgres',
    'access_policy_test',
  ]);

  function sql(relativePath) {
    const input = readFileSync(new URL(relativePath, root), 'utf8');
    const output = docker(
      [
        'exec',
        '-i',
        containerId,
        'psql',
        '-X',
        '-h',
        '/tmp',
        '-U',
        'postgres',
        '-d',
        'access_policy_test',
        '-v',
        'ON_ERROR_STOP=1',
        '--quiet',
        '--tuples-only',
        '--no-align',
      ],
      { input: `SET client_min_messages = warning;\n${input}` },
    );
    if (output.trim()) console.log(output.trim());
  }

  sql('tests/security/access_fixture.sql');
  // Replay twice to catch non-idempotent policy replacement.
  for (let pass = 0; pass < 2; pass += 1) {
    if (!baseline || baseline === '--baseline=storage')
      sql('supabase/security/catalog_admin_writes.sql');
    if (!baseline || baseline === '--baseline=catalog')
      sql('supabase/security/private_puppy_book_images.sql');
  }
  if (baseline)
    console.log(
      `Regression proof (${baseline}): a failing assertion is expected.`,
    );
  sql('tests/security/access_policies.sql');
  console.log('Access-policy assertions passed.');
} catch (error) {
  failure = error;
  if (containerId) {
    try {
      console.error(docker(['logs', '--tail=12', containerId]));
    } catch {
      /* Preserve the original test failure. */
    }
  }
} finally {
  if (containerId) docker(['rm', '--force', containerId], { stdio: 'pipe' });
}
if (failure) throw failure;
