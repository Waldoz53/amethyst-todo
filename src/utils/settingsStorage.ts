import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { validateAndFixSettings } from './validateSettings';

export const SETTINGS_FILE_NAME = 'settings.json';

export type Settings = {
  defaultHours: number;
  autoDeleteTasksOnComplete: boolean;
  autoDeleteTimer: number;
  enablePopupAfterTaskExpiry: boolean;
};

export async function loadSettings(): Promise<Settings> {
  const path = { baseDir: BaseDirectory.AppData };

  const existsFile = await exists(SETTINGS_FILE_NAME, path);
  if (!existsFile) {
    await mkdir('', path);
    const defaults = validateAndFixSettings({});
    await writeTextFile(
      SETTINGS_FILE_NAME,
      JSON.stringify(defaults, null, 2),
      path
    );
    return defaults;
  }

  try {
    const raw = await readTextFile(SETTINGS_FILE_NAME, path);
    const parsed = JSON.parse(raw);
    const fixed = validateAndFixSettings(parsed);
    await writeTextFile(
      SETTINGS_FILE_NAME,
      JSON.stringify(fixed, null, 2),
      path
    );
    return fixed;
  } catch (err) {
    console.error('Failed to load settings. Using defaults.', err);
    const fallback = validateAndFixSettings({});
    return fallback;
  }
}

export async function saveSettings(settings: Partial<Settings>) {
  const json = JSON.stringify(settings);
  await writeTextFile(SETTINGS_FILE_NAME, json, {
    baseDir: BaseDirectory.AppData,
  });
}
