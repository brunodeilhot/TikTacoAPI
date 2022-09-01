import Recipe, { IIngredients, IRecipe, IRecipeMeta } from "../models/Recipe";
import User, { IUserMeta } from "../models/User";

/**
 * Function called when creating a new recipe.
 * @return The promise of a recipe object.
 */
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

/**
 * Function called when updating a recipe object.
 * The only required parameter is the recipe id.
 * @return The promise of a recipe object.
 */
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

  recipe.title = title ?? recipe.title;
  recipe.picture = picture ?? recipe.picture;
  recipe.servings = servings ?? recipe.servings;
  recipe.time = time ?? recipe.time;
  recipe.ingredients = ingredients ?? recipe.ingredients;
  recipe.steps = steps ?? recipe.steps;
  recipe.description = description ?? recipe.description;
  recipe.diet = diet ?? recipe.diet;
  recipe.edited_at = new Date();

  await recipe.save();
  return recipe;
};

/**
 * Function called when you need to find all recipes of a user id for a feed which
 * only required limited data on said recipes.
 * @param userId
 * @param limit The number of recipes to return.
 * @returns The promise of an array of recipe objects which contains
 * only id, picture and the number of total views. Array is return in descending
 * order of creation date.
 */
export const findByUser = async (
  userId: string,
  limit: number
): Promise<IRecipe[]> =>
  Recipe.find({ user: userId })
    .select(["picture", "meta.totalViews"])
    .limit(limit)
    .sort("-created_at");

/**
 * Function called when an array of recipes of a user is needed but filtered
 * by type of meta data.
 * @param userId
 * @param meta Meta data to be filtered (likes or stars)
 * @param limit The number of recipes to return.
 * @returns The promise of an array of recipe objects which contains limited data
 * of recipe id, picture and total views filtered by type of meta data. Sorted
 * in descending order of creation date.
 */
export const findByUserMeta = async (
  userId: string,
  meta: string,
  limit: number
): Promise<IRecipe[]> => {
  const userMeta = await User.findById(userId).select([
    "meta.rec_liked",
    "meta.rec_starred",
  ]);

  if (userMeta === null) throw new Error("Bad Request");

  const { rec_liked, rec_starred } = userMeta.meta;

  const filter =
    meta === "likes"
      ? rec_liked.map((recipe) => recipe.recipe)
      : rec_starred.map((recipe) => recipe.recipe);

  return Recipe.find({ _id: filter })
    .select(["picture", "meta.totalViews"])
    .limit(limit)
    .sort("-created_at");
};

/**
 * Function called when you need an array of recipes with user information attached.
 * @param limit Number of recipes to return.
 * @param userId
 * @returns Promise of an array of recipe objects which contains id, title, picture, total likes
 * and user id, picture and username. Sorted in descending order of creation date.
 */
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

/**
 * Function called when all recipe information is needed. Full meta information is only
 * returned if a user id is provided and it matches the user id to which the recipe belongs.
 * Everytime this function is called, it also calls an addView function, which adds a view
 * to the meta data only if the user's ip isn't already in the view meta data array.
 * @param id Recipe id.
 * @param ip User ip address.
 * @param userId (optional) User id.
 * @returns The promise of a recipe object.
 */
export const findById = async (
  id: string,
  ip: string | string[] | undefined,
  userId?: string
): Promise<IRecipe> => {
  const recipePublic = await Recipe.findById(id)
    .select(["-meta.views", "-meta.likes"])
    .populate("user", "_id username");

  if (recipePublic === null) throw new Error("Bad Request");

  addView(id, ip);

  if (recipePublic.user.id !== userId) {
    return recipePublic;
  }

  const recipePrivate = await Recipe.findById(id)
    .select("-meta.views")
    .populate("user", "_id username");

  if (recipePrivate === null) throw new Error("Bad Request");

  return recipePrivate;
};

const addView = async (id: string, ip: string | string[] | undefined) => {
  const recipe = await Recipe.findById(id).select("meta");

  if (recipe === null) throw new Error("Bad Request");

  recipe.meta.views.push({ user: ip?.toString() ?? "", date: new Date() });
  recipe.meta.totalViews = recipe.meta.views.length + 1;
  recipe.save();
};

/**
 * Function called to add a like to a recipe.
 * @param id
 * @param userId
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

/**
 * Function called when removing a like from a recipe.
 * @param id
 * @param userId
 */
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
