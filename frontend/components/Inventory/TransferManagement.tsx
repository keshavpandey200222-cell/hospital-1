import React from 'react';
import { useDemoData, TransferRecord } from '../../context/DemoDataContext';

const TransferManagement: React.FC = () => {
  const { transfers, approveTransfer } = useDemoData();

  const getStatusColor = (status: TransferRecord['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const incomingTransfers = transfers.filter(t => t.fromHospital === 'Metro General');
  const outgoingTransfers = transfers.filter(t => t.toHospital === 'Metro General');

  return (
    <div className="space-y-8">
      {/* INCOMING REQUESTS (From other hospitals asking for OUR medicine) */}
      <div className="glass-card rounded-2xl p-6 border-white/5">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
           📥 Incoming Requests
           {incomingTransfers.filter(t => t.status === 'PENDING').length > 0 && (
             <span className="w-5 h-5 bg-amber-500 rounded-full text-black text-[10px] flex items-center justify-center font-bold animate-bounce">
                {incomingTransfers.filter(t => t.status === 'PENDING').length}
             </span>
           )}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {incomingTransfers.map(tr => (
             <div key={tr.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="font-bold text-white">{tr.medicineName}</h3>
                      <p className="text-xs text-slate-400">Requested by: {tr.toHospital}</p>
                   </div>
                   <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getStatusColor(tr.status)}`}>
                      {tr.status}
                   </span>
                </div>
                
                <div className="flex justify-between items-center text-xs mb-4">
                   <span className="text-slate-500">Requested Quantity: <span className="text-white font-mono">{tr.quantity} units</span></span>
                </div>

                {tr.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2">
                     <button 
                      onClick={() => approveTransfer(tr.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-all"
                     >
                       Approve
                     </button>
                     <button className="flex-1 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs font-bold py-2 rounded-lg transition-all border border-white/5">
                       Reject
                     </button>
                  </div>
                )}
             </div>
           ))}

           {incomingTransfers.length === 0 && (
             <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">
                No incoming medicine requests at this time.
             </div>
           )}
        </div>
      </div>

      {/* OUTGOING REQUESTS (We asked for medicine FROM other hospitals) */}
      <div className="glass-card rounded-2xl p-6 border-white/5 bg-gradient-to-br from-primary-500/5 to-transparent">
        <h2 className="text-xl font-bold text-white mb-6">📤 Outgoing Requests</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {outgoingTransfers.map(tr => (
             <div key={tr.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h3 className="font-bold text-white">{tr.medicineName}</h3>
                      <p className="text-xs text-slate-400">Requested from: {tr.fromHospital}</p>
                   </div>
                   <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getStatusColor(tr.status)}`}>
                      {tr.status}
                   </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-500 uppercase tracking-widest font-bold text-[10px]">Track Status...</span>
                   {tr.status === 'APPROVED' ? (
                     <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Ready for Pickup
                     </div>
                   ) : (
                     <span className="text-slate-400">Processing by Branch</span>
                   )}
                </div>
             </div>
           ))}

           {outgoingTransfers.length === 0 && (
             <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">
                No outgoing requests. Explore the Global Pool to find expiring medicine.
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TransferManagement;
