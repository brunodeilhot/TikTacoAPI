import { Schema, model } from "mongoose";

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxLength: [50, "Title cannot be longer than 50 characters"],
  },
  description: {
    type: String,
    maxLength: [250, "Description cannot be longer than 250 characters"],
    default: null,
  },
  picture: {
    type: String,
    match: [
      /([A-Z0-9\s_\\.\-\(\):])+(.jpe?g|.png|.gif)$/i,
      "File extension not allowed",
    ],
    unique: 'File name already in use',
    required: [true, "Picture is required"],
  },
  diet: [{ type: String, enum: ["gf", "df", "v", "vv", "k"] }],
  servings: {
    type: Number,
    required: [true, "Servings are required"],
  },
  time: {
    type: Number,
    required: [true, "Time is required"],
  },
  steps: {
    type: [String],
    required: [true, "Steps are required"],
  },
  ingredients: {
    type: [{ type: Object, name: String, quantity: String }],
    required: [true, "Ingredients are required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  edited_at: {
    type: Date,
    default: null,
  },
  meta: {
    likes: [String],
    views: [String],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Recipe = model("Recipe", RecipeSchema);

export default Recipe;
