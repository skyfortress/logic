import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FallacyTrainerState, SessionActivity } from "../types";
import { EvaluationResponse, Fallacy } from "../../pages/api/types";

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
  sessionActivity: [],
  questionsInSession: 0,
  isSessionComplete: false,
  showSessionResults: false,
  currentSession: {
    startTime: null,
    points: 0,
  },
};

export const MASERY_COUNT = 3;
export const QUESTIONS_IN_SESSION = 5;

export const fallacyTrainerSlice = createSlice({
  name: "fallacyTrainer",
  initialState,
  reducers: {
    setCurrentFallacy(state, action: PayloadAction<Fallacy | null>) {
      state.currentFallacy = action.payload;
      
      // Start a new session if one is not already in progress
      if (!state.currentSession?.startTime && action.payload) {
        state.currentSession = {
            startTime: new Date().toISOString(),
            points: 0
        };
      }
    },
    setUserInput(state, action: PayloadAction<string>) {
      state.userInput = action.payload;
    },
    setShowAnswer(state, action: PayloadAction<boolean>) {
      state.showAnswer = action.payload;
    },
    updateScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
      // Track points earned in the current session
      if (state.currentSession?.startTime) {
        state.currentSession.points += action.payload;
      }
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

      if (state.fallacyMasteries[fallacyType] === MASERY_COUNT) {
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
    incrementQuestionsInSession(state) {
      state.questionsInSession += 1;
      if (state.questionsInSession > QUESTIONS_IN_SESSION) {
        state.isSessionComplete = true;
      }
    },
    resetSession(state) {
      state.questionsInSession = 0;
      state.isSessionComplete = false;
      state.showSessionResults = false;
    },
    showResults(state) {
      state.showSessionResults = true;
    },
    endCurrentSession(state) {
      if (state.currentSession?.startTime) {
        const startTime = new Date(state.currentSession.startTime);
        const endTime = new Date();
        const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        
        // Add the session to activity history
        const newActivity: SessionActivity = {
          date: state.currentSession.startTime,
          duration: durationInSeconds,
          points: state.currentSession.points,
        };
        
        state.sessionActivity = [newActivity, ...(state.sessionActivity || [])];
        
        // Reset current session
        state.currentSession.startTime = null;
        state.currentSession.points = 0;
        state.questionsInSession = 0;
        state.isSessionComplete = false;
      }
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
  incrementQuestionsInSession,
  resetSession,
  showResults,
  endCurrentSession,
  hydrateState,
} = fallacyTrainerSlice.actions;

export default fallacyTrainerSlice.reducer;
