export interface ICheckoutSession {
  _id?: string;
  userId?: string;
  plan: string;
  status: "pending" | "completed" | "failed";
  paymentUrl?: string;
  paymentHash?: string;
  amount: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
