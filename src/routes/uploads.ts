import { Router } from "express";
import multer from "multer";

const recipeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "dist/public/recipes");
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname)
  }
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "dist/public/users");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
}
});

const recipeUpload = multer({ storage: recipeStorage });
const profileUpload = multer({ storage: profileStorage });

const router = Router();

router.post("/recipes", recipeUpload.single("file"), (req, res) =>
  res.status(200)
);
router.post("/users", profileUpload.single("file"), (req, res) =>
  res.status(200)
);

router.get("/recipes", (req, res) => console.log("requested"))

export default router;
