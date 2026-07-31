# 🎮 Norisk Launcher Android Port: Project Status & Developer Guide

This file provides a comprehensive overview of the current state of the Norisk Launcher Android port. It maps the project structure, details known runtime issues, and serves as a roadmap for final stabilization.

---

## 🏗️ System Architecture

The project is a **Hybrid Android Application**:
1.  **Native Shell (Java)**: A PojavLauncher-based container that provides the Minecraft runtime and system access.
2.  **Web UI (React)**: A modern, high-performance interface that runs inside a hardware-accelerated WebView.
3.  **Communication Bridge**: A bi-directional interface allowing the Web UI to trigger native actions (launching, account switching) and receive system updates.

---

## 📂 Directory Map

### 1. Android Native (`D:/Noriskk/nrc_android/`)
-   **Main Logic**: `app_pojavlauncher/src/main/java/net/kdt/pojavlaunch/firefly/`
    -   `NoriskkMainActivity.java`: The heart of the app. Initializes the WebView and the `AndroidBridge`.
-   **Resources**: `app_pojavlauncher/src/main/res/`
-   **Web Assets**: `app_pojavlauncher/src/main/assets/noriskk_ui/`
    -   **DO NOT EDIT MANUALLY**. This folder is populated by the `ui_src` build process.

### 2. Frontend React Source (`D:/Noriskk/nrc_android/ui_src/`)
-   **Core App**: `src/App.tsx` (Main container, event listeners).
-   **Services (`src/services/`)**:
    -   `bridge-service.ts`: **Central Hub**. Abstracts native calls so the UI can run on Android, Tauri, or Mock.
    -   `nrc-service.ts`: High-level business logic (news, updates, auth links).
    -   `profile-service.ts`: Minecraft profile management.
-   **Stores (`src/store/`)**: Zustand-based state management (friends, chat, profiles, themes).
-   **Components (`src/components/`)**: The modular UI parts (modals, tabs, layout).

### 3. Backup & Source of Truth
-   **Desktop Source**: `D:/Noriskk/noriskclient-launcher-3/`
    -   Use this directory to recover any original logic, styles, or assets from the desktop version.

---

## 🛠️ Build & Sync Workflow

To update the launcher UI on the device:
1.  **Build UI**: Run `npm run build` inside `ui_src`.
2.  **Sync & Build Android**: Run `gradle assembleDebug` in the root or `app_pojavlauncher` module.
3.  **Deploy**: Use Android Studio to "Run" the app or `adb install`.

---

## 🐞 Known Issues & Troubleshooting

The project currently builds successfully, but the following runtime errors are identified in logs:

### 1. Bridge Command Naming (Snake vs Camel)
-   **Status**: ⚠️ **High Priority**
-   **Issue**: Java uses `get_accounts` while JS sometimes expects `getAccounts` or direct access to `window.AndroidBridge`.
-   **Fix**: Audit `ui_src/src/services/bridge-service.ts` to ensure the mapping matches the methods in `NoriskkMainActivity.java`.

### 2. "transformCallback" Crash
-   **Status**: ⚠️ **High Priority**
-   **Issue**: Occurs when `@tauri-apps/api` logic is initialized on Android.
-   **Fix**: Ensure all Tauri imports are **dynamic** (using `await import(...)`) and only executed when `(window as any).__TAURI_INTERNALS__` exists.

### 3. Drag-and-Drop Hook Failure
-   **Status**: ℹ️ **Medium Priority**
-   **Issue**: `useGlobalDragAndDrop.tsx` crashes because it tries to access `window.metadata` which is a Tauri-only property.
-   **Fix**: Wrap the registration logic in a check for the Tauri environment.

### 4. Image Loading Errors
-   **Status**: ✅ **Partially Fixed**
-   **Issue**: Skin renders and avatars sometimes fail to resolve local paths.
-   **Fix**: Use `convertFileSrc` from `bridge-service.ts` to transform local file paths into `file://` URLs for the WebView.

---

## 📝 Bridge Interface (API)

The following methods are currently implemented in the **Java `AndroidBridge`**:
-   `launch_minecraft(argsJson)`
-   `get_accounts(dummyArgs)` -> Returns `JSONArray` of accounts.
-   `get_all_profiles_and_last_played(dummyArgs)`
-   `get_profile(argsJson)`
-   `get_system_info(dummyArgs)`
-   `open_url(url)`

---

## 🚀 Future Roadmap
- [ ] Implement `get_friends` and `get_notifications` natively in Java.
- [ ] Stabilize the WebSocket connection for real-time chat on mobile.
- [ ] Optimize 3D Skin Viewer for lower-end Android devices.

> [!TIP]
> Use `adb logcat | grep NoriskkJS` to debug frontend issues directly from your terminal.
