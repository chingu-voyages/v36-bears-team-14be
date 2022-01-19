require("dotenv").config();
import { Request, Response, NextFunction } from "express";

export function validateAPIToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // This is here in case we implement google authorization later
  if (req.path.match(/^\/auth|^\/success|^\/fail|^\/api\/auth\|/)) {
    next();
  } else {
    if (!process.env.DEV_API_TOKEN)
      throw new Error("DEV_API_TOKEN does not exist in environment variables");
    const authHeader = req.headers.authorization;
    const auth = authHeader && authHeader.split(" ")[1];
    if (auth && auth === process.env.DEV_API_TOKEN) {
      next();
    } else {
      return res.status(401).send({
        error: "Invalid API token",
      });
    }
  }
}
