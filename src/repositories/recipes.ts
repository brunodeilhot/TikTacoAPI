import Recipe from "../models/Recipe";
import User from "../models/User";

interface Iingredients {
  name: string;
  quantity: string;
}

interface Imeta {
  likes: number;
  stars: number;
  views: number;
}

export const create = async (
  title: string,
  picture: string,
  servings: number,
  time: number,
  ingredients: Array<Iingredients>,
  steps: Array<string>,
  user: string,
  description?: string,
  diet?: Array<string>
) => {
  const userExists = await User.findById(user);

  if (userExists === null) throw new Error("User invalid");

  return Recipe.create({
    title,
    picture,
    servings,
    time,
    ingredients,
    steps,
    user,
    description,
    diet,
  });
};

export const update = async (
  id: string,
  title?: string,
  picture?: string,
  servings?: number,
  time?: number,
  ingredients?: Array<Iingredients>,
  steps?: Array<string>,
  description?: string,
  diet?: Array<string>
) => {
  const recipe: any = await Recipe.findById(id);

  recipe.title = title !== undefined ? title : recipe.title;
  recipe.picture = picture !== undefined ? picture : recipe.picture;
  recipe.servings = servings !== undefined ? servings : recipe.servings;
  recipe.time = time !== undefined ? time : recipe.time;
  recipe.ingredients =
    ingredients !== undefined ? ingredients : recipe.ingredients;
  recipe.steps = steps !== undefined ? steps : recipe.steps;
  recipe.description =
    description !== undefined ? description : recipe.description;
  recipe.diet = diet !== undefined ? diet : recipe.diet;
  recipe.edited_at = Date.now();

  await recipe.save();
  return recipe;
};

export const findByUser = async (userId: string, limit: number) => {
  const recipes = await Recipe.find({ user: userId })
    .select(["picture", "meta.views"])
    .limit(limit)
    .sort("-created_at");

  recipes.forEach((recipe) => (recipe.meta.views = recipe.meta.views.length));

  return recipes;
};

export const feedRecipes = async (limit: number, user?: string) => {

  const meta = await User.findById(user).select("meta.following");

  const filter = user !== undefined ? { user: meta.meta.following } : {};

  const recipes = await Recipe.find(filter)
    .select(["_id", "title", "picture", "meta.likes"])
    .populate("user", "_id picture username")
    .limit(limit)
    .sort("-created_at");

  recipes.forEach((recipe) => {
    recipe.meta.likes = recipe.meta.likes.length;
  });

  return recipes;
};

export const findById = async (id: string, userId: string, access: string) => {
  const recipe: any = await Recipe.findById(id).populate(
    "user",
    "_id username"
  );

  if (recipe === null) throw new Error("Bad Request");

  if (recipe.meta.views.indexOf(userId) === -1) {
    recipe.meta.views.push(userId);
    recipe.save();
  }

  const {
    _id,
    title,
    description,
    picture,
    diet,
    servings,
    time,
    ingredients,
    steps,
    deleted,
    created_at,
    user,
    meta,
  } = recipe;

  return {
    _id,
    title,
    description,
    picture,
    diet,
    servings,
    time,
    ingredients,
    steps,
    deleted,
    created_at,
    user,
    meta: {
      totalLikes: access !== "private" ? meta.likes.length : meta.likes,
      totalViews: meta.views.length,
    },
  };
};

/*
  Meta data manipulation
*/

export const addLike = async (id: string, userId: string) => {
  const recipe: any = await Recipe.findById(id);
  const user: any = await User.findById(userId);

  if (user === null || recipe === null) {
    throw new Error("Bad Request");
  }

  if (user.meta.rec_liked.indexOf(id) !== -1) {
    throw new Error("Recipe already liked");
  }

  user.meta.rec_liked.push(id);
  await user.save();

  recipe.meta.likes.push(userId);
  await recipe.save();
};

export const removeLike = async (id: string, userId: string) => {
  const recipe: any = await Recipe.findById(id);
  const user: any = await User.findById(userId);

  if (user === null || recipe === null) {
    throw new Error("Bad Request");
  }

  if (user.meta.rec_liked.indexOf(id) === -1) {
    throw new Error("Recipe not liked");
  }

  const i = user.meta.rec_liked.indexOf(id);
  user.meta.rec_liked.splice(i, 1);
  await user.save();

  const k = recipe.meta.likes.indexOf(userId);
  recipe.meta.likes.splice(k, 1);
  await recipe.save();
};

const methods = {
  create,
  update,
  findByUser,
  feedRecipes,
  addLike,
  removeLike,
};

export default methods;
