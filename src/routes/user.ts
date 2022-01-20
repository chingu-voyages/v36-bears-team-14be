import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { getUserById } from "./controllers/user/user.get.controller";
import { validate } from "./validators";
const router = express.Router();

router.get("/:id", protectedRoute, validate, getUserById);
export default router;
