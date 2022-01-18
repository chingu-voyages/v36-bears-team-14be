import passport from "passport";

const LocalStrategy = require("passport-local").Strategy;
import { UserModel } from "../../models/user/user.schema";

passport.serializeUser((user: any, done: any) => {
  done(undefined, user.id);
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
  } catch (exception) {}
}

const LocalPassportStrategy = new LocalStrategy(
  {
    usernameField: "email",
  },
  authenticateUser
);

export default LocalPassportStrategy;
