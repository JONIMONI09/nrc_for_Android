# 🌉 Android-JS Bridge Documentation

This document explains how the React UI communicates with the Android native layer.

## 🛠️ The `bridge-service.ts`

The `bridge-service.ts` file acts as the universal adapter. It allows the launcher to run in three modes without changing the business logic:

1.  **Android Mode**: Uses `window.AndroidBridge` (injected by Java).
2.  **Tauri Mode**: Uses `@tauri-apps/api` (for Desktop).
3.  **Mock Mode**: Returns static data for browser-based development.

### 📡 Core Functions

#### `invoke<T>(command: string, args?: any): Promise<T>`
- **Android**: Calls `window.AndroidBridge[command](JSON.stringify(args))` and parses the JSON return string.
- **Tauri**: Uses the native Tauri IPC.
- **Defensive Design**: If a command is missing in Java, it returns a **Safe Default** (e.g., `[]` or `{}`) instead of crashing.

#### `listen<T>(event: string, handler: (payload: T) => void)`
- **Android**: Currently a stub. Android events should be sent via a custom JavaScript injection from Java.
- **Tauri**: Uses the Tauri event system.

#### `convertFileSrc(filePath: string)`
- **Purpose**: Converts a raw local path into a URL the WebView can render.
- **Android Output**: `file:///data/user/0/...`

---

## ☕ Java Implementation (`NoriskkMainActivity.java`)

The native side must declare methods with the `@JavascriptInterface` annotation.

### Example: Implementing a New Command
1.  Add method to `NoriskkMainActivity.AndroidBridge`:
    ```java
    @JavascriptInterface
    public String get_new_data(String args) {
        return "{\"key\": \"value\"}";
    }
    ```
2.  Call from React:
    ```typescript
    const data = await invoke('get_new_data');
    ```

---

## 🛑 Common Bridge Pitfalls

1.  **Serialization**: Everything sent over the bridge must be a **String**. Always `JSON.stringify` on the way out and `JSON.parse` on the way in.
2.  **Naming**: Java methods are case-sensitive. If you call `getAccounts` in JS, Java **must** have `getAccounts`, not `get_accounts`. (Standardizing on `snake_case` is recommended).
3.  **UI Thread**: Native actions that modify the UI (like opening a new Activity) must be wrapped in `runOnUiThread` in Java.
