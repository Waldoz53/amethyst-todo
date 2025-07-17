import { useTodoStore } from '../stores/useTodoStore';
import { syncFromSupabase } from '../utils/syncFromSupabase';

export default function useFetchFromDb() {
  return async () => {
    await useTodoStore.getState().loadTodos();
    await syncFromSupabase();
  };
}
