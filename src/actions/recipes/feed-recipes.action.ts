import { Request, Response } from "express";
import { feedRecipes } from "../../repositories/recipes";

export default async (req: Request, res: Response) => {
  const limit = req.params.limit;
  const user = req.params.user;

  const recipeList = await feedRecipes(parseInt(limit), user)
    .then((response) => {
      return { status: 200, data: response };
    })
    .catch((e) => {
      return { status: 400, data: [e.message, e] };
    });

  return res.status(recipeList.status).json(recipeList.data);
};
