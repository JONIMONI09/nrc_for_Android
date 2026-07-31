# Android Wrapper & Bridge (nrc_android)

## Purpose
Manages the Android shell, WebView integration, and native bridging for the Norris Client UI.

## Ownership
- Managed by: Antigravity UI & Integration Subagents

## Local Contracts
- Contains the `NoriskkMainActivity` which loads the Web UI from `assets/noriskk_ui/index.html`.
- Maintains the `NoriskkBridge` JavaScript interface.
- No direct UI elements should be written in Android XML or Compose unless required for system-level overlays; all Launcher UI is delegated to the Web UI.

## Work Guidance
- Use `gradle assembleDebug` to test builds.
- When modifying the bridge, ensure backwards compatibility for the Web UI.

## Verification
- Run `gradle assembleDebug` in `nrc_android` to ensure it compiles.
- Native features must trigger corresponding logs or actions via Intent (e.g. `launchMinecraft`).

## Child DOX Index
(None)
