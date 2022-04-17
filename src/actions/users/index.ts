import create from "./create-user.action";
import updateProfile from "./update-profile.action";
import findByEmail from "./findBy-email.action";
import findById from "./findBy-id.action";

const actions = {
    create,
    updateProfile,
    findByEmail,
    findById
};

export default actions;