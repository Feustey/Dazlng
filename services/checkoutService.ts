"use client";

import { getAlbyService } from "./albyService";

export interface CheckoutSessionData {
  userId: string;
  amount: number;
  plan?: "subscription" | "one-time";
  deliveryInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    deliveryOption: "standard" | "express";
  };
  paymentInfo?: {
    paymentUrl: string;
  };
}

class CheckoutService {
  private static instance: CheckoutService;

  private constructor() {}

  public static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService();
    }
    return CheckoutService.instance;
  }

  async createSession(data: CheckoutSessionData) {
    try {
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    try {
      const response = await fetch(`/api/checkout/session/${sessionId}`);
      if (!response.ok) {
        throw new Error("Failed to get checkout session");
      }
      return await response.json();
    } catch (error) {
      console.error("Error getting checkout session:", error);
      throw error;
    }
  }

  async updateSession(sessionId: string, data: Partial<CheckoutSessionData>) {
    try {
      const response = await fetch(`/api/checkout/session/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update checkout session");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating checkout session:", error);
      throw error;
    }
  }

  async processPayment(sessionId: string) {
    try {
      const session = await this.getSession(sessionId);
      const albyService = await getAlbyService();
      const invoice = await albyService.createInvoice({
        amount: session.amount,
        memo: `Payment for session ${sessionId}`,
      });

      await this.updateSession(sessionId, {
        paymentInfo: {
          paymentUrl: invoice.payment_request,
        },
      });

      return invoice;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }
}

export const checkoutService = CheckoutService.getInstance();
