import { Router } from "express";
import actions from "../actions/recipes";

const { create, feed, findByUser, getTotalLikes  } = actions;

const router = Router();

router.post("create", create);

router.get("/find/:user/:limit", findByUser);

router.get("/feed/:limit", feed);

router.get("/meta/total-likes/:user", getTotalLikes);

export default router;