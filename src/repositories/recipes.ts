import Recipe from "../models/Recipe";

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

export const findByUser = async (userId: string, limit: number) =>
  Recipe.find({ user: userId }).limit(limit);

export const feedRecipes = async (limit: number) =>
  Recipe.find().limit(limit).sort("+created_at");

export const getTotalLikes = async (userId: string) => {
  const recipes: any = Recipe.find({ user: userId }).select("meta.likes");

  return recipes.reduce((accumulator: number, value: number) => {
    return accumulator + value;
  }, 0);
};

const methods = { create, findByUser, feedRecipes, getTotalLikes };

export default methods;
