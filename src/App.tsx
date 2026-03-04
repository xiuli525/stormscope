import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { Layout } from "./components/layout";
import { Skeleton } from "./components/ui";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const AirQuality = lazy(() => import("./pages/AirQuality"));
const Forecast = lazy(() => import("./pages/Forecast"));
const WeatherMap = lazy(() => import("./pages/WeatherMap"));
const Historical = lazy(() => import("./pages/Historical"));
const Settings = lazy(() => import("./pages/Settings"));

function PageSkeleton() {
  return (
    <div className="space-y-6 p-2">
      <Skeleton variant="rectangular" className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton variant="rectangular" className="h-48" />
        <Skeleton variant="rectangular" className="h-48" />
      </div>
      <Skeleton variant="rectangular" className="h-48 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/air-quality" element={<AirQuality />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/map" element={<WeatherMap />} />
          <Route path="/historical" element={<Historical />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
