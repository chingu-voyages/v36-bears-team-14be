import * as express from "express";
import { Response } from "express";
import { protectedRoute } from "../middleware/protected-route";
import {
  getRecipesLikeByUserId,
  performRecipeQuery,
  getRecipeById,
} from "./controllers/recipe/recipe.get.controller";
import { RecipeModel } from "../models/recipe/recipe.schema";
import { patchToggleLike } from "./controllers/recipe/recipe.patch.controller";
import { postNewRecipe } from "./controllers/recipe/recipe.post.controller";
import { IRequest } from "./definitions";
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

router.get("/", getRecipeQueryValidator(), validate, performRecipeQuery);

router.get("/:id", getParamIdValidator(), validate, getRecipeById);

router.delete(
  "/:id",
  protectedRoute,
  getParamIdValidator(),
  validate,
  (req: IRequest, res: Response) => {
    RecipeModel.deleteRecipeById({
      recipeId: req.params.id,
      userId: req.user.id,
    })
      .then((recipeData) => {
        res.status(200).send(recipeData);
      })
      .catch((err) => res.status(400).send({ error: err.message }));
  }
);

export default router;
