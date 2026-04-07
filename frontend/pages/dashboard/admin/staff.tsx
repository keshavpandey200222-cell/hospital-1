import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useDemoData } from '../../../context/DemoDataContext';

export default function StaffPage() {
  const { staff } = useDemoData();

  return (
    <DashboardLayout role="admin" title="Staff Management">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Staff Management</h1>
        <p className="text-slate-400">Manage hospital staff, roles, and department assignments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-emerald-400">{staff.filter(s => s.status === 'online').length}</p>
          <p className="text-xs text-slate-400 mt-1">Online</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-amber-400">{staff.filter(s => s.status === 'busy').length}</p>
          <p className="text-xs text-slate-400 mt-1">Busy</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-slate-400">{staff.filter(s => s.status === 'offline').length}</p>
          <p className="text-xs text-slate-400 mt-1">Offline</p>
        </div>
      </div>

      {/* Staff List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-slate-400">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold hidden sm:table-cell">Department</th>
              <th className="p-4 font-semibold hidden md:table-cell">Email</th>
              <th className="p-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}&backgroundColor=transparent`} alt={member.name} className="w-full h-full" />
                    </div>
                    <span className="text-white font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">{member.role}</td>
                <td className="p-4 text-slate-400 hidden sm:table-cell">{member.department}</td>
                <td className="p-4 text-slate-400 hidden md:table-cell">{member.email}</td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' :
                    member.status === 'busy' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-emerald-400' :
                      member.status === 'busy' ? 'bg-amber-400' : 'bg-slate-500'
                    }`}></span>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}