import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FallacyTrainerState } from "../types";
import { EvaluationResponse, Fallacy } from "../../api/types";

const initialState: FallacyTrainerState = {
  currentFallacy: null,
  userInput: "",
  showAnswer: false,
  score: 0,
  streak: 0,
  isCorrect: null,
  isLoadingFallacy: false,
  isEvaluating: false,
  evaluation: null,
  seenFallacyIds: [],
  fallacyMasteries: {},
  showMasteryDialog: false,
};

export const fallacyTrainerSlice = createSlice({
  name: "fallacyTrainer",
  initialState,
  reducers: {
    setCurrentFallacy(state, action: PayloadAction<Fallacy | null>) {
      state.currentFallacy = action.payload;
    },
    setUserInput(state, action: PayloadAction<string>) {
      state.userInput = action.payload;
    },
    setShowAnswer(state, action: PayloadAction<boolean>) {
      state.showAnswer = action.payload;
    },
    updateScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
    setStreak(state, action: PayloadAction<number>) {
      state.streak = action.payload;
    },
    incrementStreak(state) {
      state.streak += 1;
    },
    resetStreak(state) {
      state.streak = 0;
    },
    setCorrect(state, action: PayloadAction<boolean | null>) {
      state.isCorrect = action.payload;
    },
    setLoadingFallacy(state, action: PayloadAction<boolean>) {
      state.isLoadingFallacy = action.payload;
    },
    setEvaluating(state, action: PayloadAction<boolean>) {
      state.isEvaluating = action.payload;
    },
    setEvaluation(state, action: PayloadAction<EvaluationResponse | null>) {
      state.evaluation = action.payload;
    },
    addSeenFallacy(state, action: PayloadAction<string>) {
      state.seenFallacyIds.push(action.payload);
    },
    resetSeenFallacies(state) {
      state.seenFallacyIds = [];
    },
    updateFallacyMastery(state, action: PayloadAction<string>) {
      const fallacyType = action.payload;

      if (!state.fallacyMasteries[fallacyType]) {
        state.fallacyMasteries[fallacyType] = 0;
      }
      state.fallacyMasteries[fallacyType] += 1;

      if (state.fallacyMasteries[fallacyType] == 1) {
        state.showMasteryDialog = true;
      }
    },
    resetAnswerState(state) {
      state.userInput = "";
      state.showAnswer = false;
      state.isCorrect = null;
      state.evaluation = null;
    },
    showMasteryDialog(state, action: PayloadAction<Fallacy>) {
      state.showMasteryDialog = true;
    },
    hideMasteryDialog(state) {
      state.showMasteryDialog = false;
    },
    hydrateState(state, action: PayloadAction<FallacyTrainerState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCurrentFallacy,
  setUserInput,
  setShowAnswer,
  updateScore,
  setStreak,
  incrementStreak,
  resetStreak,
  setCorrect,
  setLoadingFallacy,
  setEvaluating,
  setEvaluation,
  addSeenFallacy,
  resetSeenFallacies,
  updateFallacyMastery,
  resetAnswerState,
  showMasteryDialog,
  hideMasteryDialog,
  hydrateState,
} = fallacyTrainerSlice.actions;

export default fallacyTrainerSlice.reducer;
