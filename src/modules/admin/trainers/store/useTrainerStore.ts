import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Trainer } from '../types';

interface TrainerState {
  currentTrainer: Trainer | null;
  setCurrentTrainer: (trainer: Trainer | null) => void;
  resetCurrentTrainer: () => void;
}




const trainerApi: StateCreator<TrainerState> = (set) => ({
  currentTrainer: null,
  setCurrentTrainer: (trainer) => set({ currentTrainer: trainer }),
  resetCurrentTrainer: () => set({ currentTrainer: null }),
})

export const useTrainerStore = create<TrainerState>()(
  persist(
    devtools(
      trainerApi
    ),
    { name: 'trainer-storage'}
  )
);
