import { Response, NextFunction } from "express";
import { RecipeModel } from "../../../models/recipe/recipe.schema";
import { UserModel } from "../../../models/user/user.schema";
import { IRequest } from "../../definitions";

export const getUserById = async (req: IRequest, res: Response) => {
  const { id } = req.params;
  try {
    const secureUser = await UserModel.getUserByIdSecure({ id });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res.status(404).send({ error: `User with id ${id} not found` });
    }
  } catch (exception) {
    console.log("16", exception, id);
    return res.status(500).send({ error: exception.message });
  }
};

export const getUserByIdMe = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id && req.params.id !== "me") return next();
  try {
    const { id } = req.user;
    const secureUser = await UserModel.getUserByIdSecure({ id });
    if (secureUser) {
      return res.status(200).send(secureUser);
    } else {
      return res.status(404).send({ error: `Cannot find session user by id` });
    }
  } catch (exception) {
    return res.status(500).send({ error: exception.message });
  }
};

export const getAllRecipesByUser = async (req: IRequest, res: Response) => {
  const { id } = req.params;
  if (id === "me") {
    if (req.user && req.user.id) {
      try {
        const recipes = await RecipeModel.getAllRecipesForUserByUserId({
          userId: req.user.id,
        });
        return res.status(200).send(recipes);
      } catch (exception) {
        return res
          .status(500)
          .send({
            error: `Unable to fetch all recipes by authenticated user me`,
          });
      }
    } else {
      return res
        .status(401)
        .send({
          error: `fetching recipes for user me, but requesting user is not authenticated`,
        });
    }
  }
  try {
    const recipes = await RecipeModel.getAllRecipesForUserByUserId({
      userId: id,
    });
    return res.status(200).send(recipes);
  } catch (exception) {
    return res
      .status(500)
      .send({ error: `Unable to fetch all recipes by user with id ${id}` });
  }
};
