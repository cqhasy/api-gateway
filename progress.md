# Progress

**Status**: in-progress — Studio Ink v4 大改
**Last Updated**: 2026-06-25
**Active**: v4-04 Data pages

## v4 改造计划

见 [docs/redesign-v4-plan.md](docs/redesign-v4-plan.md)

| Phase | 内容 | 状态 |
|-------|------|------|
| v4-01 | Tokens、字体、扁平卡片、Ink 按钮、Home 编辑式 | ✅ done |
| v4-02 | Sidebar / Mobile / ⌘K / PageHeader | ✅ done |
| v4-03 | Auth 居中单栏 Claude 式 | ✅ done |
| v4-04 | Dashboard / 列表页 | 🔜 next |
| v4-05 | 收尾 | pending |

## v4-01～03 已改

- **Studio Ink**：Newsreader + Figtree，暖画布 `#F7F5F0`，赤陶 accent，墨黑主按钮
- **Home**：衬线 Hero + stat grid + link list（无 KPI 卡片墙）
- **Shell**：暖色 overlay、侧栏 quiet active、头像改 ink
- **Auth**：400px 居中单卡，品牌区在上、表单在下
- **链接色**：统一 terracotta accent

## Verification

```
cd web/default && npm run build  → exit 0 (2026-06-25)
```

## Next

v4-04 Dashboard / Token / Channel 列表壳 Studio 化
