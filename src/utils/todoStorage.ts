import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';

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

  if (fileExists) {
    const data = await readTextFile(TODO_FILE_NAME, {
      baseDir: BaseDirectory.AppData,
    });
    try {
      return JSON.parse(data);
    } catch (err) {
      console.warn('Failed to parse todo list JSON:', err);
      return [];
    }
  } else {
    await mkdir('', { baseDir: BaseDirectory.AppData });
    return [];
  }
}

export async function saveTodoList(list: TodoItem[]): Promise<void> {
  const json = JSON.stringify(list);
  await writeTextFile(TODO_FILE_NAME, json, {
    baseDir: BaseDirectory.AppData,
  });
}
