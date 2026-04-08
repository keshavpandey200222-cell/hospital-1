import { useState, useEffect } from 'react';

interface IncomingCallOverlayProps {
  callerName: string;
  type: 'VOICE' | 'VIDEO';
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallOverlay({ callerName, type, onAccept, onReject }: IncomingCallOverlayProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Ringing animation effect
    const interval = setInterval(() => {
      setRotation(prev => (prev === 5 ? -5 : 5));
    }, 150);
    
    // Play sound (simulated or using a small base64/URL)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1359/1359-preview.mp3'); // Example ringtone
    audio.loop = true;
    audio.play().catch(e => console.log('Audio autoplay blocked'));

    return () => {
      clearInterval(interval);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-8 glass-card border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(37,99,235,0.2)] text-center">
        {/* Animated Icon */}
        <div 
          className="w-24 h-24 rounded-full bg-primary-500/10 border-2 border-primary-500/20 flex items-center justify-center mx-auto mb-8 relative"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-primary-500/40 animate-ping" />
          {type === 'VIDEO' ? (
            <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          ) : (
            <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          )}
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">Incoming {type} Call</h2>
        <p className="text-slate-400 text-lg mb-10">{callerName} is calling you...</p>

        <div className="flex gap-4">
          <button 
            onClick={onReject}
            className="flex-1 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Decline
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
