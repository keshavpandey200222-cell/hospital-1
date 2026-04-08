import React from 'react';
import { useDemoData, InventoryItem } from '../../context/DemoDataContext';

const MedicineInventory: React.FC = () => {
  const { inventory, addInventoryItem } = useDemoData();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newBatch, setNewBatch] = React.useState({
    medicineName: '',
    quantity: 0,
    expiryDate: '',
  });

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'EXPIRING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'TRANSFERRED': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'SHARED': return 'bg-primary-500/10 text-primary-400 border-primary-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      ...newBatch,
      status: 'AVAILABLE',
      hospitalName: 'Current Hospital'
    });
    setShowAddModal(false);
    setNewBatch({ medicineName: '', quantity: 0, expiryDate: '' });
  };

  return (
    <div className="glass-card rounded-2xl p-6 border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">📦 Hospital Inventory</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and track your local medicine stock and expiry dates.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Add New Batch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-4 font-semibold">Medicine Name</th>
              <th className="px-4 py-4 font-semibold">Quantity</th>
              <th className="px-4 py-4 font-semibold">Expiry Date</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inventory.map((item) => (
              <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                      💊
                    </div>
                    <span className="text-white font-medium">{item.medicineName}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-slate-300 font-mono">{item.quantity} units</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-300 text-sm">{item.expiryDate}</span>
                    {item.status === 'EXPIRING' && (
                      <span className="text-[10px] text-amber-400 font-bold animate-pulse">EXPIRING SOON</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit Batch">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    {item.status === 'EXPIRING' && (
                      <button className="p-2 hover:bg-primary-500/20 rounded-lg text-primary-400 transition-colors" title="Share to Network">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          AUTO-SHARING ENABLED: SYSTEM WILL LIST MEDICINES WITHIN 14 DAYS OF EXPIRY
        </p>
        <div className="flex gap-2">
           <button className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-all">Previous</button>
           <button className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-white/5 rounded border border-white/10 hover:border-white/20 transition-all">Next</button>
        </div>
      </div>

      {/* Add New Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-fade-in-up border-primary-500/20 shadow-2xl shadow-primary-500/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">📦 Add New Medicine Batch</h3>
                <p className="text-slate-400 text-sm">Register a new stock entry for your hospital.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors text-xl">✕</button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-5">
              <div>
                <label className="text-sm text-slate-300 block mb-2 font-medium">Medicine Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Paracetamol, Amoxicillin"
                  value={newBatch.medicineName}
                  onChange={(e) => setNewBatch({ ...newBatch, medicineName: e.target.value })}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-slate-600" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2 font-medium">Quantity (Units)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="0"
                    value={newBatch.quantity || ''}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: parseInt(e.target.value) })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all placeholder:text-slate-600 font-mono" 
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2 font-medium">Expiry Date</label>
                  <input 
                    type="date" 
                    required
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all color-scheme-dark" 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/5 hover:text-white transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineInventory;
