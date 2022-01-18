import { UserModel } from "../../models/user/user.schema";
import {
  IUserDocument,
  IUserRegistrationDetails,
} from "../../models/user/user.types";
import { hashPassword } from "../../utils/crypto";

export async function findOneByEmail({
  email,
}: {
  email: string;
}): Promise<IUserDocument> {
  const user = await UserModel.find({ "email": email });
  if (user && user[0]) return user[0];
  throw new Error(`Cannot find user by email ${email}`);
}

export async function createUser({
  email,
  firstName,
  lastName,
  plainTextPassword,
}: IUserRegistrationDetails): Promise<IUserDocument> {
  const usersWithSameEmail = await UserModel.find({ "email": email });
  if (usersWithSameEmail && usersWithSameEmail.length > 0)
    throw new Error(`User with email id ${email} already exists`);
  const hashedPassword = await hashPassword({ password: plainTextPassword });
  return UserModel.create({
    email,
    firstName,
    lastName,
    hashedPassword,
  });
}
