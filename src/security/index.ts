import { RequestHandler } from "express";

const urlVerification: RequestHandler = async (req, res, next) => {
  if (req.headers.host !== process.env.REQ_HOST) {
    return res.status(403).json("Access denied");
  }

  if (req.header("x-api-key") !== process.env.API_KEY)
    return res.status(403).json("Access denied - API");

  return next();
};

export default urlVerification;
