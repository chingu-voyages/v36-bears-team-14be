require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import { IS_PRODUCTION } from "../check-environment-variables";
const API_TOKEN = IS_PRODUCTION
  ? process.env.PRODUCTION_API_TOKEN
  : process.env.DEV_API_TOKEN;

export function validateAPIToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // This is here in case we implement google authorization later
  if (req.path.match(/^\/auth|^\/success|^\/fail|^\/api\/auth\|/)) {
    next();
  } else {
    if (!API_TOKEN)
      throw new Error("API_TOKEN does not exist in environment variables");
    const authHeader = req.headers.authorization;
    const auth = authHeader && authHeader.split(" ")[1];
    if (auth && auth === API_TOKEN) {
      next();
    } else {
      return res.status(401).send({
        error: "Invalid API token",
      });
    }
  }
}
