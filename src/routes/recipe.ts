import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { patchToggleLike } from "./controllers/recipe/recipe.patch.controller";
import { postNewRecipe } from "./controllers/recipe/recipe.post.controller";
import {
  getParamIdValidator,
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
  validate,
  postNewRecipe
);

router.patch(
  "/:id/like",
  protectedRoute,
  getParamIdValidator(),
  validate,
  patchToggleLike
);
export default router;
