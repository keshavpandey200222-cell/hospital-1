import { useState } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';

export default function SettingsPage() {
  const [hospitalName, setHospitalName] = useState('Nexus Health Medical Center');
  const [maxCapacity, setMaxCapacity] = useState('500');
  const [erThreshold, setERThreshold] = useState('80');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout role="admin" title="System Settings">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure global hospital parameters and system preferences.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* General */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🏥 General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Hospital Name</label>
              <input type="text" value={hospitalName} onChange={e => setHospitalName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Max Bed Capacity</label>
                <input type="number" value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">ER Alert Threshold (%)</label>
                <input type="number" value={erThreshold} onChange={e => setERThreshold(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🔒 Security & Access</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400 mt-1">Require 2FA for all admin accounts</p>
              </div>
              <div className="w-12 h-7 bg-emerald-500 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 shadow-md"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-white font-medium">Session Timeout</p>
                <p className="text-xs text-slate-400 mt-1">Auto logout after inactivity</p>
              </div>
              <span className="text-violet-400 font-semibold text-sm">30 minutes</span>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🛠 Maintenance</h2>
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5" style={{ background: maintenanceMode ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)' }}>
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-xs text-slate-400 mt-1">Displays a maintenance page to all users</p>
            </div>
            <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-7 rounded-full relative cursor-pointer transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-slate-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${maintenanceMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} className={`w-full py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${saved ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'}`}>
          {saved ? '✓ Settings Saved!' : 'Save Changes'}
        </button>
      </div>
    </DashboardLayout>
  )
}