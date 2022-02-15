import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { patchUserByIdMe } from "./controllers/user/user.patch.controller";
import {
  getAllRecipesByUser,
  getUserById,
  getUserByIdMe,
} from "./controllers/user/user.get.controller";
import {
  getParamIdValidator,
  patchUserValidator,
  validate,
} from "./validators";
import { validateAPIToken } from "../middleware/verify-api-token";
const router = express.Router();

router.get("/:id", getParamIdValidator(), validate, getUserByIdMe, getUserById);

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
  patchUserByIdMe
);

export default router;
