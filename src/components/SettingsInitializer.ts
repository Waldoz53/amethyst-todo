import { useEffect } from 'react';
import { loadSettings } from '../utils/settingsStorage';
import { useSettingsStore } from '../stores/useSettingsStore';

export function SettingsInitializer() {
  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      useSettingsStore.getState().setAll(loaded);
    })();
  }, []);

  return null;
}
