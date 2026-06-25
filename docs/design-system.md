# MUXI API — Platform Console 设计标准

> 参考 Linear、Vercel Dashboard、OpenAI Platform 的 AI 开发者控制台美学。  
> 实现：`web/default/src/styles/muxi-theme.css` · 组件：`web/default/src/components/muxi/`

## 设计原则

| 原则 | 说明 | 反模式 |
|------|------|--------|
| **指标优先** | 页面首屏展示 3–4 个关键 KPI，大数字 + 小标签 | 大 Hero 占满首屏、指标藏在下方 |
| **紧凑密度** | 减少无效留白，内容区 padding ≤ 1.5rem | 2.5rem+ 大面积 padding、松散 section 间距 |
| **清晰层级** | 背景 → 表面 → 卡片 → 强调，靠 border/shadow 区分 | 仅靠颜色块或过大圆角堆叠 |
| **AI 平台感** | 中性灰底、tabular 数字、mono 用于 ID/密钥 | 传统 ERP 表格风、厚重色块 |
| **简洁专业** | 少装饰、强对比 typography、一致组件 | 渐变 Hero、过多 badge/图标 |

## 色彩与表面

```css
--bg-root: #f5f7fa          /* 页面底 — 与卡片白形成层次 */
--bg-surface-1: #ffffff     /* 卡片、侧栏 */
--shadow-card: 0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.03)
--bg-surface-2: #f4f4f5     /* 次级区域、hover */
--border-subtle: #e4e4e7
--brand: #f2b90c              /* MUXI 金花 — 主操作、强调 */
--brand-ink: #0a0a0a          /* MUXI 黑字 */
--link: #2563eb               /* 文字链接（非品牌主色） */
--text-primary: #18181b
```

- 背景始终浅灰，**不用**大块纯白页面底
- 卡片白底 + 1px 细 border，hover 时 border 加深 + 轻 shadow
- 主操作 / 强调用 **MUXI 金**（`--brand`），链接用 `--link` 蓝
- 品牌组件：`BrandMark`（四瓣图形）+ `BrandLockup`（图形 + MUXI + API）

## 间距尺度

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-2` | 0.5rem | 组件内 gap |
| `--space-3` | 0.75rem | 卡片 grid gap |
| `--space-4` | 1rem | section 内间距 |
| `--space-5` | 1.25rem | section 之间 |
| `--page-padding` | 1.25rem 1.5rem | `.muxi-main` 内边距 |

**Section 间距**：`margin-bottom: var(--space-5)`，禁止 `2rem+` 除非大区块分隔。

## 字体层级

| 级别 | 样式 | 用途 |
|------|------|------|
| Page title | Syne 1.375rem / 700 | PageHeader |
| Metric value | Syne 1.75–2rem / 700 tabular-nums | KPI 数字 |
| Metric label | 0.6875rem / 600 uppercase | KPI 标签 |
| Body | IBM Plex Sans 0.875–0.9375rem | 正文、描述 |
| Mono | JetBrains Mono | Token、ID、代码 |

## 核心布局模式

### 1. App Shell
- 固定侧栏 240px，内容区 `max-width: 1280px`
- 主内容 `.muxi-main`：紧凑 padding，无额外居中 margin

### 2. PageHeader
```
[ Title                    ] [ Actions ]
  Description (muted, 单行优先)
```
- `margin-bottom: var(--space-4)`
- Title 与 Metric 区之间无大空白

### 3. MetricCard（首选 KPI 模式）
```jsx
<MetricGrid layout="rhythm">
  <MetricCard label="System" value="MUXI API" size="primary" highlight />
  <MetricCard label="Uptime" value="…" size="primary" />
  <MetricCard label="Version" value="v0.0.0" size="secondary" />
</MetricGrid>
```

- **size**：`primary`（大数字、主视觉）| `secondary`（紧凑、辅助信息）
- **layout**：`rhythm`（2×2 主次行）| `emphasis-first`（Dashboard 首卡加宽）
- **变体**：`accent` | `success` | `warning` | `danger`；`highlight` 用于 primary 强调
- **图表卡**：value 在上，chart 在 `.muxi-metric-card-body` 内

### 4. Stat Bar（列表页兼容）
- `.muxi-stat-bar` 与 MetricGrid 视觉一致：分离卡片、非合并长条
- 列表页（Token / Channel / User）在 PageHeader 下直接放 stat bar

### 5. 表格 / 列表
- 表头 0.6875rem uppercase muted
- 行高紧凑，hover `bg-surface-2`
- 主操作在 PageHeader actions，不在表格内堆按钮

### 6. 表单与 Drawer
- 输入高度 40px，圆角 `--radius-sm` (6px)
- Drawer 详情：label 在上，mono 字段可复制

## 页面模板

### Home（未配置自定义内容时）
1. **MetricGrid** — 系统名、版本、启动时间、验证状态
2. **Compact intro** — 一行标题 + 描述 + CTA（非全宽 Hero）
3. **Quick links** — 水平紧凑入口
4. **Config grid** — 次级 2 列配置状态

### Dashboard
1. PageHeader
2. MetricGrid × 3（今日请求 / 额度 / Token）含 sparkline
3. 全宽 chart card（模型统计）

### 列表页（Token / Channel / User / Log）
1. PageHeader + actions
2. Stat bar / MetricGrid
3. Search + Table

## 动效
- 过渡 150–250ms，`cubic-bezier(0.16, 1, 0.3, 1)`
- 页面进入：`.muxi-animate-in` 轻微 fade + translateY(4px)
- 禁止大面积 parallax、长 duration 动画

## 开发约束
1. **所有样式** 写入 `muxi-theme.css`，禁止 inline style（Recharts tooltip 等第三方除外）
2. **新 UI** 使用 `components/muxi/*`
3. **KPI 区域** 优先 `MetricCard` + `MetricGrid`
4. Legacy `--muxi-*` 变量在 feat-17 前保留别名

## 参考对照

| 元素 | Linear | Vercel | OpenAI Platform | MUXI |
|------|--------|--------|-----------------|------|
| 背景 | 浅灰 | #fafafa | 浅灰白 | `--bg-root` |
| KPI | 大数字优先 | Usage 卡片 | Usage 指标行 | MetricCard |
| 侧栏 | 窄、分组 | 产品导航 | 资源导航 | muxi-sidebar |
| 密度 | 高 | 中高 | 中 | compact tokens |
| 圆角 | 小 | 6–8px | 8px | **8px 全站统一** |

## 圆角规范（feat-11）

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-ui` / `--radius-md` | **8px** | 侧栏选中、卡片、按钮、输入框、Modal |
| `--radius-full` | 9999px | 仅头像、OAuth 图标等圆形元素 |

禁止在 UI 组件上使用 `4px` / `6px` / `12px` 等硬编码圆角。

## 精致化细节（frontend-design）

在保持 Platform Console 克制专业的前提下，增加辨识度：

| 维度 | 实现 |
|------|------|
| **背景层次** | `body::before` 双色 radial 光晕 + `body::after` SVG 噪点纹理 |
| **KPI 卡片** | 顶部 accent 线（hover 显现）、微抬升 `translateY(-1px)` |
| **入场动效** | `.muxi-stagger-in` 子项 45ms 阶梯延迟 |
| **字体** | Syne 用于 KPI 大数字，避免 Inter/Roboto 通用栈 |
| **快捷入口** | 胶囊 pill 横排，非大块 tile |
| **反模式** | 禁止紫色渐变 Hero、2.5rem+ 无效 padding、合并长条 stat bar |

## 精致化路线图（分步实施）

| Feature | 目标 | 解决的用户反馈 |
|---------|------|----------------|
| **feat-09** | 表面层次：背景 `#f5f7fa` + 卡片 `#fff` + `--shadow-card` | 太白了、像纸片 |
| **feat-10** | KPI 主次节奏：primary/secondary MetricCard | 缺少设计重心 | ✅ |
| **feat-11** | 圆角全站 8px | 圆角不统一 | ✅ |
| **feat-12** | MUXI 品牌色/图形/签名元素 | 缺少品牌感 | ✅ |

每步完成后再进入下一步；功能页（Token/Channel 等）在 feat-12 之后继续。
