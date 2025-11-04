import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    userEmail: {type: String, required: true, unique: true},
    userPassword: {type: String, required: true, unique: true}
});

usersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Users = mongoose.model("users", usersSchema)
export default Users