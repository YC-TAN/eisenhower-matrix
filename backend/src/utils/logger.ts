const timestamp = (): string => new Date().toISOString();

export const logger = {
  info: (...params: unknown[]): void => {
    console.log(`[${timestamp()}] INFO:`, ...params);
  },
  error: (...params: unknown[]): void => {
    console.error(`[${timestamp()}] ERROR:`, ...params);
  },
  warn: (...params: unknown[]): void => {
    console.warn(`[${timestamp()}] WARN:`, ...params);
  },
};

export const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));