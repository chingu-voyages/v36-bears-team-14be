import { Response } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
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
  return res.status(200);
};
