import { NextFunction, Response } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
import { IRequest } from "../../definitions";

export const postNewRecipe = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
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
};
