import { RequestHandler } from "express";

const urlVerification: RequestHandler = async (req, res, next) => {
  if (req.header("x-api-key") !== process.env.API_KEY)
    return res.status(403).json("Access denied - API");

  return next();
};

export default urlVerification;
