import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phoneNumber: string;
  avatar: string;
  bio: string;
  preferences: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const ProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    preferences: {
      language: {
        type: String,
        default: "fr",
      },
      currency: {
        type: String,
        default: "EUR",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profile ||
  mongoose.model<IProfile>("Profile", ProfileSchema);
