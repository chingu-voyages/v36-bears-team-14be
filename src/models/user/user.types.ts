import { Document, Model } from "mongoose";
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  bio: string;
  recipes: { [keyof: string]: Date };
  createdAt: Date;
  updatedAt: Date;
}

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
}
