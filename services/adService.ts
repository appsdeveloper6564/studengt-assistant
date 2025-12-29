/**
 * Adsterra Direct Link Service
 */
export const AdService = {
  // New Reward Direct Link
  DIRECT_LINK: "https://www.effectivegatecpm.com/q8v0gdes9?key=2879c43bccd299b0327ef65449d90f71", 

  initialize: async () => {
    console.log("Adsterra initialized.");
  },

  loadAd: async (): Promise<boolean> => {
    return navigator.onLine;
  },

  /**
   * Opens the ad link.
   */
  triggerDirectLink: () => {
    window.open(AdService.DIRECT_LINK, '_blank');
  }
};