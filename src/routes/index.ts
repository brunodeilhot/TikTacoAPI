import { Router } from "express";
import urlVerification from "../security"
import apiDocs from "../docs"
import user from "./user";
import recipes from "./recipe";

const router = Router();

// router.use(urlVerification);

router.get("/", apiDocs);

router.use("/user", user);
router.use("/recipes", recipes);

export default router;
