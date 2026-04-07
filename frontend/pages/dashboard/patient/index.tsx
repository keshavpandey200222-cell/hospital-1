import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import { useDemoData } from '../../../context/DemoDataContext'

// Dynamic import to avoid SSR issues with PeerJS
const VideoCallModal = dynamic(() => import('../../../components/VideoCall/VideoCallModal'), { ssr: false })

export default function PatientDashboard() {
  const { appointments, prescriptions, testResults, documents, addDocument, cancelAppointment, rescheduleAppointment } = useDemoData()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null)
  const [showPrescriptions, setShowPrescriptions] = useState(false)
  const [showTests, setShowTests] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [joiningCall, setJoiningCall] = useState<string | null>(null)
  const [activeCall, setActiveCall] = useState<string | null>(null)
  const [videoCallAppt, setVideoCallAppt] = useState<{doctorName: string, specialty: string} | null>(null)
  const [callSeconds, setCallSeconds] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [uploadFileName, setUploadFileName] = useState('')
  const selfVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const myAppointments = appointments.filter(a => a.patientName === 'John Doe' && a.status !== 'cancelled')
  const unreadTests = testResults.filter(t => !t.read).length

  // Timer for active call
  useEffect(() => {
    if (!activeCall) { setCallSeconds(0); return; }
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  // Start/stop webcam when call starts/ends
  useEffect(() => {
    if (activeCall) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          if (selfVideoRef.current) {
            selfVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => { /* camera access denied — still show call UI */ });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [activeCall]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const handleJoinCall = (id: string) => {
    setJoiningCall(id)
    const appt = myAppointments.find(a => a.id === id);
    setTimeout(() => {
      setJoiningCall(null);
      if (appt) {
        setVideoCallAppt({ doctorName: appt.doctorName, specialty: appt.specialty });
      }
    }, 1500)
  }

  const handleEndCall = () => { setActiveCall(null); setMicOn(true); setCamOn(true); }

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setCamOn(!camOn);
  };

  const activeAppt = activeCall ? myAppointments.find(a => a.id === activeCall) : null;

  return (
    <DashboardLayout role="patient" title="Overview">

      {/* Telemedicine Call View */}
      {activeAppt && (
        <div className="glass-card rounded-2xl p-6 mb-8 border-primary-500/20 bg-gradient-to-br from-primary-500/5 to-transparent animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Live Telemedicine Call</span>
            <span className="text-slate-500 text-sm ml-auto font-mono">{formatTime(callSeconds)}</span>
          </div>

          <div className="bg-slate-900 rounded-2xl overflow-hidden relative aspect-video max-h-[420px] flex items-center justify-center border border-white/5 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-emerald-500/5"></div>
            {/* Doctor (remote) — avatar since demo */}
            <div className="text-center relative z-10">
              <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-primary-500/30 mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAppt.doctorName}&backgroundColor=transparent`} alt="" className="w-24 h-24" />
              </div>
              <p className="text-white font-bold text-xl">{activeAppt.doctorName}</p>
              <p className="text-primary-400 text-sm">{activeAppt.specialty}</p>
              <p className="text-emerald-400 text-xs mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Connected
              </p>
            </div>
            {/* YOUR LIVE CAMERA FEED */}
            <div className="absolute bottom-4 right-4 w-44 h-32 bg-slate-800 rounded-xl border-2 border-primary-500/30 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <video ref={selfVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!camOn ? 'hidden' : ''}`} />
              {!camOn && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/20 mx-auto flex items-center justify-center text-white text-sm font-bold mb-1">JD</div>
                    <p className="text-[10px] text-slate-400">Camera off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] text-white font-medium">You</div>
            </div>
            {/* Timer */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-emerald-400 text-sm font-mono">
              {formatTime(callSeconds)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button onClick={toggleMic} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${micOn ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-red-500/20 border-red-500/30'}`} title={micOn ? 'Mute' : 'Unmute'}>
              {micOn ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
              )}
            </button>
            <button onClick={toggleCam} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${camOn ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-red-500/20 border-red-500/30'}`} title={camOn ? 'Turn off camera' : 'Turn on camera'}>
              {camOn ? (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              ) : (
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              )}
            </button>
            <button onClick={handleEndCall} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]" title="End Call">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
            </button>
          </div>
        </div>
      )}

      <main className="py-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Good morning, John 👋</h1>
            <p className="text-slate-400">Your health overview is looking great today.</p>
          </div>
          <Link href="/dashboard/patient/appointments" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 group">
            <span className="text-lg group-hover:rotate-90 transition-transform duration-300">+</span> Book Appointment
          </Link>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-primary-500/30" onClick={() => setShowCalendar(!showCalendar)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center text-2xl mb-4 border border-primary-500/20">📅</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Upcoming Visits</p>
            <p className="text-3xl font-bold text-white">{myAppointments.length}</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-secondary/30" onClick={() => setShowPrescriptions(!showPrescriptions)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center text-2xl mb-4 border border-secondary/20">💊</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Active Prescriptions</p>
            <p className="text-3xl font-bold text-white">{prescriptions.length}</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-purple-500/30" onClick={() => setShowTests(!showTests)}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors"></div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4 border border-purple-500/20">📄</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Test Results</p>
            <div className="flex items-end gap-2">
               <p className="text-3xl font-bold text-white">{testResults.length}</p>
               {unreadTests > 0 && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20 mb-1">{unreadTests} Unread</span>}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-center items-center cursor-pointer hover:border-primary-500/50" onClick={() => setShowUploadModal(true)}>
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-500 text-slate-400 flex items-center justify-center text-xl mb-2 group-hover:text-primary-400 group-hover:border-primary-400 transition-colors">+</div>
            <p className="text-sm text-slate-400 font-medium">Upload Document</p>
            <p className="text-xs text-slate-500 mt-1">{documents.length} files</p>
          </div>
        </div>

        {/* Prescriptions Drawer */}
        {showPrescriptions && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">💊 Active Prescriptions</h2>
              <button onClick={() => setShowPrescriptions(false)} className="text-slate-400 hover:text-white text-sm">Close ✕</button>
            </div>
            <div className="space-y-3">
              {prescriptions.map(rx => (
                <div key={rx.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <h3 className="text-white font-semibold">{rx.name} <span className="text-slate-400 font-normal text-sm">({rx.dosage})</span></h3>
                    <p className="text-xs text-slate-400 mt-1">{rx.frequency} • Prescribed by {rx.prescribedBy}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${rx.refillsLeft > 2 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {rx.refillsLeft} refills left
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Ends {rx.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results Drawer */}
        {showTests && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">📄 Test Results</h2>
              <button onClick={() => setShowTests(false)} className="text-slate-400 hover:text-white text-sm">Close ✕</button>
            </div>
            <div className="space-y-3">
              {testResults.map(test => (
                <div key={test.id} className={`p-4 bg-white/5 rounded-xl border ${!test.read ? 'border-primary-500/30 bg-primary-500/5' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {test.testName}
                        {!test.read && <span className="text-[10px] bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded">NEW</span>}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{test.date} • {test.doctor}</p>
                      <p className="text-sm text-slate-300 mt-2">{test.summary}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded shrink-0 ml-4 ${test.status === 'normal' ? 'bg-emerald-500/20 text-emerald-400' : test.status === 'abnormal' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Section */}
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-white">Upcoming Appointments</h2>
           <button onClick={() => setShowCalendar(!showCalendar)} className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View Calendar <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
           </button>
        </div>

        {/* Calendar Drawer */}
        {showCalendar && (
          <div className="glass-card rounded-2xl p-6 mb-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">📅 Calendar Overview</h2>
              <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-white text-sm">Close ✕</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 mb-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} className="font-semibold">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                const hasAppt = myAppointments.some(a => a.date.includes(String(day)));
                return (
                  <div key={day} className={`py-2 rounded-lg text-sm transition-all ${hasAppt ? 'bg-primary-500/20 text-primary-400 font-bold border border-primary-500/30' : 'text-slate-400 hover:bg-white/5'}`}>
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="glass-card rounded-2xl overflow-hidden mb-12">
          <div className="divide-y divide-white/5">
            {myAppointments.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <p className="text-lg mb-2">No upcoming appointments</p>
                <Link href="/dashboard/patient/appointments" className="text-primary-400 hover:underline">Book one now →</Link>
              </div>
            ) : (
              myAppointments.map(appt => (
                <div key={appt.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                       <span className="text-slate-400 text-sm font-medium">{appt.doctorName.split(' ').map(n => n[0]).join('').slice(0,3)}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{appt.doctorName}</h3>
                      <p className="text-sm text-primary-400 font-medium mb-1">{appt.specialty}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                         {appt.type === 'telemedicine' ? (
                           <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Telemedicine Consult</>
                         ) : (
                           <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> In-Person{appt.room ? ` • Room ${appt.room}` : ''}</>
                         )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <div className="bg-white/10 border border-white/10 text-white text-sm font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-2 w-fit">
                       <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       {appt.date}, {appt.time}
                    </div>
                    <div className="flex items-center gap-2">
                       {appt.status === 'confirmed' ? (
                         <><span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span></span><span className="text-sm text-emerald-400 font-medium">Confirmed</span></>
                       ) : (
                         <><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-sm text-amber-400 font-medium">Pending</span></>
                       )}
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                     <button onClick={() => setShowRescheduleModal(appt.id)} className="flex-1 sm:flex-none border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">Reschedule</button>
                     <button onClick={() => cancelAppointment(appt.id)} className="flex-1 sm:flex-none border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-500/10 transition-colors">Cancel</button>
                     {appt.type === 'telemedicine' && (
                       <button onClick={() => handleJoinCall(appt.id)} className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/20 transition-all flex justify-center items-center gap-2">
                         {joiningCall === appt.id ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Join Call'}
                       </button>
                     )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">📁 Upload Document</h2>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-4 hover:border-primary-500/30 transition-colors">
              <p className="text-slate-400 mb-2">Drag & drop or click to upload</p>
              <input type="text" placeholder="Enter file name (e.g. Lab_Report.pdf)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-primary-500" value={uploadFileName} onChange={e => setUploadFileName(e.target.value)} />
            </div>
            <div className="mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Existing Documents</p>
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300 py-1">
                  <span className="text-slate-500">📎</span> {doc}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/5">Cancel</button>
              <button onClick={() => { if (uploadFileName.trim()) { addDocument(uploadFileName.trim()); setUploadFileName(''); setShowUploadModal(false); } }} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary-500/20">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4" onClick={() => setShowRescheduleModal(null)}>
          <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">📅 Reschedule Appointment</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-slate-400 ml-1 block mb-1">New Date</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)}>
                  <option value="" className="text-black">Select a date</option>
                  {['Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Nov 1'].map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 ml-1 block mb-1">New Time</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" value={rescheduleTime} onChange={e => setRescheduleTime(e.target.value)}>
                  <option value="" className="text-black">Select a time</option>
                  {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'].map(t => <option key={t} value={t} className="text-black">{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRescheduleModal(null)} className="flex-1 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/5">Cancel</button>
              <button onClick={() => { if (rescheduleDate && rescheduleTime) { rescheduleAppointment(showRescheduleModal, rescheduleDate, rescheduleTime); setShowRescheduleModal(null); setRescheduleDate(''); setRescheduleTime(''); } }} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-semibold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Real Video Call Modal */}
      <VideoCallModal
        isOpen={!!videoCallAppt}
        onClose={() => setVideoCallAppt(null)}
        doctorName={videoCallAppt?.doctorName || ''}
        specialty={videoCallAppt?.specialty || ''}
      />
    </DashboardLayout>
  )
}
