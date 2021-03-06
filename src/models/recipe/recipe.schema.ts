import { Schema, model, SchemaOptions } from "mongoose";
import {
  patchUpdate,
  toggleLike,
} from "../../controllers/recipe/recipe.methods";
import {
  createNewRecipe,
  deleteRecipeById,
  findAllRecipesLikedByUser,
  findRecipesByContextLimitSkip,
  getAllRecipesForUserByUserId,
  getRecipeById,
} from "../../controllers/recipe/recipe.statics";
import { IRecipe, IRecipeDocument, IRecipeModel } from "./recipe.types";
interface SchemaOptionsWithPojoToMixed extends SchemaOptions {
  typePojoToMixed: boolean;
}
//Recipe Schema
const RecipeSchema = new Schema<IRecipe>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: { type: Schema.Types.Mixed, required: true, default: {} },
    postedBy: {
      type: String,
      ref: "user",
    },
    images: {
      type: [{ url: String }],
    },
    ingredients: {
      type: [{ name: String, quantity: Number, unit: String }],
      required: true,
      default: [],
    },
    directions: {
      type: [
        {
          stepNumber: Number,
          description: String,
          imageUrl: { type: String, required: false },
        },
      ],
      required: true,
      default: [],
    },
    cookTimeMinutes: { type: Number, required: true, default: 0 },
    prepTimeMinutes: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

RecipeSchema.methods.toggleLike = toggleLike;
RecipeSchema.methods.patchUpdate = patchUpdate;

RecipeSchema.statics.createNewRecipe = createNewRecipe;
RecipeSchema.statics.findAllRecipesLikedByUser = findAllRecipesLikedByUser;
RecipeSchema.statics.findRecipesByContextLimitSkip =
  findRecipesByContextLimitSkip;
RecipeSchema.statics.getRecipeById = getRecipeById;
RecipeSchema.statics.deleteRecipeById = deleteRecipeById;
RecipeSchema.statics.getAllRecipesForUserByUserId =
  getAllRecipesForUserByUserId;

export default RecipeSchema;

export const RecipeModel = model<IRecipeDocument, IRecipeModel>(
  "recipe",
  RecipeSchema
);
