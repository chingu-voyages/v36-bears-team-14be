import { Response } from "express";
import { UserModel } from "../../../models/user/user.schema";
import { IRequest } from "../../definitions";

export const patchUserProfileDetailsByIdMe = async (
  req: IRequest,
  res: Response
) => {
  if (req.params.id !== "me") {
    if (req.params.id !== req.user.id) {
      return res.status(400).send({
        error: "Requestor does not have permission to update profile.",
      });
    }
  }

  try {
    const { id } = req.user;
    const { bio, photoUrl, favoriteFoods } = req.body;
    const secureUser = await UserModel.patchUserProfileDetailsById({
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

export const patchUserProfileSecureDetails = async (
  req: IRequest,
  res: Response
) => {
  if (req.params.id !== "me") {
    if (req.params.id !== req.user.id) {
      return res.status(400).send({
        error: "Requestor does not have permission to update profile.",
      });
    }
  }

  const { updateType, payload } = req.body;
  try {
    const secureUser = await UserModel.patchUserSecureDetailsById({
      id: req.user.id,
      updateType,
      payload,
    });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res
        .status(404)
        .send({ error: "Cannot do secure update user by id" });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
