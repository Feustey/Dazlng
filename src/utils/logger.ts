const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, ...args: unknown[]): void {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown): void {
    // Ajoute ici une intégration Sentry/LogRocket si besoin
  }

  warn(message: string, ...args: unknown[]): void {
    // Ajoute ici une intégration Sentry/LogRocket si besoin
  }

  debug(message: string, ...args: unknown[]): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = Logger.getInstance(); 