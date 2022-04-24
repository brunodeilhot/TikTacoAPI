import { Request, Response } from "express";
import { addFollower } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const status = await addFollower(id, userId)
    .then(() => 200)
    .catch(() => 400);

  return res.sendStatus(status);
};
