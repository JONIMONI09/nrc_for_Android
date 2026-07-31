import { invoke } from "./bridge-service";
import type { MinecraftAccount } from "../types/minecraft";

export class MinecraftAuthService {
  static async beginLogin(): Promise<MinecraftAccount | null> {
    try {
      return await invoke<MinecraftAccount | null>("begin_login");
    } catch (error) {
      console.error("Failed to begin login:", error);
      throw error;
    }
  }

  static async removeAccount(accountId: string): Promise<void> {
    try {
      await invoke("remove_account", { accountId });
    } catch (error) {
      console.error("Failed to remove account:", error);
      throw error;
    }
  }

  static async getActiveAccount(): Promise<MinecraftAccount | null> {
    try {
      return await invoke<MinecraftAccount | null>("get_active_account");
    } catch (error) {
      console.error("Failed to get active account:", error);
      return null;
    }
  }

  static async setActiveAccount(accountId: string): Promise<void> {
    try {
      await invoke("set_active_account", { accountId });
    } catch (error) {
      console.error("Failed to set active account:", error);
      throw error;
    }
  }

  static async getAccounts(): Promise<MinecraftAccount[]> {
    try {
      const accounts = await invoke<MinecraftAccount[]>("get_accounts");
      return Array.isArray(accounts) ? accounts : [];
    } catch (error) {
      console.error("Failed to get accounts:", error);
      return [];
    }
  }

  static async cancelLogin(): Promise<void> {
    try {
      await invoke("cancel_login");
    } catch (error) {
      console.error("Failed to cancel login:", error);
      throw error;
    }
  }

  static async isFlatpak(): Promise<boolean> {
    try {
      return await invoke<boolean>("is_flatpak");
    } catch (error) {
      console.error("Failed to check Flatpak status:", error);
      return false;
    }
  }
}
