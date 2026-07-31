# Task List: NRC Android Integration Execution

- `[x]` 1. Frontend Migration & Prep
    - `[x]` Create `ui_src` in `nrc_android` and sync source files from `noriskclient-launcher-3`
    - `[x]` Update `vite.config.ts` with `base: './'`
    - `[x]` Verify `HashRouter` usage in `router.tsx`
- `[x]` 2. Responsive UI Adaptation
    - `[x]` Add `mobile-layout.css` for bottom navigation transition
    - `[x]` Import `mobile-layout.css` into `globals.css`
- `[x]` 3. React-to-Android Bridge
    - `[x]` Create `src/services/bridge-service.ts`
    - `[x]` Refactor existing services to use `invoke` from bridge instead of Tauri
- `[x]` 4. Android-to-Pojav Backend Bridge
    - `[x]` Update `NoriskkMainActivity.java` with real `AndroidBridge` using Pojav logic
    - `[x]` Implement `get_accounts`, `launch_minecraft`, and `get_profiles`
- `[ ]` 5. Verification
    - `[ ]` Build frontend (`npm run build`) and move to `assets/noriskk_ui`
    - `[ ]` Build Android app (`gradle assembleDebug`)
