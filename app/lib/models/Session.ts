import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, // Expire après 24 heures
  },
});

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
