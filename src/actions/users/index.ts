import create from "./create-user.action";
import updateProfile from "./update-profile.action";
import findByEmail from "./findBy-email.action";
import findById from "./findBy-id.action";
import addStar from "./add-star.action";
import removeStar from "./remove-star.action";
import totalLikes from "./total-likes.action";
import addFollower from "./add-follower.action";
import removeFollower from "./remove-follower.action";

const actions = {
    create,
    updateProfile,
    findByEmail,
    findById,
    addStar,
    removeStar,
    totalLikes,
    addFollower,
    removeFollower
};

export default actions;