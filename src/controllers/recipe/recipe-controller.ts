import { RecipeModel } from "../../models/recipe/recipe.schema";

export const createNewRecipe = async ({
  name,
  description,
  postedBy,
}: {
  name: string;
  description: string;
  postedBy: string;
}) => {
  const recipe = {
    name,
    description,
    postedBy,
  };
  const recipeDocument = await RecipeModel.create(recipe);
};
