# Ruthenium

npm workspaces: Express API (`apps/server`), Vite + React UI (`apps/web`), shared Zod contracts (`packages/shared`), Electron shell (`apps/electron`).

## Scripts

- `npm install` — install all workspaces (run at repo root).
- `npm run dev` — API on port 3001 and Vite on 5173.
- `npm run dev:electron` — same, then opens Electron against the Vite dev server.
- `npm run build` — build server and web (Electron packaged flow can be added later).
- `npm run typecheck` — TypeScript in packages that define `typecheck`.

## Layout (Bulletproof-style starter)

React code uses feature folders under `apps/web/src/features`, with `src/lib` for cross-cutting helpers and `src/app` for composition.