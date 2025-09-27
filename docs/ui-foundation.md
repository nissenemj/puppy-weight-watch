# UI Foundation Summary

- **Layout primitives**: Use `PageLayout`, `Container`, `Section`, `Stack` from `src/components/ui/Layout.tsx` for consistent page scaffolding.
- **Navigation shell**: Primary navigation lives in `src/components/Navigation.tsx`; footer content is in `src/components/Footer.tsx`.
- **Route registry**: `src/router.tsx` defines the application routes with lazy-loaded modules for calculator, weight tracker, puppy book, guides, and legacy redirects.
- **Design tokens**: CSS variables and typography scale are centralized in `src/styles/design-system.css` and imported through `src/index.css`.
- **Folder structure**: Documentation and automated tests sit under `docs/` and `tests/` respectively to mirror the project constitution.
- **Next steps**: Migrate page components to consume a shared layout wrapper to avoid duplicating navigation markup, and extend design tokens with semantic aliases for dark mode.
