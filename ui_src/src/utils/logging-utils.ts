import { invoke } from "../services/bridge-service";

export const log = (level: 'debug' | 'info' | 'warn' | 'error', message: string): void => {
  console[level](message);
  invoke('log_message_command', { level, message }).catch(() => {});
};

export const logDebug = (message: string): void => log('debug', message);
export const logInfo = (message: string): void => log('info', message);
export const logWarn = (message: string): void => log('warn', message);
export const logError = (message: string): void => log('error', message);
