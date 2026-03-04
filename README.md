# 🌩️ StormScope — 天气数据可视化仪表盘

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/ECharts-6.0-AA344D?logo=apacheecharts&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

一个现代化的天气数据可视化仪表盘，基于 React 19 + TypeScript 构建。集成真实天气 API 数据、交互式图表、动态天空渐变背景、**Canvas 天气粒子特效系统**，支持中英双语和明暗主题切换。

---

## ✨ 核心亮点

### 🎨 Canvas 天气粒子系统

根据实时天气数据，在页面背景上渲染对应的 Canvas 2D 粒子动画 — 零外部依赖，纯手写：

| 天气状况       | 粒子效果                                |
| -------------- | --------------------------------------- |
| ☀️ 晴天 / 多云 | 漂浮光斑，脉冲发光，白天金色 / 夜晚蓝色 |
| 🌧️ 雨天        | 倾斜雨滴，速度和密度随雨量变化          |
| 🌦️ 毛毛雨      | 细小慢速雨滴                            |
| ❄️ 雪天        | 六臂结晶雪花，旋转 + 正弦摆动           |
| 🌫️ 雾天        | 径向渐变雾气团横向漂移                  |
| ⛈️ 雷暴        | 雨滴 + 多段折线闪电（含分支）+ 屏幕闪烁 |

### 🌓 动态天空渐变

背景色随天气状况和昼夜自动变化，配合粒子系统营造沉浸式天气体验。

### 📊 专业数据可视化

基于 ECharts 构建多种图表：温度趋势折线图、风向玫瑰图、降水柱状图、空气质量仪表盘、24 小时 AQI 趋势线、GitHub 风格温度热力日历。

---

## 📋 功能列表

### 仪表盘

- 当前天气状况（温度、体感温度、湿度、风速、紫外线指数）
- 逐小时预报横向滚动卡片
- 温度趋势折线图（ECharts）
- 风向玫瑰图 + 降水柱状图
- 空气质量仪表盘（实时 AQI）
- 7 天预报卡片
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
- 一键恢复默认设置

### 城市管理

- 搜索全球城市（Open-Meteo Geocoding API）
- 收藏 / 取消收藏城市
- 在当前天气区域直接点击星标收藏
- 侧栏快速切换收藏城市

---

## 🛠️ 技术栈

| 类别     | 技术                        | 版本        |
| -------- | --------------------------- | ----------- |
| 框架     | React + TypeScript          | 19.x + 5.8  |
| 构建工具 | Vite                        | 7.3         |
| 路由     | React Router                | 7.x         |
| 样式     | Tailwind CSS                | 4.2         |
| 动画     | Framer Motion               | 12.x        |
| 图表     | ECharts + echarts-for-react | 6.0 / 3.0   |
| 地图     | Leaflet + react-leaflet     | 1.9 / 5.0   |
| 状态管理 | Zustand (persist)           | 5.x         |
| 数据请求 | TanStack React Query        | 5.x         |
| 国际化   | i18next + react-i18next     | 25.x / 16.x |
| 图标     | Lucide React                | —           |
| 粒子系统 | 原生 Canvas 2D API          | —           |

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
│   ├── charts/        # ECharts 可视化图表（TempChart, AqiGauge, WindRose 等）
│   ├── layout/        # 应用外壳（Header, Sidebar, DynamicBackground, WeatherParticles）
│   ├── ui/            # 基础 UI 组件（Card, Button, Badge, Select, Toggle 等）
│   └── weather/       # 天气展示组件（CurrentWeather, ForecastCard 等）
├── hooks/             # React Query hooks（useWeather, useAirQuality 等）
├── i18n/              # 国际化配置 + 中英文语言包
├── pages/             # 路由页面（Dashboard, Forecast, AirQuality, Historical 等）
├── services/          # API 服务层（weather, air-quality, historical, geocoding）
├── stores/            # Zustand 状态管理（settings, favorites, theme）
├── themes/            # ECharts 主题注册
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数（单位转换, WMO 天气码, 天空渐变等）
```

---

## 📄 License

MIT
