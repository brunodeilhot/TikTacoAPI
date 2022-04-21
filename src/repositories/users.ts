import User from "../models/User";

interface Iuser {
  _id: string,
  name: string,
  email: string,
  username: string,
  birthday?: Date,
  picture?: string,
  bio?: string,
  created_at?: Date,
  meta?: Imeta
}

interface Imeta {
  rec_liked: Array<string>,
  likes: number,
  followers: Array<string>,
  following: Array<string>
}

export const create = async (
  name: string,
  email: string,
  username: string,
  birthday?: Date,
  picture?: string,
  bio?: string,
  created_at?: Date,
  meta?: Imeta
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
  const user: any = await User.findById(id);
  user.username = username;
  user.name = name !== undefined ? name : user.name;
  user.birthday = birthday !== undefined ? birthday : user.birthday;
  user.picture = picture !== undefined ? picture : user.picture;
  user.bio = bio !== undefined ? bio : user.bio;

  await user.save();
  return user;
};

// TODO: update user meta data

export const findByEmail = async (email: string) => User.findOne({ email });

export const findById = async (id: string) => {
  const user: any = await User.findById(id);

  const { name, username, picture, bio, meta } = user;

  return { name, username, picture, bio, meta };
};

const methods = { create, updateProfile, findByEmail };

export default methods;
