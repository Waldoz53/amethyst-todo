import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';

export const SETTINGS_FILE_NAME = 'settings.json';

export type Settings = {
  defaultHours: number,
  autoDeleteTasksOnComplete: boolean,
  autoDeleteTimer: number,
  enablePopupAfterTaskExpiry: boolean,
};

const defaultSettings: Settings = {
  defaultHours: 1,
  autoDeleteTasksOnComplete: false,
  autoDeleteTimer: 30,
  enablePopupAfterTaskExpiry: false,
};

export async function loadSettings(): Promise<Settings> {
  const fileExists = await exists(SETTINGS_FILE_NAME, {
    baseDir: BaseDirectory.AppData,
  });

  if (fileExists) {
    const data = await readTextFile(SETTINGS_FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });

    try {
      const parsed = JSON.parse(data);
      return { ...defaultSettings, ...parsed };
    } catch (err) {
      console.warn('Failed to parse settings.json, falling back to defaults:', err);
      return defaultSettings;
    }
  } else {
    await mkdir('', { baseDir: BaseDirectory.AppData });
    await saveSettings(defaultSettings);
    return defaultSettings;
  }
}

export async function saveSettings(settings: Partial<Settings>) {
  const json = JSON.stringify(settings);
  await writeTextFile(SETTINGS_FILE_NAME, json, {
    baseDir: BaseDirectory.AppData,
  });
}
