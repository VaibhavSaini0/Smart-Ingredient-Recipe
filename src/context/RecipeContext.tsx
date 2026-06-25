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
import { mockGenerateRecipe } from '../mock/generateRecipe';
import {
  ActiveFollowSession,
  Recipe,
  TimerState,
} from '../types/recipe';

interface RecipeContextValue {
  latestRecipe: Recipe | null;
  isGenerating: boolean;
  generateError: string | null;
  followSession: ActiveFollowSession | null;
  activeTimer: TimerState | null;
  generateRecipe: (ingredients: string) => Promise<boolean>;
  clearLatestRecipe: () => void;
  startFollowing: (recipe: Recipe) => void;
  stopFollowing: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  startTimer: (stepId: string, minutes: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const RecipeContext = createContext<RecipeContextValue | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [latestRecipe, setLatestRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [followSession, setFollowSession] = useState<ActiveFollowSession | null>(null);
  const [activeTimer, setActiveTimer] = useState<TimerState | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearIntervalRef(), [clearIntervalRef]);

  const generateRecipe = async (ingredients: string): Promise<boolean> => {
    if (!ingredients.trim()) {
      setGenerateError('Please enter the ingredients you have at home.');
      return false;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const recipe = await mockGenerateRecipe(ingredients);
      setLatestRecipe(recipe);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to generate recipe.';
      setGenerateError(message);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearLatestRecipe = () => setLatestRecipe(null);

  const startFollowing = (recipe: Recipe) => {
    setFollowSession({
      recipe,
      currentStepIndex: 0,
      startedAt: Date.now(),
    });
    setActiveTimer(null);
    clearIntervalRef();
  };

  const stopFollowing = () => {
    setFollowSession(null);
    setActiveTimer(null);
    clearIntervalRef();
  };

  const goToStep = (index: number) => {
    setFollowSession((prev) => {
      if (!prev) return prev;
      const max = prev.recipe.steps.length - 1;
      return { ...prev, currentStepIndex: Math.max(0, Math.min(index, max)) };
    });
    setActiveTimer(null);
    clearIntervalRef();
  };

  const nextStep = () => {
    setFollowSession((prev) => {
      if (!prev) return prev;
      const max = prev.recipe.steps.length - 1;
      if (prev.currentStepIndex >= max) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
    });
    setActiveTimer(null);
    clearIntervalRef();
  };

  const prevStep = () => {
    setFollowSession((prev) => {
      if (!prev || prev.currentStepIndex <= 0) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex - 1 };
    });
    setActiveTimer(null);
    clearIntervalRef();
  };

  const startTimer = (stepId: string, minutes: number) => {
    clearIntervalRef();
    const totalSeconds = minutes * 60;

    setActiveTimer({
      stepId,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
    });

    intervalRef.current = setInterval(() => {
      setActiveTimer((prev) => {
        if (!prev || !prev.isRunning) return prev;

        const remainingSeconds = prev.remainingSeconds - 1;
        if (remainingSeconds <= 0) {
          clearIntervalRef();
          Alert.alert('Timer done!', 'Move on to the next step when ready.');
          return { ...prev, remainingSeconds: 0, isRunning: false };
        }

        return { ...prev, remainingSeconds };
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setActiveTimer((prev) => (prev ? { ...prev, isRunning: false } : prev));
    clearIntervalRef();
  };

  const resetTimer = () => {
    setActiveTimer((prev) => {
      if (!prev) return prev;
      clearIntervalRef();
      return {
        ...prev,
        remainingSeconds: prev.totalSeconds,
        isRunning: false,
      };
    });
  };

  const value = useMemo(
    () => ({
      latestRecipe,
      isGenerating,
      generateError,
      followSession,
      activeTimer,
      generateRecipe,
      clearLatestRecipe,
      startFollowing,
      stopFollowing,
      goToStep,
      nextStep,
      prevStep,
      startTimer,
      pauseTimer,
      resetTimer,
    }),
    [
      latestRecipe,
      isGenerating,
      generateError,
      followSession,
      activeTimer,
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
