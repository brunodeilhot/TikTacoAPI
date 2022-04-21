import { Request, Response } from "express";
import { updateProfile } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const { name, username, birthday, picture, bio } = req.body;
  const id = req.params.id;

  const user = await updateProfile(id, username, name, birthday, picture, bio)
    .catch((e) => {
      return { status: 400, data: e };
    })
    .then((response) => {
      return { status: 200, data: response };
    });

  return res.status(user.status).json(user.data);
};
