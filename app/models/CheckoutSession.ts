import { ObjectId } from "mongodb";

export interface CheckoutSession {
  _id?: ObjectId;
  sessionId: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
