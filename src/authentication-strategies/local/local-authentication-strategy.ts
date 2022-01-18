import passport from "passport";

const LocalStrategy = require("passport-local").Strategy;
import { UserModel } from "../../models/user/user.schema";
import { checkPassword } from "../../utils/crypto";

passport.serializeUser((user: any, done: any) => {
  done(undefined, user._id);
});

passport.deserializeUser((id: string, done: any) => {
  UserModel.findById(id)
    .then((user) => {
      done(undefined, user);
    })
    .catch((err) => {
      done(err, undefined);
    });
});

async function authenticateUser(email: string, password: string, done: any) {
  try {
    const user = await UserModel.findOneByEmail({ email });
    if (!user) return done(undefined, false);
    const isPasswordValid = await checkPassword({
      hashedPassword: user.hashedPassword,
      plainTextPassword: password,
    });
    return isPasswordValid
      ? done(undefined, user)
      : done({ error: "Invalid username or password" }, undefined);
  } catch (exception) {
    return done(exception, undefined);
  }
}

const LocalPassportStrategy = new LocalStrategy(
  {
    usernameField: "email",
  },
  authenticateUser
);

export default LocalPassportStrategy;
