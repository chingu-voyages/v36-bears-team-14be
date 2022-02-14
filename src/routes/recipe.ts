import express, { Response } from "express";
import { protectedRoute } from "../middleware/protected-route";
import { RecipeModel } from "../models/recipe/recipe.schema";
import {
  getRecipesLikeByUserId,
  performRecipeQuery,
  getRecipeById,
} from "./controllers/recipe/recipe.get.controller";
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
  deleteRecipeByIdsValidator,
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
  "/",
  protectedRoute,
  deleteRecipeByIdsValidator(),
  validate,
  (req: IRequest, res: Response) => {
    const { recipeIds } = req.body;
    RecipeModel.deleteRecipeById({
      recipeIds,
      userId: req.user.id,
    })
      .then((recipeData) => {
        res.status(200).send(recipeData.recipes);
      })
      .catch((err) => res.status(400).send({ error: err.message }));
  }
);

export default router;
