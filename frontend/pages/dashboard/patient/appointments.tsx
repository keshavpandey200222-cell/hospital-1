import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';

export default function AppointmentPage() {
  const router = useRouter();
  const { addAppointment } = useDemoData();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const specialties = [
    { id: 'cardio', name: 'Cardiology', icon: '❤️' },
    { id: 'general', name: 'General Practice', icon: '🩺' },
    { id: 'neuro', name: 'Neurology', icon: '🧠' },
    { id: 'ortho', name: 'Orthopedics', icon: '🦴' },
    { id: 'pedia', name: 'Pediatrics', icon: '👶' },
    { id: 'derma', name: 'Dermatology', icon: '✨' },
  ];

  const doctors = [
    { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'cardio', rating: 4.9, available: 'Today' },
    { id: 'd2', name: 'Dr. Marcus Lee', specialty: 'general', rating: 4.8, available: 'Tomorrow' },
    { id: 'd3', name: 'Dr. Emily Chen', specialty: 'cardio', rating: 4.9, available: 'Oct 26' },
    { id: 'd4', name: 'Dr. Alan Turing', specialty: 'neuro', rating: 5.0, available: 'Today' },
    { id: 'd5', name: 'Dr. Jane Goodall', specialty: 'pedia', rating: 4.7, available: 'Oct 28' },
    { id: 'd6', name: 'Dr. Robert Koch', specialty: 'ortho', rating: 4.6, available: 'Next Week' },
    { id: 'd7', name: 'Dr. Rosalind F.', specialty: 'derma', rating: 4.9, available: 'Tomorrow' },
    { id: 'd8', name: 'Dr. Alice Roberts', specialty: 'general', rating: 4.5, available: 'Oct 27' },
    { id: 'd9', name: 'Dr. Sarah Jenkins', specialty: 'neuro', rating: 4.9, available: 'Next Week' },
    { id: 'd10', name: 'Dr. Marcus Lee', specialty: 'ortho', rating: 4.8, available: 'Oct 29' },
    { id: 'd11', name: 'Dr. Sarah Jenkins', specialty: 'derma', rating: 4.9, available: 'Tomorrow' },
    { id: 'd12', name: 'Dr. Marcus Lee', specialty: 'pedia', rating: 4.8, available: 'Today' },
  ];

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM'];
  const filteredDoctors = selectedSpecialty ? doctors.filter(d => d.specialty === selectedSpecialty) : doctors;
  const chosenDoctor = doctors.find(d => d.id === selectedDoctor);
  const chosenSpecialty = specialties.find(s => s.id === selectedSpecialty);

  const handleConfirm = () => {
    if (!chosenDoctor || !chosenSpecialty || !selectedDate || !selectedTime) return;
    addAppointment({
      doctorName: chosenDoctor.name,
      specialty: chosenSpecialty.name,
      date: selectedDate,
      time: selectedTime,
      type: 'telemedicine',
      status: 'confirmed',
      patientName: 'John Doe',
      patientId: 'NX-8421',
    });
    setConfirmed(true);
    setTimeout(() => router.push('/dashboard/patient'), 2000);
  };

  return (
    <DashboardLayout role="patient" title="Book Appointment">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Book a New Appointment</h1>
        <p className="text-slate-400">Follow the steps to schedule your visit with one of our specialists.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0">
           <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: confirmed ? '100%' : `${((step - 1) / 3) * 100}%` }}></div>
        </div>
        {['Specialty', 'Doctor', 'Date & Time', 'Confirm'].map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum && !confirmed;
          const isCompleted = step > stepNum || confirmed;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300
                ${isActive ? 'bg-primary-600 border-primary-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 
                  isCompleted ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                {isCompleted ? '✓' : stepNum}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block absolute -bottom-6 w-max ${isActive ? 'text-primary-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 mb-8 min-h-[400px]">
        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">1. What do you need help with?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specialties.map(spec => (
                <button key={spec.id} onClick={() => setSelectedSpecialty(spec.id)}
                  className={`p-6 rounded-2xl border transition-all text-center group ${selectedSpecialty === spec.id ? 'bg-primary-600/20 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{spec.icon}</div>
                  <h3 className={`font-semibold ${selectedSpecialty === spec.id ? 'text-primary-400' : 'text-white'}`}>{spec.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">2. Choose a Provider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map(doc => (
                <div key={doc.id} onClick={() => setSelectedDoctor(doc.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${selectedDoctor === doc.id ? 'bg-primary-600/20 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}&backgroundColor=transparent`} alt={doc.name} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{doc.name}</h3>
                    <p className="text-sm text-primary-400">{specialties.find(s => s.id === doc.specialty)?.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                       <span className="text-amber-400 font-medium">★ {doc.rating}</span>
                       <span className="text-slate-400">•</span>
                       <span className="text-emerald-400 font-medium">Next: {doc.available}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedDoctor === doc.id ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-600'}`}>
                     {selectedDoctor === doc.id && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">3. Select Date & Time</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Availability</h3>
                  <div className="flex gap-3 overflow-x-auto pb-4">
                     {['Oct 24', 'Oct 25', 'Oct 26', 'Oct 28', 'Oct 29', 'Oct 30'].map((date, i) => (
                        <button key={date} onClick={() => setSelectedDate(date)} className={`shrink-0 w-20 h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedDate === date ? 'bg-primary-600 border-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'}`}>
                           <span className="text-xs font-semibold opacity-70">{['Today','Tmrw','Sat','Mon','Tue','Wed'][i]}</span>
                           <span className="text-xl font-bold">{date.split(' ')[1]}</span>
                        </button>
                     ))}
                  </div>
               </div>
               {selectedDate && (
                 <div className="animate-fade-in-up">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Available Times</h3>
                    <div className="grid grid-cols-3 gap-3">
                       {timeSlots.map(time => (
                          <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 px-2 rounded-xl border text-sm font-semibold transition-all ${selectedTime === time ? 'bg-primary-500/20 border-primary-500 text-primary-400' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-300'}`}>
                             {time}
                          </button>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && !confirmed && (
          <div className="animate-fade-in-up flex flex-col items-center text-center max-w-lg mx-auto py-4">
             <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-primary-500/30">
               <svg className="w-10 h-10 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">Ready to Confirm</h2>
             <p className="text-slate-400 mb-8">Please review your appointment details.</p>
             <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Provider</p>
                      <p className="text-white font-bold text-lg">{chosenDoctor?.name}</p>
                      <p className="text-primary-400 text-sm">{chosenSpecialty?.name}</p>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-slate-800">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chosenDoctor?.name}&backgroundColor=transparent`} alt="Doctor" />
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Date & Time</p>
                      <p className="text-white font-bold">{selectedDate} <span className="text-slate-500 mx-1">at</span> {selectedTime}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-emerald-400 font-bold inline-flex items-center gap-1">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                         Telemedicine
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Confirmed Success */}
        {confirmed && (
          <div className="animate-fade-in-up flex flex-col items-center text-center py-12">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-500/30">
              <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Appointment Booked! 🎉</h2>
            <p className="text-slate-400">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {!confirmed && (
        <div className="flex justify-between items-center border-t border-white/10 pt-6">
           <button onClick={() => setStep(step - 1)} disabled={step === 1}
             className={`px-6 py-3 rounded-full font-semibold transition-all ${step === 1 ? 'opacity-0' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'}`}>
             Back
           </button>
           {step < 4 ? (
             <button onClick={() => setStep(step + 1)}
               disabled={(step === 1 && !selectedSpecialty) || (step === 2 && !selectedDoctor) || (step === 3 && (!selectedDate || !selectedTime))}
               className="bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2">
               Continue <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
           ) : (
             <button onClick={handleConfirm}
               className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2">
               ✓ Confirm Appointment
             </button>
           )}
        </div>
      )}
    </DashboardLayout>
  )
}