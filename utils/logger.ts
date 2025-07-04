const isDevelopment = (process.env.NODE_ENV ?? "") === 'development';

type LogArgs = string | number | boolean | null | undefined | object;

class Logger {
  private static instance: Logger;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { /* constructeur privé */ }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(_message: string, ..._args: LogArgs[]): void {
    if (isDevelopment) {
      console.info(`[INFO] ${_message}`, ..._args);
    }
  }

  error(_message: string, _error?: Error | unknown): void {
    if (isDevelopment) {
      console.error(`[ERROR] ${_message}`, _error);
    }
    // Ici, vous pourriez ajouter une intégration avec un service de monitoring
    // comme Sentry, LogRocket, etc.
  }

  warn(_message: string, ..._args: LogArgs[]): void {
    if (isDevelopment) {
      console.warn(`[WARN] ${_message}`, ..._args);
    }
  }

  debug(_message: string, ..._args: LogArgs[]): void {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${_message}`, ..._args);
    }
  }
}

export const logger = Logger.getInstance();