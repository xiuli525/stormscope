import { X, Star, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useWeather } from "@/hooks/useWeather";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/utils/cn";
import { formatTemperature } from "@/utils/units";
import type { FavoriteCity } from "@/types/geocoding";

export function FavoriteCities() {
  const { favorites, currentCity, setCurrentCity, removeFavorite } =
    useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <Card variant="glass" className="text-center py-8">
        <Star className="w-8 h-8 text-white/40 mx-auto mb-2" />
        <p className="text-sm text-white/60">No favorite cities yet</p>
        <p className="text-xs text-white/40 mt-1">
          Search for a city and add it to favorites
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider px-2">
        Favorites
      </h3>
      <AnimatePresence mode="popLayout">
        {favorites.slice(0, 5).map((city) => (
          <FavoriteCityItem
            key={city.id}
            city={city}
            isActive={currentCity?.id === city.id}
            onSelect={() => setCurrentCity(city)}
            onRemove={() => removeFavorite(city.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface FavoriteCityItemProps {
  city: FavoriteCity;
  isActive: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function FavoriteCityItem({
  city,
  isActive,
  onSelect,
  onRemove,
}: FavoriteCityItemProps) {
  const { data: weather, isLoading } = useWeather(
    city.latitude,
    city.longitude,
  );
  const { temperatureUnit } = useSettingsStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        "group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 border",
        isActive
          ? "bg-primary-500/20 border-primary-500/50 shadow-lg shadow-primary-500/10"
          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10",
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={cn(
            "p-2 rounded-lg shrink-0 transition-colors",
            isActive
              ? "bg-primary-500/20 text-primary-300"
              : "bg-white/5 text-white/40",
          )}
        >
          <MapPin className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "text-sm font-medium truncate transition-colors",
              isActive ? "text-white" : "text-white/80",
            )}
          >
            {city.name}
          </span>
          <span className="text-xs text-white/40 truncate">{city.country}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-2 shrink-0">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-white/20" />
        ) : weather ? (
          <>
            <WeatherIcon
              code={weather.current.weatherCode}
              isDay={weather.current.isDay}
              size="sm"
              className="w-8 h-8"
            />
            <span className="text-sm font-bold text-white w-8 text-right">
              {formatTemperature(weather.current.temperature, temperatureUnit)}
            </span>
          </>
        ) : null}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-lg scale-75 hover:scale-100"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
