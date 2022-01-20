import { Schema, model, SchemaOptions } from "mongoose";
import mongoose from "mongoose";
import { IRecipeDocument, IRecipeModel } from "./recipe.types";
interface SchemaOptionsWithPojoToMixed extends SchemaOptions {
  typePojoToMixed: boolean;
}
//Recipe Schema
const RecipeSchema: Schema = new Schema(
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
    ingredients: {},
  },
  {
    timestamps: true,
    strict: false,
    typePojoToMixed: false,
  } as SchemaOptionsWithPojoToMixed
);

export default RecipeSchema;
export const RecipeModel = model<IRecipeDocument, IRecipeModel>(
  "recipe",
  RecipeSchema
);
