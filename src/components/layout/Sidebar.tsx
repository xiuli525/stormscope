import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Wind,
  CloudSun,
  Map,
  History,
  Settings2,
  Menu,
  Globe,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export function Sidebar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/air-quality", label: t("nav.airQuality"), icon: Wind },
    { to: "/forecast", label: t("nav.forecast"), icon: CloudSun },
    { to: "/map", label: t("nav.map"), icon: Map },
    { to: "/historical", label: t("nav.historical"), icon: History },
    { to: "/settings", label: t("nav.settings"), icon: Settings2 },
    { to: "/globe", label: t("nav.globe"), icon: Globe },
    { to: "/weather-art", label: t("nav.weatherArt"), icon: Palette },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-primary-500 text-white shadow-lg md:hidden hover:bg-primary-600 transition-colors"
        aria-label={t("nav.toggleMenu")}
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass-secondary border-r border-[var(--glass-border-default)] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:glass-secondary flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-8 md:hidden">
            <h2 className="text-xl font-bold text-[var(--text-primary)] pl-4">
              {t("nav.menu")}
            </h2>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary-500/10 text-primary-500 shadow-sm"
                      : "text-[var(--text-secondary)] hover:bg-[var(--glass-l1-bg)] hover:text-[var(--text-primary)]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "w-5 h-5 transition-colors relative z-10",
                        isActive
                          ? "text-primary-500"
                          : "text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]",
                      )}
                    />
                    <span className="font-medium relative z-10">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--glass-border-default)]">
          <div className="text-xs text-center text-[var(--text-tertiary)]">
            StormScope v1.0
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
