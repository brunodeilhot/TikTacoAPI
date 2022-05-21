import { Request, Response } from "express";
import { findByUserMeta } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const meta = req.params.meta;
  const limit = req.params.limit;

  const recipe = await findByUserMeta(userId, meta, parseInt(limit))
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: [e.message, e] };
    });

  return res.status(recipe.status).json(recipe.data);
};
