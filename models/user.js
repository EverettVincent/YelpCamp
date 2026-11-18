// models/user.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// adds a field for password, makes sure usernames are unique
userSchema.plugin(passportLocalMongoose.default);

const User = mongoose.model("User", userSchema, "yelpusers");

export default User;

