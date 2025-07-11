import { useEffect } from 'react';
import { useAlertStore } from '../stores/useAlertStore';
import { message } from '@tauri-apps/plugin-dialog';

export function AlertQueueProcessor() {
  const { queue, isShowing, dequeue, setShowing } = useAlertStore();

  useEffect(() => {
    async function processQueue() {
      if (isShowing || queue.length === 0) return;

      setShowing(true);

      await message(queue[0], {
        title: 'Task Overdue!',
        kind: 'warning',
      });

      dequeue();
      setShowing(false);
    }

    processQueue();
  }, [queue, isShowing, dequeue, setShowing]);

  return null;
}
