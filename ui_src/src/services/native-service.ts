import { invoke, openUrl, openPath } from "./bridge-service";
import type { ImagePreviewPayload, ImagePreviewResponse } from '../types/fileSystem';

/**
 * Opens a given URL in the default external application.
 */
export const openExternalUrl = (url: string): Promise<void> => {
  return openUrl(url);
};

/**
 * Invokes the backend command to get a processed image preview.
 */
export const getImagePreview = (payload: ImagePreviewPayload): Promise<ImagePreviewResponse> => {
  return invoke<ImagePreviewResponse>('get_image_preview', { payload });
};

/**
 * Gets the launcher directory path from the backend.
 */
export const getLauncherDirectory = (): Promise<string> => {
  return invoke<string>('get_launcher_directory');
};

/**
 * Opens the launcher directory in the system's file explorer.
 */
export const openLauncherDirectory = async (): Promise<void> => {
  const launcherPath = await getLauncherDirectory();
  await openPath(launcherPath);
}; 
