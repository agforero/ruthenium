# Ruthenium

Desktop-oriented app: **Electron** + **React (Vite)** renderer, a small **Express** API on your machine, and shared types in **`packages/shared`**.

Ruthenium is **local-first**: the API listens on **loopback only**, and project analysis reads directories you select—nothing is uploaded. A future flow where someone drops a **`.zip`** of a project would need a **hosted** service to unpack and scan in isolation (trust boundaries, malware, quotas)—that is explicitly out of scope until you design for it.

## Scripts

- `npm install` — install all workspaces (run at repo root).
- `npm run dev` — local API on `127.0.0.1:3001`, Vite on `5173`, then **Electron** (primary workflow).
- `npm run dev:stack` — API + Vite only (no Electron), for UI tweaks without the shell.
- `npm run build` — build server and web (packaged Electron flow can be added later).
- `npm run typecheck` — TypeScript in packages that define `typecheck`.

## Project graph API

`POST /api/project-graph` with JSON body `{ "rootPath": "<absolute directory>" }` returns a `ProjectGraph` (see `@ruthenium/shared`). The scanner loads the nearest `tsconfig.json` / `jsconfig.json` (from that directory upward) and uses TypeScript’s resolver. This repo includes a root `tsconfig.json` so scanning the monorepo root works; single-package projects typically rely on their own config at the package root.

## Layout (Bulletproof-style starter)

React code uses feature folders under `apps/web/src/features`, with `src/lib` for cross-cutting helpers and `src/app` for composition.
