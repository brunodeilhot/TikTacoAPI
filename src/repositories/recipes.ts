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
  const recipe = await Recipe.findById(id).select("-meta");

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
): Promise<IRecipe[]> =>
  Recipe.find({ user: userId })
    .select(["picture", "meta.totalViews"])
    .limit(limit)
    .sort("-created_at");

export const feedRecipes = async (
  limit: number,
  userId: string
): Promise<IRecipe[]> => {
  const userMeta = await User.findById(userId).select("meta.following");

  const filter =
    userMeta !== null
      ? { user: userMeta.meta.following.map((follower) => follower.user) }
      : {};

  return Recipe.find(filter)
    .select(["_id", "title", "picture", "meta.totalLikes"])
    .populate("user", "_id picture username")
    .limit(limit)
    .sort("-created_at");
};

export const findById = async (
  id: string,
  userId: string
): Promise<IRecipe> => {
  const recipePublic = await Recipe.findById(id)
    .select(["-meta.views", "-meta.likes"])
    .populate("user", "_id username");

  if (recipePublic === null) throw new Error("Bad Request");

  addView(id, userId);

  if (recipePublic.user.id !== userId) {
    return recipePublic;
  }

  const recipePrivate = await Recipe.findById(id)
    .select("-meta.views")
    .populate("user", "_id username");

  if (recipePrivate === null) throw new Error("Bad Request");

  return recipePrivate;
};

const addView = async (id: string, userId: string) => {
  const recipe = await Recipe.findById(id).select("meta");

  if (recipe === null) throw new Error("Bad Request");

  if (recipe.meta.views.findIndex((u: IUserMeta) => u.user === userId) === -1) {
    recipe.meta.views.push({ user: userId, date: new Date() });
    recipe.meta.totalViews = recipe.meta.totalViews + 1;
    recipe.save();
  }
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

  const recipeIndex = user.meta.rec_liked.findIndex(
    (r: IRecipeMeta) => r.recipe === id
  );
  const userIndex = recipe.meta.likes.findIndex(
    (u: IUserMeta) => u.user === userId
  );

  if (recipeIndex !== -1 && userIndex !== -1) {
    throw new Error("Recipe already liked");
  }

  if (recipeIndex === -1) {
    user.meta.rec_liked.push({ recipe: id, date: new Date() });
    await user.save();
  }

  if (userIndex === -1) {
    recipe.meta.likes.push({ user: userId, date: new Date() });
    recipe.meta.totalLikes = recipe.meta.likes.length;
    await recipe.save();
  }
};

export const removeLike = async (id: string, userId: string): Promise<void> => {
  const recipe: any = await Recipe.findById(id);
  const user: any = await User.findById(userId);

  if (user === null || recipe === null) {
    throw new Error("Bad Request");
  }

  const recipeIndex = user.meta.rec_liked.findIndex(
    (r: IRecipeMeta) => r.recipe === id
  );
  const userIndex = recipe.meta.likes.findIndex(
    (u: IUserMeta) => u.user === userId
  );

  if (recipeIndex === -1 && userIndex === -1) {
    throw new Error("Recipe not liked");
  }

  if (recipeIndex !== -1) {
    user.meta.rec_liked.splice(recipeIndex, 1);
    await user.save();
  }

  if (userIndex !== -1) {
    recipe.meta.likes.splice(userIndex, 1);
    recipe.meta.totalLikes = recipe.meta.likes.length;
    await recipe.save();
  }
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
