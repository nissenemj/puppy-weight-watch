import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

// Called only by the isolated Docker runner. Never accepts project URLs or user credentials.
export async function checkAnnualDraftApi(origin, secret) {
  assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/);
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok) break; }
    catch { /* Wait for the newly created local REST process. */ }
    if (attempt === 39) throw new Error('Local REST server did not become ready');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  const sign = (role, sub) => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({ role, sub, exp: Math.floor(Date.now() / 1000) + 300 })).toString('base64url');
    return header + '.' + body + '.' + createHmac('sha256', secret).update(header + '.' + body).digest('base64url');
  };
  const client = (role, sub) => createClient(origin, sign(role, sub), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => {
      const url = new URL(String(input));
      assert.equal(url.origin, origin);
      assert(url.pathname.startsWith('/rest/v1/'));
      url.pathname = url.pathname.replace('/rest/v1/', '/');
      return fetch(url, init);
    } },
  });
  const owner = '00000000-0000-4000-8000-000000000001';
  const ownerBook = '10000000-0000-4000-8000-000000000003';
  const otherBook = '10000000-0000-4000-8000-000000000002';
  const a = client('authenticated', owner);
  const b = client('authenticated', '00000000-0000-4000-8000-000000000002');
  const anon = client('anon');
  const memory = await a.from('memories').insert({ book_id: ownerBook }).select('id').single();
  assert.equal(memory.error, null);
  const payload = { version: 1, puppyName: 'Nuppu', start: '2026-04-01', end: '2027-03-31', includeWeights: true,
    memories: [{ id: memory.data.id, date: '2026-06-03', included: true, mishap: false }] };
  const empty = await a.from('annual_book_drafts').select('*').eq('book_id', ownerBook).eq('owner_id', owner).maybeSingle();
  assert.equal(empty.error, null); assert.equal(empty.data, null);
  const inserted = await a.from('annual_book_drafts').insert({ book_id: ownerBook, owner_id: owner, payload, revision: 1 }).select('*').single();
  assert.equal(inserted.error, null); assert.equal(inserted.data.revision, 1);
  const restored = await a.from('annual_book_drafts').select('*').eq('book_id', ownerBook).eq('owner_id', owner).maybeSingle();
  assert.equal(restored.error, null); assert.deepEqual(restored.data.payload, payload);
  const duplicate = await a.from('annual_book_drafts').insert({ book_id: ownerBook, owner_id: owner, payload, revision: 1 }).select('*').single();
  assert.equal(duplicate.error?.code, '23505');
  const changed = { ...payload, version: 2, design: { title: 'Nupun oma vuosi', palette: 'lake', coverArt: 'illustration', letter: 'Pieni ystäväni, muistan tämän.' }, memories: [{ ...payload.memories[0], date: '2026-07-12', included: false }] };
  const updated = await a.from('annual_book_drafts').update({ payload: changed, revision: 2 }).eq('book_id', ownerBook).eq('owner_id', owner).eq('revision', 1).select('*').maybeSingle();
  assert.equal(updated.error, null); assert.equal(updated.data.revision, 2); assert.deepEqual(updated.data.payload, changed);
  const stale = await a.from('annual_book_drafts').update({ payload, revision: 2 }).eq('book_id', ownerBook).eq('owner_id', owner).eq('revision', 1).select('*').maybeSingle();
  assert.equal(stale.error, null); assert.equal(stale.data, null);
  const otherRead = await b.from('annual_book_drafts').select('*').eq('book_id', ownerBook).maybeSingle();
  assert.equal(otherRead.error, null); assert.equal(otherRead.data, null);
  const otherWrite = await b.from('annual_book_drafts').update({ payload, revision: 3 }).eq('book_id', ownerBook).select('*').maybeSingle();
  assert.equal(otherWrite.error, null); assert.equal(otherWrite.data, null);
  const privateRead = await anon.from('annual_book_drafts').select('*');
  assert.equal(privateRead.error?.code, '42501');
  const foreign = await b.from('memories').select('id').eq('book_id', otherBook).limit(1).single();
  assert.equal(foreign.error, null);
  const mixed = await a.from('annual_book_drafts').update({ payload: { ...payload, memories: [{ ...payload.memories[0], id: foreign.data.id }] }, revision: 3 }).eq('book_id', ownerBook).eq('revision', 2).select('*').maybeSingle();
  assert.equal(mixed.error?.code, '23514');
  console.log('Annual draft API: v1 restore, v2 design and private letter, event dates, duplicate insert, stale revision, other-owner read/write, anonymous read and foreign-memory rejection passed.');
}
