import { apiRequest } from './client';
import { Recipe } from '../types/recipe';

interface GenerateResponse {
  recipe: Recipe;
}

export async function generateRecipeApi(ingredients: string): Promise<Recipe> {
  const data = await apiRequest<GenerateResponse>('/api/recipes/generate', {
    method: 'POST',
    body: JSON.stringify({ ingredients }),
  });
  return data.recipe;
}

export async function getRecipesApi(): Promise<Recipe[]> {
  const data = await apiRequest<{ recipes: Recipe[] }>('/api/recipes');
  return data.recipes;
}
