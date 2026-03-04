import { useState, useEffect } from "react";
import { MapPin, Sun, Moon, Navigation } from "lucide-react";
import { SearchInput } from "../ui/SearchInput";
import { Toggle } from "../ui/Toggle";
import { useGeocode } from "../../hooks/useGeocode";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useFavoritesStore } from "../../stores/favorites";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";
import type { GeocodingResult } from "../../types/geocoding";

export function Header() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults, isLoading: isSearching } =
    useGeocode(debouncedQuery);
  const { requestLocation, loading: isLocating } = useGeolocation();
  const { setCurrentCity } = useFavoritesStore();
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
  }, [debouncedQuery]);

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
  };

  const handleLocationClick = () => {
    requestLocation();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-hero border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/20 rounded-lg text-primary-500">
            <MapPin className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent hidden sm:block">
            StormScope
          </h1>
        </div>

        <div className="flex-1 max-w-md relative">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search city..."
            loading={isSearching}
            className="w-full"
          />

          {showResults && searchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/90 backdrop-blur-md rounded-card border border-white/10 shadow-glass overflow-hidden max-h-60 overflow-y-auto z-50">
              {searchResults.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-[var(--text-primary)] font-medium">
                      {city.name}
                    </div>
                    <div className="text-[var(--text-secondary)] text-sm">
                      {city.admin1 ? `${city.admin1}, ` : ""}
                      {city.country}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLocationClick}
            disabled={isLocating}
            className="p-2 rounded-full glass-subtle hover:bg-white/10 transition-colors text-[var(--text-primary)] disabled:opacity-50"
            aria-label="Use current location"
          >
            <Navigation
              className={cn("w-5 h-5", isLocating && "animate-spin")}
            />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <Sun className="w-4 h-4 text-neutral-400 hidden sm:block" />
            <Toggle
              checked={theme === "dark"}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-primary-500"
            />
            <Moon className="w-4 h-4 text-neutral-400 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
