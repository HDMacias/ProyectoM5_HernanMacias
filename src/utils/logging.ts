export function logInfo(message: string, data?: unknown): void {
  process.stderr.write('[INFO] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n');
}

export function logError(message: string, error?: unknown): void {
  process.stderr.write('[ERROR] ${message}${error instanceof Error ? ' ' + error.message : ''}\n');
}

export function logDebug(message: string, data?: unknown): void {
  if (process.env.DEBUG === 'true') {
    process.stderr.write('[DEBUG] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n');
  }
}
