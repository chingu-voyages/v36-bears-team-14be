import { UserModel } from "../../models/user/user.schema";
import { IUser, IUserDocument } from "../../models/user/user.types";
import { hashPassword } from "../../utils/crypto";

export const createTestUsers = async ({
  count,
  plainTextPassword,
}: {
  count: number;
  plainTextPassword?: string;
}): Promise<IUserDocument[]> => {
  const dummyUsers: IUser[] = [];
  const hashedPassword = await hashPassword({
    password: plainTextPassword || "testPassword",
  });
  for (let i = 0; i < count; i++) {
    dummyUsers.push({
      firstName: `dummyUser${i}.FirstName`,
      lastName: `dummyUser${i}.LastName`,
      email: `dummyUser${i}.email@example.com`,
      hashedPassword: hashedPassword,
      bio: `dummyUser${i}.bio`,
      recipes: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      favoriteFoods: [],
    });
  }
  return UserModel.create(dummyUsers);
};
