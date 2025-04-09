import { AlbyWebhook, IAlbyWebhook } from "../models/AlbyWebhook";
import crypto from "crypto";

const ALBY_API_URL = "https://api.getalby.com";

interface CreateWebhookParams {
  userId: string;
  url: string;
  description: string;
  filterTypes: string[];
}

interface WebhookResponse {
  url: string;
  description: string;
  filter_types: string[];
  created_at: string;
  id: string;
  endpoint_secret: string;
}

export class AlbyWebhookService {
  private static async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ) {
    const response = await fetch(`${ALBY_API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Alby API error: ${response.statusText}`);
    }

    return response.json();
  }

  static async createWebhook({
    userId,
    url,
    description,
    filterTypes,
  }: CreateWebhookParams): Promise<IAlbyWebhook> {
    try {
      const response = (await this.makeRequest("/webhook_endpoints", {
        method: "POST",
        body: JSON.stringify({
          url,
          description,
          filter_types: filterTypes,
        }),
      })) as WebhookResponse;

      const webhook = await AlbyWebhook.create({
        userId,
        endpointId: response.id,
        endpointSecret: response.endpoint_secret,
        url: response.url,
        description: response.description,
        filterTypes: response.filter_types,
      });

      return webhook;
    } catch (error) {
      console.error("Error creating Alby webhook:", error);
      throw error;
    }
  }

  static async getWebhook(endpointId: string): Promise<IAlbyWebhook | null> {
    try {
      const webhook = await AlbyWebhook.findOne({ endpointId });
      return webhook;
    } catch (error) {
      console.error("Error getting Alby webhook:", error);
      throw error;
    }
  }

  static async deleteWebhook(endpointId: string): Promise<void> {
    try {
      await this.makeRequest(`/webhook_endpoints/${endpointId}`, {
        method: "DELETE",
      });

      await AlbyWebhook.deleteOne({ endpointId });
    } catch (error) {
      console.error("Error deleting Alby webhook:", error);
      throw error;
    }
  }

  static async getUserWebhooks(userId: string): Promise<IAlbyWebhook[]> {
    try {
      const webhooks = await AlbyWebhook.find({ userId });
      return webhooks;
    } catch (error) {
      console.error("Error getting user Alby webhooks:", error);
      throw error;
    }
  }

  static verifyWebhookSignature(
    payload: string,
    signature: string,
    endpointSecret: string
  ): boolean {
    try {
      const hmac = crypto.createHmac("sha256", endpointSecret);
      const calculatedSignature = hmac.update(payload).digest("hex");

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(calculatedSignature)
      );
    } catch (error) {
      console.error("Error verifying webhook signature:", error);
      return false;
    }
  }
}
