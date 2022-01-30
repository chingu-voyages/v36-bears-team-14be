import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipe,
  IRecipeDocument,
  TRecipeIngredient,
  TRecipeStep,
} from "../../models/recipe/recipe.types";

/**
 *  Batch creates some dummy recipes that we can use for testing
 * @param param0
 */
export const createTestRecipes = async ({
  count,
  createdByUserId,
  cookTimeMinutes,
  prepTimeMinutes,
  ingredients,
  directions,
}: {
  count: number;
  createdByUserId: string;
  cookTimeMinutes?: number;
  prepTimeMinutes?: number;
  ingredients?: Array<TRecipeIngredient>;
  directions?: Array<TRecipeStep>;
}): Promise<IRecipeDocument[]> => {
  const dummyRecipes: IRecipe[] = [];
  for (let i = 0; i < count; i++) {
    dummyRecipes.push({
      name: `recipe${i}.name`,
      description: `recipe${i}.description`,
      likes: {},
      postedBy: createdByUserId,
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ingredients: ingredients ?? [],
      directions: directions ?? [],
      cookTimeMinutes: cookTimeMinutes ?? 0,
      prepTimeMinutes: prepTimeMinutes ?? 0,
    });
  }
  return RecipeModel.create(dummyRecipes);
};
