
import React, { useEffect, useRef } from 'react';

const NativeAd: React.FC = () => {
  const containerId = 'container-d455aae87c3654e56936461ee385ca0f';
  const adInjected = useRef(false);

  useEffect(() => {
    // Adsterra Native Ads work by injecting a script that targets a specific ID.
    // In React, we must ensure we don't inject multiple scripts.
    const container = document.getElementById(containerId);
    if (container && !adInjected.current) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl28355175.effectivegatecpm.com/d455aae87c3654e56936461ee385ca0f/invoke.js';
      
      container.appendChild(script);
      adInjected.current = true;
    }

    return () => {
      // Cleanup for SPA navigation
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
      adInjected.current = false;
    };
  }, []);

  return (
    <div className="w-full bg-[#0f172a] rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-xl min-h-[180px] p-6 flex flex-col items-center justify-center my-6">
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 opacity-60">Sponsored Resource</div>
      <div id={containerId} className="w-full"></div>
    </div>
  );
};

export default NativeAd;
