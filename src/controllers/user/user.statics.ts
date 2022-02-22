import { UserModel } from "../../models/user/user.schema";
import {
  IUserDocument,
  IUserRegistrationDetails,
  TSecureUser,
  TUserPatchReturnData,
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

export async function patchUserProfileDetailsById({
  id,
  bio,
  favoriteFoods,
  photoUrl,
}: {
  id: string;
  bio?: {
    action: "update" | "delete";
    data?: string;
  };
  favoriteFoods?: {
    action: "update" | "delete";
    data?: Array<string>;
  };
  photoUrl?: {
    action: "update" | "delete";
    data?: string;
  };
}): Promise<TUserPatchReturnData> {
  const profileDataUpdated: string[] = [];

  const user = await UserModel.findById(id);

  if (bio && bio.action) {
    if (bio.action === "update") {
      user.bio = bio.data;
      profileDataUpdated.push("bio updated with data");
    } else if (bio.action === "delete") {
      user.bio = "";
      profileDataUpdated.push("bio deleted");
    }
  }
  if (favoriteFoods && favoriteFoods.action) {
    if (favoriteFoods.action === "update") {
      user.favoriteFoods = favoriteFoods.data;
      profileDataUpdated.push("favorite foods updated with data");
    } else if (favoriteFoods.action === "delete") {
      user.favoriteFoods = [];
      profileDataUpdated.push("favorite foods deleted");
    }
  }
  if (photoUrl && photoUrl.action) {
    if (photoUrl.action === "update") {
      user.photoUrl = photoUrl.data;
      profileDataUpdated.push("photoUrl updated with data");
    } else if (favoriteFoods.action === "delete") {
      user.photoUrl = "";
      profileDataUpdated.push("photoUrl deleted");
    }
  }
  if (profileDataUpdated.length > 0) {
    await user.save();
  } else {
    throw new Error("No data was updated in this operation");
  }
  return { user: adaptUserToSecure(user), profileDataUpdated };
}

export async function patchUserSecureDetailsById({
  id,
  updateType,
  payload,
}: {
  id: string;
  updateType: "password" | "name";
  payload: { firstName: string; lastName: string } | { password: string };
}): Promise<{ updateType: "name" | "password"; user: TSecureUser }> {
  const user = await UserModel.findById(id);
  if (!user) throw new Error(`User not found with id ${id}`);

  if (updateType === "password") {
    const dataPayload = payload as { password: string };
    const hashedPassword = await hashPassword({
      password: dataPayload.password,
    });
    user.hashedPassword = hashedPassword;
    await user.save();
    return { updateType, user: adaptUserToSecure(user) };
  } else if (updateType === "name") {
    const dataPayload = payload as { firstName: string; lastName: string };
    user.firstName = dataPayload.firstName;
    user.lastName = dataPayload.lastName;
    await user.save();
    return { updateType, user: adaptUserToSecure(user) };
  }
  throw new Error("patchUserSecureDetailsById: Invalid request");
}
/**
 *
 * @param user IUser
 * @returns TSecure user - user without sensitive info like password and e-mail address
 */
export function adaptUserToSecure(user: IUserDocument): TSecureUser {
  if (!user)
    throw new Error("User isn't defined - unable to adapt secure user");
  return {
    _id: user._id,
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
