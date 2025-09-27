# Definition of Done

1. Code conforms to TypeScript strict mode; no `any` unless documented exception.
2. Formatting applied via `npm run format` (Prettier) and lint/type-check pass (`npm run lint`, `npm run type-check`).
3. Automated tests green: `npm run test`, integration suites, and Playwright end-to-end where impacted.
4. Accessibility validation run (`npm run a11y-test`) and issues resolved or ticketed.
5. Performance budget respected (Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, TBT < 200ms) for affected views.
6. Security review complete for new endpoints/RLS policies; secrets remain outside repo.
7. Documentation updated (code comments where needed, `docs/` or README notes) and changelog entry drafted.
8. Feature toggles/flags configured; analytics events instrumented when relevant.
9. QA sign-off recorded; user acceptance criteria met.
10. CI pipeline green on feature branch and merge approved.
