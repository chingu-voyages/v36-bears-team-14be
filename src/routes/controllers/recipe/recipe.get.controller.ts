import { NextFunction, Response } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
import { RecipeQueryContext } from "../../../models/recipe/recipe.types";
import { IRequest } from "../../definitions";
export const getRecipesLikeByUserId = async (req: IRequest, res: Response) => {
  const { userId } = req.query;
  try {
    if (userId === "me") {
      const likedRecipes = await RecipeModel.findAllRecipesLikedByUser({
        userId: req.user.id,
      });
      return res.status(200).send({ userId: req.user.id, likedRecipes });
    } else {
      const likedRecipes = await RecipeModel.findAllRecipesLikedByUser({
        userId: userId as string,
      });
      return res.status(200).send({ userId, likedRecipes });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};

export const performRecipeQuery = async (req: IRequest, res: Response) => {
  const { limit, skip, context } = req.query;

  const limitAsNumber = parseInt(limit as string);
  const skipAsNumber = parseInt(skip as string);
  const contextAsString = context as string as RecipeQueryContext;

  try {
    const results = await RecipeModel.findRecipesByContextLimitSkip({
      context: contextAsString,
      limit: limitAsNumber,
      skip: skipAsNumber,
    });
    return res.status(200).send(results);
  } catch (exception) {
    return res.status(500).send({ error: exception.message })
  }
}
export const getRecipeById = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const recipeById = await RecipeModel.getRecipeById(id);
    if (recipeById) {
      return res.status(200).send(recipeById);
    } else {
      return res.status(404).send({ error: `Cannot find recipe` });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};
