import { Router } from "express";
import actions from "../actions/users";

const {
  create,
  updateProfile,
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
router.put("/update/:id", updateProfile);

router.get("/:id/:type", findById);
router.get("/find/:email", findByEmail);

router.get("/followers/:id/add/:userId", addFollower);
router.get("/followers/:id/remove/:userId", removeFollower);

router.get("/meta/likes/total/:id", totalLikes);
router.put("/meta/stars/:id/add/:recipeId", addStar);
router.put("/meta/stars/:id/remove/:recipeId", removeStar);

export default router;
