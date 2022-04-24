import { Request, Response } from "express";
import { removeLike } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const status = await removeLike(id, userId)
    .then(() => 200)
    .catch(() => 400);

  return res.sendStatus(status);
};