import { Request, Response } from "express";
import { findById } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const ip = req.headers["cf-connecting-ip"];
  const userId = req.params.userId;

  const recipe = await findById(id, ip, userId)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: [e.message, e] };
    });

  return res.status(recipe.status).json(recipe.data);
};
