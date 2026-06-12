# Repository Guidelines

## Project Structure & Module Organization

This directory contains the `vault-guest` Vite React guest frontend. Source lives in `src/`.

- `src/App.tsx`: guest login and account overview UI.
- `src/main.tsx`: React entrypoint and app providers.
- `src/styles/index.css`: global styles and Tailwind import.
- `src/vite-env.d.ts`: Vite client type declarations.
- `vite.config.ts`: Vite, React, Tailwind, and `/api` proxy setup.

Build output goes to `dist/`. Do not edit `node_modules/` or generated artifacts.

## Build, Test, and Development Commands

Use npm; `package-lock.json` is committed.

- `npm install`: install dependencies.
- `npm run dev`: start Vite on `http://localhost:3002`; `/api` proxies to `http://localhost:8080`.
- `npm run build`: run `tsc`, then produce a Vite production build.
- `npm run lint`: run ESLint across the project.
- `npm run lint:fix`: apply safe ESLint fixes.
- `npm run format`: format files with Prettier, including Tailwind class ordering.
- `npm run format:check`: verify formatting without changing files.
- `npm run preview`: serve the built app locally.

## Coding Style & Naming Conventions

Write TypeScript with strict compiler settings. Keep React components in PascalCase files such as `GuestLogin.tsx`; use camelCase for hooks, services, utilities, and helper modules. Prefer named exports for shared code when modules are split out.

Use CSS Modules for component and feature styles. Name component-owned modules after the component, such as `TruistMark.module.css`; name shared feature modules in lower kebab case, such as `auth.module.css` or `account-details.module.css`. Keep `src/styles/index.css` limited to Tailwind import, font declarations, design tokens, reset, and base element styles.

Use the shared `cn()` helper from `src/utils/cn.ts` for conditional or combined class names. Do not build class names with template-string concatenation when `cn()` can express the same state.

Keep React component files limited to rendering, local UI state, and component-owned helpers. Shared side-effect logic such as error logging, analytics, request normalization, storage, and notification helpers must live outside component files, preferably under `src/utils/` or `src/services/`.

ESLint enforces type-aware TypeScript rules, React Hooks rules, `no-console` warnings except `console.warn` and `console.error`, and inline `type` imports. Prettier controls formatting.

Keep API contracts typed at the edge. Avoid `any`; model guest API responses with local interfaces or shared types before reading nested response fields.

## Testing Guidelines

There is currently no frontend test script or test framework configured. Before opening a change, run at least `npm run lint` and `npm run build`. Also run `npm run format:check` for changes touching source or config files. If you add tests, add an npm script and use colocated names such as `Component.test.tsx` or `service.test.ts`.
Do not use Playwright for visual verification. Visual review and screenshot-based validation are handled by the user.

## Commit & Pull Request Guidelines

Use Conventional Commits strictly for every commit, such as `feat(guest): add document list` or `fix(guest): handle invalid credentials`. Keep commits scoped to one behavior change when practical.

Pull requests should include a short summary, linked issue or task when available, validation steps, and screenshots or recordings for visible UI changes. Note changes affecting the `/api` proxy, guest authentication, or account data rendering.

## Security & Configuration Tips

Do not commit secrets or environment-specific credentials. Keep API calls routed through the Vite `/api` proxy unless a change explicitly needs a different client configuration. Do not expose account passwords or raw file blobs in guest-facing UI code.
