import { Request, Response } from "express";
import { create } from "../../repositories/users";

export default async (req: Request, res: Response) => {
  const { name, email, username, birthday, picture, bio, created_at, meta } =
    req.body;

  const newUser = await create(
    name,
    email,
    username,
    birthday,
    picture,
    bio,
    created_at,
    meta
  )
    .catch((e) => {
      return { status: 400, data: e };
    })
    .then((user) => {
      return { status: 201, data: user };
    });

  return res.status(newUser.status).json(newUser.data);
};
