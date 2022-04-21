import Recipe from "../models/Recipe";
import User from "../models/User";

interface Iingredients {
  name: string;
  quantity: string;
}

interface Imeta {
  likes: number;
  favorites: number;
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
  diet?: Array<string>,
  created_at?: Date,
  edited_at?: Date,
  meta?: Imeta
) => {
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
    created_at,
    edited_at,
    meta,
  });
};

export const update = async (
  id: string,
  title: string,
  picture: string,
  servings: number,
  time: number,
  ingredients: Array<Iingredients>,
  steps: Array<string>,
  description?: string,
  diet?: Array<string>
  ) => {
  const recipe: any = await Recipe.findById(id);

  recipe.title = title;
  recipe.picture = picture;
  recipe.servings = servings;
  recipe.time = time;
  recipe.ingredients = ingredients;
  recipe.steps = steps;
  recipe.description = description !== undefined ? description : recipe.description;
  recipe.diet = diet !== undefined ? diet : recipe.diet;

  await recipe.save();
  return recipe;
}

export const addLike = async (id: string, userId: string) => {
  const user: any = await User.findById(userId);
  const recipe: any = await Recipe.findById(id);

  if (user.meta.rec_liked.indexOf(id) !== -1) {
    throw new Error('Recipe already liked')
  }
    user.meta.rec_liked.push(id);
    await user.save();

    recipe.meta.likes = recipe.meta.likes + 1;
    await recipe.save();
};

export const removeLike = async (id: string, userId: string) => {
  const user: any = await User.findById(userId);
  const recipe: any = await Recipe.findById(id);

  if (user.meta.rec_liked.indexOf(id) === -1) {
    throw new Error('Recipe not liked')
  }

  const i = user.meta.rec_liked.indexOf(id)
  user.meta.rec_liked.splice(i, 1);
  await user.save();

  recipe.meta.likes = recipe.meta.likes - 1;
  await recipe.save();
}

export const findByUser = async (userId: string, limit: number) =>
  Recipe.find({ user: userId }).limit(limit);

export const feedRecipes = async (limit: number) =>
  Recipe.find().limit(limit).sort("-created_at");

export const getTotalLikes = async (userId: string) => {
  const recipes: any = Recipe.find({ user: userId }).select("meta.likes");

  return recipes.reduce((accumulator: number, value: number) => {
    return accumulator + value;
  }, 0);
};

const methods = { create, findByUser, feedRecipes, getTotalLikes };

export default methods;
