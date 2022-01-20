import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipeDocument,
  TRecipeIngredient,
  TRecipeStep,
} from "../../models/recipe/recipe.types";

export const createNewRecipe = async ({
  name,
  description,
  postedBy,
  ingredients,
  directions,
}: {
  name: string;
  description: string;
  postedBy: string;
  ingredients: TRecipeIngredient[];
  directions: TRecipeStep[];
}): Promise<IRecipeDocument> => {
  const recipe = {
    name,
    description,
    postedBy,
    ingredients,
    directions,
  };
  return RecipeModel.create(recipe);
};
