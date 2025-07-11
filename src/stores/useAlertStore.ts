import { create } from 'zustand';

interface AlertState {
  queue: string[];
  isShowing: boolean;
  enqueue: (msg: string) => void;
  dequeue: () => void;
  setShowing: (showing: boolean) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  queue: [],
  isShowing: false,
  enqueue: (msg) =>
    set((state) => ({ queue: [...state.queue, msg] })),
  dequeue: () =>
    set((state) => ({ queue: state.queue.slice(1) })),
  setShowing: (showing) => set({ isShowing: showing }),
}));
