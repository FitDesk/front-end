import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Trainer } from '../types';

interface TrainerState {
  currentTrainer: Trainer | null;
  setCurrentTrainer: (trainer: Trainer | null) => void;
  resetCurrentTrainer: () => void;
}

export const useTrainerStore = create<TrainerState>()(
  devtools(
    (set) => ({
      currentTrainer: null,
      setCurrentTrainer: (trainer) => set({ currentTrainer: trainer }),
      resetCurrentTrainer: () => set({ currentTrainer: null }),
    }),
    {
      name: 'trainer-storage',
    }
  )
);
