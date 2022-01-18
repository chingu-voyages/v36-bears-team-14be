import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { UserModel } from "../../models/user/user.schema";
import { checkPassword } from "../../utils/crypto";
let mongoServer: any;

const options: mongoose.ConnectOptions = {
  autoIndex: false,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, options, (err) => {
    if (err) console.error(err);
  });
});

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("user statics test", () => {
  test("creates user in db properly", async () => {
    const fakeUser = {
      firstName: "someFirstName",
      lastName: "someLastName",
      email: "email@example.com",
      plainTextPassword: "password$123",
    };
    const insertedUser = await UserModel.createUser(fakeUser);
    expect(insertedUser.firstName).toBe("someFirstName");
    expect(insertedUser.email).toBe("email@example.com");
  });
  test("finds a user by e-mail", async () => {
    const fakeUser = {
      firstName: "someFirstName",
      lastName: "someLastName",
      email: "specialuser@example.com",
      plainTextPassword: "password$123",
    };
    const insertedUser = await UserModel.createUser(fakeUser);

    const foundUser = await UserModel.findOneByEmail({
      email: insertedUser.email,
    });
    expect(foundUser.email).toBe(insertedUser.email);
    expect(foundUser._id.toString()).toBe(insertedUser._id.toString());
    const checkPasswordResult = await checkPassword({
      hashedPassword: foundUser.hashedPassword,
      plainTextPassword: "password$123",
    });
    expect(checkPasswordResult).toBe(true);
  });
  test("throws an error for duplicate users", async () => {
    const fakeUser = {
      firstName: "someFirstName",
      lastName: "someLastName",
      email: "specialuser@example.com",
      plainTextPassword: "password$123",
    };
    const fakeUser2 = {
      firstName: "anotherFakeUser",
      lastName: "someOtherTypeOfLastName",
      email: "specialuser@example.com",
      plainTextPassword: "password$1237",
    };
    await UserModel.createUser(fakeUser);
    await expect(() => UserModel.createUser(fakeUser2)).rejects.toThrow();
  });
});
