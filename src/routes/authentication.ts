import * as express from "express";
const router = express.Router();
import passport from "passport";
import LocalPassportStrategy from "../authentication-strategies/local/local-authentication-strategy";
import {
  passportLocalAuthenticate,
  registerNewLocalUser,
} from "./controllers/authentication/authentication.post.controller";
import {
  loginAuthenticationValidator,
  registerNewUserValidator,
  validate,
} from "./validators";
passport.use("local", LocalPassportStrategy);

router.post(
  "/local",
  loginAuthenticationValidator(),
  validate,
  passportLocalAuthenticate
);
router.post(
  "/local/register",
  registerNewUserValidator(),
  validate,
  registerNewLocalUser
);

export default router;
