import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { RecipeQueryContext } from "../../models/recipe/recipe.types";
import { createTestRecipes } from "../utils/create-test-recipes";
import { createTestUsers } from "../utils/create-test-users";
import { findRecipesByContextLimitSkip } from "./recipe.statics";

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
describe("recipe queries", () => {
  describe("get all", () => {
    test("gets all with correct limit and skip", async () => {
      const testUsers = await createTestUsers({
        count: 2,
        plainTextPassword: "password",
      });
      await createTestRecipes({
        count: 20,
        createdByUserId: testUsers[0]._id.toString(),
      });
      await createTestRecipes({
        count: 20,
        createdByUserId: testUsers[1]._id.toString(),
      });

      const query1 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.AllRecipes,
        limit: 5,
        skip: 0,
      });
      const query2 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.AllRecipes,
        limit: 2,
        skip: 5,
      });
      const query3 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.AllRecipes,
      });
      expect(query1.length).toBe(5);
      expect(query2.length).toBe(2);
      expect(query3.length).toBe(40);
    });
    test("gets popular recipes - should sort by most popular (most likes first)", async () => {
      const testUsers = await createTestUsers({
        count: 10,
        plainTextPassword: "password",
      });
      const recipeFromUser0 = await createTestRecipes({
        count: 20,
        createdByUserId: testUsers[0]._id.toString(),
      });
      const recipeFromUser1 = await createTestRecipes({
        count: 20,
        createdByUserId: testUsers[1]._id.toString(),
      });

      await recipeFromUser0[0].toggleLike(testUsers[2]._id.toString());
      await recipeFromUser0[0].toggleLike(testUsers[3]._id.toString());
      await recipeFromUser0[0].toggleLike(testUsers[4]._id.toString());
      await recipeFromUser0[0].toggleLike(testUsers[5]._id.toString());
      await recipeFromUser0[0].toggleLike(testUsers[6]._id.toString());

      await recipeFromUser1[0].toggleLike(testUsers[2]._id.toString());
      await recipeFromUser1[0].toggleLike(testUsers[3]._id.toString());
      await recipeFromUser1[0].toggleLike(testUsers[4]._id.toString());
      await recipeFromUser1[1].toggleLike(testUsers[4]._id.toString());
      await recipeFromUser1[3].toggleLike(testUsers[4]._id.toString());

      const queryResults1 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.PopularRecipes,
      });
      const queryResults2 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.PopularRecipes,
        limit: 5,
      });
      const queryResults3 = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.PopularRecipes,
        limit: 5,
        skip: 5,
      });
      expect(
        queryResults1[0]._id.toString() === recipeFromUser0[0]._id.toString()
      );
      expect(queryResults2.length).toBe(5);
      expect(queryResults3.length).toBe(5);
      expect(
        queryResults2[0]._id.toString() !== queryResults3[0]._id.toString()
      ).toBe(true);
      expect(queryResults1[10]._id.toString()).toBe(
        queryResults3[0]._id.toString()
      );
    });
  });
});
