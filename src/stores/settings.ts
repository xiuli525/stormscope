import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types/settings";
import { DEFAULT_SETTINGS } from "@/types/settings";

interface SettingsStore extends UserSettings {
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K],
  ) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSetting: (key, value) => set({ [key]: value }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    { name: "stormscope-settings" },
  ),
);
