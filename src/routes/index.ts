import { Router } from "express";
import urlVerification from "../security"
import apiDocs from "../docs"
import user from "./user";
import recipes from "./recipe";
import uploads from "./uploads";

const router = Router();

/**
 * Verification of hostname and api key
 */
router.use(urlVerification);

router.get("/", apiDocs);

router.use("/user", user);
router.use("/recipes", recipes);

/**
 * Manages image uploading and file storage
 */
router.use("/uploads", uploads);

export default router;
