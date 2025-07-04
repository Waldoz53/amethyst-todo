import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { validateAndFixTodos } from './validateTodos';

export const TODO_FILE_NAME = 'todo.json';

export type TodoItem = {
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
};

export async function loadTodoList(): Promise<TodoItem[]> {
  const fileExists = await exists(TODO_FILE_NAME, {
    baseDir: BaseDirectory.AppData,
  });

  if (!fileExists) {
    await mkdir("", { baseDir: BaseDirectory.AppData });
    await writeTextFile(TODO_FILE_NAME, "[]", { baseDir: BaseDirectory.AppData });
    return [];
  }

  try {
    const raw = await readTextFile(TODO_FILE_NAME, { baseDir: BaseDirectory.AppData });
    const parsed = JSON.parse(raw);
    const fixed = validateAndFixTodos(parsed);

    await writeTextFile(TODO_FILE_NAME, JSON.stringify(fixed, null, 2), { baseDir: BaseDirectory.AppData });

    return fixed;
  } catch (err) {
    console.error("Failed to load or parse todo.json:", err);
    return [];
  }
}

export async function saveTodoList(list: TodoItem[]): Promise<void> {
  const json = JSON.stringify(list);
  await writeTextFile(TODO_FILE_NAME, json, {
    baseDir: BaseDirectory.AppData,
  });
}
