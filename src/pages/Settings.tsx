import { useEffect, useState } from 'react';
import { updater } from '../utils/updater';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';

export default function Settings() {
  const [checking, setChecking] = useState(false);

  const clearTodos = useTodoStore((s) => s.clearTodos);
  const saveTodos = useTodoStore((s) => s.saveTodos);

  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [defaultHours, setDefaultHours] = useState(settings.defaultHours);
  const [autoDelete, setAutoDelete] = useState(
    settings.autoDeleteTasksOnComplete
  );
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(
    settings.autoDeleteTimer
  );
  const [enablePopup, setEnablePopup] = useState(
    settings.enablePopupAfterTaskExpiry
  );

  useEffect(() => {
    setDefaultHours(settings.defaultHours);
    setAutoDelete(settings.autoDeleteTasksOnComplete);
    setAutoDeleteTimer(settings.autoDeleteTimer);
  }, [settings]);

  const handleCheck = async () => {
    setChecking(true);
    await updater();
    setChecking(false);
  };

  const wipeList = async () => {
    clearTodos();
    await saveTodos();
  };

  const handleBlur = () => {
    updateSettings('defaultHours', defaultHours);
    updateSettings('autoDeleteTasksOnComplete', autoDelete);
    updateSettings('autoDeleteTimer', autoDeleteTimer);
    saveToFile();
  };

  const toggleAutoDelete = () => {
    const newValue = !autoDelete;
    setAutoDelete(newValue);
    updateSettings('autoDeleteTasksOnComplete', newValue);
    saveToFile();
  };

  const toggleEnablePopup = () => {
    const newValue = !enablePopup;
    setEnablePopup(newValue);
    updateSettings('enablePopupAfterTaskExpiry', newValue);
    saveToFile();
  };

  return (
    <main className="settings">
      <h1>Settings</h1>
      <p style={{ fontSize: '12px' }}>Settings are automatically saved</p>

      <div className="input-container default-hours">
        <label htmlFor="defaultHours">Default Task Time (in hours):</label>
        <input
          name="defaultHours"
          type="number"
          value={defaultHours}
          onChange={(e) => setDefaultHours(parseInt(e.target.value))}
          onBlur={handleBlur}
        />
      </div>

      <div className="input-container">
        <label htmlFor="autoDelete">
          Automatically delete completed tasks?
        </label>
        <input
          name="autoDelete"
          type="checkbox"
          checked={autoDelete}
          onChange={() => toggleAutoDelete()}
        />

        {autoDelete && (
          <>
            <label htmlFor="autoDeleteTimer">
              Auto Delete Timer (in seconds):
            </label>
            <input
              name="autoDeleteTimer"
              type="number"
              value={autoDeleteTimer}
              onChange={(e) => setAutoDeleteTimer(parseInt(e.target.value))}
              onBlur={handleBlur}
            />
          </>
        )}
      </div>

      <div className="input-container">
        <label htmlFor="expire-notification">
          Send an alert if a task&apos;s timer expires?
        </label>
        <input
          name="expire-notification"
          type="checkbox"
          checked={enablePopup}
          onChange={() => toggleEnablePopup()}
        />
      </div>

      <button onClick={wipeList}>Delete To Do List Data</button>
      <button onClick={handleCheck}>
        {checking ? 'Checking...' : 'Check for Updates'}
      </button>

      <div className="information">
        <p>Amethyst To Do List</p>
        <p>Developed by Amethyst Software (Waleed R.)</p>
        <p>v0.2.2</p>
      </div>
    </main>
  );
}
