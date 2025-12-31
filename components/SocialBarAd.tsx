
import React, { useEffect } from 'react';

const SocialBarAd: React.FC = () => {
  useEffect(() => {
    // Social Bar script needs to be injected into the body to float properly
    const scriptId = 'adsterra-social-bar';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = '//pl28355175.effectivegatecpm.com/f0/a1/3e/f0a13ef0a13ef0a13ef0a13ef0.js';
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      // We usually keep social bar active across the site
    };
  }, []);

  return null; // This component doesn't render anything, just injects the script
};

export default SocialBarAd;
