import { useState } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';

export default function PatientsPage() {
  const { appointments, testResults, prescriptions } = useDemoData();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Unique patients from appointments
  const uniquePatients = Array.from(
    new Map(appointments.filter(a => a.patientName).map(a => [a.patientId, { name: a.patientName!, id: a.patientId! }])).values()
  );

  const patientAppts = selectedPatient ? appointments.filter(a => a.patientId === selectedPatient) : [];

  return (
    <DashboardLayout role="doctor" title="Patient Directory">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Patient Directory</h1>
        <p className="text-slate-400">View patient histories, test results, and appointment records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <div className="glass-card rounded-2xl p-4 lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Patients ({uniquePatients.length})</h2>
          <div className="space-y-2">
            {uniquePatients.map(patient => (
              <button key={patient.id} onClick={() => setSelectedPatient(patient.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedPatient === patient.id ? 'bg-emerald-500/20 border border-emerald-500/20' : 'hover:bg-white/5'}`}>
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}&backgroundColor=transparent`} alt="" className="w-full h-full" />
                </div>
                <div>
                  <p className={`font-semibold ${selectedPatient === patient.id ? 'text-emerald-400' : 'text-white'}`}>{patient.name}</p>
                  <p className="text-xs text-slate-500">ID: {patient.id}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* Appointment History */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📅 Appointment History</h3>
                <div className="space-y-3">
                  {patientAppts.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white font-medium">{a.specialty}</p>
                        <p className="text-xs text-slate-400">{a.type} • {a.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">{a.date}</p>
                        <p className="text-xs text-slate-400">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Results */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">🔬 Test Results</h3>
                <div className="space-y-3">
                  {testResults.map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white font-medium">{t.testName}</p>
                        <p className="text-xs text-slate-400 mt-1">{t.summary}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-semibold shrink-0 ml-4 ${t.status === 'normal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Prescriptions */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">💊 Active Prescriptions</h3>
                  <button className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95">
                    + Prescribe New
                  </button>
                </div>
                <div className="space-y-3">
                  {prescriptions.map(rx => (
                    <div key={rx.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white font-medium">{rx.name} <span className="text-slate-400 text-sm">({rx.dosage})</span></p>
                        <p className="text-xs text-slate-400">{rx.frequency}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${rx.refillsLeft > 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{rx.refillsLeft} refills</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication Reminder System (New) */}
              <div className="glass-card rounded-2xl p-6 border-primary-500/10 bg-gradient-to-br from-primary-500/5 to-transparent">
                 <h3 className="text-lg font-bold text-white mb-2">🔔 Smart Reminder System</h3>
                 <p className="text-slate-400 text-sm mb-4">Set up automated daily dose alerts for this patient.</p>
                 <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input type="text" placeholder="Medicine Name (e.g. Aspirin)" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary-500" />
                       <input type="text" placeholder="Dosage (e.g. 50mg)" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-primary-500" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                       <span className="text-xs text-slate-500 w-full mb-1">Schedule (Select Times):</span>
                       {['08:00 AM', '02:00 PM', '09:00 PM'].map(t => (
                         <label key={t} className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg cursor-pointer hover:border-primary-400 transition-colors">
                            <input type="checkbox" className="accent-primary-500" />
                            <span className="text-xs text-slate-300">{t}</span>
                         </label>
                       ))}
                    </div>
                    <button className="w-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-primary-500/20">
                       Save & Activate Smart Reminders
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
              <p className="text-lg mb-2">Select a patient from the list</p>
              <p className="text-sm">Click on a patient to view their detailed medical history.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}