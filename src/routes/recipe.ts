import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import {
  getRecipesLikeByUserId,
  performRecipeQuery,
  getRecipeById,
} from "./controllers/recipe/recipe.get.controller";
import { patchToggleLike } from "./controllers/recipe/recipe.patch.controller";
import { postNewRecipe } from "./controllers/recipe/recipe.post.controller";
import {
  getRecipeQueryValidator,
  getParamIdValidator,
  newRecipeBasicValidator,
  newRecipeDirectionsValidator,
  newRecipeIngredientsValidator,
  toggleLikeParamIdValidator,
  validate,
  validateLikeQueryParams,
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
  toggleLikeParamIdValidator(),
  validate,
  patchToggleLike
);

router.get(
  "/like",
  protectedRoute,
  validateLikeQueryParams(),
  validate,
  getRecipesLikeByUserId
);

router.get(
  "/",
  protectedRoute,
  getRecipeQueryValidator(),
  validate,
  performRecipeQuery
);
router.get(
  "/:id",
  protectedRoute,
  getParamIdValidator(),
  validate,
  getRecipeById
);
export default router;
