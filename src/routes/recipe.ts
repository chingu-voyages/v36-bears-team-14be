import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import {
  newRecipeBasicValidator,
  newRecipeDirectionsValidator,
  newRecipeIngredientsValidator,
  validate,
} from "./validators";
const router = express.Router();

router.post(
  "/",
  protectedRoute,
  newRecipeBasicValidator(),
  newRecipeIngredientsValidator(),
  newRecipeDirectionsValidator(),
  validate
);
export default router;
