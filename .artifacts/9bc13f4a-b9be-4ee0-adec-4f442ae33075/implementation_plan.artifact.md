# Implementation Plan: NRC Android Hybrid Launcher Build-Up

## 🧠 Knowledge Alignment (Retrospective)

### Was ich zuvor falsch verstanden hatte:
- **Ordner-Struktur:** Ich habe die Trennung zwischen `GlowWorm`, `noriskclient-launcher-3` und `nrc_android` nicht strikt genug eingehalten und teilweise "blind" synchronisiert.
- **Daten-Integrität:** Ich habe in der Bridge teilweise Dummy-Daten verwendet (z.B. "Thep095883"), anstatt direkt die Pojav-Datenstrukturen (`MinecraftAccount`, `LauncherProfiles`) zu nutzen.
- **Frontend-Kompatibilität:** Das "White Screen" Problem (Vite Base Path) wurde zwar erkannt, aber noch nicht systematisch im Build-Prozess verankert.

### Was ich JETZT verstehe (Ziel-Doktrin):
- **Source A (NRC PC):** Absolut tabu für Schreibzugriffe. Quelle für UI/UX, CSS und React-Logik.
- **Source B (GlowWorm):** Absolut tabu für Schreibzugriffe. Blaupause für die Android-Logik und Pojav-Backend.
- **Target (nrc_android):** Das Schlachtfeld. Hier wird alles zusammengeführt. Der alte `app_pojavlauncher` Ordner wird als Rumpf genutzt und präzise umgebaut.

---

## 🛠️ Status der bisherigen Arbeiten (nrc_android)

### Erledigt / Fixiert:
- **Basis-Sync:** Grundlegende Java-Klassen und JNI-Libs aus GlowWorm wurden nach `nrc_android/app_pojavlauncher` kopiert.
- **Kompilierung:** Schwere Fehler in `JavaGUILauncherActivity.java` (fehlende R-IDs, switch-case vs non-final IDs) wurden behoben.
- **WebView-Grundgerüst:** `NoriskkMainActivity.java` wurde erstellt, ist im Manifest als Main-Activity registriert und besitzt bereits ein hardwarebeschleunigtes WebView.

### Nächste kritische Schritte:
1. **Frontend-Umzug:** Kopieren des React-Sourcecodes in `nrc_android/ui_src`.
2. **Vite & Router Fixes:** Umstellung auf `base: './'` und `HashRouter`.
3. **Echte Bridge:** Vollständige Implementierung von `AndroidBridge` ohne Fake-Daten.

---

## 🏗️ Detaillierter Bauplan

### 1. Android Backend Foundation (`nrc_android/app_pojavlauncher`)
... [Rest des Plans bleibt bestehen] ...

#### [SYNC] Core Logic from [GlowWorm](file:///D:/Noriskk/GlowWorm/app)
- Copy all source files (`src/main/java`, `src/main/jni`, `src/main/jniLibs`, `libs`, `src/main/res`) to `nrc_android/app`.
- Merge `AndroidManifest.xml` from GlowWorm, but set `NoriskkMainActivity` as the `MAIN` launcher activity.

#### [NEW] [NoriskkMainActivity.java](file:///D:/Noriskk/nrc_android/app/src/main/java/net/kdt/pojavlaunch/firefly/NoriskkMainActivity.java)
- Create a dedicated activity with a fullscreen, transparent WebView.
- Enable Hardware Acceleration and DOM storage.
- Implement `WebChromeClient` for Logcat console bridging.
- Implement `@JavascriptInterface public class AndroidBridge`.

---

### 2. Frontend Adaptation (`nrc_android/ui_src`)

#### [SYNC] UI Source from [noriskclient-launcher-3](file:///D:/Noriskk/noriskclient-launcher-3)
- Copy `src`, `public`, `package.json`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, and `vite.config.ts` to `nrc_android/ui_src`.

#### [MODIFY] [vite.config.ts](file:///D:/Noriskk/nrc_android/ui_src/vite.config.ts)
- Set `base: './'` to ensure relative paths for `file:///` protocol compatibility.

#### [MODIFY] [router.tsx](file:///D:/Noriskk/nrc_android/ui_src/src/lib/router.tsx)
- Ensure `createHashRouter` is used (verified: already in use).

#### [NEW] [bridge-service.ts](file:///D:/Noriskk/nrc_android/ui_src/src/services/bridge-service.ts)
- Create a wrapper `invokeNative(command, args)` that checks for `window.AndroidBridge`.
- Map current Tauri commands to Android bridge methods.

#### [MODIFY] CSS for Responsiveness
- Add media queries to transform the sidebar into a bottom navigation bar for portrait orientation.
- Implement `padding-bottom: env(safe-area-inset-bottom)` to handle Android navigation bars/notches.

---

### 3. Native Bridge Commands Implementation

| Command (Frontend) | Java Implementation (AndroidBridge) |
| :--- | :--- |
| `get_accounts` | `MinecraftAccount.loadAll()` (translated to JSON) |
| `launch_minecraft` | `Tools.launchMinecraft(...)` |
| `get_launcher_directory` | `getExternalFilesDir(null)` |
| `open_url` | `Intent(Intent.ACTION_VIEW, Uri.parse(url))` |

---

## Verification Plan

### Automated Tests
- `gradle assembleDebug` in `nrc_android/app`.
- Lint checks for Android Manifest consistency.

### Manual Verification
- Deploy to Android device.
- Verify React UI loads without "White Screen".
- Check Logcat for "NoriskkJS" tags to verify console bridge.
- Test Profile loading and Minecraft launching via UI.
