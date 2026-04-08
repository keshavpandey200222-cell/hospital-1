import { useState } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';

interface VerificationRequest {
  id: string;
  doctorName: string;
  specialty: string;
  licenseNumber: string;
  qualification: string;
  docType: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

const MOCK_REQUESTS: VerificationRequest[] = [
  { id: 'v1', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', licenseNumber: 'MCI-88291', qualification: 'MD, MBBS', docType: 'LICENSE', status: 'PENDING', submittedAt: '2 hours ago' },
  { id: 'v2', doctorName: 'Dr. Alan Turing', specialty: 'Neurology', licenseNumber: 'MCI-11022', qualification: 'PhD, MD', docType: 'DEGREE', status: 'PENDING', submittedAt: '5 hours ago' },
  { id: 'v3', doctorName: 'Dr. Jane Goodall', specialty: 'Pediatrics', licenseNumber: 'MCI-77331', qualification: 'MD', docType: 'ID_PROOF', status: 'PENDING', submittedAt: '1 day ago' },
];

export default function AdminVerifications() {
  const [requests, setRequests] = useState<VerificationRequest[]>(MOCK_REQUESTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
     setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
     setSelectedId(null);
     setAdminNotes('');
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');

  return (
    <DashboardLayout role="admin" title="Verification Queue">
      <main className="py-6 animate-fade-in-up">
        <div className="mb-10">
           <h1 className="text-3xl font-bold text-white mb-2">Verification Queue</h1>
           <p className="text-slate-400">Review and validate clinical credentials for new medical professionals.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {pendingRequests.length === 0 ? (
             <div className="glass-card rounded-2xl p-20 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
                <p className="text-slate-400">All pending medical credentials have been reviewed.</p>
             </div>
           ) : (
             pendingRequests.map((req) => (
               <div key={req.id} className="glass-card rounded-[2.5rem] p-8 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-500/20 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl translate-x-16 -translate-y-16 group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto">
                     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">🎓</div>
                     <div>
                        <h3 className="text-xl font-bold text-white mb-1">{req.doctorName}</h3>
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">{req.specialty} • {req.qualification}</p>
                     </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">License Number</p>
                        <p className="text-white font-mono text-sm">{req.licenseNumber}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Doc Type</p>
                        <p className="text-white font-bold text-sm">{req.docType}</p>
                     </div>
                     <div className="hidden md:block">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Submitted</p>
                        <p className="text-slate-400 text-sm">{req.submittedAt}</p>
                     </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto shrink-0 relative z-10">
                     <button 
                       onClick={() => setSelectedId(req.id)}
                       className="flex-1 md:flex-none border border-white/10 text-slate-300 px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/5 transition-colors"
                     >
                       View Document
                     </button>
                     <button 
                       onClick={() => handleAction(req.id, 'APPROVED')}
                       className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
                     >
                       Approve
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Action Modal (Simplified) */}
        {selectedId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setSelectedId(null)}>
             <div className="glass-card rounded-[3rem] p-10 max-w-4xl w-full border-white/10 animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h2 className="text-3xl font-black text-white italic tracking-tight">Technical Review</h2>
                      <p className="text-slate-400">Verifying documents for {requests.find(r => r.id === selectedId)?.doctorName}</p>
                   </div>
                   <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="aspect-[3/4] bg-slate-900 rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                      <div className="text-center p-10">
                         <div className="text-5xl mb-6">📄</div>
                         <p className="text-white font-bold text-lg mb-2">uploaded_doc_001.pdf</p>
                         <p className="text-slate-500 text-sm italic mb-6">Medical Registration Certificate</p>
                         <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-xs font-bold transition-colors">
                            Download for Full View
                         </button>
                      </div>
                   </div>

                   <div className="space-y-8 flex flex-col justify-between">
                      <div className="space-y-6">
                         <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">Extracted Metadata</h4>
                            <div className="space-y-2 text-sm">
                               <div className="flex justify-between"><span className="text-slate-500">Registry</span><span className="text-white font-bold">National Medical Council</span></div>
                               <div className="flex justify-between"><span className="text-slate-500">Issuance Year</span><span className="text-white font-bold">2018</span></div>
                               <div className="flex justify-between"><span className="text-slate-500">Seal Status</span><span className="text-emerald-400 font-bold italic">Authenticated ✓</span></div>
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Internal Notes</label>
                            <textarea 
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add review notes for the medical board..." 
                              className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-emerald-500 h-32 transition-all resize-none"
                            ></textarea>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button 
                           onClick={() => handleAction(selectedId, 'REJECTED')}
                           className="flex-1 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 py-4 rounded-2xl font-black italic transition-all"
                         >
                           REJECT
                         </button>
                         <button 
                           onClick={() => handleAction(selectedId, 'APPROVED')}
                           className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black italic text-xl shadow-2xl shadow-emerald-500/30 transition-all"
                         >
                           APPROVE VERIFICATION
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
