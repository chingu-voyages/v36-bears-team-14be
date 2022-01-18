import { Model } from "mongoose";
import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
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
}
