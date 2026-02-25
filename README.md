# IGCSE Pseudocode Compiler Lab

A strict Cambridge IGCSE pseudocode web IDE/compiler built with Next.js.

## Features

- Strict parser for IGCSE pseudocode style (keywords, control structures, arrays, routines, file operations).
- Syntax and semantic diagnostics with Monaco markers.
- Pseudocode to Python transpilation.
- In-browser Python execution through a dedicated Web Worker (Pyodide).
- Runtime stdin panel and virtual in-memory files (`OPENFILE`, `READFILE`, `WRITEFILE`, `CLOSEFILE`).
- Local workspace persistence (source, stdin, virtual files) via browser localStorage.
- Import/export `.pseudo` files.

## Tech Stack

- Next.js (App Router) + TypeScript
- Monaco Editor (`@monaco-editor/react`)
- Custom tokenizer/parser/semantic analyzer/code generator
- Pyodide in a Web Worker
- Vitest for compiler tests

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run dist
```

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Desktop App (Electron + DMG)

Run the desktop app in development mode:

```bash
npm run dev
```

Build a macOS `.dmg` installer:

```bash
npm run dist
```

The generated installer is placed in `dist/`.

## Deployment

### Skill-Compatible Preview Deploy Script

This repository includes:

```bash
scripts/deploy.sh
```

Use it to get claimable preview deployments:

```bash
bash scripts/deploy.sh
```

### GitHub Actions (preview-first)

- Non-`main` branches and pull requests: `.github/workflows/vercel-preview.yml`
- `main` branch pushes: `.github/workflows/vercel-production.yml`

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Both workflows run validation (`lint`, `test`, `build`) before deployment.
