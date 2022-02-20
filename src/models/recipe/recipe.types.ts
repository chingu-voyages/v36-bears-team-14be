import { Document, Model } from "mongoose";
import { IUserDocument } from "../user/user.types";
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
  cookTimeMinutes: number;
  prepTimeMinutes: number;
}

export type TRecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type TRecipeStep = {
  description: string;
  imageUrl?: string;
};

export type TRecipeCreationData = Pick<
  IRecipe,
  | "name"
  | "description"
  | "postedBy"
  | "ingredients"
  | "directions"
  | "cookTimeMinutes"
  | "prepTimeMinutes"
> & {
  imageUrl?: string;
};

export type TRecipePatchPayloadData = Pick<
  TRecipeCreationData,
  | "name"
  | "description"
  | "ingredients"
  | "directions"
  | "cookTimeMinutes"
  | "prepTimeMinutes"
  | "imageUrl"
>;

export type TRecipeToggleLikeAction = {
  actionTaken: "like" | "unlike";
  updatedRecipeDocument: IRecipeDocument;
};

export enum RecipeQueryContext {
  PopularRecipes = "popularRecipes",
  QuickRecipes = "quickRecipes",
  SimpleRecipes = "simpleRecipes",
  AllRecipes = "allRecipes",
  FromUser = "fromUser",
}

export type TDeleteRecipeByIdResult = {
  user: IUserDocument;
  recipes: IRecipeDocument[];
};
export interface IRecipeDocument extends IRecipe, Document {
  toggleLike: (likedByUserId: string) => Promise<TRecipeToggleLikeAction>;
  patchUpdate: ({
    requestorId,
    payload,
  }: {
    requestorId: string;
    payload: TRecipePatchPayloadData;
  }) => Promise<IRecipeDocument>;
}
export interface IRecipeModel extends Model<IRecipeDocument> {
  createNewRecipe: ({
    name,
    description,
    postedBy,
    ingredients,
    directions,
    cookTimeMinutes,
    prepTimeMinutes,
  }: TRecipeCreationData) => Promise<IRecipeDocument>;
  findAllRecipesLikedByUser: ({
    userId,
  }: {
    userId: string;
  }) => Promise<IRecipeDocument[]>;
  findRecipesByContextLimitSkip: ({
    context,
    skip,
    limit,
  }: {
    context: RecipeQueryContext;
    skip?: number;
    limit?: number;
  }) => Promise<IRecipeDocument[]>;

  getRecipeById: (id: string) => Promise<IRecipeDocument>;
  deleteRecipeById: ({
    userId,
    recipeIds,
  }: {
    userId: string;
    recipeIds: string[];
  }) => Promise<TDeleteRecipeByIdResult>;
  getAllRecipesForUserByUserId: ({
    userId,
  }: {
    userId: string;
  }) => Promise<IRecipeDocument[]>;
}
