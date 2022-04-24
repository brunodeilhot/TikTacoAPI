import { Request, Response } from "express";
import { update } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const {
    title,
    picture,
    servings,
    time,
    ingredients,
    steps,
    description,
    diet,
  } = req.body;

  const id = req.params.id;

  const recipe = await update(
    id,
    title,
    picture,
    servings,
    time,
    ingredients,
    steps,
    description,
    diet
  ).then((response) => {
      return { status: 200, data: response };
  }).catch((e) => {
      return { status: 400, data: [e.message, e] };
  })

  return res.status(recipe.status).json(recipe.data);
};
