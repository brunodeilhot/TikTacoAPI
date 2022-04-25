import { Request, Response } from "express";
import { addLike } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const status = await addLike(id, userId)
    .then(() => {
      return { code: 200, message: "Recipe liked" };
    })
    .catch((e) => {
      return { code: 400, message: e.message };
    });

  return res.status(status.code).json(status.message);
};
