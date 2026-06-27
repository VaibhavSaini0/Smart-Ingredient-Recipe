import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { generateRecipeApi } from '../api/recipes';
import { ApiError } from '../api/client';
import {
  ActiveFollowSession,
  Recipe,
  TimerState,
} from '../types/recipe';
import { isTimerBlocking, timerBlockingMessage } from '../utils/timerBlocking';
import { playTimerCompleteSound, stopTimerSound } from '../utils/timerSound';

interface RecipeContextValue {
  latestRecipe: Recipe | null;
  isGenerating: boolean;
  generateError: string | null;
  followSession: ActiveFollowSession | null;
  activeTimer: TimerState | null;
  timerBlockingNavigation: boolean;
  generateRecipe: (ingredients: string) => Promise<boolean>;
  startFollowing: (recipe: Recipe) => void;
  stopFollowing: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  startTimer: (stepId: string, minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  cancelTimer: () => void;
  stopCompletedTimer: () => void;
  openRecipe: (recipe: Recipe) => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

function createFollowSession(recipe: Recipe): ActiveFollowSession {
  return {
    recipe,
    currentStepIndex: 0,
    finishedTimerStepIds: [],
  };
}

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [latestRecipe, setLatestRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [followSession, setFollowSession] = useState<ActiveFollowSession | null>(null);
  const [activeTimer, setActiveTimer] = useState<TimerState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const timerBlockingNavigation = useMemo(
    () => isTimerBlocking(followSession, activeTimer),
    [followSession, activeTimer],
  );

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearTimer = useCallback(() => {
    clearIntervalRef();
    setActiveTimer(null);
  }, [clearIntervalRef]);

  const tickTimer = useCallback(
    (prev: TimerState | null): TimerState | null => {
      if (!prev || !prev.isRunning) return prev;

      const remainingSeconds = prev.remainingSeconds - 1;
      if (remainingSeconds <= 0) {
        clearIntervalRef();
        void playTimerCompleteSound();
        return {
          ...prev,
          remainingSeconds: 0,
          isRunning: false,
          awaitingStop: true,
        };
      }

      return { ...prev, remainingSeconds };
    },
    [clearIntervalRef],
  );

  const startInterval = useCallback(() => {
    clearIntervalRef();
    intervalRef.current = setInterval(() => {
      setActiveTimer((prev) => tickTimer(prev));
    }, 1000);
  }, [clearIntervalRef, tickTimer]);

  useEffect(() => () => clearIntervalRef(), [clearIntervalRef]);

  const blockIfTimerActive = useCallback(
    (session: ActiveFollowSession | null, timer: TimerState | null) => {
      if (!isTimerBlocking(session, timer)) return false;

      Alert.alert(
        'Timer in progress',
        timerBlockingMessage(timer),
      );
      return true;
    },
    [],
  );

  const generateRecipe = async (ingredients: string): Promise<boolean> => {
    if (!ingredients.trim()) {
      setGenerateError('Please enter the ingredients you have at home.');
      return false;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const recipe = await generateRecipeApi(ingredients);
      setLatestRecipe(recipe);
      return true;
    } catch (error) {
      let message = 'Failed to generate recipe.';

      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message.includes('Network')
          ? 'Cannot reach server. Check that the backend is running and API URL is correct.'
          : error.message;
      }

      setGenerateError(message);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const openRecipe = (recipe: Recipe) => setLatestRecipe(recipe);

  const startFollowing = (recipe: Recipe) => {
    setFollowSession(createFollowSession(recipe));
    clearTimer();
  };

  const stopFollowing = () => {
    void stopTimerSound();
    setFollowSession(null);
    clearTimer();
  };

  const goToStep = (index: number) => {
    if (blockIfTimerActive(followSession, activeTimer)) return;

    setFollowSession((prev) => {
      if (!prev) return prev;
      const max = prev.recipe.steps.length - 1;
      return { ...prev, currentStepIndex: Math.max(0, Math.min(index, max)) };
    });
    clearTimer();
  };

  const nextStep = () => {
    if (blockIfTimerActive(followSession, activeTimer)) return;

    setFollowSession((prev) => {
      if (!prev) return prev;
      const max = prev.recipe.steps.length - 1;
      if (prev.currentStepIndex >= max) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
    });
    clearTimer();
  };

  const prevStep = () => {
    if (blockIfTimerActive(followSession, activeTimer)) return;

    setFollowSession((prev) => {
      if (!prev || prev.currentStepIndex <= 0) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex - 1 };
    });
    clearTimer();
  };

  const startTimer = (stepId: string, minutes: number) => {
    clearTimer();
    const totalSeconds = minutes * 60;

    setActiveTimer({
      stepId,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
      awaitingStop: false,
    });

    startInterval();
  };

  const resumeTimer = () => {
    setActiveTimer((prev) => {
      if (!prev || prev.isRunning || prev.awaitingStop) return prev;
      return { ...prev, isRunning: true };
    });
    startInterval();
  };

  const pauseTimer = () => {
    setActiveTimer((prev) =>
      prev && prev.isRunning ? { ...prev, isRunning: false } : prev,
    );
    clearIntervalRef();
  };

  const cancelTimer = () => {
    void stopTimerSound();
    clearTimer();
  };

  const stopCompletedTimer = () => {
    void stopTimerSound();

    const completedStepId =
      activeTimer?.awaitingStop ? activeTimer.stepId : null;

    if (completedStepId) {
      setFollowSession((prev) => {
        if (!prev || prev.finishedTimerStepIds.includes(completedStepId)) {
          return prev;
        }

        return {
          ...prev,
          finishedTimerStepIds: [...prev.finishedTimerStepIds, completedStepId],
        };
      });
    }

    clearTimer();
  };

  const value = useMemo(
    () => ({
      latestRecipe,
      isGenerating,
      generateError,
      followSession,
      activeTimer,
      timerBlockingNavigation,
      generateRecipe,
      startFollowing,
      stopFollowing,
      goToStep,
      nextStep,
      prevStep,
      startTimer,
      pauseTimer,
      resumeTimer,
      cancelTimer,
      stopCompletedTimer,
      openRecipe,
    }),
    [
      latestRecipe,
      isGenerating,
      generateError,
      followSession,
      activeTimer,
      timerBlockingNavigation,
    ],
  );

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within RecipeProvider');
  }
  return context;
}
