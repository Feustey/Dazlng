import mongoose from "mongoose";

export interface ISession {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
