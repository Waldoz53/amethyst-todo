import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { formatTimeLeft } from '../utils/formatTimeLeft';
import { useSettingsStore } from '../stores/useSettingsStore';
import { message } from '@tauri-apps/plugin-dialog';

type TodoItem = {
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
};

interface TodoItemProps {
  item: TodoItem;
  index: number;
  onRemove: (index: number) => void;
  onToggle: (index: number) => void;
}

export default function TodoItem({
  item,
  index,
  onRemove,
  onToggle,
}: TodoItemProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const popupShown = useRef(false);

  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { settings } = useSettingsStore();
  const autoDelete = settings.autoDeleteTasksOnComplete;
  const autoDeleteTimer = settings.autoDeleteTimer * 1000;

  useEffect(() => {
    const update = async () => {
      const due = new Date(item.dueDate).getTime();
      const now = Date.now();
      setTimeLeft(formatTimeLeft(due - now));

      if (
        settings.enablePopupAfterTaskExpiry &&
        timeLeft == 'Overdue!' &&
        !popupShown.current
      ) {
        popupShown.current = true;
        await message(`${item.text} is overdue`, {
          title: 'Task Overdue!',
          kind: 'warning',
        });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.dueDate, item.text, settings.enablePopupAfterTaskExpiry, timeLeft]);

  useEffect(() => {
    if (autoDelete && item.completed) {
      deleteTimer.current = setTimeout(() => {
        onRemove(index);
      }, autoDeleteTimer);
    }

    return () => {
      if (deleteTimer.current) {
        clearTimeout(deleteTimer.current);
        deleteTimer.current = null;
      }
    };
  }, [item.completed, autoDelete, autoDeleteTimer, index, onRemove]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`item ${item.completed ? 'completed' : ''}`}
      onClick={() => onToggle(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle(index);
      }}
    >
      <p className="line-clamp">
        <strong className={timeLeft == 'Overdue!' ? 'overdue' : ''}>
          {timeLeft}
        </strong>
        {item.text}
      </p>

      <div className="spacer"></div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
