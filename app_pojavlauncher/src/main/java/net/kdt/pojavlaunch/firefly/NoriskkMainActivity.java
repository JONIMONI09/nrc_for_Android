package net.kdt.pojavlaunch.firefly;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.movtery.ui.subassembly.customprofilepath.ProfilePathManager;
import net.kdt.pojavlaunch.firefly.prefs.LauncherPreferences;
import net.kdt.pojavlaunch.firefly.value.MinecraftAccount;
import net.kdt.pojavlaunch.firefly.value.launcherprofiles.LauncherProfiles;
import net.kdt.pojavlaunch.firefly.value.launcherprofiles.MinecraftProfile;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.Map;

public class NoriskkMainActivity extends AppCompatActivity {

    private WebView noriskkWebView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // --- MOBILE-MASTERY: Z-INDEX & SAFE AREA ---
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.setNavigationBarDividerColor(Color.TRANSPARENT);
        }

        // Initialize Pojav constants & Preferences
        Tools.initStorageConstants(this);
        LauncherPreferences.loadPreferences(this);

        // --- WEBVIEW ERSTELLEN ---
        noriskkWebView = new WebView(this);
        noriskkWebView.setBackgroundColor(Color.TRANSPARENT);
        setContentView(noriskkWebView);

        // --- PERFORMANCE & 3D SETUP ---
        WebSettings settings = noriskkWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        noriskkWebView.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        noriskkWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return false; 
            }
        });

        // Console-Bridge to Android Logcat
        noriskkWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                Log.d("NoriskkJS", consoleMessage.message() + " -- From line "
                        + consoleMessage.lineNumber() + " of "
                        + consoleMessage.sourceId());
                return true;
            }
        });

        // Handle back press
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (noriskkWebView.canGoBack()) {
                    noriskkWebView.goBack();
                } else {
                    setEnabled(false);
                    onBackPressed();
                }
            }
        });

        // --- BRÜCKE INITIALISIEREN ---
        noriskkWebView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        // React-UI laden aus dem lokalen Assets-Ordner
        noriskkWebView.loadUrl("file:///android_asset/noriskk_ui/index.html");
        
        hideSystemUI();
    }

    private void hideSystemUI() {
        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(getWindow(), noriskkWebView);
        if (insetsController != null) {
            insetsController.hide(WindowInsetsCompat.Type.systemBars());
            insetsController.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    // --- DIE ECHTE BRÜCKE ZU POJAV BACKEND ---
    public class AndroidBridge {
        
        @JavascriptInterface
        public void launch_minecraft(String argsJson) {
            Log.d("Noriskk", "Launch Request: " + argsJson);
            runOnUiThread(() -> {
                try {
                    JSONObject obj = new JSONObject(argsJson);
                    String accountName = obj.optString("account", "");
                    String profileId = obj.optString("id", obj.optString("profileId", ""));

                    MinecraftAccount account = MinecraftAccount.load(accountName);
                    if (account == null) {
                        // Fallback to first available account if not specified
                        File accountsDir = new File(Tools.DIR_ACCOUNT_NEW);
                        File[] files = accountsDir.listFiles((dir, name) -> name.endsWith(".json"));
                        if (files != null && files.length > 0) {
                            account = MinecraftAccount.load(files[0].getName().replace(".json", ""));
                        }
                    }

                    if (account == null) {
                        Log.e("Noriskk", "No account available to launch.");
                        return;
                    }

                    LauncherProfiles.load(ProfilePathManager.getCurrentProfile());
                    MinecraftProfile profile = LauncherProfiles.mainProfileJson.profiles.get(profileId);
                    if (profile == null) {
                        profile = LauncherProfiles.getCurrentProfile();
                    }

                    String versionId = profile.lastVersionId;
                    if (versionId == null || versionId.isEmpty()) {
                        versionId = "1.12.2"; // Absolute fallback
                    }

                    // Intent to real Pojav Launcher Logic
                    Tools.launchMinecraft(NoriskkMainActivity.this, account, profile, versionId, 8);
                } catch (Throwable e) {
                    Log.e("Noriskk", "Launch failed", e);
                }
            });
        }

        @JavascriptInterface
        public void launch_profile(String argsJson) {
            launch_minecraft(argsJson);
        }

        @JavascriptInterface
        public String get_accounts(String dummyArgs) {
            try {
                File accountsDir = new File(Tools.DIR_ACCOUNT_NEW);
                JSONArray array = new JSONArray();
                if (accountsDir.exists() && accountsDir.isDirectory()) {
                    File[] accountFiles = accountsDir.listFiles((dir, name) -> name.endsWith(".json"));
                    if (accountFiles != null) {
                        for (File f : accountFiles) {
                            String name = f.getName().replace(".json", "");
                            MinecraftAccount acc = MinecraftAccount.load(name);
                            if (acc != null) {
                                JSONObject j = new JSONObject();
                                j.put("name", acc.username);
                                j.put("uuid", acc.profileId);
                                j.put("type", acc.isMicrosoft ? "msa" : "offline");
                                array.put(j);
                            }
                        }
                    }
                }
                return array.toString();
            } catch (Exception e) {
                Log.e("Noriskk", "Failed to get accounts", e);
                return "[]";
            }
        }

        @JavascriptInterface
        public String get_profiles(String dummyArgs) {
            try {
                LauncherProfiles.load(ProfilePathManager.getCurrentProfile());
                if (LauncherProfiles.mainProfileJson != null) {
                    return LauncherProfiles.mainProfileJson.toJson();
                }
            } catch (Exception e) {
                Log.e("Noriskk", "Failed to read profiles", e);
            }
            return "{}";
        }

        @JavascriptInterface
        public String get_all_profiles_and_last_played(String dummyArgs) {
            try {
                LauncherProfiles.load(ProfilePathManager.getCurrentProfile());
                JSONObject result = new JSONObject();
                JSONArray allProfiles = new JSONArray();
                
                if (LauncherProfiles.mainProfileJson != null && LauncherProfiles.mainProfileJson.profiles != null) {
                    for (Map.Entry<String, MinecraftProfile> entry : LauncherProfiles.mainProfileJson.profiles.entrySet()) {
                        JSONObject p = new JSONObject();
                        p.put("id", entry.getKey());
                        p.put("name", entry.getValue().name);
                        p.put("last_version_id", entry.getValue().lastVersionId);
                        p.put("group", "CUSTOM"); // Pojav doesn't have groups in the same way
                        allProfiles.put(p);
                    }
                }
                
                result.put("all_profiles", allProfiles);
                String lastPlayed = LauncherPreferences.DEFAULT_PREF.getString(LauncherPreferences.PREF_KEY_CURRENT_PROFILE, "");
                result.put("last_played_profile_id", lastPlayed);
                
                return result.toString();
            } catch (Exception e) {
                Log.e("Noriskk", "Failed to get all profiles", e);
                return "{\"all_profiles\": [], \"last_played_profile_id\": null}";
            }
        }

        @JavascriptInterface
        public String get_profile(String argsJson) {
            try {
                JSONObject args = new JSONObject(argsJson);
                String id = args.getString("id");
                LauncherProfiles.load(ProfilePathManager.getCurrentProfile());
                MinecraftProfile profile = LauncherProfiles.mainProfileJson.profiles.get(id);
                if (profile != null) {
                    JSONObject p = new JSONObject();
                    p.put("id", id);
                    p.put("name", profile.name);
                    p.put("last_version_id", profile.lastVersionId);
                    return p.toString();
                }
            } catch (Exception e) {
                Log.e("Noriskk", "Failed to get single profile", e);
            }
            return "{}";
        }

        @JavascriptInterface
        public String get_system_info(String dummyArgs) {
            JSONObject j = new JSONObject();
            try {
                j.put("os", "Android");
                j.put("os_version", Build.VERSION.RELEASE);
                j.put("arch", Build.SUPPORTED_ABIS[0]);
                return j.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        @JavascriptInterface
        public String get_system_ram_mb(String dummyArgs) {
            return "4096"; // Hardcoded for now, or use ActivityManager
        }

        @JavascriptInterface
        public String get_norisk_packs(String dummyArgs) {
            return "[]";
        }

        @JavascriptInterface
        public String get_norisk_packs_resolved(String dummyArgs) {
            return "[]";
        }

        @JavascriptInterface
        public String get_standard_profiles(String dummyArgs) {
            return "{\"versions\": []}";
        }

        @JavascriptInterface
        public String is_content_installed(String dummyArgs) {
            return "{\"installed\": false}";
        }

        @JavascriptInterface
        public void install_profile(String argsJson) {
            Log.d("Noriskk", "Install Request: " + argsJson);
            // Placeholder for background installation
        }

        @JavascriptInterface
        public void open_url(String url) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url));
                startActivity(intent);
            } catch (Exception e) {
                Log.e("Noriskk", "Failed to open URL: " + url, e);
            }
        }

        @JavascriptInterface
        public void close_launcher() {
            finish();
        }
    }
}
