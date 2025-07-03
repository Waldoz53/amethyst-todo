import { useEffect, useState } from 'react';
import '../App.css';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { TodoItem as TodoType } from '../utils/todoStorage';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';

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
  } = useTodoStore();
  const { settings } = useSettingsStore();
  const [input, setInput] = useState('');
  const [dueInHours, setDueInHours] = useState(settings.defaultHours);

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
      text: input.trim(),
      completed: false,
      createdAt: now.toISOString(),
      dueDate: due.toISOString(),
    };

    addTodo(newItem);
    setInput('');
  };

  const toggleItem = (index: number) => {
    toggleTodo(index);
  };

  const removeItem = (index: number) => {
    removeTodo(index);
  };

  const clearItems = () => {
    clearTodos();
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
        {todos.map((item, index) => (
          <TodoItem
            key={index}
            item={item}
            index={index}
            onRemove={removeItem}
            onToggle={toggleItem}
          />
        ))}

        {todos.length > 0 && (
          <button className="remove" onClick={clearItems}>
            Delete All
          </button>
        )}
      </section>
    </main>
  );
}

export default Home;
