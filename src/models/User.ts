import { Schema, model } from "mongoose";

const UserSchema = new Schema({
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
  birthday: Date,
  username: {
    type: String,
    match: [/^[a-z0-9_.]+$/, "Username is invalid"],
    required: [true, "Username is required"],
    unique: true,
    maxLength: [25, "Username cannot be longer than 25 characters"],
  },
  picture: {
    type: String,
    match: [/([A-Z0-9\s_\\.\-\(\):])+(.jpe?g|.png|.gif)$/i, "File type is invalid"],
    unique: true,
  },
  bio: {
    type: String,
    maxLength: [250, "Bio cannot be longer than 250 characters"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  privateProfile: {
    type: Boolean,
    default: true
  },
  privateLikes: {
    type: Boolean,
    default: true
  },
  meta: {
    rec_liked: [String],
    lkes: Number,
    followers: [String],
    following: [String],
  },
});

const User = model("User", UserSchema);

export default User;
