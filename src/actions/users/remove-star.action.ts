import { Request, Response } from "express";
import { removeStar } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const recipeId = req.params.recipeId;

  const status = await removeStar(id, recipeId)
    .then(() => 200)
    .catch(() => 400);

  return res.sendStatus(status);
};