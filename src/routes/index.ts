import { create, findByEmail, updateProfile } from "./../repositories/users";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (_, res) => res.send("Project started"));
router.post("/create", async (req: Request, res: Response) => {
  if (req.get("content-type") === "application/json" && req.method === "POST") {
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
  }
  return res.status(406).json({ "406": "Request not accepted" });
});
router.get("/find/:email", async (req: Request, res: Response) => {
  if (req.get("content-type") === "application/json" && req.method === "GET") {
    const email = req.params.email;

    const user = await findByEmail(email)
      .catch((e) => {
        return { status: 400, data: e };
      })
      .then((user) => {
        return { status: 200, data: user };
      });

    return res.status(user.status).json(user.data);
  }
  return res.status(406).json({ "406": "Request not accepted" });
});
router.put("/update/:id", async (req: Request, res: Response) => {
  if (req.get("content-type") === "application/json" && req.method === "PUT") {
    const { name, username, birthday, picture, bio } = req.body;
    const id = req.params.id;

    const user = await updateProfile(id, username, name, birthday, picture, bio)
      .catch((e) => {
        return { status: 400, data: e };
      })
      .then((user) => {
        return { status: 200, data: user };
      });
    return res.status(user.status).json(user.data);
  }
  return res.status(406).json({ "406": "Request not accepted" });
});

export default router;
