
import fs from 'fs';
import path from 'path';

const manifestPath = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const appId = "ca-app-pub-9066646910248492~3992571465"; // Your Real App ID

async function fixManifest() {
    console.log('🛠️ Configuring Android Native Files with Real AdMob ID...');

    if (!fs.existsSync(manifestPath)) {
        console.error('❌ Error: Android project not found. Run "npx cap add android" first.');
        return;
    }

    let content = fs.readFileSync(manifestPath, 'utf8');

    // 1. Inject Real AdMob ID into Manifest
    if (!content.includes('com.google.android.gms.ads.APPLICATION_ID')) {
        const metaData = `
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="${appId}"/>`;
        
        content = content.replace('</application>', `${metaData}\n    </application>`);
        fs.writeFileSync(manifestPath, content, 'utf8');
        console.log('✅ Real AdMob ID injected into AndroidManifest.xml');
    } else {
        // Update existing ID if it's different (e.g. if it was a test ID)
        const regex = /android:name="com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value="[^"]*"/;
        content = content.replace(regex, `android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${appId}"`);
        fs.writeFileSync(manifestPath, content, 'utf8');
        console.log('✅ AdMob ID updated to latest real ID.');
    }

    // 2. Fix Hardware Acceleration
    if (!content.includes('android:hardwareAccelerated="true"')) {
        content = content.replace('<application', '<application android:hardwareAccelerated="true"');
        fs.writeFileSync(manifestPath, content, 'utf8');
        console.log('✅ Hardware Acceleration enabled.');
    }

    console.log('🚀 Native configuration complete! Now build your APK.');
}

fixManifest();
