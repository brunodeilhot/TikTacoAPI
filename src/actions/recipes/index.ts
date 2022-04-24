import create from "./create-recipe.action";
import feed from "./feed-recipes.action";
import findByUser from "./findBy-user.action";
import findById from "./findBy-id.action"
import addLike from "./add-like.action";
import removeLike from "./remove-like.action";
import update from "./update-recipe.action";

const actions = {
    create,
    update,    
    feed,
    findById,
    findByUser,
    addLike,
    removeLike
};

export default actions;