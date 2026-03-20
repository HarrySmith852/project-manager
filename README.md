# Project management

Monorepo for a project-management product: **Next.js** client (`client/`) and **NestJS** API (`server/`).

## Layout

| Path       | Role                          |
| ---------- | ----------------------------- |
| `client/`  | Web UI (Next.js)              |
| `server/`  | Backend API (NestJS)          |

## Local development

- **Client:** see `client/package.json` scripts (e.g. dev server).
- **Server:** see `server/README.md` and `server/package.json`.

## GitHub repository

Remote: **[HarrySmith852/project-manager](https://github.com/HarrySmith852/project-manager)** (display title **Project Manager**; GitHub repo names cannot contain spaces, so the slug is `project-manager`).

Configure GitHub MCP in `~/.cursor/mcp.json` with a [personal access token](https://github.com/settings/tokens) (`repo` scope) under `GITHUB_PERSONAL_ACCESS_TOKEN` for the `github` server, then restart MCP.

After the remote exists, add it and push from this folder (example):

```bash
git init
git remote add origin https://github.com/HarrySmith852/project-manager.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

Use your actual default branch name if it is not `main`.

**Note:** `server/` currently contains its own `.git` directory. For a single monorepo on GitHub, either remove `server/.git` before the first root commit or keep separate remotes by design—pick one model and stick to it.
