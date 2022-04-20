import { Request, Response } from "express";
import { feedRecipes } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const limit = req.params.limit;

  const recipeList = await feedRecipes(parseInt(limit))
    .catch((e) => {
      return { status: 400, data: e };
    })
    .then((response) => {
      return { status: 200, data: response };
    });

  return res.status(recipeList.status).json(recipeList.data);
};
