import { Router } from "express";
import actions from "../actions/recipes";

const {
  create,
  feed,
  findById,
  findByUser,
  addLike,
  removeLike,
  update,
  findByUserMeta,
} = actions;

const router = Router();

router.post("/create", create);
router.put("/update/:id", update);

router.get("/find/id/:id/:userId", findById);
router.get("/find/user/:userId/:limit", findByUser);
router.get("/find/user/:userId/meta/:meta/:limit", findByUserMeta);

router.get("/feed/:limit/:user?", feed);

router.post("/meta/likes/:id/add/:userId", addLike);
router.delete("/meta/likes/:id/remove/:userId", removeLike);

export default router;
