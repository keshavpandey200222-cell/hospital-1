import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';

export default function SchedulePage() {
  const { appointments } = useDemoData();
  const doctorAppts = appointments.filter(a => a.doctorName === 'Dr. Sarah Jenkins' && a.status !== 'cancelled');

  const days = ['Mon 24', 'Tue 25', 'Wed 26', 'Thu 27', 'Fri 28'];
  const hours = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  return (
    <DashboardLayout role="doctor" title="My Schedule">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Schedule</h1>
        <p className="text-slate-400">View and manage your weekly availability and booked appointments.</p>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-slate-500 text-sm font-semibold w-24">Time</th>
                {days.map(day => (
                  <th key={day} className="p-4 text-white font-semibold text-sm text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {hours.map(hour => (
                <tr key={hour} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 text-slate-500 text-xs font-medium border-r border-white/5">{hour}</td>
                  {days.map(day => {
                    const dayNum = day.split(' ')[1];
                    const appt = doctorAppts.find(a => a.date.includes(dayNum) && a.time === hour);
                    return (
                      <td key={day} className="p-2 text-center">
                        {appt ? (
                          <div className={`p-2 rounded-lg text-xs ${appt.type === 'telemedicine' ? 'bg-primary-500/20 border border-primary-500/20 text-primary-400' : 'bg-emerald-500/20 border border-emerald-500/20 text-emerald-400'}`}>
                            <p className="font-semibold truncate">{appt.patientName}</p>
                            <p className="opacity-70">{appt.type === 'telemedicine' ? '📹' : '🏥'} {appt.specialty}</p>
                          </div>
                        ) : (
                          <div className="p-2 rounded-lg text-xs text-slate-600 hover:bg-white/5 cursor-pointer transition-colors">
                            Available
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming List */}
      <h2 className="text-xl font-bold text-white mt-10 mb-4">📋 Booked This Week</h2>
      <div className="space-y-3">
        {doctorAppts.map(appt => (
          <div key={appt.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.patientName}&backgroundColor=transparent`} alt="" className="w-full h-full" />
              </div>
              <div>
                <p className="text-white font-semibold">{appt.patientName}</p>
                <p className="text-xs text-slate-400">{appt.specialty} • {appt.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{appt.date}</p>
              <p className="text-xs text-slate-400">{appt.time}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}