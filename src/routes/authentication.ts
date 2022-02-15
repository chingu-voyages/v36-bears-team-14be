import * as express from "express";
const router = express.Router();
import passport from "passport";
import LocalPassportStrategy from "../authentication-strategies/local/local-authentication-strategy";
import { endExistingSession } from "../middleware/end-existing-session";
import { validateAPIToken } from "../middleware/verify-api-token";

import { determineIfSessionIsActive } from "./controllers/authentication/authentication.get.controller";
import {
  logOut,
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
  validateAPIToken,
  endExistingSession,
  loginAuthenticationValidator(),
  validate,
  passportLocalAuthenticate
);
router.post(
  "/local/register",
  validateAPIToken,
  registerNewUserValidator(),
  validate,
  registerNewLocalUser
);
router.post("/logout", logOut);

// Helper route we may need to check if a session is active (without getting 401)
router.get("/session", determineIfSessionIsActive);

export default router;
