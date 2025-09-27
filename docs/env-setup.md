# Environment Configuration

## Required Files

- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test` (optional for CI/local test runs)

> Never commit `.env*` files. Use the templates below and share secrets through the password manager.

## Variables

| Variable                      | Description                                      | Development Source                                          |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`           | Supabase project URL                             | `supabase status` output or Supabase dashboard              |
| `VITE_SUPABASE_ANON_KEY`      | Public anon key for client SDK                   | Supabase dashboard ? Settings ? API                         |
| `SUPABASE_SERVICE_ROLE_KEY`   | Service role key (server-side only)              | Supabase dashboard ? Settings ? API (store in backend only) |
| `SUPABASE_DB_PASSWORD`        | Database password for migrations/seeds           | Supabase CLI init or dashboard                              |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                           | Stripe dashboard ? Developers                               |
| `STRIPE_SECRET_KEY`           | Stripe secret key (server-side only)             | Stripe dashboard ? Developers                               |
| `STRIPE_WEBHOOK_SECRET`       | Webhook signing secret                           | Stripe CLI or dashboard                                     |
| `SENDGRID_API_KEY`            | Email delivery                                   | SendGrid dashboard                                          |
| `VITE_FIREBASE_CONFIG`        | JSON string for Firebase notifications           | Firebase console ? Project settings                         |
| `VITE_SENTRY_DSN`             | Error tracking DSN                               | Sentry project settings                                     |
| `VITE_ANALYTICS_KEY`          | Product analytics (PostHog/GA)                   | Analytics provider                                          |
| `VITE_APP_ENV`                | One of `development`, `staging`, `production`    | Manual                                                      |
| `VITE_DEPLOY_TARGET`          | Matches deployment environment for feature flags | Manual                                                      |

## Template (`.env.example`)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_PASSWORD=

VITE_APP_ENV=development
VITE_DEPLOY_TARGET=local

VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

SENDGRID_API_KEY=
VITE_FIREBASE_CONFIG=
VITE_SENTRY_DSN=
VITE_ANALYTICS_KEY=
```

## Local Setup Steps

1. Run `supabase init` if not already configured.
2. Populate `.env.development` using the table above.
3. Export Supabase secrets for CLI commands: `setx SUPABASE_DB_PASSWORD "..."` (Windows) or export in shell.
4. Start services `supabase start` and run `npm run dev`.

## Secret Management

- Store production secrets in the team password manager.
- Configure GitHub Actions secrets matching the new deploy workflow (`IONOS_*`, `STRIPE_*`, `SENDGRID_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- Use environment-specific `.env` files locally; CI pulls from GitHub secrets.

## Verification

- `npm run test:e2e` requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set.
- Deploy workflows fail fast if any secrets are missing; monitor CI logs for `Configure environment secrets`.
