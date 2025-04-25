declare module "lnurl" {
  interface LNURLServer {
    generateNewUrl(callbackUrl: string): string;
  }

  interface LNURLOptions {
    port: number;
  }

  function createServer(options: LNURLOptions): LNURLServer;

  export = {
    createServer,
  };
}
