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
  recipeIds,
}: {
  userId: string;
  recipeIds: string[];
}): Promise<TDeleteRecipeByIdResult> => {
  // const recipe = await RecipeModel.findById(recipeId);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("Could not find the user");
  }
  const foundRecipes = await RecipeModel.find({
    "$and": [{ "postedBy": userId }, { "_id": { "$in": recipeIds } }],
  });

  if (foundRecipes && foundRecipes.length !== recipeIds.length) {
    console.warn(" 126 Delete request seems fishy as the lengths don't match");
  }

  if (foundRecipes && foundRecipes.length > 0) {
    const idsToDelete = foundRecipes.map((r) => r._id.toString());
    await RecipeModel.deleteMany({
      "_id": { "$in": idsToDelete },
    });
  }

  recipeIds.forEach((id) => {
    delete user.recipes[id];
  });
  user.markModified("recipes");
  await user.save();

  const userRecipes = await getAllRecipesForUserByUserId({ userId });
  return { user, recipes: userRecipes };
};
export const getAllRecipesForUserByUserId = async ({
  userId,
}: {
  userId: string;
}): Promise<IRecipeDocument[]> => {
  const recipes = await RecipeModel.where({ "postedBy": userId });
  return recipes;
};
