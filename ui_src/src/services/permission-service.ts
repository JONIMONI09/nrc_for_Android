import { invoke } from "./bridge-service";

export async function refreshPermissions() {
  return invoke("refresh_permissions");
}

export async function hasPermission(permission: string): Promise<boolean> {
  const permissions = await invoke<string[]>("get_permissions").catch(() => []);
  return Array.isArray(permissions) && permissions.includes(permission);
}
