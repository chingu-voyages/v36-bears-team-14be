import { RecipeModel } from "../../models/recipe/recipe.schema";
import { IRecipeDocument } from "../../models/recipe/recipe.types";

export const getAllRecipes = async ({
  limit,
  skip,
}: {
  limit?: number;
  skip?: number;
}): Promise<IRecipeDocument[]> => {
  return RecipeModel.find()
    .sort({ updatedAt: 1, _id: 1 })
    .skip(skip ?? 0)
    .limit(limit ?? 0);
};

export const getPopularRecipes = async ({
  limit,
  skip,
}: {
  limit?: number;
  skip?: number;
}): Promise<IRecipeDocument[]> => {
  /**
   * We'll use the number of likes to determine what is most popular
   */
  const pipeLine: any[] = [
    { "$set": { "likesArray": { "$objectToArray": "$likes" } } },
    {
      "$set": {
        "likesArray": {
          "$cond": [{ "$eq": ["$likesArray", null] }, [], "$likesArray"],
        },
      },
    },
    { "$set": { "likesCount": { "$size": "$likesArray" } } },
    {
      "$sort": { "likesCount": -1 },
    },
    {
      "$unset": ["likesArray", "likesCount"],
    },
  ];
  if (limit && limit > 0) {
    return RecipeModel.aggregate(pipeLine)
      .skip(skip ?? 0)
      .limit(limit);
  }

  return RecipeModel.aggregate(pipeLine).skip(skip ?? 0);
};

export const getQuickRecipes = async ({
  limit,
  skip,
}: {
  limit?: number;
  skip?: number;
}): Promise<IRecipeDocument[]> => {
  // Quick recipes are sorted by prepTime + cookTime - lowest to highest
  const pipeLine: any[] = [
    {
      "$set": {
        "totalPrepCookTime": {
          "$sum": ["$cookTimeMinutes", "$prepTimeMinutes"],
        },
      },
    },
    {
      "$sort": {
        "totalPrepCookTime": 1,
      },
    },
    {
      "$unset": ["totalPrepCookTime"],
    },
  ];
  if (limit && limit > 0) {
    return RecipeModel.aggregate(pipeLine)
      .skip(skip ?? 0)
      .limit(limit);
  }

  return RecipeModel.aggregate(pipeLine).skip(skip ?? 0);
};

export const getSimpleRecipes = async ({
  limit,
  skip,
}: {
  limit?: number;
  skip?: number;
}): Promise<IRecipeDocument[]> => {
  /* Add the totalPrepCookTime, totalIngredients and totalSteps together to
  get a total effort number. Then sort it from lowest to highest

  */
  const pipeLine: any[] = [
    {
      "$set": {
        "totalPrepCookTime": {
          "$sum": ["$cookTimeMinutes", "$prepTimeMinutes"],
        },
      },
    },
    {
      "$set": {
        "totalIngredients": {
          "$size": "$ingredients",
        },
      },
    },
    {
      "$set": {
        "totalSteps": {
          "$size": "$directions",
        },
      },
    },
    {
      "$set": {
        "totalEffort": {
          "$sum": ["$totalPrepCookTime", "$totalIngredients", "$totalSteps"],
        },
      },
    },
    {
      "$sort": 1,
    },
    // {
    //   "$unset": ["to"]
    // }
  ];
  if (limit && limit > 0) {
    return RecipeModel.aggregate(pipeLine)
      .skip(skip ?? 0)
      .limit(limit);
  }

  return RecipeModel.aggregate(pipeLine).skip(skip ?? 0);
};
