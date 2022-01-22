import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { RecipeModel } from "../models/recipe/recipe.schema";
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
  async (req: any, res: any) => {
    const {
      name,
      description,
      ingredients,
      directions,
      cookTimeMinutes,
      prepTimeMinutes,
    } = req.body;
    try {
      const result = await RecipeModel.createNewRecipe({
        name,
        description,
        postedBy: req.user.id,
        ingredients,
        directions,
        cookTimeMinutes,
        prepTimeMinutes,
      });
      res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
);
export default router;
