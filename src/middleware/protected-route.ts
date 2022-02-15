import { NextFunction, Request, Response } from "express";

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    next();
  } else {
    return res
      .status(401)
      .send({ error: "Unauthorized access to protected route" });
  }
};
