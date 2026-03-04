import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DynamicBackground } from "./DynamicBackground";
import { useFavoritesStore } from "../../stores/favorites";
import { useWeather } from "../../hooks/useWeather";

interface LayoutProps {
  children: React.ReactNode;
}

const DEFAULT_CITY = {
  id: "beijing",
  name: "Beijing",
  country: "China",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

export function Layout({ children }: LayoutProps) {
  const { currentCity } = useFavoritesStore();
  const city = currentCity ?? DEFAULT_CITY;

  const { data: weather } = useWeather(city.latitude, city.longitude);

  const weatherCode = weather?.current.weatherCode ?? 0;
  const isDay = weather?.current.isDay ?? true;

  return (
    <div className="relative min-h-screen text-[var(--text-primary)] font-sans">
      <DynamicBackground weatherCode={weatherCode} isDay={isDay} />

      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
