import { useState } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';
import Link from 'next/link';

export default function DoctorVerification() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    qualification: '',
    docType: 'LICENSE',
    filePath: 'uploaded_doc_001.pdf', // Mocked path
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to /api/verify/submit
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <DashboardLayout role="doctor" title="Professional Verification">
      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-12 text-center">
           <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-4xl mb-6 mx-auto border border-emerald-500/20">🛡️</div>
           <h1 className="text-4xl font-black text-white mb-4 tracking-tight italic">Professional Verification</h1>
           <p className="text-slate-400 text-lg">Verify your identity and medical qualifications to join our elite medical network.</p>
        </div>

        {!isSubmitted ? (
          <div className="glass-card rounded-[3rem] p-10 md:p-16 border-white/5 relative overflow-hidden">
             {/* Progress Bar */}
             <div className="flex items-center gap-4 mb-12">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full bg-emerald-500 transition-all duration-700 ${step >= s ? 'w-full' : 'w-0'}`}></div>
                  </div>
                ))}
             </div>

             <form onSubmit={handleSubmit} className="space-y-10">
                {step === 1 && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                         <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-black italic">01</span>
                         Basic Qualifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical Qualification</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. MBBS, MD (Cardiology)" 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all"
                              value={formData.qualification}
                              onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical Council Reg. No</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. MCI-123456" 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500 transition-all"
                              value={formData.licenseNumber}
                              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                            />
                         </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl tracking-tighter italic shadow-2xl shadow-emerald-600/20 transition-all">
                       Proceed to Documentation →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-fade-in">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                         <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-black italic">02</span>
                         Document Upload
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {['LICENSE', 'DEGREE', 'ID_PROOF'].map((type) => (
                           <button 
                             key={type}
                             type="button"
                             onClick={() => setFormData({...formData, docType: type})}
                             className={`p-6 rounded-3xl border transition-all text-left group ${formData.docType === type ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                           >
                             <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${formData.docType === type ? 'text-black/60' : 'text-emerald-400'}`}>Type</p>
                             <p className="font-bold">{type.replace('_', ' ')}</p>
                           </button>
                         ))}
                      </div>
                      
                      <div className="mt-8 p-12 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                         <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📂</div>
                         <div>
                            <p className="text-white font-bold text-lg">Click to select {formData.docType.toLowerCase()}</p>
                            <p className="text-slate-500 text-sm italic">PDF, JPG, or PNG (Max 5MB)</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/10 text-slate-300 py-5 rounded-2xl font-black italic hover:bg-white/5 transition-all">Back</button>
                       <button type="button" onClick={() => setStep(3)} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl tracking-tighter italic shadow-2xl shadow-emerald-600/20 transition-all">Review Request</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl space-y-6">
                       <h3 className="text-xl font-bold text-white mb-4">Summary Review</h3>
                       <div className="grid grid-cols-2 gap-8 text-sm">
                          <div><p className="text-slate-500 font-bold uppercase tracking-widest mb-1">Qualification</p><p className="text-white font-bold">{formData.qualification}</p></div>
                          <div><p className="text-slate-500 font-bold uppercase tracking-widest mb-1">License No</p><p className="text-white font-bold">{formData.licenseNumber}</p></div>
                          <div><p className="text-slate-500 font-bold uppercase tracking-widest mb-1">Document Type</p><p className="text-emerald-400 font-bold">{formData.docType}</p></div>
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setStep(2)} className="flex-1 border border-white/10 text-slate-300 py-5 rounded-2xl font-black italic hover:bg-white/5 transition-all">Change</button>
                       <button type="submit" disabled={isSubmitting} className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xl tracking-tighter italic shadow-2xl shadow-emerald-600/20 transition-all disabled:opacity-50">
                          {isSubmitting ? 'Verifying Integrity...' : 'Submit Credentials ✓'}
                       </button>
                    </div>
                  </div>
                )}
             </form>
          </div>
        ) : (
          <div className="glass-card rounded-[3rem] p-20 border-white/5 text-center space-y-8 animate-fade-in-up">
             <div className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-5xl mx-auto shadow-[0_0_50px_rgba(16,185,129,0.2)]">🕒</div>
             <div>
                <h2 className="text-3xl font-black text-white italic tracking-tight mb-4">Verification In Transit</h2>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                   Our administrative team is reviewing your clinical credentials. You will receive a notification once the **Verified Badge (✔)** is active on your profile.
                </p>
             </div>
             <Link href="/dashboard/doctor" className="inline-flex py-4 px-12 bg-white text-black rounded-2xl font-black italic hover:bg-emerald-400 transition-all shadow-xl shadow-white/5">
                Back to Dashboard
             </Link>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
