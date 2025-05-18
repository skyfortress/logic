import { configureStore } from '@reduxjs/toolkit';
import fallacyTrainerReducer from './slices/fallacyTrainerSlice';
import { RootState } from './types';
import { getUserId } from '../utils/userIdentification';

const STORAGE_KEY = 'fallacy_trainer_state';
const DEBOUNCE_DELAY = 2000; // 2 seconds

const loadState = (): Partial<RootState> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return {};
    }
    const state = JSON.parse(serializedState);
    state.fallacyTrainer.currentFallacy = null;
    state.fallacyTrainer.showMasteryDialog = false;
    return state;

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
    
    debouncedSyncWithServer(state);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const debouncedSyncWithServer = (() => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (state: RootState) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      const userId = getUserId();
      const stateWithUserId = {
        ...state,
        userId
      };
      
      fetch('/api/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stateWithUserId),
      })
      .then(response => {
        if (!response.ok) {
          console.error('Error syncing state with server:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Failed to sync state with server:', error);
        timeoutId = null;
      });
    }, DEBOUNCE_DELAY);
  };
})();

// Initialize store with local state first
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