/**
 * Logger utility for test logging
 */
export class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log info message
   */
  info(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] [${timestamp}] ${message}`;
    console.log(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Log error message
   */
  error(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[ERROR] [${timestamp}] ${message}`;
    console.error(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Log warning message
   */
  warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[WARN] [${timestamp}] ${message}`;
    console.warn(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Log debug message
   */
  debug(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[DEBUG] [${timestamp}] ${message}`;
    console.debug(logMessage);
    this.logs.push(logMessage);
  }

  /**
   * Get all logs
   */
  getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

