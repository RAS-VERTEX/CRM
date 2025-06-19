// lib/utils/logger.ts

type LogLevel = "info" | "warn" | "error" | "debug";

interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || "info";
    this.prefix = options.prefix || "[App]";
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} ${this.prefix} [${level.toUpperCase()}]`;
    return data
      ? `${prefix} ${message} ${JSON.stringify(data)}`
      : `${prefix} ${message}`;
  }

  info(message: string, data?: any): void {
    console.log(this.formatMessage("info", message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage("warn", message, data));
  }

  error(message: string, error?: any): void {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : error;
    console.error(this.formatMessage("error", message, errorData));
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, data));
    }
  }
}

export const logger = new Logger({ prefix: "[SimPRO]" });
