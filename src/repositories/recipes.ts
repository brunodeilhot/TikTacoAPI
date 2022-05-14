import Recipe, { IIngredients, IRecipe, IRecipeMeta } from "../models/Recipe";
import User, { IUserMeta } from "../models/User";

export const create = async (
  title: string,
  picture: string,
  servings: number,
  time: number,
  ingredients: IIngredients[],
  steps: string[],
  user: string,
  description?: string,
  diet?: string[]
): Promise<IRecipe> => {
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
  ingredients?: IIngredients[],
  steps?: string[],
  description?: string,
  diet?: string[]
): Promise<IRecipe> => {
  const recipe = await Recipe.findById(id);

  if (recipe === null) throw new Error("Bad Request");

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
  recipe.edited_at = new Date();

  await recipe.save();
  return recipe;
};

export const findByUser = async (
  userId: string,
  limit: number
): Promise<IRecipe[]> => {
  const recipes = await Recipe.find({ user: userId })
    .select(["picture", "meta.views"])
    .limit(limit)
    .sort("-created_at");

  recipes.forEach((recipe) => {
    recipe.meta.totalViews = recipe.meta.views.length;
    recipe.meta.views = [];
  });

  return recipes;
};

export const feedRecipes = async (
  limit: number,
  user?: string
): Promise<IRecipe[]> => {
  const userMeta =
    user !== undefined
      ? await User.findById(user).select("meta.following")
      : null;
  const followers =
    userMeta !== null
      ? userMeta.meta.following.map((follower) => follower.user)
      : null;

  const filter = user !== undefined ? { user: followers } : {};

  const recipes = await Recipe.find(filter)
    .select(["_id", "title", "picture", "meta.likes"])
    .populate("user", "_id picture username")
    .limit(limit)
    .sort("-created_at");

  recipes.forEach((recipe) => {
    recipe.meta.totalLikes = recipe.meta.likes.length;
    recipe.meta.likes = [];
  });

  return recipes;
};

export const findById = async (id: string, userId: string): Promise<IRecipe> => {
  const recipe = await Recipe.findById(id).populate(
    "user",
    "_id username"
  );

  if (recipe === null) throw new Error("Bad Request");

  if (recipe.meta.views.findIndex((u: IUserMeta) => u.user === userId) === -1) {
    recipe.meta.views.push({ user: userId, date: new Date() });
    recipe.save();
  }

  const { user, meta } = recipe;

  return {
    ...recipe,
    meta: {
      totalLikes: meta.likes.length,
      totalViews: meta.views.length,
      likes: user.id === userId ? meta.likes : [],
      views: [],
    },
  };
};

/*
  Meta data manipulation
*/

export const addLike = async (id: string, userId: string): Promise<void> => {
  const recipe = await Recipe.findById(id);
  const user = await User.findById(userId);

  if (user === null || recipe === null) {
    throw new Error("Bad Request");
  }

  if (
    user.meta.rec_liked.findIndex((r: IRecipeMeta) => r.recipe === id) !== -1 ||
    recipe.meta.likes.findIndex((u: IUserMeta) => u.user === userId) !== -1
  ) {
    throw new Error("Recipe already liked");
  }

  user.meta.rec_liked.push({ recipe: id, date: new Date() });
  await user.save();

  recipe.meta.likes.push({ user: userId, date: new Date() });
  await recipe.save();
};

export const removeLike = async (id: string, userId: string): Promise<void> => {
  const recipe: any = await Recipe.findById(id);
  const user: any = await User.findById(userId);

  if (user === null || recipe === null) {
    throw new Error("Bad Request");
  }

  if (
    user.meta.rec_liked.findIndex((r: IRecipeMeta) => r.recipe === id) === -1 ||
    recipe.meta.likes.findIndex((u: IUserMeta) => u.user === userId) === -1
  ) {
    throw new Error("Recipe not liked");
  }

  const i = user.meta.rec_liked.findIndex((r: IRecipeMeta) => r.recipe === id);
  user.meta.rec_liked.splice(i, 1);
  await user.save();

  const k = recipe.meta.likes.findIndex((u: IUserMeta) => u.user === userId);
  recipe.meta.likes.splice(k, 1);
  await recipe.save();
};

const methods = {
  create,
  update,
  findByUser,
  feedRecipes,
  findById,
  addLike,
  removeLike,
};

export default methods;
