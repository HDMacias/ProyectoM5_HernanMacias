import { logInfo } from './logging.js';

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
      } catch (error) {
        lastError = error;

        const isRateLimit =
          error instanceof Error && error.message.includes('rate limit');

          if (isRateLimit || attempt === maxRetries) {
            throw error;
          }

         const delay = baseDelay * Math.pow(2, attempt - 1);
         logInfo(`Rate limit detectado. Reintentando en ${delay}ms (intento ${attempt}/${maxRetries})`);
         await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
