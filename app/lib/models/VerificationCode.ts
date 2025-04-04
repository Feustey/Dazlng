import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
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

// Supprimer automatiquement les codes expirés
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode =
  mongoose.models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);
