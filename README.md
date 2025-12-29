# 🚀 Student Assistant: Mobile Conversion Guide

Welcome! This guide will help you turn this code into a real APK for your Android phone.

## 🛠 Step 1: Install the Tools
1. **Node.js**: [Install from here](https://nodejs.org/). Choose the "LTS" version.
2. **Android Studio**: [Install from here](https://developer.android.com/studio).

## 💻 Step 2: Setup in VS Code
Open your terminal in this folder and run:

```bash
# 1. Install Capacitor (The Bridge)
npm install @capacitor/core @capacitor/cli

# 2. Setup the Mobile Project
npx cap init "Student Assistant" com.yourname.studentapp --web-dir .

# 3. Add Android Support
npm install @capacitor/android
npx cap add android
```

## 📱 Step 3: Run on your Phone
1. Connect your phone via USB.
2. Run this command:
   ```bash
   npx cap run android
   ```
3. This will build the app and launch it on your device!

## 💰 Step 4: Adding Real Ads
When you are ready to earn money:
1. Create a [Google AdMob](https://admob.google.com/) account.
2. Get your **Ad Unit IDs**.
3. Open `services/adService.ts` and replace the placeholder IDs with your real ones.
4. Run `npx cap sync` to update the app.

## 💡 Pro Tips for Beginners
- **Safe Areas**: The code already includes `viewport-fit=cover`. This prevents your app from being hidden behind the phone's camera "notch".
- **Icons**: You can generate icons easily using `npx @capacitor/assets generate`.
- **Haptics**: To make the phone vibrate when you complete a task, look into the `@capacitor/haptics` plugin!
