import { Schema, model, SchemaOptions } from "mongoose";
import { IUser } from "./user.types";

interface SchemaOptionsWithPojoToMixed extends SchemaOptions {
  typePojoToMixed: boolean;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    bio: { type: String, required: true },
    recipes: { type: Schema.Types.Mixed, required: true, default: {} },
  },
  {
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

export default userSchema;
export const UserModel = model<IUser>("user", userSchema);
