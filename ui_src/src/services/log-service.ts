import { invoke } from "./bridge-service";

export const LOG_LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'] as const;
export type LogLevel = typeof LOG_LEVELS[number];

export interface ParsedLogLine {
  id: number;
  raw: string;
  timestamp?: string;
  thread?: string;
  level?: LogLevel;
  text: string;
}

export async function getProfileLogFiles(profileId: string): Promise<string[]> {
    return await invoke<string[]>('get_profile_log_files', { profileId });
}

export async function getLogFileContent(logFilePath: string): Promise<string> {
    return await invoke<string>('get_log_file_content', { logFilePath });
}

export async function uploadLogToMclogs(logContent: string): Promise<string> {
    return await invoke<string>('upload_log_to_mclogs_command', { logContent });
}

export async function openLogFileDirectory(filePath: string): Promise<void> {
    await invoke('open_file_directory', { filePath });
}

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  modified: number;
}

export async function listLauncherLogs(): Promise<FileInfo[]> {
  return await invoke<FileInfo[]>('list_launcher_logs');
}

export async function listCrashReports(): Promise<FileInfo[]> {
  return await invoke<FileInfo[]>('list_crash_reports');
}

export async function listAllMcLogs(): Promise<FileInfo[]> {
  return await invoke<FileInfo[]>('list_all_mc_logs');
}

export async function listProcessLogs(): Promise<FileInfo[]> {
  return await invoke<FileInfo[]>('list_process_logs');
}
