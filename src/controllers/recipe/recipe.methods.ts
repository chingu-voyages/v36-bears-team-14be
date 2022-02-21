import {
  IRecipeDocument,
  TRecipePatchPayloadData,
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

export async function patchUpdate(
  this: IRecipeDocument,
  {
    requestorId,
    payload,
  }: { requestorId: string; payload: TRecipePatchPayloadData }
): Promise<IRecipeDocument> {
  if (this.postedBy !== requestorId)
    throw new Error(
      "Request is not authorized. Requestor is not associated with this recipe"
    );

  this.name = payload.name;
  this.description = payload.description;
  this.cookTimeMinutes = payload.cookTimeMinutes;
  this.prepTimeMinutes = payload.prepTimeMinutes;
  this.ingredients = payload.ingredients;
  this.directions = payload.directions;

  if (payload.imageUrl && payload.imageUrl !== null) {
    this.images.unshift({ url: payload.imageUrl });
  } else {
    console.warn(`Image data cleared for recipe ${this._id.toString()}`);
    this.images = [];
  }

  await this.save();
  return this;
}
