
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
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      
      // Adsterra requires atOptions to be set before invoke.js runs
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `
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
      
      containerRef.current.appendChild(confScript);
      containerRef.current.appendChild(invokeScript);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [id, height, width]);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 bg-[#0f172a] rounded-3xl border border-slate-800 shadow-sm overflow-hidden my-4 mx-auto">
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Academic Sponsor</div>
      <div 
        ref={containerRef} 
        style={{ width: `${width}px`, height: `${height}px` }} 
        className="overflow-hidden bg-slate-900/50 flex items-center justify-center rounded-lg"
      />
    </div>
  );
};

export default AdsterraAd;
