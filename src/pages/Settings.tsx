import { useState } from "react";
import { updater } from "../utils/updater"

export default function Settings() {
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    setChecking(true);
    await updater();
    setChecking(false);
  };

  return (
    <main className="settings">
      <h1>Settings (WIP)</h1>
      <p>Amethyst To Do List</p>
      <p>Developed by Amethyst Software (Waleed R.)</p>
      <p>v0.1.3</p>

      <button onClick={handleCheck}>{checking ? 'Checking...' : 'Check for Updates'}</button>
    </main>
  )
}