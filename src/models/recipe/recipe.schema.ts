import { Schema, model } from "mongoose";

//Recipe Schema
const recipeSchema: Schema = new Schema({
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
});

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
