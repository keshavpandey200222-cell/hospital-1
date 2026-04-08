import React from 'react';
import { useDemoData, MedicationLog } from '../../context/DemoDataContext';
import { useTheme } from '@/context/ThemeContext';

const MedicationTracker: React.FC = () => {
  const { medicationLogs, markLogAsTaken } = useDemoData();
  const { theme } = useTheme();

  const getStatusColor = (status: MedicationLog['status']) => {
    switch (status) {
      case 'TAKEN': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400';
      case 'MISSED': return 'text-red-500 bg-red-500/10 border-red-500/20 dark:text-red-400';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:text-amber-400';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 h-full border-primary-500/10 hover:border-primary-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold theme-text-primary flex items-center gap-2">
            💊 Daily Dose Alert
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
          </h2>
          <p className="theme-text-muted text-sm mt-1 font-medium">Smart medication reminder system</p>
        </div>
        <div className="bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
          <span className="text-primary-500 dark:text-primary-400 text-xs font-bold uppercase tracking-wider">
            {medicationLogs.filter(l => l.status === 'TAKEN').length}/{medicationLogs.length} Completed
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {medicationLogs.map((log) => (
          <div 
            key={log.id} 
            className={`group p-4 rounded-xl border transition-all duration-300 ${
              log.status === 'TAKEN' 
                ? 'dark:bg-slate-800/30 bg-slate-100 border-transparent opacity-60' 
                : 'dark:bg-white/5 bg-white border dark:border-white/10 border-slate-200 hover:dark:bg-white/[0.08] hover:bg-slate-50 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  log.status === 'TAKEN' ? 'dark:bg-slate-700/50 bg-slate-200 grayscale' : 'bg-primary-500/20 border border-primary-500/20 text-primary-500 dark:text-primary-400'
                }`}>
                  {log.status === 'TAKEN' ? '✔' : '💊'}
                </div>
                <div>
                  <h3 className={`font-bold text-base transition-colors ${log.status === 'TAKEN' ? 'theme-text-muted line-through' : 'theme-text-primary'}`}>
                    {log.medicationName} 
                  </h3>
                  <div className="flex items-center gap-3 mt-1 font-medium">
                    <span className="text-sm theme-text-muted">{log.dosage}</span>
                    <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`}></span>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400/80">{log.scheduledTime}</span>
                  </div>
                  {log.instructions && (
                    <p className="text-xs theme-text-muted mt-2 italic flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {log.instructions}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border font-black uppercase tracking-wider ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
                
                {log.status === 'PENDING' && (
                  <button 
                    onClick={() => markLogAsTaken(log.id)}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1"
                  >
                    Take Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {medicationLogs.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="theme-text-muted text-sm font-bold uppercase tracking-wider">No scheduled doses for today!</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t dark:border-white/5 border-slate-100 flex items-center justify-between text-xs font-bold">
        <span className="theme-text-muted opacity-60">Smart Scheduler Active</span>
        <button className="text-primary-600 dark:text-primary-400 hover:underline">Full History →</button>
      </div>
    </div>
  );
};

export default MedicationTracker;
