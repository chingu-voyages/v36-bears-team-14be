import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import {
  patchUserProfileDetailsByIdMe,
  patchUserProfileSecureDetails,
} from "./controllers/user/user.patch.controller";
import {
  getAllRecipesByUser,
  getUserById,
  getUserByIdMe,
} from "./controllers/user/user.get.controller";
import {
  getParamIdValidator,
  patchUserValidator,
  secureUserPatchValidator,
  validate,
} from "./validators";
import { validateAPIToken } from "../middleware/verify-api-token";
const router = express.Router();

router.get(
  "/:id",
  validateAPIToken,
  getParamIdValidator(),
  validate,
  getUserByIdMe,
  getUserById
);

router.get(
  "/:id/recipes",
  validateAPIToken,
  getParamIdValidator(),
  validate,
  getAllRecipesByUser
);

router.patch(
  "/:id",
  validateAPIToken,
  protectedRoute,
  getParamIdValidator(),
  patchUserValidator(),
  validate,
  patchUserProfileDetailsByIdMe
);

router.patch(
  "/:id/secure",
  validateAPIToken,
  protectedRoute,
  getParamIdValidator(),
  secureUserPatchValidator(),
  validate,
  patchUserProfileSecureDetails
);

export default router;
