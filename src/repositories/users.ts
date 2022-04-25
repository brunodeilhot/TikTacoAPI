import Recipe from "../models/Recipe";
import User from "../models/User";

interface Iuser {
  _id: string;
  name: string;
  email: string;
  username: string;
  birthday?: Date;
  picture?: string;
  bio?: string;
  created_at?: Date;
  meta?: Imeta;
}

interface Imeta {
  rec_liked: Array<string>;
  likes: number;
  rec_starred: Array<string>;
  stars: number;
  followers: Array<string>;
  following: Array<string>;
}

export const create = async (
  name: string,
  email: string,
  username: string,
  birthday?: Date,
  picture?: string,
  bio?: string
) => {
  return User.create({
    name,
    email,
    username,
    birthday,
    picture,
    bio,
  });
};

export const updateProfile = async (
  id: string,
  username?: string,
  name?: string,
  birthday?: Date,
  picture?: string,
  bio?: string
) => {
  const user: any = await User.findById(id);
  user.username = username !== undefined ? username : user.username;
  user.name = name !== undefined ? name : user.name;
  user.birthday = birthday !== undefined ? birthday : user.birthday;
  user.picture = picture !== undefined ? picture : user.picture;
  user.bio = bio !== undefined ? bio : user.bio;

  await user.save();
  return user;
};

export const findByEmail = async (email: string) => User.findOne({ email });

export const findById = async (id: string) => {
  const user: any = await User.findById(id);

  const { name, username, picture, bio, meta } = user;

  const { followers, following } = meta;

  return { name, username, picture, bio, followers, following };
};

export const addFollower = async (id: string, userId: string) => {
  const user: any = await User.findById(id);
  const followUser: any = await User.findById(userId);

  if (user === null || followUser === null) throw new Error("Bad Request");

  if (
    user.meta.following.indexOf(userId) !== -1 ||
    followUser.meta.followers.indexOf(id) !== -1
  )
    throw new Error("User already followed");

  user.meta.following.push(userId);
  user.save();

  followUser.meta.followers.push(id);
  followUser.save();
};

export const removeFollower = async (id: string, userId: string) => {
  const user: any = await User.findById(id);
  const followUser: any = await User.findById(userId);

  if (user === null || followUser === null) throw new Error("Bad Request");

  if (
    user.meta.following.indexOf(userId) === -1 ||
    followUser.meta.followers.indexOf(id) === -1
  )
    throw new Error("User not followed");

  const i = user.meta.following.indexOf(userId);
  user.meta.following.splice(i, 1);
  user.save();

  const k = followUser.meta.followers.indexOf(id);
  followUser.meta.followers.splice(k, 1);
  followUser.save();
};

/*
  Meta Data manipulation
*/
export const totalLikes = async (id: string) => {
  const recipes = await Recipe.find({ user: id }).select(["_id", "meta.likes"]);

  if (recipes === null) throw new Error("Bad Request");

  if (recipes.length === 1) return recipes[0].meta.likes.length;

  return recipes.reduce((acc, recipe) => acc + recipe.meta.likes.length, 0);
};

export const addStar = async (id: string, recipeId: string) => {
  const user: any = await User.findById(id);

  if (user === null) throw new Error("Bad Request");

  if (user.meta.rec_starred.indexOf(recipeId) !== -1)
    throw new Error("Recipe already starred");

  user.meta.rec_starred.push(recipeId);
  await user.save();
};

export const removeStar = async (id: string, recipeId: string) => {
  const user: any = await User.findById(id);

  if (user === null) throw new Error("Bad Request");

  if (user.meta.rec_starred.indexOf(recipeId) === -1)
    throw new Error("Recipe not starred");

  const i = user.meta.rec_starred.indexOf(recipeId);
  user.meta.rec_starred.splice(i, 1);
  await user.save();
};

const methods = { create, updateProfile, findByEmail, addStar, removeStar };

export default methods;
