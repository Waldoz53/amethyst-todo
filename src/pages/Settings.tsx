import { useEffect, useState } from "react";
import { updater } from "../utils/updater";
import { useTodoStore } from "../stores/useTodoStore";
import { useSettingsStore } from "../stores/useSettingsStore";

export default function Settings() {
  const [checking, setChecking] = useState(false);

  const clearTodos = useTodoStore((s) => s.clearTodos);
  const saveTodos = useTodoStore((s) => s.saveTodos);

  const { settings, updateSettings, saveToFile } = useSettingsStore();
  const [defaultHours, setDefaultHours] = useState(settings.defaultHours);

  useEffect(() => {
    setDefaultHours(settings.defaultHours);
  }, [settings.defaultHours]);

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
    updateSettings("defaultHours", defaultHours);
    saveToFile();
  };

  return (
    <main className="settings">
      <h1>Settings</h1>

      <div className="input-container default-hours">
        <label htmlFor="defaultHours">Default Hours:</label>
        <input
          id="defaultHours"
          type="number"
          value={defaultHours}
          onChange={(e) => setDefaultHours(parseInt(e.target.value))}
          onBlur={handleBlur}
        />
      </div>

      <button onClick={wipeList}>Delete To Do List Data</button>
      <button onClick={handleCheck}>
        {checking ? "Checking..." : "Check for Updates"}
      </button>

      <div className="information">
        <p>Amethyst To Do List</p>
        <p>Developed by Amethyst Software (Waleed R.)</p>
        <p>v0.2.0</p>
      </div>
    </main>
  );
}
