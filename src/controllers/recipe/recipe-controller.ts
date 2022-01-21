import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipeDocument,
  TRecipeCreationData,
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
  cookTimeMinutes,
  prepTimeMinutes,
}: TRecipeCreationData): Promise<IRecipeDocument> => {
  const recipe = {
    name,
    description,
    postedBy,
    ingredients,
    directions,
    cookTimeMinutes,
    prepTimeMinutes,
  };
  const newRecipe = await RecipeModel.create(recipe);
  await updateUserWithNewRecipe({ newRecipe });
  return newRecipe;
};

async function updateUserWithNewRecipe({
  newRecipe,
}: {
  newRecipe: IRecipeDocument;
}): Promise<void> {
  const user = await UserModel.findById(newRecipe.postedBy);
  user.recipes[`${newRecipe._id}`] = new Date();
  user.markModified("recipes");
  await user.save();
}
