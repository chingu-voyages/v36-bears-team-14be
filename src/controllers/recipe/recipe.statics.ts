import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipeDocument,
  RecipeQueryContext,
  TRecipeCreationData,
} from "../../models/recipe/recipe.types";
import { UserModel } from "../../models/user/user.schema";

import {
  getAllRecipes,
  getPopularRecipes,
  getQuickRecipes,
  getSimpleRecipes,
} from "./recipe.queries";

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

export const findAllRecipesLikedByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<IRecipeDocument[]> => {
  const mongoQuery = `likes.${userId}`;
  const results = await RecipeModel.where({
    [`${mongoQuery}`]: { $exists: true },
  }).exec();
  return results;
};

export const findRecipesByContextLimitSkip = async ({
  context,
  skip,
  limit,
}: {
  context: RecipeQueryContext;
  skip?: number;
  limit?: number;
}): Promise<IRecipeDocument[]> => {
  switch (context) {
    case RecipeQueryContext.AllRecipes:
      return getAllRecipes({ limit, skip });
    case RecipeQueryContext.PopularRecipes:
      return getPopularRecipes({ limit, skip });
    case RecipeQueryContext.QuickRecipes:
      return getQuickRecipes({ limit, skip });
    case RecipeQueryContext.SimpleRecipes:
      return getSimpleRecipes({ limit, skip });
    default:
      throw new Error(`Invalid query context: ${context}`);
  }
};
