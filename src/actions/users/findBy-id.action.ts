import { findById } from "./../../repositories/users";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await findById(id)
    .catch((e) => {
      return { status: 400, data: e };
    })
    .then((user) => {
      return { status: 200, data: user };
    });

  return res.status(user.status).json(user.data);
};
