import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { formatTimeLeft } from '../utils/formatTimeLeft';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAlertStore } from '../stores/useAlertStore';

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
};

interface TodoItemProps {
  item: TodoItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TodoItem({ item, onRemove, onToggle }: TodoItemProps) {
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
        useAlertStore.getState().enqueue(`${item.text} is overdue`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [item.dueDate, item.text, settings.enablePopupAfterTaskExpiry, timeLeft]);

  useEffect(() => {
    if (autoDelete && item.completed) {
      deleteTimer.current = setTimeout(() => {
        onRemove(item.id);
      }, autoDeleteTimer);
    }

    return () => {
      if (deleteTimer.current) {
        clearTimeout(deleteTimer.current);
        deleteTimer.current = null;
      }
    };
  }, [item.completed, autoDelete, autoDeleteTimer, item.id, onRemove]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`item ${item.completed ? 'completed' : ''}`}
      onClick={() => onToggle(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggle(item.id);
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
          onRemove(item.id);
        }}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}
