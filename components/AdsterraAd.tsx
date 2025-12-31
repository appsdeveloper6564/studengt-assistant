
import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  id: string;
  format: 'banner' | 'rectangle' | 'skyscraper';
}

const AD_CONFIGS = {
  banner: { width: 468, height: 60 },
  rectangle: { width: 300, height: 250 },
  skyscraper: { width: 160, height: 300 }
};

const AdsterraAd: React.FC<AdsterraAdProps> = ({ id, format }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = AD_CONFIGS[format];

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous ad to prevent duplication
    containerRef.current.innerHTML = '';

    const scriptWrapper = document.createElement('div');
    scriptWrapper.id = `ad-script-${id}`;
    
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${id}/invoke.js`;
    invokeScript.async = true;

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [id, height, width]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 shadow-sm overflow-hidden my-6 mx-auto transition-opacity duration-500 min-h-[100px]">
      <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 opacity-50">Scholarly Sponsor</div>
      <div 
        ref={containerRef} 
        style={{ width: `${width}px`, height: `${height}px`, minWidth: '300px' }} 
        className="flex items-center justify-center bg-slate-950/50 rounded-xl"
      />
    </div>
  );
};

export default AdsterraAd;
