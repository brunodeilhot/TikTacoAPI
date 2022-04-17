import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [50, 'Name cannot be longer than 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is invalid'],
        maxLength: [100, 'Email cannot be longer than 100 characters']
    },
    birthday: Date,
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        maxLength: [25, 'Username cannot be longer than 25 characters']
    },
    picture: {
        type: String,
        match: /([^\\s]+(\\.(?i)(jpe?g|png|gif|bmp))$)/,
        unique: true,
    },
    bio: {
        type: String,
        maxLength: [250, 'Bio cannot be longer than 250 characters']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    meta: {
        rec_liked: [String],
        followers: [String],
        following: [String],
    }
});

const User = model('User', UserSchema);

export default User;