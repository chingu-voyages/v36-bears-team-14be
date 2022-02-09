import { Response, NextFunction } from "express";
import { UserModel } from "../../../models/user/user.schema";
import { IRequest } from "../../definitions";

export const getUserById = async (req: IRequest, res: Response) => {
  const { id } = req.params;
  try {
    const secureUser = await UserModel.getUserByIdSecure({ id });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res.status(404).send({ error: `User with id ${id} not found` });
    }
  } catch (exception) {
    console.log("16", exception);
    return res.status(500).send({ error: exception.message });
  }
};

export const getUserByIdMe = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id && req.params.id !== "me") return next();
  try {
    const { id } = req.user;
    const secureUser = await UserModel.getUserByIdSecure({ id });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res.status(404).send({ error: `Cannot find session user by id` });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
