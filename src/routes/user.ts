import { Router } from "express";
import actions from "../actions/users";

const {
  create,
  update,
  findByEmail,
  findById,
  addStar,
  removeStar,
  totalLikes,
  addFollower,
  removeFollower,
} = actions;

const router = Router();

router.post("/create", create);
router.put("/update/:id", update);

router.get("/find/:id", findById);
router.get("/find/email/:email", findByEmail);

router.post("/followers/:id/add/:userId", addFollower);
router.delete("/followers/:id/remove/:userId", removeFollower);

router.get("/meta/likes/total/:id", totalLikes);
router.post("/meta/stars/:id/add/:recipeId", addStar);
router.delete("/meta/stars/:id/remove/:recipeId", removeStar);

export default router;
