import { NextRequest } from "next/server";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  request?: NextRequest;
  userId?: string;
  [key: string]: NextRequest | string | undefined;
}

class Logger {
  private static formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const requestInfo = context?.request
      ? {
          method: context.request.method,
          url: context.request.url,
          ip: context.request.ip,
        }
      : {};

    return JSON.stringify({
      timestamp,
      level,
      message,
      ...requestInfo,
      ...context,
    });
  }

  static info(message: string, context?: LogContext): void {
    console.log(this.formatMessage("info", message, context));
  }

  static warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  static error(message: string, context?: LogContext): void {
    console.error(this.formatMessage("error", message, context));
  }

  static debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context));
    }
  }
}

export default Logger;
