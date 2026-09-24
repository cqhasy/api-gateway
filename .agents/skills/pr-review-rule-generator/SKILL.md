---
name: pr-review-rule-generator
description: Generate and edit ai-pr-review custom rules YAML from natural language. Use whenever the user wants to create, extend, or translate review rules, rule sets, .pr-review.rules.yaml, pattern matchers, glob scopes, or says things like "帮我写一条规则""禁止 TODO""Go 项目不许 panic""生成规则文档" — even if they do not mention YAML or this repo. Also use when refining rules in the dashboard Rules editor or before saving a named rule set under ai-pr-review/rules/.
---

# PR Review Rule Generator

Turn plain-language policy into **valid custom rules YAML** for [ai-pr-review](https://github.com/cqhasy/ai-pr-review). Rules are cheap deterministic checks on **added diff lines** before AI passes run.

## Before you write YAML

1. Read `references/schema.md` for the exact field names and constraints.
2. Skim `references/examples.md` for idiomatic patterns by language/stack.
3. Clarify only when needed: target languages/paths, severity, test-file exclusions, append vs replace.

## Workflow

### 1. Extract intent

From the user's message, list:

- **Policies** — what should fail review (one bullet per rule)
- **Scope** — languages, directories, test vs prod
- **Severity** — default `medium` unless security/secrets → `high`/`critical`, style nits → `low`

### 2. Draft rules

For each policy, produce one `rules:` entry:

- `id`: unique kebab-case (e.g. `no-console-log`)
- `message`: concise title
- `pattern`: Go regexp safe for single-line match; escape metacharacters
- `include` / `exclude`: path globs when scope is narrower than "all files"
- `suggestion`: optional one-line fix

Prefer **specific** patterns over catch-alls. Split unrelated policies into separate rules.

### 3. Output format

**Dashboard API (`POST /api/rules/generate`):** Reply with **only** one fenced YAML block — no numbered summaries, no "Added N rules", no "I've prepared". The server parses stdout text only; it cannot read files you edit on disk.

Deliver **only** a fenced YAML block (language tag `yaml`). Do not add prose before the fence or after it for API/dashboard requests.

```yaml
rules:
  - id: example
    message: "..."
    severity: medium
    pattern: '...'
```

If updating an existing file the user pasted, output the **complete merged document** (all old rules + new), not a patch snippet.

### 4. Self-check

Before finishing, verify:

- [ ] Top-level key is `rules:` (array)
- [ ] Every rule has `id`, `message`, `pattern`
- [ ] IDs are unique
- [ ] Severities ∈ {low, medium, high, critical}
- [ ] Patterns are valid Go regex (RE2)
- [ ] Globs match the user's stack (`**/*.go`, `**/*.{ts,tsx}`, etc.)

If the project is available, run validation when possible:

```bash
# From repo root — paste YAML into a temp file or use API validate
go test ./internal/rule/... -run TestValidate -count=1
```

Or POST draft to dashboard `POST /api/rules/validate` with body `{"rules":"<yaml>"}`.

## Pattern cookbook

| Intent | Pattern hint |
|--------|----------------|
| Function call | `\bname\(` |
| Import | `^\s*import\s+` or `from\s+module` |
| Secret-like token | specific prefix + length, e.g. `AKIA[0-9A-Z]{16}` |
| Comment marker | `(?i)\bTODO\b` |
| File-type scope | `include: ["**/*.py"]` |

## Append vs replace

- **Replace**: user says "rewrite", "only these rules", or supplies a fresh spec with no merge intent.
- **Append**: user says "再加一条", "also check for", or references existing YAML — preserve all prior rules unless they asked to remove one.

## Integration with this repo

- Shipped template: `config/.pr-review.rules.yaml`
- Engine: `internal/rule/engine.go` (`Rule` struct, `Validate`, `Engine.Run` on added lines)
- Dashboard: named sets in `~/ai-pr-review/rules/<name>.yaml`; user picks a set per review

### Cursor skill vs Dashboard API

| Path | Uses this SKILL.md? | How |
|------|---------------------|-----|
| **Cursor / Claude Code with skill installed** | Yes | Agent reads this skill + `references/*.md` |
| **Web Rules assistant** (`POST /api/rules/generate`) | **Yes, when on disk** | On `serve` / `NewRouter`, backend loads `.agents/skills/pr-review-rule-generator/` (walk up from cwd or binary dir). Inlines `SKILL.md` body + `references/schema.md` + `references/examples.md` + API output constraints. Override with `PR_REVIEW_SKILL_RULE_GENERATOR` or `PR_REVIEW_SKILLS_DIR`. Falls back to embedded `internal/api/prompts/rules_schema.md` if not found. |

If the dashboard shows `no YAML found in model output`, the model returned prose/JSON without a `rules:` block — retry or check server log for `rules generate: loaded skill from …`.

When editing files in the repo, save to the user's target rule set name they specify; otherwise output YAML for them to paste.

## Tone

Be concise. The YAML fence is the product. Prose-only replies break the dashboard parser — never substitute a bullet list for the YAML file.
