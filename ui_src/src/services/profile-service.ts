import { invoke } from "./bridge-service";

export async function getLocalContent(params: any) {
  return invoke<any[]>("get_local_content", params);
}

export async function resolveImagePath(id: string, path: string) {
  return invoke<string>("resolve_image_path", { id, path });
}

export async function repairProfile(id: string) {
  return invoke("repair_profile", { id });
}

export async function getProfileInstancePath(id: string) {
  return invoke<string>("get_profile_instance_path", { id });
}

export async function addProfileSymlink(id: string, path: string) {
  return invoke("add_profile_symlink", { id, path });
}

export async function removeProfileSymlink(id: string, path: string) {
  return invoke("remove_profile_symlink", { id, path });
}

export async function getProfileSymlinks(id: string) {
  return invoke<string[]>("get_profile_symlinks", { id });
}

export async function getDefaultProfilePath() {
  return invoke<string>("get_default_profile_path");
}

export async function getSystemRamMb() {
  return invoke<number>("get_system_ram_mb");
}

export async function uploadProfileImages(files: string[]) {
  return invoke<string[]>("upload_profile_images", { files });
}

export async function isProfileLaunching(id: string) {
  return invoke<boolean>("is_profile_launching", { id });
}

export async function getAllProfilesAndLastPlayed() {
  return invoke<any>("get_all_profiles_and_last_played");
}

export async function getProfile(id: string) {
  return invoke<any>("get_profile", { id });
}

export async function createProfile(params: any) {
  return invoke<string>("create_profile", params);
}

export async function updateProfile(id: string, updates: any) {
  return invoke("update_profile", { id, updates });
}

export async function deleteProfile(id: string) {
  return invoke("delete_profile", { id });
}

export async function launchProfile(id: string) {
  return invoke("launch_profile", { id });
}

export async function installProfile(id: string) {
  return invoke("install_profile", { id });
}

export async function abortProfileLaunch(id: string) {
  return invoke("abort_launch", { id });
}

export async function getProfileDirectoryStructure(id: string) {
  return invoke<any>("get_profile_directory_structure", { id });
}

export async function copyProfile(params: any) {
  return invoke<string>("copy_profile", params);
}

export async function exportProfile(params: any) {
  return invoke<string>("export_profile", params);
}

export async function checkForGroupMigration(id: string) {
  return invoke<any>("check_for_group_migration", { id });
}
