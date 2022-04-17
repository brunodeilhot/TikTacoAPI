import { Request, Response } from "express";
import { findByEmail } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const email = req.params.email;

  const user = await findByEmail(email)
    .catch((e) => {
      return { status: 400, data: e };
    })
    .then((user) => {
      return { status: 200, data: user };
    });

  return res.status(user.status).json(user.data);
};
