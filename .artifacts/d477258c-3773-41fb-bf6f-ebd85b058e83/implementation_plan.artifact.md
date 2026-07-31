# Fallow Audit & Deep Refactoring Plan

This plan outlines the steps to audit, refactor, and build the Noriskk hybrid launcher to achieve production-level code quality.

## Goals
- Clean up dead code and Tauri-specific remnants in the Android build.
- Resolve all warnings and potential runtime issues identified by static analysis.
- Ensure a zero-warning build for both the React frontend and the Android application.
- Establish a robust bridge between the React UI and the Pojav backend.

## Proposed Changes

### 1. React Frontend Audit & Refactoring (`ui_src`)
- **[MODIFY] [bridge-service.ts](file:///D:/Noriskk/nrc_android/ui_src/src/services/bridge-service.ts)**
    - Optimize the `invoke` function to prioritize `AndroidBridge`.
    - Ensure type safety for all bridge calls.
    - Remove or conditionalize Tauri-specific logic to prevent overhead on Android.
- **[MODIFY] [tauri-service.ts](file:///D:/Noriskk/nrc_android/ui_src/src/services/tauri-service.ts)**
    - Rename to `native-service.ts` or similar to reflect hybrid nature.
    - Clean up unused Tauri plugin imports.

### 2. Android Backend Audit & Refactoring (`app_pojavlauncher`)
- **[MODIFY] [NoriskkMainActivity.java](file:///D:/Noriskk/nrc_android/app_pojavlauncher/src/main/java/net/kdt/pojavlaunch/firefly/NoriskkMainActivity.java)**
    - Expand `AndroidBridge` to support missing frontend requests (e.g., `get_system_ram_mb`, `get_norisk_packs`).
    - Implement robust error handling for JSON parsing and Pojav API calls.
    - Audit WebView settings for security and performance.
- **[MODIFY] [Tools.java](file:///D:/Noriskk/nrc_android/app_pojavlauncher/src/main/java/net/kdt/pojavlaunch/firefly/Tools.java)**
    - Search for potential optimizations in resource handling.

### 3. Build & Deployment Optimization
- **[MODIFY] [build.gradle](file:///D:/Noriskk/nrc_android/app_pojavlauncher/build.gradle)**
    - Ensure all dependencies are up-to-date and necessary.
    - Optimize build types and resource shrinking.

## Verification Plan

### Automated Tests
- `npm run build` in `ui_src` must pass with zero errors.
- `./gradlew assembleDebug` in `nrc_android` must pass with zero errors.

### Manual Verification
- Deploy to an Android device/emulator.
- Verify React UI loads correctly.
- Test `launch_minecraft` and verify it triggers the Pojav backend.
- Check Logcat for any bridge communication errors.

## Open Questions
- Are there specific Pojav features (e.g., mod installation) that need to be exposed to the React UI immediately?
- Should we implement a "mock" bridge for browser-based development of the React UI?
