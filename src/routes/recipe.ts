import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { postNewRecipe } from "./controllers/recipe/recipe.post.controller";
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
  validate,
  postNewRecipe
);
export default router;
