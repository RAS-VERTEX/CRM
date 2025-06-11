interface LogLevel {
  INFO: "info";
  WARN: "warn";
  ERROR: "error";
  DEBUG: "debug";
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(
        `[INFO] ${new Date().toISOString()} - ${message}`,
        data || ""
      );
    }
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || "");
  }

  error(message: string, error?: any): void {
    console.error(
      `[ERROR] ${new Date().toISOString()} - ${message}`,
      error || ""
    );
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(
        `[DEBUG] ${new Date().toISOString()} - ${message}`,
        data || ""
      );
    }
  }
}

export const logger = new Logger();
