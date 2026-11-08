// Isolated PostgreSQL checks. No cloud credentials, production database or image pull is accepted.
import assert from "node:assert/strict";
import { execFileSync, execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
const asyncExec = promisify(execFile);
const docker = (args, options = {}) =>
  execFileSync("docker", args, {
    encoding: "utf8",
    timeout: 30000,
    maxBuffer: 4 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
    ...options,
  });
assert(!process.env.DOCKER_HOST, "Remote Docker is not allowed.");
assert.match(
  docker([
    "context",
    "inspect",
    "--format",
    "{{.Endpoints.docker.Host}}",
  ]).trim(),
  /^unix:\/\//,
);
const image = docker([
  "image",
  "inspect",
  "public.ecr.aws/supabase/postgres:17.11.0.006",
  "--format",
  "{{.Id}}",
]).trim();
const container = `pentulaskuri-features-${randomUUID()}`;
const sql = (text, role = "supabase_admin", owner = "") =>
  docker(
    [
      "exec",
      "-i",
      container,
      "psql",
      "-X",
      "-U",
      "supabase_admin",
      "-d",
      "features_test",
      "-v",
      "ON_ERROR_STOP=1",
      "-qAt",
    ],
    {
      input: `set client_min_messages=warning;\n${owner ? `select set_config('request.jwt.claim.sub','${owner}',false);` : ""}\nset role ${role};\n${text}`,
    },
  )
    .trim()
    .split("\n")
    .filter(Boolean)
    .at(-1);
const asyncSql = async (text) => {
  const { stdout } = await asyncExec(
    "docker",
    [
      "exec",
      "-i",
      container,
      "psql",
      "-X",
      "-U",
      "supabase_admin",
      "-d",
      "features_test",
      "-v",
      "ON_ERROR_STOP=1",
      "-qAt",
      "-c",
      `set role service_role; ${text}`,
    ],
    { encoding: "utf8", timeout: 30000 },
  );
  return stdout.trim().split("\n").filter(Boolean).at(-1);
};
const quote = (text) => `'${text.replaceAll("'", "''")}'`;
let checks = 0;
const check = (value, label) => {
  assert(value, label);
  checks++;
  console.log(`PASS ${label}`);
};
const denied = (text, role = "authenticated", owner = "") => {
  try {
    sql(text, role, owner);
    return false;
  } catch {
    return true;
  }
};
let started = false;
try {
  docker([
    "run",
    "-d",
    "--name",
    container,
    "--network",
    "none",
    "-e",
    `POSTGRES_PASSWORD=${randomUUID()}`,
    "-e",
    "POSTGRES_DB=postgres",
    image,
  ]);
  started = true;
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      docker([
        "exec",
        container,
        "pg_isready",
        "-h",
        "127.0.0.1",
        "-U",
        "supabase_admin",
      ]);
      ready = true;
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  assert(ready, "Local test database did not become ready.");
  docker([
    "exec",
    container,
    "psql",
    "-U",
    "supabase_admin",
    "-d",
    "postgres",
    "-c",
    "create database features_test;",
  ]);
  sql(`
 do $$ begin if not exists(select 1 from pg_roles where rolname='anon') then create role anon; end if;
 if not exists(select 1 from pg_roles where rolname='authenticated') then create role authenticated; end if;
 if not exists(select 1 from pg_roles where rolname='service_role') then create role service_role bypassrls; end if; end $$;
 alter role service_role bypassrls;
 create schema auth;create schema storage;
 create table auth.users(id uuid primary key,email_confirmed_at timestamptz,is_anonymous boolean default false);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create function storage.foldername(name text) returns text[] language sql immutable as $$ select (string_to_array(name,'/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,created_at timestamptz default now(),unique(bucket_id,name));
 alter table storage.objects enable row level security;
 create table public.puppy_books(id uuid primary key,owner_id uuid not null references auth.users);
 create table public.memories(id uuid primary key default gen_random_uuid(),book_id uuid references public.puppy_books,created_by uuid references auth.users,content_type text,content_url text,caption text,tags text[]);
 grant usage on schema public,auth,storage to anon,authenticated,service_role;
 grant all on all tables in schema public,storage to service_role;
 grant select,insert,update,delete on storage.objects to authenticated;
 grant select on storage.objects to anon;
 create policy legacy_permissive_storage_read on storage.objects for select to anon,authenticated using(true);
 create policy legacy_permissive_storage_insert on storage.objects for insert to authenticated with check(true);
 create policy legacy_permissive_storage_delete on storage.objects for delete to authenticated using(true);
 grant execute on function auth.uid(),storage.foldername(text) to anon,authenticated,service_role;
 `);
  const migrations = readdirSync(
    new URL("../supabase/migrations/", import.meta.url),
  ).filter((x) => x.endsWith("_safety_and_storybook_images.sql"));
  assert.equal(migrations.length, 1);
  sql(
    readFileSync(
      new URL(`../supabase/migrations/${migrations[0]}`, import.meta.url),
      "utf8",
    ),
  );
  const photoMigrations = readdirSync(
    new URL("../supabase/migrations/", import.meta.url),
  ).filter((x) => x.endsWith("_photo_reference_edits.sql"));
  assert.equal(photoMigrations.length, 1);
  sql(
    readFileSync(
      new URL(`../supabase/migrations/${photoMigrations[0]}`, import.meta.url),
      "utf8",
    ),
  );
  const openPilotMigrations = readdirSync(
    new URL("../supabase/migrations/", import.meta.url),
  ).filter((x) => x.endsWith("_open_verified_image_pilot.sql"));
  assert.equal(openPilotMigrations.length, 1);
  sql(readFileSync(
    new URL(`../supabase/migrations/${openPilotMigrations[0]}`, import.meta.url),
    "utf8",
  ));
  check(
    sql("select access_mode from pentulaskuri_features.image_config;") === "allowlist",
    "migration preserves the existing audience until explicitly opened",
  );
  check(
    sql("select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind='r' and not c.relrowsecurity and (n.nspname='pentulaskuri_features' or n.nspname='public' and c.relname in ('image_jobs','storybook_inputs','safety_source_checks','safety_news_items'));") === "0",
    "all new public and private feature tables have row security enabled",
  );
  check(
    sql("select count(*) from public.safety_source_checks;", "anon") === "2",
    "public source health is readable",
  );
  check(
    denied(
      "insert into public.safety_source_checks(source_id) values('fake');",
      "anon",
    ),
    "public caller cannot publish notices",
  );
  const a = randomUUID(),
    b = randomUUID(),
    bookA = randomUUID(),
    bookB = randomUUID(),
    req = randomUUID();
  const inputA = randomUUID(),
    inputB = randomUUID();
  const spec = {
    style: "dog-photo-transform-v1",
    scene: "princess",
    inputPath: `${a}/${inputA}.png`,
    notes: "",
  };
  const specSql = `${quote(JSON.stringify(spec))}::jsonb`;
  sql(
    `insert into auth.users(id,email_confirmed_at) values('${a}',now()),('${b}',now()); insert into public.puppy_books values('${bookA}','${a}'),('${bookB}','${b}');`,
  );
  const reserve = (owner, request = req, s) =>
    `select public.reserve_storybook_image('${owner}','${request}',${s ?? `${quote(JSON.stringify({ ...spec, inputPath: owner === a ? spec.inputPath : `${b}/${inputB}.png` }))}::jsonb`});`;
  check(denied(reserve(a), "service_role"), "generation is closed by default");
  sql(
    `update pentulaskuri_features.image_config set enabled=true;insert into pentulaskuri_features.image_access values('${a}'),('${b}');`,
  );
  const inputReserve = `select public.reserve_storybook_input('${a}','${inputA}');`;
  const inputs = await Promise.all([
    asyncSql(inputReserve),
    asyncSql(inputReserve),
  ]);
  check(
    inputs[0] === spec.inputPath &&
      inputs[0] === inputs[1] &&
      sql("select count(*) from public.storybook_inputs;") === "1",
    "concurrent input reservations reuse one private path",
  );
  check(
    denied(inputReserve, "authenticated", a),
    "user cannot bypass input limits with the service RPC",
  );
  check(
    denied(
      `insert into storage.objects(bucket_id,name) values('storybook-inputs','${a}/${randomUUID()}.png');`,
      "authenticated",
      a,
    ),
    "unreserved photo upload is denied",
  );
  sql(
    `insert into storage.objects(bucket_id,name) values('storybook-inputs','${spec.inputPath}');`,
    "authenticated",
    a,
  );
  check(
    sql(
      "select count(*) from storage.objects where bucket_id='storybook-inputs';",
      "authenticated",
      b,
    ) === "0",
    "other owner cannot read the source photo despite legacy storage policies",
  );
  check(
    sql(
      "select count(*) from storage.objects where bucket_id='storybook-inputs';",
      "anon",
    ) === "0",
    "anonymous source photo read is denied",
  );
  check(
    denied(
      `insert into storage.objects(bucket_id,name) values('storybook-inputs','${spec.inputPath}');`,
      "authenticated",
      b,
    ),
    "other owner cannot upload to a reserved photo path",
  );
  sql(
    `select public.reserve_storybook_input('${b}','${inputB}');`,
    "service_role",
  );
  sql(
    `insert into storage.objects(bucket_id,name) values('storybook-inputs','${b}/${inputB}.png');`,
    "authenticated",
    b,
  );
  check(
    denied(
      reserve(
        a,
        randomUUID(),
        `${quote(JSON.stringify({ ...spec, inputPath: `${b}/${inputB}.png` }))}::jsonb`,
      ),
      "service_role",
    ),
    "generation cannot use another owner’s input photo",
  );
  for (let i = 0; i < 3; i++)
    sql(
      `select public.reserve_storybook_input('${a}','${randomUUID()}');`,
      "service_role",
    );
  check(
    denied(
      `select public.reserve_storybook_input('${a}','${randomUUID()}');`,
      "service_role",
    ),
    "daily source upload reservations are bounded",
  );
  const [first, replay] = await Promise.all([
    asyncSql(reserve(a)),
    asyncSql(reserve(a)),
  ]);
  const job = JSON.parse(first);
  check(
    job.id === JSON.parse(replay).id &&
      sql("select count(*) from public.image_jobs;") === "1",
    "concurrent duplicate requests reserve exactly once",
  );
  check(
    sql("select reserved_micros from pentulaskuri_features.image_budgets;") ===
      "1000000",
    "one request holds one budget reservation",
  );
  check(
    denied(
      reserve(
        a,
        req,
        `${quote(JSON.stringify({ ...spec, scene: "space" }))}::jsonb`,
      ),
      "service_role",
    ),
    "same request cannot change its prompt",
  );
  check(
    denied(reserve(a), "authenticated", a),
    "authenticated caller cannot invoke a quota bypass RPC",
  );
  check(
    sql("select count(*) from public.image_jobs;", "authenticated", a) === "1",
    "owner can read own job",
  );
  check(
    sql("select count(*) from public.image_jobs;", "authenticated", b) === "0",
    "other owner cannot read the job",
  );
  check(
    denied(
      "select * from pentulaskuri_features.image_payloads;",
      "authenticated",
      a,
    ),
    "private image bytes cannot be read through a user role",
  );
  const claims = await Promise.all([
    asyncSql(`select public.claim_storybook_image('${job.id}');`),
    asyncSql(`select public.claim_storybook_image('${job.id}');`),
  ]);
  check(
    claims.filter((value) => value && value !== "null").length === 1,
    "concurrent workers claim one generation only",
  );
  const payload = Buffer.alloc(64).toString("base64");
  sql(
    `select public.store_storybook_result('${job.id}',${quote(payload)},repeat('a',64),60500,'synthetic-provider-request');`,
    "service_role",
  );
  sql(
    `select public.store_storybook_result('${job.id}',${quote(payload)},repeat('a',64),60500,'synthetic-provider-request');`,
    "service_role",
  );
  check(
    sql("select spent_micros from pentulaskuri_features.image_budgets;") ===
      "60500" &&
      sql(
        "select reserved_micros from pentulaskuri_features.image_budgets;",
      ) === "0",
    "provider result settles measured cost once",
  );
  sql(
    `select public.finish_storybook_delivery('${job.id}','',false);`,
    "service_role",
  );
  check(
    sql(
      `select count(*) from pentulaskuri_features.image_payloads where job_id='${job.id}';`,
    ) === "1",
    "delivery failure retains generated bytes",
  );
  const path = `${a}/${job.id}.png`;
  sql(
    `insert into storage.objects(bucket_id,name) values('generated-storybook','${path}');`,
  );
  check(
    sql(
      "select count(*) from storage.objects where bucket_id='generated-storybook';",
      "authenticated",
      a,
    ) === "1",
    "owner can read private generated object",
  );
  check(
    sql(
      "select count(*) from storage.objects where bucket_id='generated-storybook';",
      "authenticated",
      b,
    ) === "0",
    "other owner cannot read private generated object",
  );
  check(
    sql(
      "select count(*) from storage.objects where bucket_id='generated-storybook';",
      "anon",
    ) === "0",
    "anonymous caller cannot read generated object",
  );
  check(
    denied(
      `insert into storage.objects(bucket_id,name) values('generated-storybook','${a}/forged.png');`,
      "authenticated",
      a,
    ),
    "owner cannot forge generated objects",
  );
  sql(
    `select public.finish_storybook_delivery('${job.id}','${path}',true); select public.finish_storybook_delivery('${job.id}','${path}',true);`,
    "service_role",
  );
  check(
    sql(`select status from public.image_jobs where id='${job.id}';`) ===
      "ready",
    "delivery retry completes without another generation",
  );
  check(
    sql("select count(*) from pentulaskuri_features.image_payloads;") === "0",
    "temporary payload is cleared after durable storage",
  );
  const copyPath = `${a}/books/${bookA}/satukuva-${job.id}.png`;
  sql(
    `insert into storage.objects(bucket_id,name) values('puppy-books','${copyPath}');`,
  );
  const attach = `select public.attach_storybook_image('${a}','${job.id}','${bookA}');`;
  const copies = await Promise.all([asyncSql(attach), asyncSql(attach)]);
  check(
    copies[0] === copies[1] &&
      sql("select count(*) from public.memories;") === "1",
    "repeated book delivery adds one memory",
  );
  check(
    denied(
      `select public.attach_storybook_image('${b}','${job.id}','${bookB}');`,
      "service_role",
    ),
    "other owner cannot attach the image",
  );
  check(
    denied(
      `select public.attach_storybook_image('${a}','${job.id}','${bookB}');`,
      "service_role",
    ),
    "owner cannot attach to someone else’s book",
  );
  const second = JSON.parse(sql(reserve(a, randomUUID()), "service_role"));
  check(
    denied(reserve(a, randomUUID()), "service_role"),
    "daily request limit is enforced in the database",
  );
  sql(
    `select public.claim_storybook_image('${second.id}');select public.fail_storybook_image('${second.id}','provider_uncertain',true);`,
    "service_role",
  );
  check(
    sql(`select status from public.image_jobs where id='${second.id}';`) ===
      "unknown",
    "ambiguous provider result stays unknown",
  );
  check(
    sql("select reserved_micros from pentulaskuri_features.image_budgets;") ===
      "1000000",
    "ambiguous result keeps its cost reservation",
  );
  check(
    denied(reserve(b, randomUUID()), "service_role"),
    "ambiguous billing pauses further provider spending",
  );
  // Separate fixture phase for simultaneous requests at the monthly boundary.
  sql(
    "truncate public.image_jobs cascade;update pentulaskuri_features.image_budgets set blocked=false,reserved_micros=0,spent_micros=19000000;",
  );
  const budget = await Promise.allSettled([
    asyncSql(reserve(a, randomUUID())),
    asyncSql(reserve(b, randomUUID())),
  ]);
  check(
    budget.filter((x) => x.status === "fulfilled").length === 1,
    "concurrent users cannot over-reserve the 20 USD monthly budget",
  );
  check(
    sql(
      "select spent_micros+reserved_micros from pentulaskuri_features.image_budgets;",
    ) === "20000000",
    "monthly ledger includes in-flight generation",
  );
  const activeBudgetJob = JSON.parse(
    budget.find((result) => result.status === "fulfilled").value,
  );
  const expiredPath = activeBudgetJob.spec.inputPath,
    expiredOwner = activeBudgetJob.owner_id;
  sql(
    `update public.storybook_inputs set expires_at=now()-interval '1 minute' where path='${expiredPath}';`,
  );
  check(
    sql(
      "select count(*) from public.expired_storybook_inputs();",
      "service_role",
    ) === "0",
    "cleanup retains a photo referenced by an active job",
  );
  sql("update public.image_jobs set status='failed' where status='queued';");
  check(
    sql(
      "select count(*) from public.expired_storybook_inputs();",
      "service_role",
    ) === "1",
    "cleanup selects expired source photos",
  );
  check(
    sql(
      `select count(*) from storage.objects where bucket_id='storybook-inputs' and name='${expiredPath}';`,
      "authenticated",
      expiredOwner,
    ) === "0",
    "expired source photos are no longer readable by the owner",
  );
  check(
    denied(
      `select public.reserve_storybook_input('${expiredOwner}','${expiredPath.split("/")[1].slice(0, -4)}');`,
      "service_role",
    ),
    "expired input id cannot be reused",
  );
  sql(
    `delete from storage.objects where bucket_id='storybook-inputs' and name='${expiredPath}';select public.finish_storybook_input_cleanup(array['${expiredPath}']);`,
    "service_role",
  );
  check(
    sql(
      `select count(*) from public.storybook_inputs where path='${expiredPath}';`,
    ) === "0",
    "successful private storage cleanup clears expired metadata",
  );
  // A separate fixture phase opens the audience without widening data access.
  const c = randomUUID(), d = randomUUID(), e = randomUUID();
  const inputC = randomUUID(), inputD = randomUUID(), inputE = randomUUID();
  sql(`insert into auth.users(id,email_confirmed_at) values('${c}',now()),('${d}',now()),('${e}',now());
    truncate public.image_jobs cascade;
    update pentulaskuri_features.image_budgets set blocked=false,reserved_micros=0,spent_micros=0;
    update pentulaskuri_features.image_config set pilot_limit=1;`);
  check(
    sql(`select public.storybook_access('${c}');`, "service_role") === "f" &&
      denied(`select public.reserve_storybook_input('${c}','${inputC}');`, "service_role"),
    "a new user remains excluded in allowlist mode",
  );
  sql("update pentulaskuri_features.image_config set access_mode='verified_users';");
  check(
    sql(`select public.storybook_access('${c}') and public.storybook_access('${d}');`, "service_role") === "t" &&
      sql(`select count(*) from pentulaskuri_features.image_access where user_id in ('${c}','${d}');`) === "0",
    "open audience includes new users without individual grants",
  );
  check(
    denied("update pentulaskuri_features.image_config set monthly_budget_micros=21000000;"),
    "configuration cannot raise the approved 20 USD ceiling",
  );
  check(
    denied("update pentulaskuri_features.image_config set access_mode='public';"),
    "an anonymous audience cannot be configured",
  );
  check(
    denied("update pentulaskuri_features.image_config set access_mode='allowlist';", "authenticated", c) &&
      denied(`select public.storybook_access('${c}');`, "authenticated", c),
    "users cannot change the audience or call its service-only RPC",
  );
  const openSpec = (owner, input) => ({ ...spec, inputPath: `${owner}/${input}.png` });
  const openReserve = (owner, input, request = randomUUID()) =>
    `select public.reserve_storybook_image('${owner}','${request}',${quote(JSON.stringify(openSpec(owner,input)))}::jsonb);`;
  for (const [owner, input] of [[c,inputC],[d,inputD],[e,inputE]]) {
    sql(`select public.reserve_storybook_input('${owner}','${input}');`, "service_role");
    sql(`insert into storage.objects(bucket_id,name) values('storybook-inputs','${owner}/${input}.png');`, "authenticated", owner);
  }
  // Even with the initial allowlist's global image cap reached, the open
  // audience is limited by the shared monthly budget and per-user daily quota.
  sql(`insert into public.image_jobs(owner_id,request_id,spec,budget_month,reserved_micros,status)
    values('${a}','${randomUUID()}',${specSql},date_trunc('month',now() at time zone 'UTC')::date,0,'failed');`);
  check(
    sql(`select public.reserve_storybook_input('${c}','${randomUUID()}');`, "service_role").startsWith(`${c}/`),
    "the open audience is not stopped by the old quality-test lifetime cap",
  );
  sql("update pentulaskuri_features.image_budgets set spent_micros=19000000;");
  const openBoundary = await Promise.allSettled([
    asyncSql(openReserve(c,inputC)), asyncSql(openReserve(d,inputD)),
  ]);
  check(
    openBoundary.filter((x) => x.status === "fulfilled").length === 1 &&
      sql("select spent_micros+reserved_micros from pentulaskuri_features.image_budgets;") === "20000000",
    "two newly eligible users share one atomic 20 USD monthly budget",
  );
  const openWinner = JSON.parse(openBoundary.find((x) => x.status === "fulfilled").value);
  check(
    denied(openReserve(e,inputE), "service_role"),
    "another user cannot reserve after the shared budget is exhausted",
  );
  check(
    sql("select count(*) from public.image_jobs;", "authenticated", e) === "0" &&
      sql("select count(*) from storage.objects where bucket_id='storybook-inputs';", "authenticated", e) === "1",
    "a newly eligible user still cannot read other owners' jobs or photos",
  );
  sql(`select public.claim_storybook_image('${openWinner.id}');select public.fail_storybook_image('${openWinner.id}','moderation_blocked',false);`, "service_role");
  sql("update pentulaskuri_features.image_budgets set spent_micros=0;");
  for(let i=0;i<2;i++) {
    const item = JSON.parse(sql(openReserve(e,inputE), "service_role"));
    sql(`select public.claim_storybook_image('${item.id}');select public.fail_storybook_image('${item.id}','moderation_blocked',false);`, "service_role");
  }
  check(
    denied(openReserve(e,inputE), "service_role"),
    "the open audience retains the two-request daily quota for each user",
  );
  sql("update pentulaskuri_features.image_config set access_mode='allowlist';");
  check(
    sql(`select public.storybook_access('${c}');`, "service_role") === "f" &&
      denied(openReserve(c,inputC), "service_role"),
    "the audience can be rolled back without changing budget or owner policies",
  );
  sql("update pentulaskuri_features.image_config set access_mode='verified_users',enabled=false;");
  check(
    sql(`select public.storybook_access('${d}');`, "service_role") === "f" &&
      denied(`select public.reserve_storybook_input('${d}','${randomUUID()}');`, "service_role"),
    "the global stop switch still closes new photo reservations",
  );
  console.log(
    `${checks} isolated database and storage-policy checks passed. No cloud database changed.`,
  );
  mkdirSync(".cache", { recursive: true });
  writeFileSync(
    ".cache/feature-policy-result.json",
    JSON.stringify(
      { checks, passed: true, cloud_database_changed: false },
      null,
      2,
    ),
  );
} finally {
  if (started) docker(["rm", "-f", container]);
}
