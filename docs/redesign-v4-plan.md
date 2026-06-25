# Studio Ink — MUXI API 美术大改 v4

> 参考 Claude.ai / Cursor 官方产品界面。取代 v3「Platform Console + 金色 SaaS 卡片风」。

## 问题诊断（为何 v3 显得丑）

| 症状 | 根因 |
|------|------|
| 像廉价后台模板 | 四宫格 MetricCard + 双层 shadow + 金色主按钮 |
| 没有产品气质 | Syne + IBM Plex 通用组合；金色滥用为 UI accent |
| 噪音多 | SVG 噪点、radial 光晕、sidebar 金条、卡片顶线 |
| 缺乏编辑感 | 无 serif 标题层级；Hero 被 KPI 卡片抢戏 |

## 新方向：Studio Ink

**一句话**：暖色纸感画布 + 墨黑交互 + 赤陶点缀 + 衬线标题 —— 像 Claude 一样 calm，像 Cursor 一样 precise。

### 参考对照

| 维度 | Claude | Cursor | Studio Ink |
|------|--------|--------|------------|
| 画布 | `#F7F5F0` 暖白 | 中性灰白 | `--bg-root #F7F5F0` |
| 标题 | 衬线/编辑感 | 干净 sans | **Newsreader** serif |
| 正文 | 人文 sans | Geist/Figtree | **Figtree** |
| 主按钮 | 深色/赤陶 | 近黑实心 | **Ink `#292524`** |
| 强调 | 赤陶 `#C96442` | 蓝/黑 | **Terracotta** 仅 focus/link |
| 卡片 | 几乎无 shadow | 细 border | **hairline border, no float shadow** |
| 侧栏 | — | 窄、quiet | 252px, 分组 muted, active 浅灰底 |
| 品牌金 | — | — | **仅 BrandMark 图形**，不进按钮 |

### 反模式（v4 禁止）

- 金色主按钮 / 金色 sidebar 竖条
- 首屏 4 张 KPI 卡片墙
- 噪点纹理 + 多色 radial 背景
- Syne / Space Grotesk / Inter

---

## 分阶段实施

| ID | 阶段 | 范围 | 状态 |
|----|------|------|------|
| **v4-01** | Foundation | Tokens、字体、base、按钮、卡片 flatten | ✅ done |
| **v4-02** | App Shell | Sidebar、Mobile bar、Command Palette、PageHeader | ✅ done |
| **v4-03** | 核心页 | Home 编辑式 Hero、Auth 居中面板 | ✅ done |
| **v4-04** | 数据页 | Dashboard、Token/Channel 列表壳 | 🔜 next |
| **v4-05** | 收尾 | Semantic 覆盖统一、a11y、progress | pending |

功能 feature（Token Drawer 等）在 **v4-05 完成后** 继续 feat-13+。

---

## v4-01 Token 规范

```css
--bg-root: #F7F5F0;
--bg-sidebar: #EFEDE8;
--bg-card: #FFFCF8;
--border-subtle: rgba(28, 25, 23, 0.08);
--text-primary: #1C1917;
--accent: #C96442;          /* terracotta — links, focus, active icon */
--brand: #E5A800;           /* logo mark ONLY */
--shadow-card: none;
--radius-ui: 10px;
--font-display: 'Newsreader', Georgia, serif;
--font-body: 'Figtree', 'PingFang SC', sans-serif;
```

## Home v4 信息架构

```
[ Kicker: MUXI API ]
[ Serif H1 — 欢迎语 ]
[ Lead 段落 ]
[ Primary + Secondary CTA ]

┌─ System ─────────────────────┐
│ Name · Version · Uptime · …  │  ← 单行 stat row，非卡片墙
└──────────────────────────────┘

Quick links → 纵向 link list（Cursor 资源导航感）
Config → 简单行列表 + badge
```

---

## 验收

- [ ] 首屏像「AI 产品」不像「Bootstrap 后台」
- [ ] 遮住 Logo 仍能从 typography + 赤陶 accent 辨认调性
- [ ] `npm run build` exit 0
- [ ] 无 inline style 新增
