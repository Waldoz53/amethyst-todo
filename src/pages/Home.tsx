import { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { TodoItem as TodoType } from '../utils/todoStorage';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSessionStore } from '../stores/useSessionStore';
import { createClient } from '@supabase/supabase-js';
import { message } from '@tauri-apps/plugin-dialog';
import { syncFromSupabase } from '../utils/syncFromSupabase';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function Home() {
  const {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearTodos,
    loadTodos,
    saveTodos,
    loaded,
    deletedIds,
    clearDeletedIds,
  } = useTodoStore();
  const { settings } = useSettingsStore();
  const [input, setInput] = useState('');
  const [dueInHours, setDueInHours] = useState(settings.defaultHours);
  const session = useSessionStore((s) => s.session);
  const [syncing, setSyncing] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (loaded) {
      saveTodos();
      setDueInHours(settings.defaultHours);
    }
  }, [todos, loaded, settings.defaultHours, saveTodos]);

  const addItem = () => {
    if (!input.trim()) return;

    const now = new Date();
    const due = new Date(now.getTime() + dueInHours * 60 * 60 * 1000);

    const newItem: TodoType = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
      createdAt: now.toISOString(),
      dueDate: due.toISOString(),
    };

    addTodo(newItem);
    setInput('');
  };

  const toggleItem = (id: string) => {
    toggleTodo(id);
  };

  const removeItem = (id: string) => {
    removeTodo(id);
  };

  const clearItems = () => {
    clearTodos();
  };

  const syncToDb = async () => {
    setSyncing(true);
    const userId = session?.user.id;

    if (todos.length === 0) {
      const { error: deleteAllError } = await supabase
        .from('todos')
        .delete()
        .eq('user_id', userId);

      if (deleteAllError) {
        console.error('Error deleting all todos:', deleteAllError.message);
        await message(`${deleteAllError.message}`, { title: 'Sync Error' });
        return;
      }

      console.log('All todos deleted from Supabase (local list empty).');
    }

    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('todos')
        .delete()
        .in('id', deletedIds);

      if (deleteError) {
        console.error('Error deleting todos:', deleteError.message);
        await message(`${deleteError.message}`, { title: 'Sync Error' });
        return;
      }
    }

    const todosToInsert = todos.map((todo) => ({
      id: todo.id,
      user_id: userId,
      text: todo.text,
      completed: todo.completed,
      created_at: todo.createdAt,
      due_date: todo.dueDate,
    }));

    const { error } = await supabase.from('todos').upsert(todosToInsert, {
      onConflict: 'id',
    });

    if (error) {
      console.log(error);
      await message(`${error.message}`, { title: 'Sync Error' });
      return;
    } else {
      clearDeletedIds();
    }
    setSyncing(false);
  };

  const fetchFromDb = async () => {
    setFetching(true);
    await useTodoStore.getState().loadTodos();
    await syncFromSupabase();
    setFetching(false);
  };

  return (
    <main id="app">
      <TodoForm
        input={input}
        setInput={setInput}
        onAdd={addItem}
        dueInHours={dueInHours}
        setDueInHours={setDueInHours}
      />

      <section className="list">
        {todos.length > 0 ? (
          <>
            {todos.map((item) => (
              <TodoItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onToggle={toggleItem}
              />
            ))}
          </>
        ) : (
          <p className="empty">This list is empty. Add a new item!</p>
        )}
      </section>

      <section className="button-container">
        {session && (
          <>
            <button className="sync" onClick={syncToDb}>
              {!syncing ? 'Save List' : 'Saving...'}
            </button>
            <button className="fetch" onClick={fetchFromDb}>
              {!fetching ? 'Fetch List' : 'Fetching...'}
            </button>
          </>
        )}

        {todos.length > 0 && (
          <button className="remove" onClick={clearItems}>
            Delete All Items (Local)
          </button>
        )}
      </section>
    </main>
  );
}

export default Home;
