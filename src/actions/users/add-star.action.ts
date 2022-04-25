import { Request, Response } from "express";
import { addStar } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const recipeId = req.params.recipeId;

  const status = await addStar(id, recipeId)
  .then(() => {
    return { code: 200, message: "Recipe starred" };
  })
  .catch((e) => {
    return { code: 400, message: e.message };
  });

  return res.status(status.code).json(status.message);
};
