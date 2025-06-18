declare module 'lightning' {
  export interface LndConfig {
    lnd: any;
  }

  export interface DecodePaymentRequestParams extends LndConfig {
    request: string;
  }

  export interface GetWalletInfoParams extends LndConfig {}

  export interface GetChannelsParams extends LndConfig {}

  export interface CreateLndGrpcParams {
    socket: string;
    cert: string;
    macaroon: string;
  }

  export interface DecodedPaymentRequest {
    tokens: number;
    description: string;
    id: string;
    expires_at: string;
    destination: string;
  }

  export interface WalletInfo {
    public_key: string;
    alias: string;
    current_block_height: number;
  }

  export interface Channels {
    channels: Array<any>;
  }

  export interface CreateInvoiceParams {
    amount: number;
    description: string;
    expires_at?: string;
  }

  export interface Invoice {
    paymentRequest: string;
    id: string;
    secret: string;
    amount: number;
    description: string;
    expires_at: string;
  }

  export type InvoiceStatus = 'pending' | 'settled' | 'expired' | 'error';

  export function createLndGrpc(params: CreateLndGrpcParams): Promise<{ lnd: any }>;
  export function decodePaymentRequest(params: DecodePaymentRequestParams): Promise<DecodedPaymentRequest>;
  export function getWalletInfo(params: GetWalletInfoParams): Promise<WalletInfo>;
  export function getChannels(params: GetChannelsParams): Promise<Channels>;
  export function createInvoice(params: CreateInvoiceParams & LndConfig): Promise<Invoice>;
  export function getInvoice(params: { id: string } & LndConfig): Promise<{ status: InvoiceStatus }>;
}

declare module '@/types/lightning' {
  export type { Invoice, InvoiceStatus, CreateInvoiceParams } from 'lightning';
} 