import { RequestHandler } from "express";

const urlVerification: RequestHandler = async (req, res, next) => {
  if (req.hostname !== "localhost") {
    res.status(403).json("Access denied");
  }

  return next();
};

export default urlVerification;
