import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
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
