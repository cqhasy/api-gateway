# ai-pr-review Custom Rules YAML Schema

Rules are deterministic pre-filters: they scan **added lines only** in a PR diff (not context/delete lines, not unchanged files).

## File shape

```yaml
rules:
  - id: unique-kebab-id
    message: "Human-readable finding title"
    severity: low | medium | high | critical   # default: medium
    pattern: 'Go regexp matched against each added line'
    include: ["**/*.go"]      # optional path globs; empty = all files
    exclude: ["**/*_test.go"] # optional; takes precedence over include
    suggestion: "Optional fix guidance"
    confidence: 1.0           # optional [0,1]; default 1.0
```

## Field rules

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Unique within file; becomes `Issue.Pass`; use kebab-case |
| `message` | yes | Short title shown in review UI |
| `pattern` | yes | **Go** `regexp` syntax (RE2); matched against full added line text |
| `severity` | no | Must be one of: `low`, `medium`, `high`, `critical` |
| `include` | no | List of path globs; omit to match all paths |
| `exclude` | no | Skips paths even if `include` matched |

## Glob syntax (path scoping)

- `**/*.go` — any `.go` file in any directory
- `**/*_test.go` — test files
- `src/**` — under `src/`
- `*` — any segment except `/`
- `?` — one character except `/`

## Pattern tips

- Escape regex metacharacters: `\.` for dot, `\(` for paren
- Word boundaries: `\bpanic\(` not `panic(`
- Case-insensitive: `(?i)password`
- Avoid catastrophic backtracking on huge lines; prefer simple patterns
- Patterns run on **one line at a time** — no multiline match

## What NOT to do

- Do not use `description` (use `message`)
- Do not nest rules under other keys — only top-level `rules:` list
- Do not output JSON or markdown tables as the deliverable — YAML only
- Do not reference line numbers in rules (matching is content-based on added lines)

## Validation

After drafting, mentally verify:

1. Every rule has unique `id`
2. Every `pattern` compiles as Go regexp
3. Severities are valid enums
4. Globs use the project's language extensions when the user names a stack (e.g. Go → `**/*.go`)
