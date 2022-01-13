import { Document, Model } from "mongoose";
export interface IRecipe {
  _id: string;
  name: string;
  description: string;
  likes: {
    userId: string;
    date: Date;
  };
  postedBy: string;
  images: Array<{ url: string }>;
}

export interface IRecipeDocument extends IRecipe, Document {}
export interface IRecipeModel extends Model<IRecipeModel> {}
