import React, { useState } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import MedicineInventory from '../../../components/Inventory/MedicineInventory';
import GlobalMedicinePool from '../../../components/Inventory/GlobalMedicinePool';
import TransferManagement from '../../../components/Inventory/TransferManagement';

const HospitalInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'global' | 'transfers'>('inventory');

  const tabs = [
    { id: 'inventory', name: 'Local Inventory', icon: '📦' },
    { id: 'global', name: 'Global Pool', icon: '🌍' },
    { id: 'transfers', name: 'Transfer Requests', icon: '🔄' },
  ];

  return (
    <DashboardLayout role="admin" title="Hospital Central Dashboard">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
           <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">💊 Medicine Sharing Network</h1>
              <p className="text-slate-400">Collaborative inventory management and automatic medicine exchange.</p>
           </div>
           
           <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
           </div>
        </div>

        {/* Dynamic Content Based on Tabs */}
        <div className="animate-fade-in-up">
          {activeTab === 'inventory' && (
            <div className="space-y-8">
               <MedicineInventory />
               
               {/* Quick Stats Banner */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                     <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">Stock Health</p>
                     <p className="text-2xl font-bold text-white">92% Stable</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                     <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">Expiring Soon</p>
                     <p className="text-2xl font-bold text-white">14 Batches</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-transparent border border-primary-500/20">
                     <p className="text-xs text-primary-400 font-bold uppercase tracking-widest mb-1">Network Savings</p>
                     <p className="text-2xl font-bold text-white">$12,450.00</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'global' && <GlobalMedicinePool />}

          {activeTab === 'transfers' && <TransferManagement />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalInventoryPage;
