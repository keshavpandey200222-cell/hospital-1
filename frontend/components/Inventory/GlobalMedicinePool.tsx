import React, { useState } from 'react';
import { useDemoData, InventoryItem } from '../../context/DemoDataContext';

const GlobalMedicinePool: React.FC = () => {
  const { inventory, requestTransfer } = useDemoData();
  const [requestModal, setRequestModal] = useState<InventoryItem | null>(null);
  const [requestQuantity, setRequestQuantity] = useState<number>(1);

  // Filter for shared/expiring medicines from OTHER hospitals
  const sharedMeds = inventory.filter(i => i.status === 'EXPIRING');

  const handleRequest = () => {
    if (requestModal) {
      requestTransfer(requestModal.id, requestQuantity);
      setRequestModal(null);
      setRequestQuantity(1);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border-primary-500/10 bg-gradient-to-br from-primary-500/5 to-transparent">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🌍 Global Medicine Pool
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Browse expiring medicines across the network available for immediate transfer.</p>
        </div>
        <div className="text-right">
           <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Active Pool</span>
           <p className="text-2xl font-bold text-white">{sharedMeds.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedMeds.map((med) => (
          <div key={med.id} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-all duration-300 transform hover:-translate-y-1">
             <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center text-xl shadow-inner group-hover:bg-primary-500/30 transition-colors">
                  💊
               </div>
               <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-full font-bold">
                  Expiring in 21 days
               </span>
             </div>
             <div>
                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-primary-400 transition-colors">{med.medicineName}</h3>
                <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">{med.hospitalName}</p>
                
                <div className="flex justify-between text-sm mb-4">
                   <div>
                      <span className="block text-slate-500 text-[10px] uppercase font-bold">Available</span>
                      <span className="text-white font-mono">{med.quantity} units</span>
                   </div>
                   <div className="text-right">
                      <span className="block text-slate-500 text-[10px] uppercase font-bold text-right">Expiry Date</span>
                      <span className="text-slate-300 font-mono text-xs">{med.expiryDate}</span>
                   </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <button 
                    onClick={() => setRequestModal(med)}
                    className="w-full bg-primary-600/20 hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-500/30 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn"
                   >
                     <svg className="w-4 h-4 transform group-hover/btn:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                     Request Transfer
                   </button>
                </div>
             </div>
          </div>
        ))}

        {sharedMeds.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
             <div className="text-4xl mb-4 grayscale opacity-50">🏥</div>
             <p className="text-slate-400 text-sm">No medicines are currently available for sharing in the network.</p>
          </div>
        )}
      </div>

      {/* Transfer Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
           <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-fade-in-up border-primary-500/20">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-white">Request Transfer</h3>
                    <p className="text-slate-400 text-sm">Transferring from: {requestModal.hospitalName}</p>
                 </div>
                 <button onClick={() => setRequestModal(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
                 <p className="text-xs text-slate-500 mb-1">Medicine Name</p>
                 <p className="text-white font-bold">{requestModal.medicineName}</p>
                 <p className="text-xs text-slate-400 mt-1">Available Quantity: {requestModal.quantity}</p>
              </div>

              <div className="mb-6">
                 <label className="text-sm text-slate-300 block mb-2">Quantity to Request</label>
                 <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      min="1" 
                      max={requestModal.quantity} 
                      value={requestQuantity} 
                      onChange={(e) => setRequestQuantity(parseInt(e.target.value))}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary-500 transition-colors" 
                    />
                    <div className="flex gap-2">
                       <button onClick={() => setRequestQuantity(q => q > 1 ? q - 1 : 1)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 font-bold">-</button>
                       <button onClick={() => setRequestQuantity(q => q < requestModal.quantity ? q + 1 : q)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 font-bold">+</button>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setRequestModal(null)} className="flex-1 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors">Cancel</button>
                 <button onClick={handleRequest} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/20 active:scale-95 transition-all">Submit Request</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GlobalMedicinePool;
