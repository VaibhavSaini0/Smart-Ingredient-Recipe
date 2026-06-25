import { Recipe, RecipeStep } from '../types/recipe';

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function parseIngredients(input: string): string[] {
  return input
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(capitalize);
}

function buildSteps(ingredients: string[]): RecipeStep[] {
  const main = ingredients[0] ?? 'ingredients';
  const second = ingredients[1] ?? 'seasoning';
  const third = ingredients[2] ?? 'aromatics';
  const fourth = ingredients[3] ?? 'base';

  return [
    {
      id: 'step-1',
      instruction: `Wash and prep ${main.toLowerCase()} and ${second.toLowerCase()}. Cut into bite-sized pieces.`,
    },
    {
      id: 'step-2',
      instruction: `Heat a pan over medium heat. Add ${third.toLowerCase()} and sauté for 2 minutes until fragrant.`,
      timerMinutes: 2,
    },
    {
      id: 'step-3',
      instruction: `Add ${main.toLowerCase()} to the pan. Cook until lightly browned on all sides.`,
      timerMinutes: 5,
    },
    {
      id: 'step-4',
      instruction: `Stir in ${second.toLowerCase()} and ${fourth.toLowerCase()}. Mix well and cook until everything is tender.`,
      timerMinutes: 8,
    },
    {
      id: 'step-5',
      instruction: 'Taste and adjust seasoning. Serve hot and enjoy your homemade dish!',
    },
  ];
}

function buildTitle(ingredients: string[]): string {
  const main = ingredients[0] ?? 'Pantry';
  const accent = ingredients[1] ?? 'Special';
  return `${main} & ${accent} Skillet Bowl`;
}

export async function mockGenerateRecipe(input: string): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const ingredients = parseIngredients(input);

  if (ingredients.length < 3) {
    throw new Error('Please enter at least 3 ingredients separated by commas.');
  }

  return {
    id: `recipe-${Date.now()}`,
    title: buildTitle(ingredients),
    ingredients: ingredients.map((item) => `1 portion ${item.toLowerCase()}`),
    steps: buildSteps(ingredients),
    prepTime: '25 min',
    servings: 2,
    inputIngredients: ingredients,
  };
}
