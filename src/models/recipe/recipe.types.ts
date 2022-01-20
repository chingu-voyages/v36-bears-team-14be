import { Document, Model } from "mongoose";
export interface IRecipe {
  name: string;
  description: string;
  likes: { [keyof: string]: Date };
  postedBy: string;
  images: Array<{ url: string }>;
  createdAt: Date;
  updatedAt: Date;
  ingredients: Array<TRecipeIngredient>;
  directions: Array<TRecipeStep>;
}

export type TRecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type TRecipeStep = {
  stepNumber: number;
  description: string;
  imageUrl?: string;
};

export interface IRecipeDocument extends IRecipe, Document {}
export interface IRecipeModel extends Model<IRecipeDocument> {}
