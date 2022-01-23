import { UserModel } from "../../models/user/user.schema";
import {
  IUserDocument,
  IUserRegistrationDetails,
  TSecureUser,
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

export async function getUserByIdSecure({
  id,
}: {
  id: string;
}): Promise<TSecureUser> {
  const user = await UserModel.findById(id);
  return adaptUserToSecure(user);
}

export async function getAllUsersSecure(): Promise<TSecureUser[]> {
  const users = await UserModel.find();
  return users.map((user) => {
    return adaptUserToSecure(user);
  });
}

export async function patchUserByIdSecure({
  id,
  bio,
  favoriteFoods,
  photoUrl,
}: {
  id: string;
  bio?: string;
  favoriteFoods?: Array<string>;
  photoUrl?: string;
}): Promise<TSecureUser> {
  const user = await UserModel.findById(id);
  if (bio) {
    user.bio = bio;
  }
  if (favoriteFoods) {
    user.favoriteFoods = favoriteFoods;
  }
  if (photoUrl) {
    user.photoUrl = photoUrl;
  }
  await user.save();
  return adaptUserToSecure(user);
}
/**
 *
 * @param user IUser
 * @returns TSecure user - user without sensitive info like password and e-mail address
 */
export function adaptUserToSecure(user: IUserDocument): TSecureUser {
  return {
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    recipes: user.recipes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    favoriteFoods: user.favoriteFoods,
    photoUrl: user.photoUrl,
  };
}
