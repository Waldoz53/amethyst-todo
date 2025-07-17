import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

export default function AutoDeleteSettings() {
  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [autoDelete, setAutoDelete] = useState(settings.autoDeleteTasksOnComplete);
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(settings.autoDeleteTimer);

  useEffect(() => {
    setAutoDelete(settings.autoDeleteTasksOnComplete);
    setAutoDeleteTimer(settings.autoDeleteTimer);
  }, [settings]);

  const handleToggle = () => {
    const newValue = !autoDelete;
    setAutoDelete(newValue);
    updateSettings('autoDeleteTasksOnComplete', newValue);
    saveToFile();
  };

  const handleTimerChange = (value: number) => {
    setAutoDeleteTimer(value);
    updateSettings('autoDeleteTimer', value);
    saveToFile();
  };

  return (
    <section className="input-container">
      <label htmlFor="autoDelete">Automatically delete completed tasks?</label>
      <input
        name="autoDelete"
        type="checkbox"
        checked={autoDelete}
        onChange={handleToggle}
      />
      {autoDelete && (
        <>
          <label htmlFor="autoDeleteTimer">Auto Delete Timer (in seconds):</label>
          <input
            name="autoDeleteTimer"
            type="number"
            value={autoDeleteTimer}
            onChange={(e) => handleTimerChange(parseInt(e.target.value))}
          />
        </>
      )}
    </section>
  );
}
