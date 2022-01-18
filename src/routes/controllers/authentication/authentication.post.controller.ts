import * as express from "express";
import { Request, Response } from "express";
import passport from "passport";

enum AuthenticationStrategy {
  Local = "local",
}
export const passportLocalAuthenticate = async (
  req: Request,
  res: Response,
  next: express.NextFunction
): Promise<void> => {
  passport.authenticate(AuthenticationStrategy.Local, (err, user, info) => {
    if (err) {
      return res.status(401).send({ error: err.message });
    }
    if (!user) {
      return res.status(401).send({ error: err.message });
    }
    req.logIn(user, () => {
      res
        .status(200)
        .send({ message: "Local authentication successful", id: user._id });
    });
  })(req, res, next);
};
