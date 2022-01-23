import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createDummyRecipes } from "./create-dummy-recipes";
import { createTestUsers } from "./create-dummy-users";
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

describe("create dummy recipes helper method tests", () => {
  test("creates dummy recipes correctly, with the correct amount and properties", async () => {
    const dummyUser = await createTestUsers({
      count: 1,
      plainTextPassword: "password",
    });
    const userId = dummyUser[0]._id;

    const testRecipes = await createDummyRecipes({
      count: 10,
      createdByUserId: userId,
    });
    expect(testRecipes.length).toBe(10);
    expect(testRecipes[3].name).toBe("recipe3.name");
    expect(testRecipes[2].postedBy).toBe(userId.toString());
    expect(testRecipes[1].description).toBe("recipe1.description");
  });
});
