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

export const patchUpdateRecipeById = async (req: IRequest, res: Response) => {
  const { id } = req.params;

  const payload = {
    name: req.body.name,
    description: req.body.description,
    cookTimeMinutes: req.body.cookTimeMinutes,
    prepTimeMinutes: req.body.prepTimeMinutes,
    imageUrl: req.body.imageUrl,
    directions: req.body.directions,
    ingredients: req.body.ingredients,
  };

  try {
    const recipe = await RecipeModel.findById(id);
    if (!recipe)
      return res
        .status(404)
        .send({
          error: `Unable to patch recipe: recipe not found with id ${id}`,
        });

    const result = await recipe.patchUpdate({
      requestorId: req.user.id,
      payload,
    });
    return res.status(200).send(result);
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
