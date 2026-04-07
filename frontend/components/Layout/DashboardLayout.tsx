import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Sidebar from './Sidebar';
import { useDemoData } from '../../context/DemoDataContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'patient' | 'doctor' | 'admin';
  title: string;
}

export default function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { appointments, testResults } = useDemoData();

  const themeTheme = role === 'patient' ? 'primary' : role === 'doctor' ? 'emerald' : 'violet';
  const logoInitials = role === 'admin' ? 'SA' : role === 'doctor' ? 'SJ' : 'JD';
  const userName = role === 'patient' ? 'John Doe' : role === 'doctor' ? 'Dr. Sarah Jenkins' : 'System Admin';
  const userSubtext = role === 'patient' ? 'Patient ID: NX-8421' : role === 'doctor' ? 'Cardiology Specialist' : 'Superuser';

  const notifications = [
    { id: 'n1', type: 'appointment', title: 'Appointment Reminder', message: `Your appointment with ${appointments[0]?.doctorName || 'a doctor'} is coming up on ${appointments[0]?.date || 'soon'}.`, time: '2 min ago', read: false },
    { id: 'n2', type: 'result', title: 'New Test Result Available', message: `Your ${testResults[0]?.testName || 'lab test'} results are ready to view.`, time: '1 hour ago', read: false },
    { id: 'n3', type: 'prescription', title: 'Prescription Refill', message: 'Your Lisinopril prescription has 1 refill remaining. Consider requesting a renewal.', time: '3 hours ago', read: true },
    { id: 'n4', type: 'system', title: 'Security Alert', message: 'New login detected from Windows device. If this wasn\'t you, secure your account.', time: 'Yesterday', read: true },
    { id: 'n5', type: 'appointment', title: 'Appointment Confirmed', message: 'Your telemedicine appointment has been confirmed by the provider.', time: 'Yesterday', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'result': return '📄';
      case 'prescription': return '💊';
      case 'system': return '🔒';
      default: return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-darkBG text-slate-200 font-sans selection:bg-primary-500 selection:text-white flex flex-col">
      <Head>
        <title>{title} | Nexus Health</title>
      </Head>

      {/* Top Navbar */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 h-20 w-full shrink-0 relative">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href={`/dashboard/${role}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${themeTheme}-400 to-${themeTheme}-600 shadow-lg shadow-${themeTheme}-500/30 text-white flex items-center justify-center font-bold text-lg`}>
              N
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
               {role === 'admin' ? 'NEXUS ADMIN' : 'NEXUS'}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-slate-400 hover:text-white transition-colors hidden sm:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-darkBG flex items-center justify-center text-[10px] text-white font-bold">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 top-12 w-96 glass-card rounded-2xl border border-white/10 shadow-2xl shadow-black/50 z-[70] animate-fade-in-up overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg">Notifications</h3>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-semibold">{unreadCount} new</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''}`}>
                          <div className="flex gap-3">
                            <span className="text-xl shrink-0 mt-0.5">{getNotifIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-semibold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>{notif.title}</h4>
                                {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-white/10 text-center">
                      <button onClick={() => setShowNotifications(false)} className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href={`/dashboard/${role}/profile`} className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{userName}</p>
                  <p className={`text-xs text-${themeTheme}-400`}>{userSubtext}</p>
               </div>
               <div className={`w-10 h-10 rounded-full bg-slate-800 border-2 border-${themeTheme}-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]`}>
                 {logoInitials}
               </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-20" style={{ marginTop: '-5rem' }}>
        <Sidebar role={role} />
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in-up">
           <div className="max-w-6xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}
