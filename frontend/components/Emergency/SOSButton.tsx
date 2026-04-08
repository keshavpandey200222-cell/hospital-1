import React, { useState } from 'react';
import { useDemoData } from '../../context/DemoDataContext';

const SOSButton: React.FC = () => {
  const { triggerSOS, activeSOS } = useDemoData();
  const [isConfirming, setIsConfirming] = useState(false);

  if (activeSOS) return null; // Hide if already active

  const handleSOS = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-cancel confirmation after 5 seconds
      setTimeout(() => setIsConfirming(false), 5000);
    } else {
      triggerSOS();
      setIsConfirming(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-center gap-4">
      {isConfirming && (
        <div className="bg-white/10 backdrop-blur-md border border-rose-500/30 p-4 rounded-2xl animate-fade-in-up shadow-2xl">
          <p className="text-white font-bold text-sm mb-2 text-center">Tap again to confirm Emergency</p>
          <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full animate-progress-shrink"></div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleSOS}
        className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all active:scale-90 relative group ${
          isConfirming 
            ? 'bg-rose-600 animate-pulse scale-110' 
            : 'bg-rose-500 hover:bg-rose-600'
        }`}
      >
        <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-20 group-hover:opacity-40"></span>
        <span className="relative z-10">🚨</span>
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">SOS</span>
      </button>
    </div>
  );
};

export default SOSButton;
