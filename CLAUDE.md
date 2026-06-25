# MUXI API — Agent Harness

## Startup
- Go backend at `./`, React frontend at `web/default/`
- Design system: **Clear Horizon** — `src/styles/muxi-theme.css` (light theme, CSS custom properties only)
- Base components: `src/components/muxi/` (Button, Input, Badge, IconButton, ConfirmDialog)
- API reference: `docs/frontend-api-map.md` (load on demand)
- Build frontend: `cd web/default && npm run build`
- Build backend: `go build -o one-api.exe .`
- Verify all: `./init.sh`

## Working Rules
1. All CSS changes go through `muxi-theme.css` — never inline styles
2. New UI uses `components/muxi/*`; Semantic UI migrated away in feat-17
3. `feature_list.json` is source of truth — one active feature at a time
4. `progress.md` tracks status — update after each feature
5. Before claiming done: `./init.sh` or `npm run build` + `go build`
6. Legacy `--muxi-*` CSS vars alias to `--bg-*` / `--accent-*` during migration

## Definition of Done
- Feature matches spec in `feature_list.json`
- `./init.sh` exits 0 (or `npm run build` + `go build`)
- `progress.md` updated with evidence
- No new Web Interface Guidelines anti-patterns

## Design Direction (v2)
- **Tone**: Light airy SaaS — soft slate background, white cards
- **Accent**: blue `#2563eb`
- **Fonts**: Syne (display), IBM Plex Sans (body), JetBrains Mono (code)
- **Patterns**: PageHeader, Command Palette (⌘K), Drawer details
