import { RecipeModel } from "../../models/recipe/recipe.schema";
import {
  IRecipe,
  IRecipeDocument,
  TRecipeIngredient,
  TRecipeStep,
} from "../../models/recipe/recipe.types";
import { UserModel } from "../../models/user/user.schema";
import { TSecureUser } from "../../models/user/user.types";

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
  const testRecipes = await RecipeModel.create(dummyRecipes);
  await updateTestUsersWithTestRecipes({
    userId: createdByUserId,
    testRecipes,
  });
  return testRecipes;
};

const updateTestUsersWithTestRecipes = async ({
  userId,
  testRecipes,
}: {
  userId: string;
  testRecipes: IRecipeDocument[];
}): Promise<TSecureUser> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("Can't find user");

  const userRecipeObject: any = {};
  testRecipes.forEach((recipe) => {
    userRecipeObject[`${recipe._id.toString()}`] = new Date();
  });
  user.recipes = userRecipeObject;
  user.markModified("recipes");
  await user.save();
  return user;
};
