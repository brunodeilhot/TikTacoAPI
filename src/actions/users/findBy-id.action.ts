import { findById } from "./../../repositories/users";
import { Request, Response } from "express";

export default async (req: Request, res: Response) => {
  const id = req.params.id;

  const user = await findById(id)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: e };
    });

  return res.status(user.status).json(user.data);
};
