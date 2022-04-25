import { RequestHandler } from "express";

const urlVerification: RequestHandler = async (req, res, next) => {
    // console.log(req.baseUrl)
    console.log("through here")

    return next();
}

export default urlVerification;