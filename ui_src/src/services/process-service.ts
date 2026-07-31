import { invoke } from "./bridge-service";

export async function launch(id: string, singleplayer?: string, multiplayer?: string, migrationInfo?: any, skipLastPlayedUpdate?: boolean, overrides?: any) {
  return invoke("launch_profile", { id, singleplayer, multiplayer, migrationInfo, skip_last_played_update: skipLastPlayedUpdate, overrides });
}

export async function abort(id: string) {
  return invoke("abort_launch", { id });
}

export async function getRunningProcesses() {
  return invoke<any[]>("get_processes");
}

export async function stopProcess(id: string) {
  return invoke("stop_process", { id });
}

export async function openLogWindow(id: string) {
  return invoke("open_log_window", { id });
}

export async function checkCrashLog(id: string) {
  return invoke("check_crash_log", { id });
}

export async function fetchCrashReport(profileId: string, processId: string, startTime?: string) {
  return invoke<string>("fetch_crash_report", { profileId, processId, startTime });
}

export async function getProcessLogCursor(id: string, offset: number) {
  return invoke<any>("get_process_log_cursor", { id, offset });
}

export interface LaunchOverrides {
  game_version?: string;
  loader?: string;
  pack?: string;
}
