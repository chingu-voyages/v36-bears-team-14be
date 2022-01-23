import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { patchUserByIdMe } from "./controllers/user/user.patch.controller";
import {
  getAllUsersSecureMiddleWare,
  getUserById,
  getUserByIdMe,
} from "./controllers/user/user.get.controller";
import {
  getParamIdValidator,
  patchUserValidator,
  validate,
} from "./validators";
const router = express.Router();

router.get("/", protectedRoute, getAllUsersSecureMiddleWare);
router.get(
  "/:id",
  protectedRoute,
  getParamIdValidator(),
  validate,
  getUserByIdMe,
  getUserById
);
router.patch(
  "/:id",
  protectedRoute,
  getParamIdValidator(),
  patchUserValidator(),
  validate,
  patchUserByIdMe
);
export default router;
