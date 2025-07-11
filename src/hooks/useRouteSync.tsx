import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncFromSupabase } from '../utils/syncFromSupabase';

export function useRouteSync() {
  const location = useLocation();

  useEffect(() => {
    syncFromSupabase();
  }, [location.pathname]);
}
