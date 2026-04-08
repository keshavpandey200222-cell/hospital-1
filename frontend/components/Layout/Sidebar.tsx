import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar({ role }: { role: 'patient' | 'doctor' | 'admin' }) {
  const router = useRouter();
  const { theme } = useTheme();

  const patientLinks = [
    { label: 'Overview', href: '/dashboard/patient', icon: '🏠' },
    { label: 'Appointments', href: '/dashboard/patient/appointments', icon: '📅' },
    { label: 'Health Records', href: '/dashboard/patient/records', icon: '📄' },
    { label: 'Smart Assistant', href: '/dashboard/patient/consultation', icon: '🧠' },
  ];

  const doctorLinks = [
    { label: 'Queue & Overview', href: '/dashboard/doctor', icon: '🩺' },
    { label: 'My Schedule', href: '/dashboard/doctor/schedule', icon: '📅' },
    { label: 'Patient Directory', href: '/dashboard/doctor/patients', icon: '👥' },
  ];

  const adminLinks = [
    { label: 'Command Center', href: '/dashboard/admin', icon: '📊' },
    { label: 'Staff Management', href: '/dashboard/admin/staff', icon: '⚕️' },
    { label: 'Verification Queue', href: '/dashboard/admin/verifications', icon: '🛡️' },
    { label: 'Medicine Sharing', href: '/dashboard/hospital/inventory', icon: '💊' },
    { label: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ];

  const links = role === 'patient' ? patientLinks : role === 'doctor' ? doctorLinks : adminLinks;

  return (
    <aside className={`w-64 border-r h-full flex flex-col fixed left-0 top-20 z-40 hidden md:flex transition-all duration-500 backdrop-blur-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#73628A]/10 bg-white/40 shadow-xl shadow-[#313D5A]/5'}`}>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {links.map((link) => {
          const isActive = router.pathname === link.href || (link.href !== `/dashboard/${role}` && router.pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/10 scale-[1.02]' : 'theme-text-muted hover:theme-text-primary hover:bg-[#CBC5EA]/10 dark:hover:bg-white/5'}`}>
              <span className="text-xl filter drop-shadow-sm">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#73628A]/10'}`}>
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 theme-text-muted hover:text-rose-500 transition-all rounded-xl hover:bg-rose-500/5 font-bold group">
             <span className="text-xl transition-transform group-hover:scale-110">🚪</span>
             Logout
          </Link>
      </div>
    </aside>
  );
}
