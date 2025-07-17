import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export default function SettingsForm() {
  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [defaultHours, setDefaultHours] = useState(settings.defaultHours);

  useEffect(() => {
    setDefaultHours(settings.defaultHours);
  }, [settings]);

  const handleBlur = () => {
    updateSettings('defaultHours', defaultHours);
    saveToFile();
  };

  return (
    <section className="input-container default-hours">
      <label htmlFor="defaultHours">Default Task Time (in hours):</label>
      <input
        name="defaultHours"
        type="number"
        value={defaultHours}
        onChange={(e) => setDefaultHours(parseInt(e.target.value))}
        onBlur={handleBlur}
      />
    </section>
  );
}
