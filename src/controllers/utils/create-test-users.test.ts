import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { checkPassword } from "../../utils/crypto";
import { createTestUsers } from "./create-test-users";
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

describe("creates dummy test users", () => {
  test("creates dummy test users properly", async () => {
    const dummyUsers = await createTestUsers({
      count: 4,
      plainTextPassword: "test1",
    });
    expect(dummyUsers.length).toBe(4);
    expect(dummyUsers[3].firstName).toBe("dummyUser3.FirstName");
    expect(dummyUsers[2].bio).toBe("dummyUser2.bio");
    const isPasswordValid = await checkPassword({
      hashedPassword: dummyUsers[0].hashedPassword,
      plainTextPassword: "test1",
    });
    expect(isPasswordValid).toBe(true);
  });
});
