import { Response } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
import { IRequest } from "../../definitions";

export const postNewRecipe = async (req: IRequest, res: Response) => {
  const {
    name,
    description,
    ingredients,
    directions,
    cookTimeMinutes,
    prepTimeMinutes,
    imageUrl,
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
      imageUrl,
    });
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};
