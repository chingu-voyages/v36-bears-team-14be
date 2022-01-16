import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { IRecipeDocument, IRecipeModel } from "./recipe.types";

//Recipe Schema
const RecipeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desription: {
      type: String,
      required: true,
    },
    likes: { type: Schema.Types.Mixed, required: true, default: {} }
    postedBy: {
      type: String,
      ref: "user",
    },
    images: {
      type: [{ url: String }],
    },
  },
{
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

export default RecipeSchema;
// export const RecipeModel = model<IRecipeDocument, IRecipeModel>('recipes', RecipeSchema, 'recipes')
