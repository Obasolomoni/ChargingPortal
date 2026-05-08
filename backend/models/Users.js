import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true}
});

const Users = mongoose.model("users", usersSchema)
export default Users