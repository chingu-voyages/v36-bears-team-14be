import { Schema, model } from "mongoose";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser>({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {type: String, required: true},
    hashedPassword: {type: String, required: true},
    bio: {type: String, required: true},
    recipes: { type: Schema.Types.Mixed, required: true, default: {} }
},{ timestamps: { createdAt: 'created_at', updatedAt: 'created_at',  } },
);


export default userSchema;
export const UserModel = model<IUser>('user', userSchema);