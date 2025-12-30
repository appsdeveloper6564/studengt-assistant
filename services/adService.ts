
/**
 * Adsterra High-Conversion Ad Service
 */
export const AdService = {
  // Your provided Adsterra Direct Link (Smartlink)
  SMART_LINK: "https://www.effectivegatecpm.com/q8v0gdes9?key=2879c43bccd299b0327ef65449d90f71", 

  initialize: async () => {
    console.log("Scholar Hub: Adsterra Ecosystem Online.");
  },

  /**
   * Opens the Smartlink for earning points or unlocking features.
   * This generates maximum CPM for the publisher.
   */
  showSmartlink: () => {
    try {
      // We open in a new tab to avoid breaking the user's session
      window.open(AdService.SMART_LINK, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error("Ad block detected or popup blocked.");
      // Fallback: simple redirect if popup fails
      window.location.href = AdService.SMART_LINK;
    }
  }
};
