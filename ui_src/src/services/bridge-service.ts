// nrc_android/ui_src/src/services/bridge-service.ts

/**
 * Universal invoke function that routes commands to AndroidBridge or Mock
 */
export const invoke = async <T>(command: string, args: Record<string, any> = {}): Promise<T> => {
  const androidBridge = (window as any).AndroidBridge;

  // 1. Android Check
  if (androidBridge) {
     if (typeof androidBridge[command] === 'function') {
         console.log(`[Bridge] Android Call: ${command}`, args);
         const result = androidBridge[command](JSON.stringify(args));
         if (!result) return getSafeDefault<T>(command);
         try {
             return JSON.parse(result) as T;
         } catch (e) {
             console.error(`[Bridge] Failed to parse JSON result for command "${command}":`, result);
             return getSafeDefault<T>(command);
         }
     } else {
         console.warn(`[Bridge] AndroidBridge exists but command "${command}" is not implemented. Using fallback.`);
         return getSafeDefault<T>(command);
     }
  }

  // 2. Legacy Tauri Check (Optional/Removed for production Android)
  if ((window as any).__TAURI_INTERNALS__) {
      const { invoke: tauriInvoke } = await import('@tauri-apps/api/core');
      return await tauriInvoke<T>(command, args);
  }

  // 3. Mock Bridge for Local Development
  console.info(`[Bridge] No native bridge found for command: ${command}. Using Mock.`);
  return getMockData<T>(command);
};

/**
 * Universal URL opener
 */
export const openUrl = async (url: string): Promise<void> => {
    const androidBridge = (window as any).AndroidBridge;
    if (androidBridge && typeof androidBridge.open_url === 'function') {
        androidBridge.open_url(url);
        return;
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { openUrl: tauriOpenUrl } = await import('@tauri-apps/plugin-opener');
        return await tauriOpenUrl(url);
    }

    console.log(`[Mock] Opening URL: ${url}`);
    window.open(url, '_blank');
};

/**
 * Universal Path opener
 */
export const openPath = async (path: string): Promise<void> => {
    const androidBridge = (window as any).AndroidBridge;
    if (androidBridge && typeof androidBridge.open_path === 'function') {
        androidBridge.open_path(path);
        return;
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { openPath: tauriOpenPath } = await import('@tauri-apps/plugin-opener');
        return await tauriOpenPath(path);
    }

    console.log(`[Mock] Opening Path: ${path}`);
};

/**
 * Returns safe defaults for commands to prevent UI crashes
 */
function getSafeDefault<T>(command: string): T {
    const defaults: Record<string, any> = {
        'get_accounts': [],
        'get_active_account': null,
        'get_all_profiles_and_last_played': { all_profiles: [], last_played_profile_id: null },
        'get_profiles': { profiles: {} },
        'get_norisk_packs': [],
        'get_norisk_packs_resolved': [],
        'get_standard_profiles': { versions: [] },
        'get_launcher_config': { use_browser_based_login: false, pack_rollout_override: 'auto' },
        'get_system_info': { os: 'Android' },
        'is_content_installed': { installed: false },
        'get_processes': [],
        'get_news_and_changelogs_command': [],
        'get_friends': [],
        'get_pending_requests': [],
        'get_friends_user': { privacy: { showServer: true, allowRequests: true, allowServerInvites: true } },
        'get_notifications': [],
        'get_all_skins': [],
        'get_active_skin': {},
        'get_user_skin_data': {},
        'get_profile_symlinks': [],
        'get_app_version': '0.5.22',
        'get_system_ram_mb': 4096,
        'refresh_standard_versions': [],
        'check_for_group_migration': { needs_migration: false }
    };
    return (defaults[command] ?? {}) as T;
}

/**
 * Mock data for development
 */
function getMockData<T>(command: string): T {
    const mocks: Record<string, any> = {
        'get_accounts': [
            { name: 'MockPlayer', uuid: '00000000-0000-0000-0000-000000000000', type: 'offline' }
        ],
        'get_all_profiles_and_last_played': {
            all_profiles: [
                { id: 'mock-profile', name: 'Mock Profile 1.12.2', last_version_id: '1.12.2', group: 'CUSTOM', loader: 'vanilla' }
            ],
            last_played_profile_id: 'mock-profile'
        },
        'get_system_ram_mb': 8192,
        'get_app_version': '0.5.22'
    };

    return (mocks[command] || getSafeDefault<T>(command)) as T;
}

/**
 * Converts a file path to a web-accessible URL
 */
export const convertFileSrc = (filePath: string, protocol = 'asset'): string => {
  const androidBridge = (window as any).AndroidBridge;
  if (androidBridge) {
    if (filePath.startsWith('http') || filePath.startsWith('file://') || filePath.startsWith('data:')) {
      return filePath;
    }
    return `file://${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }

  return filePath;
};

/**
 * Universal Clipboard writer
 */
export const writeText = async (text: string): Promise<void> => {
    const androidBridge = (window as any).AndroidBridge;
    if (androidBridge && typeof androidBridge.copy_to_clipboard === 'function') {
        androidBridge.copy_to_clipboard(text);
        return;
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { writeText: tauriWrite } = await import('@tauri-apps/plugin-clipboard-manager');
        return await tauriWrite(text);
    }

    console.log(`[Mock] Copying to clipboard: ${text}`);
    await navigator.clipboard.writeText(text);
};

export interface Event<T> {
    event: string;
    payload: T;
}

/**
 * Universal Event Listener
 */
export const listen = async <T>(event: string, handler: (payload: any) => void): Promise<() => void> => {
    const androidBridge = (window as any).AndroidBridge;

    if (androidBridge) {
        // Android events are often handled via specific callbacks or not at all in this way
        console.log(`[Bridge] Listener for ${event} registered (Android)`);
        return () => console.log(`[Bridge] Listener for ${event} unregistered (Android)`);
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { listen: tauriListen } = await import('@tauri-apps/api/event');
        return await tauriListen(event, handler);
    }

    console.log(`[Bridge] Listener for ${event} registered (Mock)`);
    return () => console.log(`[Bridge] Listener for ${event} unregistered (Mock)`);
};

/**
 * Universal App Exit
 */
export const exitApp = async (): Promise<void> => {
    const androidBridge = (window as any).AndroidBridge;
    if (androidBridge && typeof androidBridge.exit_app === 'function') {
        androidBridge.exit_app();
        return;
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { exit } = await import('@tauri-apps/plugin-process');
        return await exit();
    }

    console.log('[Mock] Exiting app');
    window.close();
};

/**
 * Universal Dialog Open
 */
export const openDialog = async (options: any = {}): Promise<string | string[] | null> => {
    const androidBridge = (window as any).AndroidBridge;
    if (androidBridge && typeof androidBridge.open_dialog === 'function') {
        const result = androidBridge.open_dialog(JSON.stringify(options));
        return result ? JSON.parse(result) : null;
    }

    if ((window as any).__TAURI_INTERNALS__) {
        const { open } = await import('@tauri-apps/plugin-dialog');
        return await open(options);
    }

    console.log('[Mock] Opening dialog', options);
    return null;
};

/**
 * Universal Window Manager
 */
export const getCurrentWindow = (): any => {
    if ((window as any).__TAURI_INTERNALS__) {
        // This is tricky because it's usually synchronous in Tauri imports
        // For now return a proxy or null
        return null;
    }
    return null;
};

