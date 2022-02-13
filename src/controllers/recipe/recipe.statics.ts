import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipeDocument,
  RecipeQueryContext,
  TDeleteRecipeByIdResult,
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
  imageUrl,
}: TRecipeCreationData): Promise<IRecipeDocument> => {
  const recipe = {
    name,
    description,
    postedBy,
    ingredients,
    directions,
    cookTimeMinutes,
    prepTimeMinutes,
    images: imageUrl ? [{ url: imageUrl }] : [],
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
  userId,
  skip,
  limit,
}: {
  context: RecipeQueryContext;
  userId?: string;
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
export async function getRecipeById(id: string): Promise<IRecipeDocument> {
  const recipe = await RecipeModel.findById(id);
  return recipe;
}
export const deleteRecipeById = async ({
  userId,
  recipeId,
}: {
  userId: string;
  recipeId: string;
}): Promise<TDeleteRecipeByIdResult> => {
  const recipe = await RecipeModel.findById(recipeId);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("Could not find the user");
  }
  if (!recipe) {
    throw new Error("Could not find the recipe");
  }
  if (recipe.postedBy === userId) {
    await recipe.delete();
    delete user.recipes[recipe._id];
    user.markModified("recipes");
    await user.save();
    const userRecipes = await getAllRecipesForUserByUserId({ userId });
    return { user, recipes: userRecipes };
  } else {
    throw new Error("You can only delete your own recipes");
  }
};
export const getAllRecipesForUserByUserId = async ({
  userId,
}: {
  userId: string;
}): Promise<IRecipeDocument[]> => {
  const recipes = await RecipeModel.where({ "postedBy": userId });
  return recipes;
};
