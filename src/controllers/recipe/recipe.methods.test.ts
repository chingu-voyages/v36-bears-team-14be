import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { TRecipePatchPayloadData } from "../../models/recipe/recipe.types";
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

describe("recipe toggle likes tests", () => {
  test("toggles likes properly", async () => {
    const testUsers = await createTestUsers({
      count: 3,
      plainTextPassword: "password",
    });
    const testRecipe = await createTestRecipes({
      count: 1,
      createdByUserId: testUsers[0]._id.toString(),
    });

    await testRecipe[0].toggleLike(testUsers[1]._id.toString());
    await testRecipe[0].toggleLike(testUsers[2]._id.toString());

    expect(testRecipe[0].likes[`${testUsers[1]._id.toString()}`]).toBeDefined();

    await testRecipe[0].toggleLike(testUsers[1]._id.toString());
    expect(
      testRecipe[0].likes[`${testUsers[1]._id.toString()}`]
    ).toBeUndefined();
    expect(testRecipe[0].likes[`${testUsers[2]._id.toString()}`]).toBeDefined();
    expect(Object.keys(testRecipe[0].likes).length).toBe(1);
  });
});
describe("patch recipe tests", () => {
  test("patches correctly", async () => {
    const testUsers = await createTestUsers({
      count: 3,
      plainTextPassword: "password",
    });
    const testRecipe = await createTestRecipes({
      count: 1,
      createdByUserId: testUsers[0]._id.toString(),
    });

    const payload: TRecipePatchPayloadData = {
      name: "updated recipe",
      description: "updated description",
      cookTimeMinutes: 55,
      prepTimeMinutes: 60,
      ingredients: [
        { name: "updatedName", quantity: 100, unit: "updatedQuantity" },
      ],
      directions: [
        { description: "some updated direction 1" },
        { description: "some updated direction 2" },
      ],
    };

    const patchedData = await testRecipe[0].patchUpdate({
      requestorId: testUsers[0]._id.toString(),
      payload,
    });

    expect(patchedData.name).toBe("updated recipe");
    expect(patchedData.prepTimeMinutes).toBe(60);
    expect(patchedData.directions.length).toBe(2);
    expect(patchedData.ingredients.length).toBe(1);
    expect(patchedData.ingredients[0].quantity).toBe(100);
    expect(patchedData.directions[1].description).toBe(
      "some updated direction 2"
    );
  });
  test("throws error during unauthorized patch request", async () => {
    const testUsers = await createTestUsers({
      count: 3,
      plainTextPassword: "password",
    });
    const testRecipe = await createTestRecipes({
      count: 1,
      createdByUserId: testUsers[0]._id.toString(),
    });

    const payload: TRecipePatchPayloadData = {
      name: "updated recipe",
      description: "updated description",
      cookTimeMinutes: 55,
      prepTimeMinutes: 60,
      ingredients: [
        { name: "updatedName", quantity: 100, unit: "updatedQuantity" },
      ],
      directions: [
        { description: "some updated direction 1" },
        { description: "some updated direction 2" },
      ],
    };
    await expect(() =>
      testRecipe[0].patchUpdate({
        requestorId: testUsers[1]._id.toString(),
        payload,
      })
    ).rejects.toThrow();
  });
});
