import { create } from 'zustand';
import { TodoItem, loadTodoList, saveTodoList } from '../utils/todoStorage';

type TodoStore = {
  todos: TodoItem[];
  deletedIds: string[];
  loaded: boolean;
  loadTodos: () => Promise<void>;
  saveTodos: () => Promise<void>;
  addTodo: (item: TodoItem) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearTodos: () => void;
  clearDeletedIds: () => void;
  setAll: (items: TodoItem[]) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  deletedIds: [],
  loaded: false,

  loadTodos: async () => {
    const todos = await loadTodoList();
    set({ todos, loaded: true });
  },

  saveTodos: async () => {
    await saveTodoList(get().todos);
  },

  addTodo: (item) => {
    const updated = [...get().todos, item];
    set({ todos: updated });
  },

  toggleTodo: (id) => {
    const updated = get().todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    set({ todos: updated });
  },

  removeTodo: (id) => {
    const updated = get().todos.filter((todo) => todo.id !== id);
    const deleted = [...get().deletedIds, id];
    console.log(deleted);
    set({ todos: updated, deletedIds: deleted });
  },

  clearTodos: () => {
    set({ todos: [] });
  },

  clearDeletedIds: () => set({ deletedIds: [] }),

  setAll: (items) => {
    set({ todos: items });
  },
}));
