import { Document, Model } from "mongoose";
export interface IRecipe {
  _id: string;
  name: string;
  description: string;
  likes: { [keyof: string]: Date };
  postedBy: string;
  images: Array<{ url: string }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipeDocument extends Document<IRecipe> {}
export interface IRecipeModel extends Model<IRecipeModel> {}
