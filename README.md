# StormScope - Weather Data Visualization Dashboard

A modern, responsive weather data visualization dashboard built with React, TypeScript, and ECharts. Features real-time weather data, air quality monitoring, historical analysis, and interactive maps.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-6.0-AA344D?logo=apacheecharts&logoColor=white)

## Features

### Dashboard

- Current weather conditions with animated weather icons
- Hourly forecast with horizontal scrollable cards
- Temperature trend chart (ECharts)
- Wind rose diagram and precipitation bar chart
- Air quality gauge with real-time AQI
- 7-day forecast cards
- Favorite cities quick-access sidebar

### 7-Day Forecast

- Daily weather breakdown with temperature ranges
- Precipitation probability indicators
- Staggered animations with Framer Motion

### Air Quality

- Large AQI gauge with color-coded levels
- AQI scale reference (supports US EPA and European standards)
- 6 pollutant detail cards (PM2.5, PM10, O3, NO2, SO2, CO)
- 24-hour AQI trend line chart

### Historical Data

- Year selector for historical analysis
- Temperature heat calendar (GitHub-style)
- Monthly temperature trend line chart
- Aggregated statistics (max/min temp, rainfall, wind speed)

### Weather Map

- Interactive Leaflet map with dark theme
- City marker with weather popup
- Floating weather info card overlay
- Smooth fly-to animations on city change

### Settings

- Temperature unit (Celsius / Fahrenheit)
- Wind speed unit (km/h, m/s, mph, knots)
- Precipitation unit (mm / inches)
- AQI standard (US EPA / European)
- Theme (Light / Dark / System)
- One-click reset to defaults

## Tech Stack

| Category      | Technology                  | Version    |
| ------------- | --------------------------- | ---------- |
| Framework     | React + TypeScript          | 19.x + 5.8 |
| Build         | Vite                        | 7.3        |
| Routing       | React Router                | 7.x        |
| Styling       | Tailwind CSS                | 4.2        |
| Animation     | Framer Motion               | 12.x       |
| Charts        | ECharts + echarts-for-react | 6.0 / 3.0  |
| Maps          | Leaflet + react-leaflet     | 1.9 / 5.0  |
| State         | Zustand                     | 5.x        |
| Data Fetching | TanStack React Query        | 5.x        |
| Icons         | Lucide React                | -          |

## Data Source

All weather data is sourced from the [Open-Meteo API](https://open-meteo.com/) — a free, open-source weather API that requires no API key.

- Current weather & forecasts
- Historical weather data
- Air quality data (US AQI & European AQI)
- Geocoding for city search

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9 (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/xiuli525/stormscope.git
cd stormscope

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── charts/        # ECharts visualizations (TempChart, AqiGauge, WindRose, etc.)
│   ├── layout/        # App shell (Header, Sidebar, Layout, DynamicBackground)
│   ├── ui/            # Base UI components (Card, Button, Badge, Select, Toggle, etc.)
│   └── weather/       # Weather display components (CurrentWeather, ForecastCard, etc.)
├── hooks/             # React Query hooks (useWeather, useAirQuality, useForecast, etc.)
├── pages/             # Route pages (Dashboard, Forecast, AirQuality, Historical, etc.)
├── services/          # API service layer (weather, air-quality, historical, geocoding)
├── stores/            # Zustand state stores (settings, favorites, theme)
├── themes/            # ECharts light/dark themes
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (units, WMO codes, gradients, etc.)
```

## License

MIT
