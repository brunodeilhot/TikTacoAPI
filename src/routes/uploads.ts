import { Router } from "express";
import multer from "multer";

const recipeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/recipes");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "public/users");
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const recipeUpload = multer({ storage: recipeStorage });
const profileUpload = multer({ storage: profileStorage });

const router = Router();

router.post("/recipes", async (req, res) => {
  return recipeUpload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json(err.message);
    }
    return res.status(200).json("File Uploaded Successfully");
  });
});

router.post("/users", async (req, res) => {
  return profileUpload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json(err.message);
    }
    return res.status(200).json("File Uploaded Successfully");
  });
});

export default router;
