import { Schema, model, SchemaOptions } from "mongoose";
import {
  createUser,
  findOneByEmail,
  getAllUsersSecure,
  getUserByIdSecure,
  patchUserProfileDetailsById,
  patchUserSecureDetailsById,
} from "../../controllers/user/user.statics";
import { IUser, IUserDocument, IUserModel } from "./user.types";

interface SchemaOptionsWithPojoToMixed extends SchemaOptions {
  typePojoToMixed: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    recipes: { type: Schema.Types.Mixed, required: false, default: {} },
    favoriteFoods: { type: [String], required: false, default: [] },
    photoUrl: { type: String, required: false },
  },
  {
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

userSchema.statics.findOneByEmail = findOneByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.getUserByIdSecure = getUserByIdSecure;
userSchema.statics.getAllUsersSecure = getAllUsersSecure;
userSchema.statics.patchUserProfileDetailsById = patchUserProfileDetailsById;
userSchema.statics.patchUserSecureDetailsById = patchUserSecureDetailsById;
export default userSchema;
export const UserModel = model<IUserDocument, IUserModel>("user", userSchema);
