import { Schema, model } from "mongoose";
import { IRecipeMeta } from "./Recipe";

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxLength: [50, "Name cannot be longer than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email is invalid"],
    maxLength: [100, "Email cannot be longer than 100 characters"],
  },
  birthday: {
    type: Date,
    default: null,
  },
  username: {
    type: String,
    match: [/^[a-z0-9_.]+$/, "Username is invalid"],
    required: [true, "Username is required"],
    unique: true,
    maxLength: [25, "Username cannot be longer than 25 characters"],
  },
  picture: {
    type: String,
    match: [
      /([A-Z0-9\s_\\.\-\(\):])+(.jpe?g|.png|.gif|.svg)$/i,
      "File type is invalid",
    ],
    unique: true,
    default: "taco-placeholder.svg",
  },
  bio: {
    type: String,
    maxLength: [250, "Bio cannot be longer than 250 characters"],
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  privateProfile: {
    type: Boolean,
    default: false,
  },
  privateLikes: {
    type: Boolean,
    default: false,
  },
  meta: {
    rec_liked: [
      {
        type: Object,
        recipe: String,
        date: Date,
      },
    ],
    rec_starred: [
      {
        type: Object,
        recipe: String,
        date: Date,
      },
    ],
    followers: [
      {
        type: Object,
        user: String,
        date: Date,
      },
    ],
    following: [
      {
        type: Object,
        user: String,
        date: Date,
      },
    ],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const User = model<IUser>("User", UserSchema);

export interface IUser {
  id: string;
  name: string;
  email: string;
  birthday?: Date;
  username: string;
  picture?: string;
  bio?: string;
  created_at: Date;
  privateProfile: boolean;
  PrivateLikes: boolean;
  meta: {
    rec_liked: IRecipeMeta[];
    rec_starred: IRecipeMeta[];
    followers: IUserMeta[];
    following: IUserMeta[];
  };
  deleted: boolean;
}

export interface IUserMeta {
  user: string;
  date: Date;
}

export default User;
