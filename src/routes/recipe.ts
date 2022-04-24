import { Router } from "express";
import actions from "../actions/recipes";

const { create, feed, findById, findByUser, addLike, removeLike, update } =
  actions;

const router = Router();

router.post("/create", create);
router.put("/update/:id", update);

router.get("/find/:id/:userId/:access", findById);
router.get("/find/:userId/:limit", findByUser);

router.get("/feed/:limit", feed);

router.put("/meta/likes/:id/add/:userId", addLike);
router.put("/meta/likes/:id/remove/:userId", removeLike);

export default router;
