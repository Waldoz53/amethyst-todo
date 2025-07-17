import { useTodoStore } from '../stores/useTodoStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useState } from 'react';

type Props = {
  syncToDb: () => Promise<void>;
  fetchFromDb: () => Promise<void>;
};

export default function HomeActions({ syncToDb, fetchFromDb }: Props) {
  const { todos, clearTodos } = useTodoStore();
  const { settings } = useSettingsStore();
  const session = useSessionStore((s) => s.session);
  const [syncing, setSyncing] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncToDb();
    setSyncing(false);
  };

  const handleFetch = async () => {
    setFetching(true);
    await fetchFromDb();
    setFetching(false);
  };

  return (
    <section className="button-container">
      {session && (
        <>
          {!settings.autoSync && (
            <button className="sync" onClick={handleSync}>
              {!syncing ? 'Save List' : 'Saving...'}
            </button>
          )}
          <button className="fetch" onClick={handleFetch}>
            {!fetching ? 'Fetch List' : 'Fetching...'}
          </button>
        </>
      )}
      {todos.length > 0 && (
        <button className="remove" onClick={clearTodos}>
          {!settings.autoSync ? 'Delete All (Local)' : 'Delete All'}
        </button>
      )}
    </section>
  );
}
