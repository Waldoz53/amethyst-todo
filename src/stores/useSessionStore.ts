import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

type SessionStore = {
  session: Session | null;
  setSession: (s: Session | null) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (s) => set({ session: s }),
}));
