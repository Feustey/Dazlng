import { Document } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}
