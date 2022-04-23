import { Request, Response } from "express";
import { findByEmail } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const email = req.params.email;

  const user = await findByEmail(email)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: e };
    });

  return res.status(user.status).json(user.data);
};
