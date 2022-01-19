import { Request, Response, NextFunction } from "express";

export function endExistingSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.user && req.logOut();
  next();
}
