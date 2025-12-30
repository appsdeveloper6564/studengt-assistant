
# 📱 Student Assistant - Mobile Setup Guide

## 🛑 CRITICAL FIX: "App Keeps Stopping" Error
If your app crashes immediately on launch, it is because **AdMob requires an Application ID** in your native Android code.

### How to fix:
1. Open **Android Studio**.
2. Go to `app` > `src` > `main` > **`AndroidManifest.xml`**.
3. Inside the `<application>` tag (at the bottom before `</application>`), paste this:
   ```xml
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-3940256099942544~3347511713"/>
   ```
4. Click the **Sync (Elephant)** icon.
5. Run the app again.

## 🚀 How to Test on Your Phone

### Step 1: Enable USB Debugging
1. Settings > About Phone > Tap **Build Number** 7 times.
2. Settings > Developer Options > Enable **USB Debugging**.

### Step 2: Connection
- Connect phone via USB.
- Select "File Transfer" mode on phone if prompted.
- Accept the "Allow USB Debugging" prompt.

### Step 3: Run from Android Studio
- Ensure the top dropdown shows your device name.
- Press **Shift + F10** or click the **Green Play Button**.

## 🛠 Troubleshooting
- **Gradle Error?** Active internet required for first-time sync.
- **Sync failed?** File > Invalidate Caches > Restart.
