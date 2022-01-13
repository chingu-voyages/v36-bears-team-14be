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
    likes: {
      key: String,
      ref: "user",
      value: Date,
    },
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
  }
);

export default RecipeSchema;
// export const RecipeModel = model<IRecipeDocument, IRecipeModel>('recipes', RecipeSchema, 'recipes')
