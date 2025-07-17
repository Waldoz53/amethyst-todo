import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export default function AutoSyncToggle() {
  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [autoSync, setAutoSync] = useState(settings.autoSync);

  useEffect(() => {
    setAutoSync(settings.autoSync);
  }, [settings]);

  const handleToggle = () => {
    const newValue = !autoSync;
    setAutoSync(newValue);
    updateSettings('autoSync', newValue);
    saveToFile();
  };

  return (
    <section className="input-container">
      <label htmlFor="autosync">Automatically sync to cloud?</label>
      <input
        name="autosync"
        type="checkbox"
        checked={autoSync}
        onChange={handleToggle}
      />
    </section>
  );
}
