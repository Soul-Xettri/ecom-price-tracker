import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    exp: { type: Date, required: true },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
