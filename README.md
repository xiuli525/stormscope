# 🌩️ StormScope — 天气数据可视化仪表盘

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/ECharts-6.0-AA344D?logo=apacheecharts&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-r183-000000?logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

一个现代化的天气数据可视化仪表盘，基于 React 19 + TypeScript 构建。集成真实天气 API 数据、交互式图表、动态天空渐变背景、**Canvas 天气粒子特效系统**、**极端天气预警**、**天文与生活建议面板**、**天气分享卡片生成器**、**AI 天气助手（豆包大模型）**、**3D 地球可视化**、**生成式天气艺术壁纸**、**语音天气播报**，支持中英双语和明暗主题切换。

---

## ✨ 核心亮点

### 🎨 Canvas 天气粒子系统

根据实时天气数据，在页面背景上渲染对应的 Canvas 2D 粒子动画 — 零外部依赖，纯手写物理引擎：

| 天气状况       | 粒子效果                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ |
| ☀️ 晴天 / 多云 | 4 种光斑变体（光球 / 十字星 / 光环 / 闪星），多层光晕，正弦复合曲线飘浮，白天暖金色 / 夜晚冷蓝色 |
| 🌧️ 雨天        | 渐变尾迹雨滴（头亮尾淡），微风阵风摆动，地面水花溅射扩散环                                       |
| 🌦️ 毛毛雨      | 极细（0.4px）慢速半透明雨丝，与暴雨视觉明确区分                                                  |
| ❄️ 雪天        | 4 种雪花变体（圆片 / 六臂结晶 / 八角星 / 微点），风力影响 + 空气阻力感（大片飘得慢）             |
| 🌫️ 雾天        | 22 层深度分层雾气团，呼吸膨缩动画，椭圆软边径向渐变                                              |
| ⛈️ 雷暴        | 200 粒暴雨 + 三层渲染闪电（光晕 / 核心 / 高亮），二级分叉，闪烁抖动相位                          |
| 🌨️ 冰雹        | 不规则六边形冰块，冰面高光，高速旋转坠落 + 地面溅射                                              |
| ☁️ 阴天        | 3-5 椭圆 blob 叠加成立体云团，视差分层漂移                                                       |

### 🌓 动态天空渐变

背景色随天气状况和昼夜自动变化，配合粒子系统营造沉浸式天气体验。

### 📊 专业数据可视化

基于 ECharts 构建多种图表：温度趋势折线图、风向玫瑰图、降水柱状图、空气质量仪表盘、24 小时 AQI 趋势线、GitHub 风格温度热力日历。

### ⚠️ 极端天气预警系统

自动检测当前天气数据中的极端状况（暴雨、高温、寒潮、大风、暴雪、沙尘暴等），以醒目的色彩卡片横幅展示预警信息，包含预警等级、持续时间和防护建议。

### 🌙 天文与生活面板

- **日出日落可视化弧线** — SVG 动态绘制太阳运行轨迹，实时标注当前位置
- **月相显示** — 根据日期计算当前月相并展示对应图标
- **生活建议指数** — 穿衣指数、运动指数、洗车指数、紫外线防护等级，基于真实气象数据智能计算

### 📤 天气分享卡片生成器

一键生成精美天气分享 PNG 图片，支持 3 种模板风格（渐变卡片 / 极简黑白 / 照片风格），使用 html2canvas 将实时天气数据渲染为可保存、可分享的高清图片。

### 🤖 AI 天气助手

集成豆包（Doubao）大语言模型，支持 SSE 流式对话，实时解读当前城市天气数据：

- **智能天气解读** — AI 根据当前温度、湿度、风速、空气质量等真实数据提供个性化建议
- **快捷问题** — 5 个预置快捷按钮（今天穿什么、适合运动吗、空气质量分析、未来天气趋势、出行建议）
- **流式输出** — SSE 实时打字机效果，支持随时中断
- **语音输入** — Web Speech API 语音识别，支持中英双语语音转文字
- **语音朗读** — Web Speech Synthesis 朗读 AI 回复，一键播放/停止
- **用户自备 API Key** — 在设置页面输入豆包 API Key 即可使用，数据安全自主可控

### 🎨 生成式天气艺术壁纸

基于 Perlin noise 流场算法，将实时天气数据映射为独一无二的艺术画作：

- **3 种艺术风格** — 流场（Flow Field）、星座（Constellation）、极光（Aurora）
- **天气数据驱动** — 温度、风速、云量、湿度、降水等参数实时影响画面生成
- **4K 壁纸下载** — 一键导出 3840×2160 高清壁纸
- **实时预览** — Canvas 即时渲染，每次点击「重新生成」都获得全新画面

### 🌍 3D 地球可视化

基于 Three.js + React Three Fiber 构建的交互式 3D 地球：

- **自定义 GLSL Shader 地球** — 程序化渲染陆地/海洋/冰盖/沙漠纹理
- **实时昼夜分界线** — 根据 UTC 时间计算太阳位置，地球表面自动显示昼夜区域
- **夜晚城市灯光** — 暗面随机分布的暖色光点模拟城市灯光
- **菲涅尔大气光晕** — 地球边缘蓝色辉光效果
- **收藏城市标记** — 脉冲动画标记点，颜色根据实时温度变化（冷蓝 → 热红）
- **2000 粒子星空** — 缓慢旋转的深空背景
- **交互控制** — 拖拽旋转、滚轮缩放、点击城市跳转查看详情

---

## 📋 功能列表

### 仪表盘

- 极端天气预警横幅（自动检测暴雨/高温/寒潮/大风等）
- 当前天气状况（温度、体感温度、湿度、风速、紫外线指数）
- 一键生成天气分享卡片（3 种模板风格）
- 逐小时预报横向滚动卡片
- 温度趋势折线图（ECharts）
- 风向玫瑰图 + 降水柱状图
- 空气质量仪表盘（实时 AQI）
- 7 天预报卡片
- 天文与生活面板（日出日落弧线、月相、穿衣/运动/洗车/紫外线建议）
- 收藏城市快速切换侧栏

### 7 天预报

- 每日天气详情（温度范围、天气图标）
- 降水概率指示器
- Framer Motion 交错动画

### 空气质量

- 大型 AQI 仪表盘（色阶对应等级）
- AQI 标准参考（支持美国 EPA / 欧洲标准切换）
- 6 种污染物详情卡片（PM2.5、PM10、O₃、NO₂、SO₂、CO）
- 24 小时 AQI 趋势折线图

### 历史数据

- 年份选择器
- 温度热力日历（GitHub 风格）
- 月度温度趋势折线图
- 汇总统计（最高/最低温度、降雨量、风速）

### 天气地图

- 交互式 Leaflet 地图
- 城市标记 + 天气信息弹窗
- 浮动天气信息卡片
- 城市切换时平滑飞行动画

### 设置

- 温度单位（℃ / ℉）
- 风速单位（km/h、m/s、mph、knots）
- 降水单位（mm / inches）
- AQI 标准（美国 EPA / 欧洲）
- 主题切换（浅色 / 深色 / 跟随系统）
- 语言切换（中文 / English）
- AI API Key 配置（豆包大模型）
- 一键恢复默认设置

### AI 天气助手

- 流式对话界面（浮动聊天面板）
- 基于当前城市天气数据的智能问答
- 5 个快捷问题按钮（中英双语）
- SSE 流式输出 + 随时中断
- 语音输入（Web Speech API 语音识别，中英双语）
- 语音朗读 AI 回复（Web Speech Synthesis）
- 聊天记录清空

### 天气艺术壁纸

- 3 种生成式艺术风格（流场 / 星座 / 极光）
- 实时天气数据驱动画面生成
- Canvas 即时渲染预览
- 一键下载 4K（3840×2160）高清壁纸
- 天气参数面板（温度、风速、云量、湿度、降水、天气状况、昼夜）

### 3D 地球

- 交互式 3D 地球（Three.js + React Three Fiber）
- 自定义 GLSL Shader 渲染（陆地/海洋/冰盖/沙漠）
- 实时昼夜分界线 + 夜晚城市灯光
- 收藏城市温度标记点（脉冲动画）
- 2000 粒子深空星场
- 拖拽旋转 / 滚轮缩放 / 自动旋转
- 点击城市跳转仪表盘查看详情

### 城市管理

- 搜索全球城市（Open-Meteo Geocoding API）
- 收藏 / 取消收藏城市
- 在当前天气区域直接点击星标收藏
- 侧栏快速切换收藏城市

---

## 🛠️ 技术栈

| 类别     | 技术                                      | 版本              |
| -------- | ----------------------------------------- | ----------------- |
| 框架     | React + TypeScript                        | 19.x + 5.8        |
| 构建工具 | Vite                                      | 7.3               |
| 路由     | React Router                              | 7.x               |
| 样式     | Tailwind CSS                              | 4.2               |
| 动画     | Framer Motion                             | 12.x              |
| 图表     | ECharts + echarts-for-react               | 6.0 / 3.0         |
| 地图     | Leaflet + react-leaflet                   | 1.9 / 5.0         |
| 状态管理 | Zustand (persist)                         | 5.x               |
| 数据请求 | TanStack React Query                      | 5.x               |
| 国际化   | i18next + react-i18next                   | 25.x / 16.x       |
| 图标     | Lucide React                              | —                 |
| 粒子系统 | 原生 Canvas 2D API                        | —                 |
| 截图生成 | html2canvas                               | 1.4               |
| 3D 渲染  | Three.js + React Three Fiber + Drei       | r183 / 9.5 / 10.7 |
| AI 模型  | 豆包大模型（Doubao）                      | 1.5 Pro 32K       |
| 语音交互 | Web Speech API（Recognition + Synthesis） | —                 |

---

## 🌐 数据来源

所有天气数据来自 [Open-Meteo API](https://open-meteo.com/) — 免费、开源的天气 API，无需 API Key：

- 当前天气 & 预报数据
- 历史天气数据
- 空气质量数据（US AQI & European AQI）
- 地理编码城市搜索

---

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9（推荐）或 npm

### 安装 & 运行

```bash
git clone https://github.com/xiuli525/stormscope.git
cd stormscope
pnpm install
pnpm dev
```

浏览器访问 `http://localhost:5173` 即可查看。

### 构建生产版本

```bash
pnpm build
pnpm preview
```

---

## 📁 项目结构

```
src/
├── components/
│   ├── ai/            # AI 天气助手（AiChatButton, AiChatPanel, AiMessage, AiQuickActions）
│   ├── charts/        # ECharts 可视化图表（TempChart, AqiGauge, WindRose 等）
│   ├── globe/         # 3D 地球可视化（Earth, CityMarkers, Starfield, GlobePage）
│   ├── layout/        # 应用外壳（Header, Sidebar, DynamicBackground, WeatherParticles）
│   ├── map/           # 地图组件
│   ├── ui/            # 基础 UI 组件（Card, Button, Badge, Select, Toggle 等）
│   └── weather/       # 天气展示组件（CurrentWeather, ForecastCard, WeatherAlerts, AstroLifePanel, ShareCard 等）
├── hooks/             # React Query hooks（useWeather, useAirQuality, useSpeech 等）
├── i18n/              # 国际化配置 + 中英文语言包
├── pages/             # 路由页面（Dashboard, Forecast, AirQuality, Historical, Globe, WeatherArt 等）
├── services/          # API 服务层（weather, air-quality, historical, geocoding, ai）
├── stores/            # Zustand 状态管理（settings, favorites, theme, ai）
├── themes/            # ECharts 主题注册
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数（单位转换, WMO 天气码, 天空渐变, 天气预警规则, AI 提示词, 地球数学 等）
```

---

## 📄 License

MIT
