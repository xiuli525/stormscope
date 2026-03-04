import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, Skeleton } from "@/components/ui";
import {
  CurrentWeather,
  WeatherCard,
  ForecastCard,
  FavoriteCities,
} from "@/components/weather";
import { TempChart, AqiGauge, WindRose, PrecipBar } from "@/components/charts";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useWeather } from "@/hooks/useWeather";
import { useAirQuality } from "@/hooks/useAirQuality";
import { isCurrentHour } from "@/utils/date";

const DEFAULT_CITY = {
  id: "beijing",
  name: "Beijing",
  country: "China",
  countryCode: "CN",
  latitude: 39.9042,
  longitude: 116.4074,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

interface ForecastHour {
  time: string;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  isActive: boolean;
}

interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipProb: number;
}

export default function Dashboard() {
  const { currentCity } = useFavoritesStore();
  const { temperatureUnit, aqiStandard } = useSettingsStore();

  const city = currentCity ?? DEFAULT_CITY;

  const { data: weather, isLoading: isWeatherLoading } = useWeather(
    city.latitude,
    city.longitude,
  );
  const { data: airQuality, isLoading: isAqiLoading } = useAirQuality(
    city.latitude,
    city.longitude,
  );

  const isLoading = isWeatherLoading || isAqiLoading;

  const currentAqi = useMemo(() => {
    if (!airQuality?.hourly) return 0;
    const key = aqiStandard === "us" ? "usAqi" : "europeanAqi";
    return airQuality.hourly[key]?.[0] ?? 0;
  }, [airQuality, aqiStandard]);

  const next24Hours = useMemo<ForecastHour[]>(() => {
    if (!weather?.hourly?.time) return [];
    return weather.hourly.time.slice(0, 24).map((time: string, i: number) => ({
      time,
      temperature: weather.hourly.temperature2m[i],
      weatherCode: weather.hourly.weatherCode[i],
      isDay: !!weather.hourly.isDay[i],
      isActive: isCurrentHour(time),
    }));
  }, [weather]);

  const next7Days = useMemo<ForecastDay[]>(() => {
    if (!weather?.daily?.time) return [];
    return weather.daily.time.slice(0, 7).map((date: string, i: number) => ({
      date,
      tempMax: weather.daily.temperature2mMax[i],
      tempMin: weather.daily.temperature2mMin[i],
      weatherCode: weather.daily.weatherCode[i],
      precipProb: weather.daily.precipitationProbabilityMax[i],
    }));
  }, [weather]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 w-full max-w-7xl mx-auto">
        <Skeleton
          variant="rectangular"
          className="h-[200px] w-full rounded-3xl"
        />
        <div className="space-y-4">
          <Skeleton variant="text" className="h-8 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                className="h-32 w-24 rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <Skeleton variant="rectangular" className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rectangular" className="h-80 rounded-3xl" />
          <Skeleton variant="rectangular" className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-8 w-full max-w-7xl mx-auto text-zinc-100 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="w-full">
        {weather && (
          <CurrentWeather
            data={weather.current}
            cityName={city.name}
            countryCode={city.countryCode}
            unit={temperatureUnit}
          />
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
          Hourly Forecast
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
          {next24Hours.map((hour) => (
            <div key={hour.time} className="snap-start flex-shrink-0">
              <WeatherCard
                time={hour.time}
                temperature={hour.temperature}
                weatherCode={hour.weatherCode}
                isDay={hour.isDay}
                isActive={hour.isActive}
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
          Temperature Trend
        </h2>
        <Card variant="glass" className="p-6 h-[350px]">
          {weather?.hourly && (
            <TempChart hourly={weather.hourly} unit={temperatureUnit} />
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
            Precipitation & Wind
          </h2>
          <Card variant="glass" className="p-6 h-[350px]">
            {weather?.hourly && <PrecipBar hourly={weather.hourly} />}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4 lg:pt-11">
          <Card
            variant="glass"
            className="p-6 h-[350px] flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-4 left-4 text-sm text-zinc-400 font-medium">
              Wind Direction
            </div>
            {weather?.hourly && (
              <WindRose
                directions={weather.hourly.windDirection10m?.slice(0, 24) ?? []}
                speeds={weather.hourly.windSpeed10m?.slice(0, 24) ?? []}
              />
            )}
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
              Air Quality
            </h2>
            <Card
              variant="glass"
              className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              <div className="w-full sm:w-1/2 flex justify-center">
                <div className="w-48 h-48">
                  <AqiGauge aqi={currentAqi} standard={aqiStandard} />
                </div>
              </div>
              <div className="w-full sm:w-1/2 pl-0 sm:pl-6 border-l-0 sm:border-l border-white/10 flex flex-col justify-center gap-4">
                <div>
                  <p className="text-sm text-zinc-400 font-medium uppercase tracking-wider">
                    Primary Pollutant
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">PM2.5</span>
                    <span className="text-zinc-400">Particulate Matter</span>
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-light text-emerald-400">
                    {airQuality?.hourly?.pm2_5?.[0] ?? 0}{" "}
                    <span className="text-lg text-zinc-500">µg/m³</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Fine particles that can penetrate deep into the lungs and
                    enter the bloodstream.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
              7-Day Forecast
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {next7Days.map((day) => (
                <ForecastCard
                  key={day.date}
                  date={day.date}
                  tempMax={day.tempMax}
                  tempMin={day.tempMin}
                  weatherCode={day.weatherCode}
                  precipProb={day.precipProb}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="space-y-4 xl:sticky xl:top-6 h-fit"
        >
          <h2 className="text-xl font-semibold text-zinc-200/90 pl-1">
            Saved Locations
          </h2>
          <Card variant="glass" className="p-4 min-h-[400px]">
            <FavoriteCities />
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
