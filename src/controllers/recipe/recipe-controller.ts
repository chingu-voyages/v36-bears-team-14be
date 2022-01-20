import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipeDocument,
  TRecipeIngredient,
  TRecipeStep,
} from "../../models/recipe/recipe.types";
import { UserModel } from "../../models/user/user.schema";

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
  const newRecipe = await RecipeModel.create(recipe);
  const user = await UserModel.findById(postedBy);
  user.recipes[`${newRecipe._id}`] = new Date();
  user.markModified("recipes");
  await user.save();
  return newRecipe;
};
