import { Request, Response } from "express";

const apiDocs = async (_req: Request, res: Response) => {
  const info = {
    version: "1.0.0",
    name: "TikTacoAPI",
    endpoints: ["user", "recipes"],
  };
  return res.json(info);
};

export default apiDocs;