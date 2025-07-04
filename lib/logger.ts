type LogLevel = "info" | "error" | "warn";

const log = (level: LogLevel, message: string, data?: unknown): void => {
  if ((process.env.NODE_ENV || "") === "development") {
    switch (level) {
      case "info":
        console.log(message, data);
        break;
      case "error":
        console.error(message, data);
        break;
      case "warn":
        console.warn(message, data);
        break;
      default:
        console.log(message, data);
    }
  }
};

export const logger = {
  info: (message: string, data?: unknown) => log("info", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
};
