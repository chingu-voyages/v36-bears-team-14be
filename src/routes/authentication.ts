import * as express from "express";
const router = express.Router();
import passport from "passport";
import LocalPassportStrategy from "../authentication-strategies/local/local-authentication-strategy";
import { passportLocalAuthenticate } from "./controllers/authentication/authentication.post.controller";
import { loginAuthenticationValidator, validate } from "./validators";
passport.use("local", LocalPassportStrategy);

router.post(
  "/local",
  loginAuthenticationValidator(),
  validate,
  passportLocalAuthenticate
);
router.post("/local/register");

export default router;
