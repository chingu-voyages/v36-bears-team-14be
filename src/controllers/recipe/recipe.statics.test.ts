import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { RecipeModel } from "../../models/recipe/recipe.schema";
import { TRecipeCreationData } from "../../models/recipe/recipe.types";
import { UserModel } from "../../models/user/user.schema";
import { createTestRecipes } from "../utils/create-test-recipes";
import { createTestUsers } from "../utils/create-test-users";

let mongoServer: any;

const options: mongoose.ConnectOptions = {
  autoIndex: false,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri, options);
  } catch (exception) {
    console.warn("Mongo error", exception);
  }
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Recipe controller tests", () => {
  describe("Create new recipe", () => {
    test("creates new recipe properly in the database", async () => {
      const dummyUser = await createTestUsers({ count: 1 });
      const newRecipe: TRecipeCreationData = {
        name: "crab cakes",
        description: "delicious food",
        postedBy: dummyUser[0]._id,
        ingredients: [{ name: "crab", quantity: 2, unit: "tablespoons" }],
        directions: [
          { description: "first step" },
          { description: "second step" },
          { description: "third step" },
        ],
        cookTimeMinutes: 20,
        prepTimeMinutes: 5,
      };
      const freshlyCreatedRecipe = await RecipeModel.createNewRecipe(newRecipe);
      const testUser = await UserModel.findById(dummyUser[0]._id.toString());
      expect(freshlyCreatedRecipe.cookTimeMinutes).toBe(20);
      expect(freshlyCreatedRecipe.name).toBe("crab cakes");
      expect(freshlyCreatedRecipe.postedBy).toBe(testUser._id.toString());
      expect(freshlyCreatedRecipe.ingredients.length).toBe(1);
      expect(freshlyCreatedRecipe.directions[1].description).toBe(
        "second step"
      );
      expect(
        testUser.recipes[`${freshlyCreatedRecipe._id.toString()}`]
      ).toBeDefined();
    });
  });
});

describe("recipe find recipes liked by user tests", () => {
  test("finds recipes liked by user", async () => {
    const testUsers = await createTestUsers({
      count: 2,
      plainTextPassword: "password",
    });
    const testRecipes = await createTestRecipes({
      count: 20,
      createdByUserId: testUsers[0]._id.toString(),
    });

    await Promise.all([
      testRecipes[0].toggleLike(testUsers[1]._id.toString()),
      testRecipes[1].toggleLike(testUsers[1]._id.toString()),
      testRecipes[5].toggleLike(testUsers[1]._id.toString()),
      testRecipes[15].toggleLike(testUsers[1]._id.toString()),
      testRecipes[17].toggleLike(testUsers[1]._id.toString()),
    ]);

    const likedRecipes = await RecipeModel.findAllRecipesLikedByUser({
      userId: testUsers[1]._id.toString(),
    });
    expect(likedRecipes.length).toBe(5);
    expect(
      likedRecipes.every(
        (recipe) => !!recipe.likes[`${testUsers[1]._id.toString()}`]
      )
    ).toBe(true);
  });
});
