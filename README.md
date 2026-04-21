# Ruthenium

Desktop app: **Electron** (main + preload) + **React (Vite)** renderer, shared contracts in **`packages/shared`**, and the TypeScript project scanner in **`packages/project-graph`**.

## How it talks to itself

Privileged work runs in the **Electron main process** behind a small **IPC allowlist** exposed from **`preload`** via `contextBridge` (`ping`, `scanProjectGraph`, `selectProjectDirectory`). The renderer does **not** open a local HTTP port for app logic—other programs cannot call a Ruthenium “API” on loopback.

Ruthenium is **local-first**: you pick folders on disk; nothing is uploaded. A future **`.zip`** upload flow would need a **hosted** service with its own security model.

## Scripts

- `npm install` — install all workspaces (run at repo root).
- `npm run dev` — Vite on **5173**, builds Electron main/preload, then opens **Electron** (primary workflow).
- `npm run dev:stack` — Vite only (browser); graph and ping need Electron and will show a notice.
- `npm run dev:electron` — same as `npm run dev`.
- `npm run build` — `esbuild` bundles for Electron, then Vite production build for the renderer.
- `npm run typecheck` — TypeScript in packages that define `typecheck`.

## Layout (Bulletproof-style starter)

React code uses feature folders under `apps/web/src/features`, with `src/app` for composition.
