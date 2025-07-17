import { useSessionStore } from '../stores/useSessionStore';
import { useTodoStore } from '../stores/useTodoStore';
import { message } from '@tauri-apps/plugin-dialog';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function useSyncToDb() {
  return async () => {
    const { todos, deletedIds, clearDeletedIds } = useTodoStore.getState();
    const userId = useSessionStore.getState().session?.user.id;
    if (!userId) return;

    if (todos.length === 0) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('user_id', userId);

      if (error) {
        await message(error.message, { title: 'Sync Error' });
        return;
      }
    }

    if (deletedIds.length > 0) {
      const { error } = await supabase
        .from('todos')
        .delete()
        .in('id', deletedIds);

      if (error) {
        await message(error.message, { title: 'Sync Error' });
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
      await message(error.message, { title: 'Sync Error' });
    } else {
      clearDeletedIds();
    }
  };
}
