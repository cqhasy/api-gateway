# MUXI API — Agent Harness

## Startup
- Go backend at `./`, React frontend at `web/default/`
- Design system: **Platform Console** — `docs/design-system.md` + `src/styles/muxi-theme.css`
- Base components: `src/components/muxi/` (Button, Input, Badge, MetricCard, MetricGrid, PageHeader, …)
- API reference: `docs/frontend-api-map.md` (load on demand)
- Build frontend: `cd web/default && npm run build`
- Build backend: `go build -o one-api.exe .`
- Verify all: `./init.sh`

## Working Rules
1. All CSS changes go through `muxi-theme.css` — never inline styles
2. New UI uses `components/muxi/*`; Semantic UI migrated away in feat-17
3. KPI 区域优先 `MetricCard` + `MetricGrid`（见 `docs/design-system.md`）
4. `feature_list.json` is source of truth — one active feature at a time
5. `progress.md` tracks status — update after each feature
6. Before claiming done: `./init.sh` or `npm run build` + `go build`
7. Legacy `--muxi-*` CSS vars alias to `--bg-*` / `--accent-*` during migration

## Definition of Done
- Feature matches spec in `feature_list.json`
- `./init.sh` exits 0 (or `npm run build` + `go build`)
- `progress.md` updated with evidence
- No new Web Interface Guidelines anti-patterns

## Design Direction (Studio Ink v4)
- **Reference**: Claude.ai warmth + Cursor tool precision
- **Plan**: `docs/redesign-v4-plan.md`
- **Fonts**: Newsreader (display) + Figtree (UI)
- **Accent**: Terracotta `#C96442` · Primary: Ink `#292524`
- **Brand gold**: Logo mark only (`BrandMark`)
