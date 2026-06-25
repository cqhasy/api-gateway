# Example rule sets

## User: "Go 项目不要用 fmt.Println，测试文件除外"

```yaml
rules:
  - id: no-fmt-println
    message: "Avoid fmt.Println in committed code; use the logger"
    severity: low
    pattern: '\bfmt\.Print(ln|f)?\('
    include: ["**/*.go"]
    exclude: ["**/*_test.go"]
    suggestion: "Replace with structured logging."
```

## User: "任何语言新增代码里不许留 TODO 或 FIXME"

```yaml
rules:
  - id: no-todo-fixme
    message: "Unresolved TODO/FIXME introduced in this change"
    severity: low
    pattern: '(?i)\b(TODO|FIXME)\b'
    suggestion: "Resolve or track in your issue tracker."
```

## User: "前端 React 项目禁止 console.log 进主分支"

```yaml
rules:
  - id: no-console-log
    message: "console.log left in production code"
    severity: low
    pattern: '\bconsole\.log\('
    include: ["**/*.{ts,tsx,js,jsx}"]
    exclude: ["**/*.test.*", "**/__tests__/**"]
    suggestion: "Remove or gate behind a debug flag."
```

## User: "检测硬编码 AWS 密钥"

```yaml
rules:
  - id: no-hardcoded-aws-key
    message: "Possible hardcoded AWS access key"
    severity: critical
    pattern: 'AKIA[0-9A-Z]{16}'
    suggestion: "Use environment variables or a secret manager."
```

## User: "在现有规则上加一条：禁止 panic"

When appending, output the **full** merged file (all previous rules plus the new one), not a fragment.
