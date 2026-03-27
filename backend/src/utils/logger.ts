const timestamp = () => new Date().toISOString();

export const logger = {
  info: (...params: unknown[]) => {
    console.log(`[${timestamp()}] INFO:`, ...params);
  },
  error: (...params: unknown[]) => {
    console.error(`[${timestamp()}] ERROR:`, ...params);
  },
  warn: (...params: unknown[]) => {
    console.warn(`[${timestamp()}] WARN:`, ...params);
  },
};

export const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));