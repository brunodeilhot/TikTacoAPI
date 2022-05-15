import Recipe, { IRecipeMeta } from "../models/Recipe";
import User, { IUser, IUserMeta } from "../models/User";

export const create = async (
  name: string,
  email: string,
  username: string,
  birthday?: Date,
  picture?: string,
  bio?: string
): Promise<IUser> => {
  return User.create({
    name,
    email,
    username,
    birthday,
    picture,
    bio,
  });
};

export const update = async (
  id: string,
  username?: string,
  name?: string,
  birthday?: Date,
  picture?: string,
  bio?: string
): Promise<IUser> => {
  const user = await User.findById(id);

  if (user === null) throw new Error("Bad Request");

  user.username = username !== undefined ? username : user.username;
  user.name = name !== undefined ? name : user.name;
  user.birthday = birthday !== undefined ? birthday : user.birthday;
  user.picture = picture !== undefined ? picture : user.picture;
  user.bio = bio !== undefined ? bio : user.bio;

  await user.save();
  return user;
};

export const findByEmail = async (email: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (user === null) throw new Error("Bad Request");

  return user;
};

export const findById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id).select([
    "-email",
    "-birthday",
    "-created_at",
    "-meta.rec_liked",
    "-meta.rec_starred",
  ]);

  if (user === null) throw new Error("Bad Request");

  return user;
};

export const addFollower = async (
  id: string,
  userId: string
): Promise<void> => {
  const user = await User.findById(id);
  const followUser = await User.findById(userId);

  if (id === userId || user === null || followUser === null)
    throw new Error("Bad Request");

  if (
    user.meta.following.findIndex((u: IUserMeta) => u.user === userId) !== -1 ||
    followUser.meta.followers.findIndex((u: IUserMeta) => u.user === id) !== -1
  )
    throw new Error("User already followed");

  user.meta.following.push({ user: userId, date: new Date() });
  user.save();

  followUser.meta.followers.push({ user: id, date: new Date() });
  followUser.save();
};

export const removeFollower = async (
  id: string,
  userId: string
): Promise<void> => {
  const user: any = await User.findById(id);
  const followUser: any = await User.findById(userId);

  if (id === userId || user === null || followUser === null)
    throw new Error("Bad Request");

  if (
    user.meta.following.findIndex((u: IUserMeta) => u.user === userId) === -1 ||
    followUser.meta.followers.findIndex((u: IUserMeta) => u.user === id) === -1
  )
    throw new Error("User not followed");

  const i = user.meta.following.findIndex((u: IUserMeta) => u.user === userId);
  user.meta.following.splice(i, 1);
  user.save();

  const k = followUser.meta.followers.findIndex(
    (u: IUserMeta) => u.user === id
  );
  followUser.meta.followers.splice(k, 1);
  followUser.save();
};

/*
  Meta Data manipulation
*/
export const totalLikes = async (id: string): Promise<number> => {
  const recipes = await Recipe.find({ user: id }).select([
    "_id",
    "meta.totalLikes",
  ]);

  if (recipes === null) throw new Error("Bad Request");

  if (recipes.length === 1) return recipes[0].meta.totalLikes;

  return recipes.reduce((acc, recipe) => acc + recipe.meta.totalLikes, 0);
};

export const addStar = async (id: string, recipeId: string): Promise<void> => {
  const user: any = await User.findById(id);

  if (user === null) throw new Error("Bad Request");

  if (
    user.meta.rec_starred.findIndex(
      (r: IRecipeMeta) => r.recipe === recipeId
    ) !== -1
  )
    throw new Error("Recipe already starred");

  user.meta.rec_starred.push({ recipe: recipeId, date: new Date() });
  await user.save();
};

export const removeStar = async (
  id: string,
  recipeId: string
): Promise<void> => {
  const user: any = await User.findById(id);

  if (user === null) throw new Error("Bad Request");

  if (
    user.meta.rec_starred.findIndex(
      (r: IRecipeMeta) => r.recipe === recipeId
    ) === -1
  )
    throw new Error("Recipe not starred");

  const i = user.meta.rec_starred.findIndex(
    (r: IRecipeMeta) => r.recipe === recipeId
  );
  user.meta.rec_starred.splice(i, 1);
  await user.save();
};

const methods = {
  create,
  update,
  findByEmail,
  findById,
  addStar,
  removeStar,
  totalLikes,
  addFollower,
  removeFollower,
};

export default methods;
