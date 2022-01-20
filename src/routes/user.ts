import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import {
  getUserById,
  getUserByIdMe,
} from "./controllers/user/user.get.controller";
import { getParamIdValidator, validate } from "./validators";
const router = express.Router();

router.get(
  "/:id",
  protectedRoute,
  getParamIdValidator(),
  validate,
  getUserByIdMe,
  getUserById
);
export default router;
