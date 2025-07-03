import { create } from "zustand";
import { saveSettings } from "../utils/settingsStorage";

type Settings = {
  defaultHours: number,
  autoDeleteTasksOnComplete: boolean,
  autoDeleteTimer: number,
  enablePopupAfterTaskExpiry: boolean,
}

type SettingsStore = {
  settings: Settings,
  updateSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setAll: (newSettings: Partial<Settings>) => void;
  saveToFile: () => void
}

export const useSettingsStore = create<SettingsStore>(set => ({
  settings: {
    defaultHours: 1,
    autoDeleteTasksOnComplete: false,
    autoDeleteTimer: 30,
    enablePopupAfterTaskExpiry: false
  },

  updateSettings: (key, value) =>
    set(state => ({
      settings: { ...state.settings, [key]: value }
    })),

  setAll: (newSettings) =>
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    })),

  saveToFile: async () => {
    const current = useSettingsStore.getState().settings
    await saveSettings(current)
  }
}))


// example usage
// const store = useSettingsStore.getState();
// store.updateSettings('autoDeleteTasksOnComplete', true);
// store.saveToFile();