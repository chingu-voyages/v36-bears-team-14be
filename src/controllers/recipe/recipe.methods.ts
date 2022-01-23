import {
  IRecipeDocument,
  TRecipeToggleLikeAction,
} from "../../models/recipe/recipe.types";

export async function toggleLike(
  this: IRecipeDocument,
  likedByUserId: string
): Promise<TRecipeToggleLikeAction> {
  if (this.likes[`${likedByUserId}`]) {
    delete this.likes[`${likedByUserId}`];
    this.markModified("likes");
    await this.save();
    return {
      actionTaken: "unlike",
      updatedRecipeDocument: this,
    };
  } else {
    this.likes[`${likedByUserId}`] = new Date();
    this.markModified("likes");
    await this.save();
    return {
      actionTaken: "like",
      updatedRecipeDocument: this,
    };
  }
}
