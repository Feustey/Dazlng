import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  pubkey: string;
  nodePubkey?: string;
  lightningAddress?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
