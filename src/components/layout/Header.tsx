import { useState, useEffect, useRef } from "react";
import { MapPin, Sun, Moon, Navigation, Globe, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SearchInput } from "../ui/SearchInput";
import { Toggle } from "../ui/Toggle";
import { useGeocode } from "../../hooks/useGeocode";
import { useFavoritesStore } from "../../stores/favorites";
import { useThemeStore } from "../../stores/theme";
import { reverseGeocode } from "../../services/geocoding";
import { cn } from "../../utils/cn";
import type { GeocodingResult } from "../../types/geocoding";

export function Header() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading: isSearching } =
    useGeocode(debouncedQuery);
  const { setCurrentCity, addFavorite, removeFavorite, isFavorite } =
    useFavoritesStore();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
    setHighlightIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: GeocodingResult) => {
    setCurrentCity({
      id: String(city.id),
      name: city.name,
      country: city.country,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
      admin1: city.admin1,
    });
    setQuery("");
    setShowResults(false);
    setHighlightIndex(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const results = searchResults ?? [];
    if (!showResults || results.length === 0) {
      if (e.key === "Enter" && query.trim().length >= 2) {
        setDebouncedQuery(query);
        setShowResults(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < results.length) {
          handleSelectCity(results[highlightIndex]);
        } else if (results.length > 0) {
          handleSelectCity(results[0]);
        }
        break;
      case "Escape":
        setShowResults(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, city: GeocodingResult) => {
    e.stopPropagation();
    const cityId = String(city.id);
    if (isFavorite(cityId)) {
      removeFavorite(cityId);
    } else {
      addFavorite({
        id: cityId,
        name: city.name,
        country: city.country,
        countryCode: city.countryCode,
        latitude: city.latitude,
        longitude: city.longitude,
        admin1: city.admin1,
      });
    }
  };

  const handleLocationClick = async () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const city = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (city) {
          setCurrentCity(city);
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-hero border-b border-[var(--glass-border-default)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/20 rounded-lg text-primary-500">
            <MapPin className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent hidden sm:block">
            StormScope
          </h1>
        </div>

        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <SearchInput
            value={query}
            onChange={setQuery}
            onKeyDown={handleSearchKeyDown}
            placeholder={t("header.searchPlaceholder")}
            loading={isSearching}
            className="w-full"
          />

          {showResults && searchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--search-dropdown-bg)] backdrop-blur-xl rounded-card border border-[var(--search-dropdown-border)] shadow-glass overflow-hidden max-h-60 overflow-y-auto z-50">
              {searchResults.map((city, index) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-[var(--search-item-hover)] transition-colors flex items-center gap-3 border-b border-[var(--glass-border-subtle)] last:border-0",
                    highlightIndex === index && "bg-[var(--search-item-hover)]",
                  )}
                >
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--text-primary)] font-medium">
                      {city.name}
                    </div>
                    <div className="text-[var(--text-secondary)] text-sm">
                      {city.admin1 ? `${city.admin1}, ` : ""}
                      {city.country}
                    </div>
                  </div>
                  <span
                    onClick={(e) => handleToggleFavorite(e, city)}
                    className="p-1.5 rounded-full hover:bg-[var(--component-bg-hover)] transition-colors shrink-0"
                    title={
                      isFavorite(String(city.id))
                        ? t("favorites.removeFromFavorites")
                        : t("favorites.addToFavorites")
                    }
                  >
                    <Star
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isFavorite(String(city.id))
                          ? "fill-amber-400 text-amber-400"
                          : "text-[var(--text-muted)] hover:text-amber-400/60",
                      )}
                    />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLocationClick}
            disabled={isLocating}
            className="p-2 rounded-full glass-subtle hover:bg-[var(--component-bg-hover)] transition-colors text-[var(--text-primary)] disabled:opacity-50"
            aria-label={t("header.useCurrentLocation")}
          >
            <Navigation
              className={cn("w-5 h-5", isLocating && "animate-spin")}
            />
          </button>

          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh")
            }
            className="p-2 rounded-full glass-subtle hover:bg-[var(--component-bg-hover)] transition-colors text-[var(--text-primary)] flex items-center gap-1"
            aria-label="Switch language"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">
              {t("header.langSwitch")}
            </span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[var(--glass-border-default)]">
            <Sun className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" />
            <Toggle
              checked={theme === "dark"}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-primary-500"
            />
            <Moon className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
