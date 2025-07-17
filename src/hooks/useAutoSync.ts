import { useEffect, useRef } from 'react';
import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import useSyncToDb from './useSyncToDb';

export default function useAutoSync() {
  const { todos } = useTodoStore();
  const { autoSync } = useSettingsStore().settings;
  const syncToDb = useSyncToDb();
  const prevLength = useRef(todos.length);

  useEffect(() => {
    if (!autoSync) return;

    if (todos.length !== prevLength.current) {
      prevLength.current = todos.length;
      syncToDb();
    }
  }, [todos.length, autoSync, syncToDb]);
}
