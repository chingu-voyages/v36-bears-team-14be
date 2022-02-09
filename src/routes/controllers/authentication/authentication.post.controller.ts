import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { adaptUserToSecure } from "../../../controllers/user/user.statics";
import { UserModel } from "../../../models/user/user.schema";
import { IUserRegistrationDetails } from "../../../models/user/user.types";

enum AuthenticationStrategy {
  Local = "local",
}
export const passportLocalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
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
        .send({
          message: "Local authentication successful",
          user: adaptUserToSecure(user),
        });
    });
  })(req, res, next);
};

export const registerNewLocalUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, firstName, lastName, password } = req.body;

  const newUserDetails: IUserRegistrationDetails = {
    email,
    firstName,
    lastName,
    plainTextPassword: password,
  };

  try {
    const newUser = await UserModel.createUser(newUserDetails);
    if (newUser) {
      req.logIn(newUser, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            error: `Unable to register user due to server error ${err}`,
          });
        }
        const secureNewUser = adaptUserToSecure(newUser);
        return res.status(200).send(secureNewUser);
      });
    }
  } catch (exception) {
    next(res.status(400).send({ error: exception.message }));
  }
};

export const logOut = async (req: Request, res: Response) => {
  req.logOut();
  return res.status(200).send({ info: "Session ended successfully" });
};
