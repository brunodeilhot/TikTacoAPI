import { Request, Response } from "express";
import { removeFollower } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const status = await removeFollower(id, userId)
    .then(() => {
      return { code: 200, message: "Follower removed" };
    })
    .catch((e) => {
      return { code: 400, message: e.message };
    });

  return res.status(status.code).json(status.message);
};
