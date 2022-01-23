import { RecipeModel } from "../../models/recipe/recipe.schema";
import { IRecipe, IRecipeDocument } from "../../models/recipe/recipe.types";

/**
 *  Batch creates some dummy recipes that we can use for testing
 * @param param0
 */
export const createDummyRecipes = async ({
  count,
  createdByUserId,
}: {
  count: number;
  createdByUserId: string;
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
      ingredients: [],
      directions: [],
      cookTimeMinutes: 0,
      prepTimeMinutes: 0,
    });
  }
  return RecipeModel.create(dummyRecipes);
};
