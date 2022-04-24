import { Request, Response } from "express";
import { totalLikes } from "../../repositories/users";


export default async (req: Request, res: Response) => {
  const id = req.params.id;

  const likes = await totalLikes(id)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: e };
    });

  return res.status(likes.status).json(likes.data);
};
