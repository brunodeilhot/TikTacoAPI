import create from "./create-recipe.action";
import feed from "./feed-recipes.action";
import findByUser from "./findBy-user.action";
import getTotalLikes from "./getTotal-likes.action";

const actions = {
    create,
    feed,
    findByUser,
    getTotalLikes
};

export default actions;