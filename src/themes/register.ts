import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  GaugeChart,
  RadarChart,
  HeatmapChart,
  PieChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
  PolarComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import lightTheme from "./echarts-light";
import darkTheme from "./echarts-dark";

echarts.use([
  LineChart,
  BarChart,
  GaugeChart,
  RadarChart,
  HeatmapChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  CalendarComponent,
  PolarComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

echarts.registerTheme("stormscope-light", lightTheme);
echarts.registerTheme("stormscope-dark", darkTheme);

export { echarts };
