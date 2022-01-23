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
    return res.status(500).send({ error: exception.message });
  }
};

export const getUserByIdMe = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id !== "me") next();
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

export const getAllUsersSecureMiddleWare = async (
  req: IRequestUser,
  res: Response
) => {
  try {
    const secureUsers = await UserModel.getAllUsersSecure();
    return res.status(200).send(secureUsers);
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
