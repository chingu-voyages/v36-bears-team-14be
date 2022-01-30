import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  RecipeQueryContext,
  TRecipeIngredient,
  TRecipeStep,
} from "../../models/recipe/recipe.types";
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
    test("quick recipes tests - should retrieve and sort properly", async () => {
      const testUsers = await createTestUsers({
        count: 1,
        plainTextPassword: "password",
      });

      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
      });
      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 5,
        cookTimeMinutes: 5,
      });
      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
      });
      const r3 = await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 0,
        cookTimeMinutes: 5,
      });
      const r4 = await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 3,
        cookTimeMinutes: 60,
      });

      const queryResults = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.QuickRecipes,
        limit: 5,
      });

      expect(queryResults[0]._id.toString()).toBe(r3[0]._id.toString());
      expect(queryResults[4]._id.toString()).toBe(r4[0]._id.toString());
      expect(queryResults.length).toBe(5);
    });
    test("simple recipes query test", async () => {
      const testUsers = await createTestUsers({
        count: 1,
        plainTextPassword: "password",
      });

      const mapper = ({
        count,
        object,
      }: {
        count: number;
        object: any;
      }): TRecipeIngredient[] | TRecipeStep[] => {
        const arr: any[] = [];
        for (let i = 0; i < count; i++) {
          arr.push(object);
        }
        return arr;
      };

      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 5,
        cookTimeMinutes: 10,
        directions: mapper({
          count: 5,
          object: { description: "d1" },
        }) as TRecipeStep[],
        ingredients: mapper({
          count: 9,
          object: { name: "ingredientName1", quantity: 1, unit: "cup" },
        }) as TRecipeIngredient[],
      });
      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 5,
        cookTimeMinutes: 5,
        directions: mapper({
          count: 1,
          object: { description: "d1" },
        }) as TRecipeStep[],
        ingredients: mapper({
          count: 1,
          object: { name: "ingredientName1", quantity: 1, unit: "cup" },
        }) as TRecipeIngredient[],
      });
      await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        directions: mapper({
          count: 7,
          object: { description: "d1" },
        }) as TRecipeStep[],
        ingredients: mapper({
          count: 12,
          object: { name: "ingredientName1", quantity: 1, unit: "cup" },
        }) as TRecipeIngredient[],
      });
      const r3 = await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 0,
        cookTimeMinutes: 5,
        directions: mapper({
          count: 2,
          object: { description: "d1" },
        }) as TRecipeStep[],
        ingredients: mapper({
          count: 2,
          object: { name: "ingredientName1", quantity: 1, unit: "cup" },
        }) as TRecipeIngredient[],
      });
      const r4 = await createTestRecipes({
        createdByUserId: testUsers[0]._id.toString(),
        count: 1,
        prepTimeMinutes: 3,
        cookTimeMinutes: 60,
        directions: mapper({
          count: 7,
          object: { description: "d1" },
        }) as TRecipeStep[],
        ingredients: mapper({
          count: 20,
          object: { name: "ingredientName1", quantity: 1, unit: "cup" },
        }) as TRecipeIngredient[],
      });

      const queryResults = await findRecipesByContextLimitSkip({
        context: RecipeQueryContext.SimpleRecipes,
        limit: 5,
      });

      expect(queryResults[4]._id.toString()).toBe(r4[0]._id.toString());
      expect(queryResults[4]._id.toString()).toBe(r4[0]._id.toString());
      expect(queryResults[0]._id.toString()).toBe(r3[0]._id.toString());
    });
  });
});
