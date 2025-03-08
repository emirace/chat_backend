import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  password: { type: String },
  socketId: { type: String, default: null },
  role: { type: String, enum: ["Admin", "User", "Guest"], default: "User" },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
