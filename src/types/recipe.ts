export interface RecipeStep {
  id: string;
  instruction: string;
  timerMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: RecipeStep[];
  prepTime: string;
  servings: number;
  inputIngredients: string[];
}

export interface ActiveFollowSession {
  recipe: Recipe;
  currentStepIndex: number;
  startedAt: number;
}

export interface TimerState {
  stepId: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}
