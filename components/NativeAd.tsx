import React, { useEffect } from 'react';

const NativeAd: React.FC = () => {
  useEffect(() => {
    const containerId = 'container-d455aae87c3654e56936461ee385ca0f';
    const container = document.getElementById(containerId);
    
    if (container) {
      // Clear existing content to prevent duplicates
      container.innerHTML = '';
      
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28355175.effectivegatecpm.com/d455aae87c3654e56936461ee385ca0f/invoke.js';
      
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full bg-white card-surface rounded-[2rem] overflow-hidden border shadow-sm min-h-[160px] p-2 flex items-center justify-center">
      <div id="container-d455aae87c3654e56936461ee385ca0f" className="w-full"></div>
    </div>
  );
};

export default NativeAd;