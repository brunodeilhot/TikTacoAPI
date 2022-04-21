import create from "./create-recipe.action";
import feed from "./feed-recipes.action";
import findByUser from "./findBy-user.action";
import getTotalLikes from "./getTotal-likes.action";
import addLike from "./add-like.action";
import removeLike from "./remove-like.action";
import update from "./update-recipe.action";

const actions = {
    create,
    feed,
    findByUser,
    getTotalLikes,
    addLike,
    removeLike,
    update
};

export default actions;