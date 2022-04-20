import { Request, Response, Router } from "express";
import user from "./user";
import recipes from "./recipe";

const router = Router();

router.get("/", (_: Request, res: Response) => res.send("Project started"));

router.use("/user", user);
router.use("/recipes", recipes);

export default router;
