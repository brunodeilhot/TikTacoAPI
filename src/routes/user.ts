import { Router } from "express";
import actions from "../actions/users";

const { create, updateProfile, findByEmail, findById } =  actions;

const router = Router();

router.post("/create", create);
router.put("/update/:id", updateProfile);

router.get("/find/:email", findByEmail);
router.get("/find/:id", findById);

export default router;