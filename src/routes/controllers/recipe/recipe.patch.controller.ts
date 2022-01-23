import { Response } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
import { IRequest } from "../../definitions";

export const patchToggleLike = async (req: IRequest, res: Response) => {
  const { id } = req.user;
  const recipeId = req.params.id;

  try {
    const targetRecipe = await RecipeModel.findById(recipeId);
    if (!targetRecipe) {
      return res
        .status(400)
        .send({ error: `recipe with id ${recipeId} does not exist` });
    }
    const response = await targetRecipe.toggleLike(id);
    return res.status(200).send(response);
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
