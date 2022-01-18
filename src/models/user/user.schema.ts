import { Schema, model, SchemaOptions } from "mongoose";
import { findOneByEmail } from "../../controllers/user/user.statics";
import { IUser, IUserDocument, IUserModel } from "./user.types";

interface SchemaOptionsWithPojoToMixed extends SchemaOptions {
  typePojoToMixed: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    bio: { type: String, required: true, default: "" },
    recipes: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  {
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

userSchema.statics.findOneByEmail = findOneByEmail;
export default userSchema;
export const UserModel = model<IUserDocument, IUserModel>("user", userSchema);
