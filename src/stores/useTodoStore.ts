import { create } from "zustand";
import { TodoItem, loadTodoList, saveTodoList } from "../utils/todoStorage";

type TodoStore = {
  todos: TodoItem[]
  loaded: boolean;
  loadTodos: () => Promise<void>;
  saveTodos: () => Promise<void>;
  addTodo: (item: TodoItem) => void;
  toggleTodo: (index: number) => void;
  removeTodo: (index: number) => void;
  clearTodos: () => void;
  setAll: (items: TodoItem[]) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loaded: false,

  loadTodos: async () => {
    const todos = await loadTodoList();
    set({ todos, loaded: true })
  },

  saveTodos: async () => {
    await saveTodoList(get().todos)
  },

  addTodo: (item) => {
    const updated = [...get().todos, item]
    set({ todos: updated })
  },

  toggleTodo: (index) => {
    const updated = [...get().todos]
    updated[index].completed = !updated[index].completed
    set({ todos: updated })
  },

  removeTodo: (index) => {
    const updated = get().todos.filter((_, i) => i !== index)
    set({ todos: updated })
  },

  clearTodos: () => {
    set({ todos: [] })
  },

  setAll: (items) => {
    set({ todos: items })
  }
}))