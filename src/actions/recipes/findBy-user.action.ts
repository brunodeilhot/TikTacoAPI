import { Request, Response } from "express";
import { findByUser } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const user = req.params.user;
  const limit = req.params.limit;

  const recipe = await findByUser(user, parseInt(limit))
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: e };
    });

  return res.status(recipe.status).json(recipe.data);
};
