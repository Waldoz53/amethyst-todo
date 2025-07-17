import { useTodoStore } from '../stores/useTodoStore';
import TodoItem from './TodoItem';

export default function TodoItemList() {
  const { todos, removeTodo, toggleTodo } = useTodoStore();

  if (todos.length === 0) {
    return <p className="empty">This list is empty. Add a new item!</p>;
  }

  return (
    <>
      {todos.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onRemove={removeTodo}
          onToggle={toggleTodo}
        />
      ))}
    </>
  );
}
