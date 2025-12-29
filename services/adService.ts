/**
 * Universal Ad Service
 * This works in both browser (Webview) and Native App.
 */
export const AdService = {
  initialize: async () => {
    console.log("Ad Service initialized in Web Mode");
    // If you are using a cloud converter that supports AdMob, 
    // you would paste their specific script here.
  },

  loadAd: async (): Promise<boolean> => {
    // Simulating a load delay for better UX
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1500);
    });
  },

  showRewardedVideo: async (onReward: () => void, onError: () => void) => {
    /**
     * Since you are using a Cloud Converter (No local Node/Studio),
     * we use a "Web Reward" logic. This ensures your app works 
     * even without native Capacitor plugins.
     */
    const isCapacitor = (window as any).Capacitor !== undefined;

    if (isCapacitor) {
      // If the cloud converter supports Capacitor, try to use it
      try {
        const reward = await (window as any).Capacitor.Plugins.AdMob.showRewardVideoAd();
        if (reward) onReward();
      } catch (e) {
        onError();
      }
    } else {
      // FALLBACK: If converted via simple Web-to-APK tool
      // This will trigger the built-in video simulation in App.tsx
      onError(); 
    }
  }
};