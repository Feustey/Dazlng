const isDevelopment = process.env.NODE_ENV === 'development';

type LogArgs = string | number | boolean | null | undefined | object;

class Logger {
  private static instance: Logger;

  private constructor() {
    // Constructeur privé pour empêcher l'instanciation directe
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string, ...args: LogArgs[]): void {
    if (isDevelopment) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | unknown): void {
    if (isDevelopment) {
      // console.error(`[ERROR] ${message}`, error);
    }
    // Ici, vous pourriez ajouter une intégration avec un service de monitoring
    // comme Sentry, LogRocket, etc.
  }

  warn(message: string, ...args: LogArgs[]): void {
    if (isDevelopment) {
      // console.warn(`[WARN] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: LogArgs[]): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = Logger.getInstance(); 