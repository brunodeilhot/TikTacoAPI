import { Request, Response, Router } from "express";
import user from "./user"

const router = Router();

router.get("/", (_: Request, res: Response) => res.send("Project started"));

router.use("/user", user)

export default router;
