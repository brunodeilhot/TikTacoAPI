import { Request, Response } from "express";
import { getTotalLikes } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const user = req.params.user;

  const totalLikes = await getTotalLikes(user)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: e };
    });

  return res.status(totalLikes.status).json(totalLikes.data);
};
