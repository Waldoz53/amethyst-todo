import '../styles/home.css'
import { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItemList from '../components/TodoItemList';
import HomeActions from '../components/HomeActions';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { TodoItem as TodoType } from '../utils/todoStorage';
import useAutoSync from '../hooks/useAutoSync';
import useSyncToDb from '../hooks/useSyncToDb';
import useFetchFromDb from '../hooks/useFetchFromDb';

function Home() {
  const { todos, addTodo, loaded, saveTodos, loadTodos } = useTodoStore();
  const { settings } = useSettingsStore();
  const [input, setInput] = useState('');
  const [dueInHours, setDueInHours] = useState(settings.defaultHours);

  const syncToDb = useSyncToDb();
  const fetchFromDb = useFetchFromDb();

  useAutoSync();

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

  return (
    <main className="home">
      <TodoForm
        input={input}
        setInput={setInput}
        onAdd={addItem}
        dueInHours={dueInHours}
        setDueInHours={setDueInHours}
      />

      <TodoItemList />

      <HomeActions
        syncToDb={syncToDb}
        fetchFromDb={fetchFromDb}
      />
    </main>
  );
}

export default Home;
