# Fallow Audit & Refactoring Tasks

- [x] Refactor Frontend Bridge
    - [x] Rename `tauri-service.ts` to `native-service.ts`
    - [x] Implement Mock Bridge in `bridge-service.ts`
    - [x] Clean up dead Tauri imports/plugins
- [x] Expand Android Bridge (`NoriskkMainActivity.java`)
    - [x] Implement `get_system_ram_mb`
    - [x] Implement `get_norisk_packs` (placeholder)
    - [x] Implement `list_profiles` and `get_profile`
    - [x] Robust error handling for all bridge methods
- [x] Verification & Build
    - [x] `npm run build` in `ui_src`
    - [x] Sync assets to Android
    - [x] `./gradlew assembleDebug`
