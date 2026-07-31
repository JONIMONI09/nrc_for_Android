import { invoke } from './bridge-service';
import type { Profile } from '../types/profile';
import { useProfileStore } from '../store/profile-store';
import { getPackRolloutConfig } from './flagsmith-service';
import { refreshPermissions } from './permission-service';
import { logInfo, logError } from '../utils/logging-utils';

export const fetchNewsAndChangelogs = (): Promise<any[]> => {
  return invoke('get_news_and_changelogs_command');
};

export const refreshNoriskPacks = (): Promise<void> => {
  return invoke('refresh_norisk_packs');
};

export const refreshStandardVersions = (): Promise<Profile[]> => {
  return invoke('refresh_standard_versions');
};

export const refreshNrcDataOnMount = async (): Promise<void> => {
  useProfileStore.setState({ loading: true, error: null });

  try {
    let nrcPacksSuccess = false;
    let standardVersionsSuccess = false;

    getPackRolloutConfig()
      .then((config) => {
        logInfo(`Pack rollout config loaded: ${JSON.stringify(config)}`);
      })
      .catch((error) => {
        logError(`Failed to load pack rollout config: ${error}`);
      });

    refreshPermissions()
      .then(() => logInfo("User permissions refreshed on mount"))
      .catch((error) => logError(`Failed to refresh permissions: ${error}`));

    try {
      await refreshNoriskPacks();
      console.log("Norisk Packs updated successfully on mount!");
      nrcPacksSuccess = true;
    } catch (error) {
      console.error("Failed to refresh Norisk Packs on mount:", error);
    }

    try {
      const standardProfiles = await refreshStandardVersions();
      console.log("Standard Versions updated successfully on mount!");
      useProfileStore.setState({ standardProfiles });
      standardVersionsSuccess = true;
    } catch (error) {
      console.error("Failed to refresh Standard Versions on mount:", error);
    }

    if (nrcPacksSuccess || standardVersionsSuccess) {
      try {
        console.log("Refreshing profiles state after NRC data update...");
        await useProfileStore.getState().fetchProfiles();
        console.log("Profiles state refreshed successfully.");
      } catch (error) {
        console.error("Failed to refresh profiles state after NRC data update:", error);
      }
    }
  } catch (error) {
    console.error("Error during NRC data refresh or profile fetching process:", error);
    useProfileStore.setState({
      error: "Failed to initialize or refresh app data.",
      loading: false,
    });
  }
};

export const discordAuthLink = (): Promise<void> => {
  return invoke('discord_auth_link');
};

export const discordAuthStatus = (): Promise<boolean> => {
  return invoke('discord_auth_status');
};

export const discordAuthUnlink = (): Promise<void> => {
  return invoke('discord_auth_unlink');
};

export const githubAuthLink = (): Promise<void> => {
  return invoke('github_auth_link');
};

export const githubAuthStatus = (): Promise<boolean> => {
  return invoke('github_auth_status');
};

export const githubAuthUnlink = (): Promise<void> => {
  return invoke('github_auth_unlink');
};

export const getMobileAppToken = (): Promise<string> => {
  return invoke('get_mobile_app_token');
};

export const resetMobileAppToken = (): Promise<string> => {
  return invoke('reset_mobile_app_token');
};

export const checkUpdateAvailable = (): Promise<any | null> => {
  return invoke('check_update_available_command');
};

export const downloadAndInstallUpdate = (): Promise<void> => {
  return invoke('download_and_install_update_command');
};

export const getAdventCalendar = (): Promise<any[]> => {
  return invoke('get_advent_calendar_command');
};

export const claimAdventCalendarDay = (tag: number): Promise<any> => {
  return invoke('claim_advent_calendar_day_command', { tag });
};

export const getNotifications = (): Promise<any[]> => {
  return invoke('get_notifications');
};

export const markAllNotificationsRead = (): Promise<void> => {
  return invoke('mark_all_notifications_read');
};

export const markNotificationRead = (notificationId: string): Promise<void> => {
  return invoke('mark_notification_read', { notificationId });
};

export interface UniquePlayersResponse {
  count: number;
  windowHours: number;
  computedAtMs: number;
}

export const getUniquePlayers24h = (): Promise<UniquePlayersResponse> => {
  return invoke('get_unique_players_24h_command');
};

export { log as logMessage, logDebug as logMessageDebug, logInfo as logMessageInfo, logWarn as logMessageWarn, logError as logMessageError } from '../utils/logging-utils';
