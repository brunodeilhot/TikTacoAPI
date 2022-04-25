import { Request, Response } from "express";
import { addFollower } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.params.userId;

  const status = await addFollower(id, userId)
    .then(() => {
      return { code: 200, message: "Follower added" };
    })
    .catch((e) => {
      return { code: 400, message: e.message };
    });

  return res.status(status.code).json(status.message);
};
