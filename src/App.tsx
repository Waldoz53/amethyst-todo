import { SettingsInitializer } from './components/SettingsInitializer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Header from './components/Header';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useSessionStore } from './stores/useSessionStore';
import { syncFromSupabase } from './utils/syncFromSupabase';
import { useTodoStore } from './stores/useTodoStore';
import { RouteSyncer } from './components/RouteSyncer';
import { AlertQueueProcessor } from './components/AlertQueueProcessor';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  // retrieve session from Zustand
  const session = useSessionStore((s) => s.session);

  const hasSynced = useRef(false);

  // auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      useSessionStore.getState().setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useSessionStore.getState().setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id && !hasSynced.current) {
      hasSynced.current = true;
      initializeList();
    }
  }, [session]);

  useEffect(() => {
    const onFocus = () => {
      if (session?.user?.id) {
        initializeList();
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [session]);

  async function initializeList() {
    await useTodoStore.getState().loadTodos();
    await syncFromSupabase();
  }

  return (
    <BrowserRouter>
      <SettingsInitializer />
      <RouteSyncer />
      <AlertQueueProcessor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}
