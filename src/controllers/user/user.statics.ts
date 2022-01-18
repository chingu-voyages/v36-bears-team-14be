import { UserModel } from "../../models/user/user.schema";
import { IUserDocument } from "../../models/user/user.types";

export async function findOneByEmail({
  email,
}: {
  email: string;
}): Promise<IUserDocument> {
  const user = await UserModel.find({ "email": email });
  if (user && user[0]) return user[0];
  throw new Error(`Cannot find user by email ${email}`);
}
