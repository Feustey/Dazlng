declare module 'lightning' {
  export interface LndConfig {
    lnd: any;
  }

  export interface DecodePaymentRequestParams extends LndConfig {
    request: string;
  }

  export interface GetWalletInfoParams extends LndConfig {}

  export interface GetChannelsParams extends LndConfig {}

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

  export function decodePaymentRequest(params: DecodePaymentRequestParams): Promise<DecodedPaymentRequest>;
  export function getWalletInfo(params: GetWalletInfoParams): Promise<WalletInfo>;
  export function getChannels(params: GetChannelsParams): Promise<Channels>;
} 