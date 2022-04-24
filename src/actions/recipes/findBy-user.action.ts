import { Request, Response } from "express";
import { findByUser } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const limit = req.params.limit;

  const recipe = await findByUser(userId, parseInt(limit))
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: [e.message, e] };
    });

  return res.status(recipe.status).json(recipe.data);
};
