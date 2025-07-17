import { useState } from 'react';
import { updater } from '../../utils/updater';
import { useTodoStore } from '../../stores/useTodoStore';
import { message, confirm } from '@tauri-apps/plugin-dialog';
import { useSessionStore } from '../../stores/useSessionStore';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function UpdateAndWipeButtons() {
  const [checking, setChecking] = useState(false);
  const session = useSessionStore((s) => s.session);
  const clearTodos = useTodoStore((s) => s.clearTodos);
  const saveTodos = useTodoStore((s) => s.saveTodos);

  const wipeLocal = async () => {
    clearTodos();
    await saveTodos();
  };

  const wipeRemote = async () => {
    const userId = session?.user.id;
    if (!userId) return;

    const confirmed = await confirm("This action can't be reverted. Are you sure?", {
      title: 'Confirm Delete Data',
    });
    if (!confirmed) return;

    const { error } = await supabase.from('todos').delete().eq('user_id', userId);
    if (error) {
      await message(error.message, { title: 'Error Deleting Data' });
    } else {
      await message('Successfully deleted uploaded data', { title: 'Success!' });
    }
  };

  const checkForUpdates = async () => {
    setChecking(true);
    await updater();
    setChecking(false);
  };

  return (
    <>
      <button onClick={wipeLocal}>Delete Local List</button>
      {session && <button onClick={wipeRemote}>Delete Uploaded List</button>}
      <button onClick={checkForUpdates}>
        {checking ? 'Checking...' : 'Check for Updates'}
      </button>
    </>
  );
}
