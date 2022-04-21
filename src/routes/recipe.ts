import { Router } from "express";
import actions from "../actions/recipes";

const { create, feed, findByUser, getTotalLikes, addLike, removeLike, update } =
  actions;

const router = Router();

router.post("/create", create);

router.put("/update/:id", update);

router.get("/find/:user/:limit", findByUser);

router.get("/feed/:limit", feed);

router.get("/meta/likes/:user", getTotalLikes);
router.put("/meta/likes/:id/add/:userId", addLike);
router.put("/meta/likes/:id/remove/:userId", removeLike);

export default router;
