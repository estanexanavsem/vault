# Repository Guidelines

## Project Structure & Module Organization

This directory contains the `vault-admin` Vite React admin frontend. Source lives in `src/`.

- `src/components/`: React UI components and screens.
- `src/services/`: API clients built around `httpClient` with `/api` as the base URL.
- `src/store/`: Zustand stores for client state.
- `src/hooks/`: reusable React hooks for session and panel data flows.
- `src/forms/`, `src/types/`, `src/utils/`: form schemas/helpers, shared TypeScript types, and formatting/error utilities.
- `src/styles/index.css` and `src/theme.ts`: global styles and Mantine theme setup.

Build output goes to `dist/`. Do not edit `node_modules/` or generated artifacts.

## Build, Test, and Development Commands

Use npm; `package-lock.json` is committed.

- `npm install`: install dependencies.
- `npm run dev`: start Vite on `http://localhost:3001`; `/api` proxies to `http://localhost:8080`.
- `npm run build`: run `tsc`, then produce a Vite production build.
- `npm run lint`: run ESLint across the project.
- `npm run lint:fix`: apply safe ESLint fixes.
- `npm run format`: format files with Prettier, including Tailwind class ordering.
- `npm run format:check`: verify formatting without changing files.
- `npm run preview`: serve the built app locally.

## Coding Style & Naming Conventions

Write TypeScript with strict compiler settings. Keep React components in PascalCase files such as `AccountTable.tsx`; use camelCase for hooks, stores, services, utilities, and form modules. Use named exports only; `export default` and `export { X as default }` are banned for source files and enforced by ESLint. Tooling config files may use default exports when the tool expects them.

ESLint enforces type-aware TypeScript rules, React Hooks rules, no default exports, `no-console` warnings except `console.warn` and `console.error`, and inline `type` imports. Prettier controls formatting.

## Testing Guidelines

There is currently no frontend test script or test framework configured. Before opening a change, run at least `npm run lint` and `npm run build`. If you add tests, add an npm script and use colocated names such as `Component.test.tsx` or `service.test.ts`.
Do not use Playwright for visual verification. Visual review and screenshot-based validation are handled by the user.

## Commit & Pull Request Guidelines

Use Conventional Commits strictly for every commit, such as `feat(accounts): add status filters` or `fix(session): refresh expired credentials`. Keep commits scoped to one behavior change when practical.

Pull requests should include a short summary, linked issue or task when available, validation steps, and screenshots or recordings for visible UI changes. Note changes affecting the `/api` proxy or authentication behavior.

## Security & Configuration Tips

Do not commit secrets or environment-specific credentials. Keep API calls routed through `src/services/httpClient.ts` unless a change explicitly needs a different client configuration.
