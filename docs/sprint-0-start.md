# Sprint 0 Start Checklist

## Day 1 Actions

1. Verify local environment: Node 18+, npm configured, run `npm install --legacy-peer-deps`.
2. Initialize Supabase locally: `supabase init`, `supabase start`; confirm connection string saved in `.env.development`.
3. Enable Husky hooks: `npm run prepare`; ensure pre-commit runs format/lint/test pipeline.
4. Create Jira/Linear board lanes: Backlog, In Progress, In Review, Blocked, Done.
5. Populate Sprint 0 board with items S0-01�S0-09 from `docs/sprint-0-backlog.md`.
6. Schedule recurring meetings (stand-up, review, retro) and send invites.

## Testing Expectations

- Stand up smoke suite: verify `npm run lint`, `npm run type-check`, `npm run test`, `npm run a11y-test` execute without failing base project.
- QA to draft baseline Playwright scripts hitting landing page and health check endpoint.
- Establish testing data set for Supabase dev: seed script stored in `supabase/seed/sprint-0.sql` (placeholder).

## Documentation Updates

- Update `docs/roadmap.md` after each ceremony recap (planning, review).
- Maintain `docs/risks.md` and log status changes weekly (owner responsible updates entry).
- Add meeting notes to `docs/meetings/` (create directory) with ISO date filenames.
- Keep decision log in `docs/decisions.md` (to be created during Sprint 0).

## Definition of Ready Check

- Each Sprint 1 candidate story must have: problem statement, acceptance criteria, data needs, analytics tag requirements, a11y considerations.
- Dependencies identified with owner and ETA; blockers listed in Sprint 0 board.
