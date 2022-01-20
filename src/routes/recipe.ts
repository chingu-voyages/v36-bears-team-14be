import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { RecipeModel } from "../models/recipe/recipe.schema";
import { newRecipeValidator, validate } from "./validators";
const router = express.Router();

router.post(
  "/",
  protectedRoute,
  newRecipeValidator,
  validate,
  async (req: any, res: any) => {
    const { name, description, ingredients, directions } = req.body;
    try {
      const result = await RecipeModel.createNewRecipe({
        name,
        description,
        postedBy: req.user.id,
        ingredients,
        directions,
      });
      res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
);
export default router;
