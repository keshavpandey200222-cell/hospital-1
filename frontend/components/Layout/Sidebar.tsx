import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ role }: { role: 'patient' | 'doctor' | 'admin' }) {
  const router = useRouter();

  const patientLinks = [
    { label: 'Overview', href: '/dashboard/patient', icon: '🏠' },
    { label: 'Appointments', href: '/dashboard/patient/appointments', icon: '📅' },
    { label: 'Health Records', href: '/dashboard/patient/records', icon: '📄' },
  ];

  const doctorLinks = [
    { label: 'Queue & Overview', href: '/dashboard/doctor', icon: '🩺' },
    { label: 'My Schedule', href: '/dashboard/doctor/schedule', icon: '📅' },
    { label: 'Patient Directory', href: '/dashboard/doctor/patients', icon: '👥' },
  ];

  const adminLinks = [
    { label: 'Command Center', href: '/dashboard/admin', icon: '📊' },
    { label: 'Staff Management', href: '/dashboard/admin/staff', icon: '⚕️' },
    { label: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];

  const links = role === 'patient' ? patientLinks : role === 'doctor' ? doctorLinks : adminLinks;

  return (
    <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col fixed left-0 top-20 z-40 hidden md:flex">
      <nav className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const isActive = router.pathname === link.href || (link.href !== `/dashboard/${role}` && router.pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10 font-medium">
             <span className="text-xl">🚪</span>
             Logout
          </Link>
      </div>
    </aside>
  );
}
