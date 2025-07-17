import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export default function ExpiryPopupToggle() {
  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [enabled, setEnabled] = useState(settings.enablePopupAfterTaskExpiry);

  useEffect(() => {
    setEnabled(settings.enablePopupAfterTaskExpiry);
  }, [settings]);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    updateSettings('enablePopupAfterTaskExpiry', newValue);
    saveToFile();
  };

  return (
    <section className="input-container">
      <label htmlFor="expire-notification">
        Send an alert if a task&apos;s timer expires?
      </label>
      <input
        name="expire-notification"
        type="checkbox"
        checked={enabled}
        onChange={handleToggle}
      />
    </section>
  );
}
