import { Document, Model } from "mongoose";
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  bio: string;
  recipes: { [keyof: string]: Date };
  favoriteFoods: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  photoUrl?: string;
}

export interface IUserRegistrationDetails {
  email: string;
  firstName: string;
  lastName: string;
  plainTextPassword: string;
}

export type TSecureUser = Pick<
  IUserDocument,
  | "_id"
  | "firstName"
  | "lastName"
  | "bio"
  | "recipes"
  | "createdAt"
  | "updatedAt"
  | "favoriteFoods"
  | "photoUrl"
>;

export type TUserPatchReturnData = {
  profileDataUpdated: string[];
  user: TSecureUser;
};
export interface IUserDocument extends IUser, Document {}
export interface IUserModel extends Model<IUserDocument> {
  findOneByEmail: ({ email }: { email: string }) => Promise<IUserDocument>;
  createUser: ({
    email,
    firstName,
    lastName,
    plainTextPassword,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    plainTextPassword: string;
  }) => Promise<IUserDocument>;
  getUserByIdSecure: ({ id }: { id: string }) => Promise<TSecureUser>;
  getAllUsersSecure: () => Promise<TSecureUser[]>;
  patchUserByIdSecure: ({
    id,
    bio,
    favoriteFoods,
    photoUrl,
  }: {
    id: string;
    bio?: string;
    favoriteFoods?: Array<string>;
    photoUrl?: string;
  }) => Promise<TUserPatchReturnData>;
}
