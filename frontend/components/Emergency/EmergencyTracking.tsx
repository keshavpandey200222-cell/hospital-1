import React from 'react';
import { useDemoData } from '../../context/DemoDataContext';

const EmergencyTracking: React.FC = () => {
  const { activeSOS, cancelSOS } = useDemoData();

  if (!activeSOS) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0%,transparent_70%)] animate-pulse"></div>
      
      <div className="max-w-2xl w-full glass-card rounded-[2.5rem] p-10 border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
              <span className="text-rose-500 font-black tracking-widest uppercase text-sm">Emergency Active</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tighter">Emergency Response</h2>
          </div>
          <button 
            onClick={cancelSOS}
            className="text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-xl border border-white/10 font-bold"
          >
            Cancel Alert
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">🚑</div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Status</p>
              <h3 className="text-2xl font-bold text-white mb-2">{activeSOS.status}</h3>
              <p className="text-slate-500 text-sm italic">Request triggered at {activeSOS.timestamp}</p>
            </div>

            <div className="p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20">
              <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-1">Nearby Hospital</p>
              <h3 className="text-xl font-bold text-white">{activeSOS.hospitalName || 'Identifying nearest...'}</h3>
              <div className="mt-4 flex items-center gap-2 text-rose-300/60 text-sm">
                <span>📍</span>
                Calculating fastest route...
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-primary-600/20 to-indigo-600/20 rounded-[2rem] border border-primary-500/30 relative flex flex-col justify-between">
            {activeSOS.ambulance ? (
              <>
                <div>
                  <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4">Assigned Ambulance</p>
                  <h4 className="text-3xl font-bold text-white mb-1">{activeSOS.ambulance.driverName}</h4>
                  <p className="text-slate-400 font-medium">{activeSOS.ambulance.driverPhone}</p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 text-xs font-bold mb-1 uppercase">Distance</p>
                      <p className="text-2xl font-black text-white">{activeSOS.ambulance.distance} km</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs font-bold mb-1 uppercase tracking-widest">ETA</p>
                      <p className="text-4xl font-black text-white">{activeSOS.ambulance.eta} MIN</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Dispatching Nearest Ambulance...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <button 
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>📞</span> Call Hospital Desk
          </button>
          <button 
            className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 animate-pulse"
          >
            <span>🚨</span> Share My Medical History
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTracking;
