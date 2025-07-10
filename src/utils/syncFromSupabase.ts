import { useTodoStore } from '../stores/useTodoStore';
import { useSessionStore } from '../stores/useSessionStore';
import { createClient } from '@supabase/supabase-js';
import { TodoItem } from './todoStorage';

export async function syncFromSupabase() {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  const session = useSessionStore.getState().session;
  const { todos: localTodos, setAll, saveTodos } = useTodoStore.getState();

  if (!session) {
    console.warn('Not logged in');
    return;
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('todos')
    .select('id, text, completed, created_at, due_date')
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to fetch todos from Supabase:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('remote db empty — skipping merge, preserving local');
    return;
  }

  const remoteTodos = data.map((todo) => ({
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    createdAt: todo.created_at,
    dueDate: todo.due_date,
  }));

  const merged = mergeTodos(localTodos, remoteTodos);
  setAll(merged);
  await saveTodos();
  console.log('Merged remote todos into local store');
}

export function mergeTodos(local: TodoItem[], remote: TodoItem[]): TodoItem[] {
  const map = new Map<string, TodoItem>();

  for (const todo of local) {
    map.set(todo.id, todo);
  }

  for (const todo of remote) {
    if (!map.has(todo.id)) {
      map.set(todo.id, todo);
    }
  }

  return Array.from(map.values());
}
