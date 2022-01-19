import * as express from "express";
import { protectedRoute } from "../middleware/protected-route";
import { RecipeModel } from "../models/recipe/recipe.schema";
const router = express.Router();

router.post("/", protectedRoute, async (req: any, res: any) => {
  const { name, description } = req.body;
  try {
    const result = await RecipeModel.createNewRecipe({
      name,
      description,
      postedBy: req.user.id,
    });
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
export default router;
