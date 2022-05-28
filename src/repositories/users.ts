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

  user.name = name !== undefined ? name : user.name;
  user.birthday = birthday !== undefined ? birthday : user.birthday;
  user.picture = picture !== undefined ? picture : user.picture;
  user.bio = bio !== undefined ? bio : user.bio;

  if (username && username !== user.name) {
    user.name = username;
  }

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

  const followingIndex = user.meta.following.findIndex(
    (u: IUserMeta) => u.user === userId
  );
  const followerIndex = followUser.meta.followers.findIndex(
    (u: IUserMeta) => u.user === id
  );

  if (followingIndex !== -1 && followerIndex !== -1)
    throw new Error("User already followed");

  if (followingIndex === -1) {
    user.meta.following.push({ user: userId, date: new Date() });
    user.save();
  }

  if (followerIndex === -1) {
    followUser.meta.followers.push({ user: id, date: new Date() });
    followUser.save();
  }
};

export const removeFollower = async (
  id: string,
  userId: string
): Promise<void> => {
  const user: any = await User.findById(id);
  const followUser: any = await User.findById(userId);

  if (id === userId || user === null || followUser === null)
    throw new Error("Bad Request");

  const followingIndex = user.meta.following.findIndex(
    (u: IUserMeta) => u.user === userId
  );
  const followerIndex = followUser.meta.followers.findIndex(
    (u: IUserMeta) => u.user === id
  );

  if (followingIndex === -1 && followerIndex === -1)
    throw new Error("User not followed");

  if (followingIndex !== -1) {
    user.meta.following.splice(followingIndex, 1);
    user.save();
  }

  if (followerIndex !== -1) {
    followUser.meta.followers.splice(followerIndex, 1);
    followUser.save();
  }
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
