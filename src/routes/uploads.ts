import { Router } from "express";
import multer from "multer";

const recipeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "dist/public/recipes");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "dist/public/users");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const recipeUpload = multer({ storage: recipeStorage });
const profileUpload = multer({ storage: profileStorage });

const router = Router();

router.post("/recipes", recipeUpload.single("file"), (_req, res) =>
  res.status(200)
);
router.post("/users", profileUpload.single("file"), (_req, res) =>
  res.status(200)
);

export default router;
