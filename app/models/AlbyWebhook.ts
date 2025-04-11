import { ObjectId } from "mongodb";

export interface AlbyWebhook {
  _id?: ObjectId;
  webhookId: string;
  event: string;
  status: "pending" | "processed" | "failed";
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
