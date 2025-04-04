import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Supprimer automatiquement les sessions expirées
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
