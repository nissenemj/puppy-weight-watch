# Risk Register

| ID   | Risk                                                     | Impact   | Likelihood | Owner                   | Mitigation                                                                |
| ---- | -------------------------------------------------------- | -------- | ---------- | ----------------------- | ------------------------------------------------------------------------- |
| R-01 | Supabase scalability limitations under breeder data load | High     | Medium     | Backend Dev             | Plan read replicas, index review per sprint, load testing before Phase 2  |
| R-02 | RLS misconfiguration exposing private data               | Critical | Low        | Tech Lead, Backend Dev  | Enforce policy reviews at each schema change, automated policy tests      |
| R-03 | Accessibility regressions during rapid UI iteration      | Medium   | Medium     | Frontend Dev, QA        | Integrate axe checks into CI, maintain component accessibility checklists |
| R-04 | QA/UX capacity shortfall in Sprints 2-3                  | Medium   | High       | PM                      | Secure contractor bench, adjust scope or shift milestones if needed       |
| R-05 | Third-party integrations (Stripe/SendGrid) delayed       | Medium   | Medium     | PM                      | Start contracts in Sprint 0, maintain contingency providers               |
| R-06 | Offline sync conflicts causing data loss                 | High     | Low        | Backend Dev, Mobile Dev | Implement conflict resolution specs and automated tests before launch     |
| R-07 | Analytics gaps hinder decision-making                    | Medium   | Medium     | Data Analyst            | Define core metrics in Sprint 0, validate tracking in staging             |
