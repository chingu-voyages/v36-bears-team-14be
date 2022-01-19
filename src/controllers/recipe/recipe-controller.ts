import { RecipeModel } from "../../models/recipe/recipe.schema";
import { IRecipeDocument } from "../../models/recipe/recipe.types";

export const createNewRecipe = async ({
  name,
  description,
  postedBy,
}: {
  name: string;
  description: string;
  postedBy: string;
}): Promise<IRecipeDocument> => {
  const recipe = {
    name,
    description,
    postedBy,
  };
  return RecipeModel.create(recipe);
};
