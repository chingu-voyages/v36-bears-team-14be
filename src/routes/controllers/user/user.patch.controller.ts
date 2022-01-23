import { Response } from "express";
import { UserModel } from "../../../models/user/user.schema";
import { IRequest } from "../../definitions";

export const patchUserByIdMe = async (req: IRequest, res: Response) => {
  if (req.params.id !== "me") {
    return res
      .status(400)
      .send({ error: "User does not have permission to update profile." });
  }
  try {
    const { id } = req.user;
    const { bio, photoUrl, favoriteFoods } = req.body;
    const secureUser = await UserModel.patchUserByIdSecure({
      id,
      bio,
      photoUrl,
      favoriteFoods,
    });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res.status(404).send({ error: "Cannot update user by id" });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
