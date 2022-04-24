import { Request, Response } from "express";
import { create } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const {
    title,
    description,
    picture,
    diet,
    servings,
    time,
    steps,
    ingredients,
    user,
  } = req.body;

  const newRecipe = await create(
    title,
    picture,
    servings,
    time,
    ingredients,
    steps,
    user,
    description,
    diet
  )
    .then((recipe) => {
      return { status: 201, data: recipe };
    })
    .catch((e) => {
      return { status: 400, data: [e.message, e] };
    });

  return res.status(newRecipe.status).json(newRecipe.data);
};
