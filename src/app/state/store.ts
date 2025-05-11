import { configureStore } from '@reduxjs/toolkit';
import fallacyTrainerReducer from './slices/fallacyTrainerSlice';
import { RootState } from './types';

const STORAGE_KEY = 'fallacy_trainer_state';

const loadState = (): Partial<RootState> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {};
  }
};

const saveState = (state: RootState) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    fallacyTrainer: fallacyTrainerReducer as any
  },
  preloadedState
});

store.subscribe(() => {
  saveState(store.getState() as RootState);
});

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;