
import { AdMob, RewardAdOptions } from '@capacitor-community/admob';

// Real Google Test ID for Rewarded Ads
const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';

export const AdService = {
  initialize: async () => {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [],
        initializeForTesting: true,
      });
      console.log("AdMob Ready");
    } catch (e) {
      console.error("AdMob Init Error", e);
    }
  },

  loadAd: async (): Promise<boolean> => {
    try {
      const options: RewardAdOptions = {
        adId: TEST_REWARDED_ID,
        isTesting: true
      };
      await AdMob.prepareRewardVideoAd(options);
      return true;
    } catch (e) {
      console.error("AdMob Load Error", e);
      return false;
    }
  },

  showRewardedVideo: async (onReward: () => void, onError: () => void) => {
    try {
      const reward = await AdMob.showRewardVideoAd();
      if (reward) {
        onReward();
      }
    } catch (e) {
      console.error("AdMob Show Error", e);
      onError();
    }
  }
};
