"use client";

import { getAlbyService } from "./albyService";
import { supabase } from "@/app/lib/supabase";
import { CheckoutSession } from "@/app/lib/models";

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
      const { data: session, error } = await supabase
        .from("checkout_sessions")
        .insert({
          user_id: data.userId,
          amount: data.amount,
          plan: data.plan,
          status: "pending",
          delivery_info: data.deliveryInfo,
          payment_info: data.paymentInfo,
        })
        .select()
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async getSession(sessionId: string) {
    try {
      const { data: session, error } = await supabase
        .from("checkout_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error("Error getting checkout session:", error);
      throw error;
    }
  }

  async updateSession(sessionId: string, data: Partial<CheckoutSessionData>) {
    try {
      const { data: session, error } = await supabase
        .from("checkout_sessions")
        .update({
          amount: data.amount,
          plan: data.plan,
          delivery_info: data.deliveryInfo,
          payment_info: data.paymentInfo,
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return session;
    } catch (error) {
      console.error("Error updating checkout session:", error);
      throw error;
    }
  }

  async processPayment(sessionId: string) {
    try {
      const session = await this.getSession(sessionId);
      const albyService = await getAlbyService();
      const invoice = await albyService.createInvoice(
        session.amount,
        `Payment for session ${sessionId}`
      );

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
