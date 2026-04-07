import Link from 'next/link'
import DashboardLayout from '../../../components/Layout/DashboardLayout'
import { useDemoData } from '../../../context/DemoDataContext'

export default function AdminDashboard() {
  const { appointments, staff, auditLogs } = useDemoData()

  const totalPatients = 4821
  const onlineStaff = staff.filter(s => s.status === 'online').length
  const activeAppointments = appointments.filter(a => a.status !== 'cancelled').length

  return (
    <DashboardLayout role="admin" title="Command Center">
      <main className="py-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Hospital Command Center</h1>
            <p className="text-slate-400">System metrics and oversight operations are fully optimal.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/admin/staff" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full font-semibold transition-all border border-white/10 block text-center">
                Manage Staff
            </Link>
            <Link href="/dashboard/admin/settings" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2 group">
                <svg className="w-5 h-5 text-violet-200 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                System Settings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl mb-4 border border-amber-500/20">👥</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Total Patients</p>
            <p className="text-3xl font-bold text-white">{totalPatients.toLocaleString()}</p>
            <p className="text-xs text-amber-500 mt-2 flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> +12% this month</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-2xl mb-4 border border-violet-500/20">⚕️</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Active Staff</p>
            <p className="text-3xl font-bold text-white">{staff.length}</p>
            <p className="text-xs text-slate-400 mt-2">{onlineStaff} currently online</p>
          </div>

          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center text-2xl mb-4 border border-primary-500/20">📅</div>
            <p className="text-sm text-slate-400 font-medium mb-1">Active Appointments</p>
            <p className="text-3xl font-bold text-white">{activeAppointments}</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-500/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"></div>
            <p className="text-sm text-violet-300 font-bold mb-4 uppercase tracking-wider relative z-10">System Status</p>
            <div className="flex items-center gap-3 relative z-10">
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               <span className="text-xl font-bold text-white">All Systems Go</span>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <h2 className="text-xl font-bold text-white mb-6">Recent Security & Audit Logs</h2>
        <div className="glass-card rounded-2xl overflow-hidden mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="font-semibold p-4">Timestamp</th>
                <th className="font-semibold p-4">Event</th>
                <th className="font-semibold p-4 hidden sm:table-cell">User ID</th>
                <th className="font-semibold p-4 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-slate-300">{log.timestamp}</td>
                  <td className="p-4 text-white">{log.event}</td>
                  <td className="p-4 text-slate-400 hidden sm:table-cell">{log.userId}</td>
                  <td className="p-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.severity === 'INFO' ? 'bg-emerald-500/20 text-emerald-400' :
                      log.severity === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{log.severity}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </DashboardLayout>
  )
}
