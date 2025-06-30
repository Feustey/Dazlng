type LogLevel = 'info' | 'error' | 'warn'

const log = (level: LogLevel, message: string, data?: unknown): void => {
  if ((process.env.NODE_ENV || '') === 'development') {
    switch (level) {
      case 'error':
        console.error(message, data)
        break
      case 'warn':
        console.warn(message, data)
        break
      default:
        console.log(message, data)
    }
  }
}

export const logger = {
  info: (message: string, data?: unknown): void => log('info', message, data),
  error: (message: string, error?: unknown): void => log('error', message, error),
  warn: (message: string, data?: unknown): void => log('warn', message, data)
}
