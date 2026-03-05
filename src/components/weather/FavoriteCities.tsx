import { X, Star, MapPin, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { useFavoritesStore } from "@/stores/favorites";
import { useSettingsStore } from "@/stores/settings";
import { useWeather } from "@/hooks/useWeather";
import { WeatherIcon } from "./WeatherIcon";
import { cn } from "@/utils/cn";
import { formatTemperature } from "@/utils/units";
import type { FavoriteCity } from "@/types/geocoding";

export function FavoriteCities() {
  const { t } = useTranslation();
  const { favorites, currentCity, setCurrentCity, removeFavorite } =
    useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <Card variant="glass" className="text-center py-8">
        <Star className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--text-tertiary)]">
          {t("favorites.noFavorites")}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          {t("favorites.addHint")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider px-2">
        {t("favorites.title")}
      </h3>
      <AnimatePresence mode="popLayout">
        {favorites.map((city) => (
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
          : "bg-[var(--component-bg)] border-[var(--glass-border-subtle)] hover:bg-[var(--component-bg-hover)] hover:border-[var(--glass-border-default)]",
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={cn(
            "p-2 rounded-lg shrink-0 transition-colors",
            isActive
              ? "bg-primary-500/20 text-primary-300"
              : "bg-[var(--component-bg)] text-[var(--text-muted)]",
          )}
        >
          <MapPin className="w-4 h-4" />
        </div>

        <div className="flex flex-col min-w-0">
          <span
            className={cn(
              "text-sm font-medium truncate transition-colors",
              isActive
                ? "text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]",
            )}
          >
            {city.name}
          </span>
          <span className="text-xs text-[var(--text-muted)] truncate">
            {city.country}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-2 shrink-0">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
        ) : weather ? (
          <>
            <WeatherIcon
              code={weather.current.weatherCode}
              isDay={weather.current.isDay}
              size="sm"
              className="w-8 h-8"
            />
            <span className="text-sm font-bold text-[var(--text-primary)] w-8 text-right">
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
