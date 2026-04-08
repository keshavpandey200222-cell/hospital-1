import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import { useDemoData } from '../../../context/DemoDataContext'

const VideoCallModal = dynamic(() => import('../../../components/VideoCall/VideoCallModal'), { ssr: false })

export default function DoctorDashboard() {
  const { currentUser, appointments, cancelAppointment } = useDemoData()
  const [joiningCall, setJoiningCall] = useState<string | null>(null)
  const [queueActive, setQueueActive] = useState(false)
  const [admittedPatients, setAdmittedPatients] = useState<string[]>([])
  const [showAdmitModal, setShowAdmitModal] = useState<string | null>(null)
  const [showTelemedicineView, setShowTelemedicineView] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [notes, setNotes] = useState('')

  const todaysAppointments = appointments.filter(a => a.status !== 'cancelled' && !admittedPatients.includes(a.id))
  const pendingReviews = appointments.filter(a => a.status === 'pending').length

  const handleStartQueue = () => {
    setJoiningCall('queue')
    setTimeout(() => {
      setJoiningCall(null)
      setQueueActive(true)
      setShowVideoCall(true)
    }, 1500)
  }

  const handleStopQueue = () => {
    setQueueActive(false)
    setShowTelemedicineView(false)
  }

  const handleAdmitPatient = (apptId: string) => {
    setShowAdmitModal(apptId)
  }

  const confirmAdmit = () => {
    if (showAdmitModal) {
      setAdmittedPatients(prev => [...prev, showAdmitModal])
      setShowAdmitModal(null)
      setNotes('')
    }
  }

  const currentPatient = todaysAppointments[0]

  return (
    <DashboardLayout role="doctor" title="Overview">
      <main className="py-6 animate-fade-in-up">
        {currentUser && !currentUser.isVerified && (
          <div className="mb-10 p-8 rounded-[2rem] border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">⚠️</div>
              <div>
                <h3 className="text-xl font-bold theme-text-primary mb-1">Verify Your Clinical Credentials</h3>
                <p className="text-amber-600 dark:text-amber-200/60 text-sm font-medium">Your profile is missing a verified status. Upload your medical license to unlock full features.</p>
              </div>
            </div>
            <Link href="/dashboard/doctor/verification" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-xl font-black italic transition-all shadow-lg shadow-amber-500/30 active:scale-95">
              Start Verification
            </Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#313D5A] dark:text-white mb-2 flex items-center gap-3">
              Good morning, {currentUser?.name || 'Doctor'}
              {currentUser?.isVerified && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]" title="Verified Professional">
                  ✓
                </span>
              )}
              👋
            </h1>
            <p className="theme-text-muted font-medium">You have {todaysAppointments.length} appointments remaining today.</p>
          </div>
          {!queueActive ? (
            <button onClick={handleStartQueue} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 group">
              {joiningCall === 'queue' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <svg className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              )}
              Start Telemedicine Queue
            </button>
          ) : (
            <button onClick={handleStopQueue} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
              End Queue Session
            </button>
          )}
        </div>

        {/* Telemedicine Live View */}
        {showTelemedicineView && currentPatient && (
          <div className="glass-card rounded-2xl p-6 mb-8 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Live — Telemedicine Session</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Feed Placeholder */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden relative aspect-video flex items-center justify-center border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-primary-500/5"></div>
                <div className="text-center relative z-10">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-emerald-500/30 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPatient.patientName}&backgroundColor=transparent`} alt="" className="w-20 h-20" />
                  </div>
                  <p className="text-white font-bold text-lg">{currentPatient.patientName}</p>
                  <p className="text-emerald-400 text-sm">Connected • {currentPatient.specialty}</p>
                  <div className="flex justify-center gap-4 mt-6">
                    <button className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button onClick={handleStopQueue} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                {/* Timer */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-emerald-400 text-sm font-mono">
                  00:14:32
                </div>
              </div>

              {/* Patient Info Sidebar */}
              <div className="space-y-4">
                <div className="dark:bg-white/5 bg-[#CBC5EA]/10 rounded-xl p-4 border dark:border-white/5 border-[#73628A]/10">
                  <h3 className="text-sm font-bold theme-text-muted uppercase tracking-wider mb-3">Patient Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="theme-text-muted font-medium">Name</span><span className="text-[#313D5A] dark:text-white font-bold">{currentPatient.patientName}</span></div>
                    <div className="flex justify-between"><span className="theme-text-muted font-medium">ID</span><span className="text-[#313D5A] dark:text-white font-bold">{currentPatient.patientId}</span></div>
                    <div className="flex justify-between"><span className="theme-text-muted font-medium">Visit</span><span className="text-[#313D5A] dark:text-white font-bold">{currentPatient.specialty}</span></div>
                    <div className="flex justify-between"><span className="theme-text-muted font-medium">Type</span><span className="text-emerald-500 font-bold capitalize">{currentPatient.type}</span></div>
                  </div>
                </div>
                <div className="dark:bg-white/5 bg-[#CBC5EA]/10 rounded-xl p-4 border dark:border-white/5 border-[#73628A]/10">
                  <h3 className="text-sm font-bold theme-text-muted uppercase tracking-wider mb-3">Session Notes</h3>
                  <textarea placeholder="Type consultation notes..." className="w-full dark:bg-white/5 bg-white border dark:border-white/10 border-[#73628A]/10 rounded-lg px-3 py-2 theme-text-primary text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-24 transition-all font-medium"></textarea>
                </div>
                <button onClick={() => handleAdmitPatient(currentPatient.id)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all">
                  ✓ Complete & Admit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 border border-emerald-500/20">🩺</div>
            <p className="text-sm theme-text-muted font-bold mb-1">Remaining Patients</p>
            <p className="text-3xl font-bold theme-text-primary">{todaysAppointments.length}</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-4 border border-blue-500/20">✅</div>
            <p className="text-sm theme-text-muted font-bold mb-1">Admitted Today</p>
            <p className="text-3xl font-bold theme-text-primary">{admittedPatients.length}</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 -left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="flex flex-col h-full justify-center">
              <p className="text-sm text-emerald-400 font-bold mb-2 uppercase tracking-wider">Queue Status</p>
              {queueActive ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                  <span className="text-xl font-bold text-emerald-500">Live</span>
                </div>
              ) : (
                <p className="text-xl font-bold theme-text-muted">Inactive</p>
              )}
            </div>
          </div>
        </div>

        {/* Queue */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold theme-text-primary">Patient Queue</h2>
           <Link href="/dashboard/doctor/schedule" className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors">
              Manage Schedule →
           </Link>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden mb-12">
          <div className="divide-y divide-white/5">
            {todaysAppointments.length === 0 ? (
              <div className="p-12 text-center theme-text-muted">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-lg font-bold theme-text-primary mb-2">All patients seen!</p>
                <p className="font-medium">You have admitted {admittedPatients.length} patients today. Great work!</p>
              </div>
            ) : (
              todaysAppointments.map((appt, i) => (
                <div key={appt.id} className={`p-6 hover:dark:bg-white/[0.02] hover:bg-[#CBC5EA]/5 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${i > 0 ? 'opacity-50' : ''}`}>
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner shrink-0 relative">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.patientName}&backgroundColor=transparent`} alt="Patient" className={`w-12 h-12 ${i > 0 ? 'grayscale' : ''}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold theme-text-primary text-lg">{appt.patientName}</h3>
                          {i === 0 && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Next</span>}
                      </div>
                      <p className="text-xs theme-text-muted flex items-center gap-2 font-medium">
                         <span>ID: {appt.patientId}</span>
                         <span>•</span>
                         <span>{appt.type === 'telemedicine' ? '📹 Telemedicine' : `🏥 In-Person${appt.room ? ` • Room ${appt.room}` : ''}`}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <div className={`${i === 0 ? 'dark:bg-white/10 bg-[#CBC5EA]/10 dark:border-white/10 border-[#73628A]/10 theme-text-primary' : 'dark:bg-white/5 bg-[#CBC5EA]/5 dark:border-white/5 border-[#73628A]/10 theme-text-muted'} text-sm font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-2 w-fit border`}>
                       {appt.time}
                    </div>
                    <div className="text-sm theme-text-muted font-bold">{appt.specialty}</div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                     <Link href="/dashboard/doctor/patients" className="flex-1 sm:flex-none border dark:border-white/10 border-slate-200 theme-text-muted px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-center">View History</Link>
                     {i === 0 && (
                       <button onClick={() => handleAdmitPatient(appt.id)} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex justify-center items-center gap-2">
                         Admit Patient
                       </button>
                     )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Admit Patient Modal */}
      {showAdmitModal && (() => {
        const appt = appointments.find(a => a.id === showAdmitModal);
        if (!appt) return null;
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setShowAdmitModal(null)}>
            <div className="glass-card rounded-2xl p-8 max-w-lg w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/30 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.patientName}&backgroundColor=transparent`} alt="" className="w-full h-full" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{appt.patientName}</h2>
                  <p className="text-sm text-slate-400">ID: {appt.patientId} • {appt.specialty}</p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
              <div>
                <label className="text-xs font-bold theme-text-muted ml-1 block mb-2 uppercase tracking-wide">Diagnosis / Clinical Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Enter clinical findings..." className="w-full dark:bg-white/5 bg-white border dark:border-white/10 border-[#73628A]/10 rounded-xl px-4 py-4 theme-text-primary placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none h-28 transition-all font-medium"></textarea>
              </div>
              <div>
                <label className="text-xs font-bold theme-text-muted ml-1 block mb-2 uppercase tracking-wide">Treatment Plan</label>
                <select className="w-full dark:bg-white/5 bg-white border dark:border-white/10 border-[#73628A]/10 rounded-xl px-4 py-4 theme-text-primary outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer font-medium">
                  <option className="dark:bg-slate-900 bg-white" value="none">No follow-up needed</option>
                  <option className="dark:bg-slate-900 bg-white" value="schedule">Schedule follow-up visit</option>
                  <option className="dark:bg-slate-900 bg-white" value="lab">Order lab work</option>
                  <option className="dark:bg-slate-900 bg-white" value="referral">Refer to specialist</option>
                  <option className="dark:bg-slate-900 bg-white" value="prescription">Issue prescription</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAdmitModal(null)} className="flex-1 border dark:border-white/10 border-slate-200 theme-text-muted py-4 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={confirmAdmit} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2">
                ✓ Confirm Action
              </button>
            </div>
            </div>
          </div>
        );
      })()}

      {/* Real Video Call Modal */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={() => { setShowVideoCall(false); setQueueActive(false); }}
        doctorName={currentPatient?.patientName || 'Patient'}
        specialty={currentPatient?.specialty || 'Consultation'}
      />
    </DashboardLayout>
  )
}
