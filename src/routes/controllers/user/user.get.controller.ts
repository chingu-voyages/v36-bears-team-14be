import { Request, Response, NextFunction } from "express";

export const getUserById = async (req: Request, res: Response) => {};

export const getUserByIdMe = async (
  req: Request,
  res: Express.Response,
  next: NextFunction
) => {
  if (req.params.id !== "me") next();
  try {
  } catch (exception) {}
};
