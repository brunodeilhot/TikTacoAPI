import User from "../models/User";

export const create = async (
  name: string,
  email: string,
  username: string,
  birthday?: Date,
  picture?: string,
  bio?: string,
  created_at?: Date,
  meta?: Object
) => {
  return User.create({
    name,
    email,
    username,
    birthday,
    picture,
    bio,
    created_at,
    meta,
  });
};

export const updateProfile = async (
  id: string,
  username: string,
  name?: string,
  birthday?: Date,
  picture?: string,
  bio?: string
) => {
  const user = await User.findById(id);
  user.username = username;  
  user.name = name !== undefined ? name : user.name;
  user.birthday = birthday !== undefined ? birthday : user.birthday;
  user.picture = picture !== undefined ? picture : user.picture;
  user.bio = bio !== undefined ? bio : user.bio;

  await user.save();
  return user
};

export const findByEmail = async (email: string) => User.findOne({ email });

export const findById = async (id: string) => {
  const user = await User.findById(id);

  const { name, username, picture, bio, meta } = user;

  return { name, username, picture, bio, meta }
}

const methods = { create, updateProfile, findByEmail };

export default methods;
