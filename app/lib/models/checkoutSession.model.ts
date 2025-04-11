export interface ICheckoutSession {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  payment_hash?: string;
  created_at: string;
  updated_at: string;
}

export type CheckoutSession = ICheckoutSession;
