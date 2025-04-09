import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    pubkey: {
      type: String,
      required: true,
      unique: true,
    },
    nodePubkey: {
      type: String,
      default: null,
    },
    lightningAddress: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
