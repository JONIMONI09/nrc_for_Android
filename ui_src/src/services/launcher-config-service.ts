import { invoke } from "./bridge-service";

export async function getGlobalMemorySettings() {
  return invoke<any>("get_global_memory_settings");
}

export async function setGlobalMemorySettings(settings: any) {
  return invoke("set_global_memory_settings", { settings });
}

export async function getGlobalCustomJvmArgs() {
  return invoke<string>("get_global_custom_jvm_args");
}

export async function setGlobalCustomJvmArgs(args: string) {
  return invoke("set_global_custom_jvm_args", { args });
}

export async function getLauncherConfig() {
  return invoke<any>("get_launcher_config");
}

export async function setLauncherConfig(config: any) {
  return invoke("set_launcher_config", { config });
}

export async function getAppVersion() {
  return invoke<string>("get_app_version");
}

export async function setProfileGroupingPreference(criterion: string) {
  return invoke("set_profile_grouping_preference", { criterion });
}
