# Progress

**Status**: in-progress (6/18 features complete)
**Last Updated**: 2026-06-25
**Active Feature**: feat-07 — Home 落地页

## Completed

| ID | Feature | Evidence |
|----|---------|----------|
| feat-01~05 | Harness / Tokens / 组件 / Shell / ⌘K | 见上轮 |
| feat-06 | 认证页重设计 | `AuthShell`, Login/Register/Reset 全用 muxi 组件；认证页无侧栏 |

## Verification (2026-06-25)

```
cd web/default && npm run build  → exit 0
```

## Next

1. **feat-07** Home 落地页 Hero + 状态卡片
2. **feat-08** Dashboard 数据可视化

## Notes

- 主题：**Clear Horizon** 浅色
- 认证页路径：`/login` `/register` `/reset` `/user/reset` 不显示 Sidebar
