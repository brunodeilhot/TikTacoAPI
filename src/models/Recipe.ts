import { Schema, model } from "mongoose";
import { IUser, IUserMeta } from "./User";

const RecipeSchema: Schema = new Schema({
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
    unique: "File name already in use",
    required: [true, "Picture is required"],
  },
  diet: [{ type: String, enum: ["GF", "DF", "V", "VE", "K"] }],
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
    likes: [
      {
        type: Object,
        user: String,
        date: Date,
      },
    ],
    views: [
      {
        type: Object,
        user: String,
        date: Date,
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
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

const Recipe = model<IRecipe>("Recipe", RecipeSchema);

export interface IRecipe {
  id: string;
  title: string;
  description?: string;
  picture: string | undefined;
  diet: string[];
  servings: number;
  time: number;
  steps: string[];
  ingredients: IIngredients[];
  created_at: Date;
  edited_at: Date | null;
  meta: {
    likes: IUserMeta[];
    views: IUserMeta[];
    totalLikes: number;
    totalViews: number;
  };
  deleted: boolean;
  user: IUser;
}

export interface IIngredients {
  name: string;
  quantity: string;
}

export interface IRecipeMeta {
  recipe: string;
  date: Date;
}

export default Recipe;
