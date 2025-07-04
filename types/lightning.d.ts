declare module 'lightning' {
  export interface LndConfig {
    host: string;
    port: number;
    macaroon: string;
    cert?: string;
  }

  export interface DecodePaymentRequestParams {
    paymentRequest: string;
  }

  export interface GetWalletInfoParams {
    provider: string;
  }

  export interface GetChannelsParams {
    provider: string;
  }

  export interface CreateLndGrpcParams {
    socket: string;
    cert: string;
    macaroon: string;
  }

  export interface DecodedPaymentRequest {
    amount: number;
    description: string;
    destination: string;
    timestamp: number;
    expiry: number;
  }

  export interface WalletInfo {
    alias: string;
    pubkey: string;
    balance: number;
    channels: number;
  }

  export interface Channels {
    channels: Array<{
      id: string;
      capacity: number;
      localBalance: number;
      remoteBalance: number;
      active: boolean;
    }>;
  }

  export interface CreateInvoiceParams {
    amount: number;
    description: string;
    metadata?: Record<string, any>;
  }

  export interface Invoice {
    paymentRequest: string;
    paymentHash: string;
    amount: number;
    description: string;
    timestamp: number;
    expiry: number;
    settled: boolean;
    settledAt?: string;
    metadata?: Record<string, any>;
  }

  export interface InvoiceStatus {
    settled: boolean;
    settledAt?: string;
    metadata?: Record<string, any>;
  }

  export interface LightningService {
    generateInvoice(params: CreateInvoiceParams): Promise<Invoice>;
    checkInvoiceStatus(paymentHash: string): Promise<InvoiceStatus>;
    watchInvoice(params: {
      paymentHash: string;
      onPaid: () => Promise<void>;
      onExpired: () => void;
      onError: (error: Error) => void;
    }): Promise<void>;
    healthCheck(): Promise<{ isOnline: boolean; provider: string }>;
  }

  export function createLndGrpc(params: CreateLndGrpcParams): Promise<{ lnd: any }>;
  export function decodePaymentRequest(params: DecodePaymentRequestParams): Promise<DecodedPaymentRequest>;
  export function getWalletInfo(params: GetWalletInfoParams): Promise<WalletInfo>;
  export function getChannels(params: GetChannelsParams): Promise<Channels>;
  export function createInvoice(params: CreateInvoiceParams & LndConfig): Promise<Invoice>;
  export function getInvoice(params: { id: string } & LndConfig): Promise<{ status: InvoiceStatus }>;
}

declare module '@/types/lightning' {
  export type { Invoice, InvoiceStatus, CreateInvoiceParams, LightningService } from 'lightning';
} 