
# AdMob Native Configuration (REAL IDs ACTIVE)

Aapki Real AdMob IDs set ho gayi hain.

### Step 1: AndroidManifest.xml Verify
Android Studio mein check karein ki ye ID present hai:
`ca-app-pub-9066646910248492~3992571465`

### Step 2: Build Command
Terminal mein ye run karein:
1. `npm run build`
2. `npx cap sync android`
3. `node scripts/fix-android.js` (Ye auto-fix kar dega)

### Step 3: APK Generation
Android Studio kholen, `Build > Build Bundle(s) / APK(s) > Build APK(s)` pe click karein.

**Note:** Asli ads aane mein 24-48 hours lag sakte hain agar aapka AdMob account naya hai.
