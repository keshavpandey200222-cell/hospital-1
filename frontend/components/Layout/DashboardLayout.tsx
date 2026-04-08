import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useDemoData } from '../../context/DemoDataContext';
import SOSButton from '../Emergency/SOSButton';
import EmergencyTracking from '../Emergency/EmergencyTracking';
import ChatBot from '../AI/ChatBot';
import CommunicationHub from '../Communication/CommunicationHub';
import IncomingCallOverlay from '../Communication/IncomingCallOverlay';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useTheme } from '@/context/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'patient' | 'doctor' | 'admin';
  title: string;
}

export default function DashboardLayout({ children, role, title }: DashboardLayoutProps) {
  const { theme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { appointments, testResults } = useDemoData();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

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
    <div className={`min-h-screen transition-all duration-500 font-sans selection:bg-[#183642] selection:text-white flex flex-col ${theme === 'dark' ? 'bg-[#050505] text-slate-200' : 'bg-[#EAEAEA] text-[#313D5A]'}`}>
      <Head>
        <title>{title} | Nexus Health</title>
      </Head>

      {/* Top Navbar */}
      <header className={`backdrop-blur-xl border-b sticky top-0 z-50 h-20 w-full shrink-0 relative transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 shadow-lg' : 'bg-white/40 border-[#73628A]/10 shadow-xl shadow-[#313D5A]/5'}`}>
        <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href={`/dashboard/${role}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${themeTheme}-400 to-${themeTheme}-600 shadow-lg shadow-${themeTheme}-500/30 text-white flex items-center justify-center font-bold text-lg`}>
              N
            </div>
            <span className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#313D5A]'}`}>
               {role === 'admin' ? 'NEXUS ADMIN' : 'NEXUS'}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`relative transition-colors hidden sm:block ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setShowNotifications(false)}></div>
                  <div className={`absolute right-0 top-12 w-96 glass-card rounded-2xl border shadow-2xl z-[70] animate-fade-in-up overflow-hidden ${theme === 'dark' ? 'border-white/10' : 'border-[#73628A]/10'}`}>
                    <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/10' : 'border-[#73628A]/10 bg-[#CBC5EA]/10'}`}>
                      <h3 className={`font-bold text-lg theme-text-primary`}>Notifications</h3>
                      <span className="text-xs bg-red-500/20 text-red-500 dark:text-red-400 px-2 py-1 rounded-full font-bold">{unreadCount} new</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y dark:divide-white/5 divide-[#73628A]/10">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 transition-colors cursor-pointer ${!notif.read ? 'bg-primary-500/5' : 'hover:dark:bg-white/5 hover:bg-[#CBC5EA]/5'}`}>
                          <div className="flex gap-4">
                            <span className="text-xl shrink-0 mt-0.5 shadow-sm p-2 rounded-lg bg-white/50">{getNotifIcon(notif.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`text-sm font-bold truncate ${!notif.read ? 'theme-text-primary' : 'theme-text-muted'}`}>{notif.title}</h4>
                                {!notif.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></span>}
                              </div>
                              <p className="text-xs theme-text-muted mt-1 line-clamp-2 font-medium leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] theme-text-muted opacity-60 mt-2 font-bold uppercase tracking-wider">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`p-4 border-t text-center ${theme === 'dark' ? 'border-white/10' : 'border-[#73628A]/10 bg-[#CBC5EA]/10'}`}>
                      <button onClick={() => setShowNotifications(false)} className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-bold transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href={`/dashboard/${role}/profile`} className="flex items-center gap-3 pl-6 border-l dark:border-white/10 border-slate-200 cursor-pointer hover:opacity-80 transition-opacity">
               <div className="text-right hidden sm:block">
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest text-${themeTheme}-500/70`}>{userSubtext}</p>
               </div>
               <div className={`w-10 h-10 rounded-full dark:bg-slate-800 bg-slate-100 border-2 border-${themeTheme}-500 flex items-center justify-center theme-text-primary font-black shadow-lg`}>
                 {logoInitials}
               </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 pt-20" style={{ marginTop: '-5rem' }}>
        <Sidebar role={role} />
        <main className={`flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in-up transition-all ${theme === 'dark' ? '' : 'bg-[#EAEAEA]'}`}>
           <div className="max-w-6xl mx-auto">
             {children}
           </div>
        </main>
      </div>

      {/* Global Emergency SOS System */}
      {role === 'patient' ? (
        <>
          <SOSButton />
          <EmergencyTracking />
          <ChatBot />
        </>
      ) : (
        <ChatBot />
      )}
      {/* Real-time Communication Suite */}
      {hasMounted && (
        <>
          <CommunicationHub 
            userId={role === 'patient' ? 'P-123' : 'D-456'} 
            userName={userName}
            role={role.toUpperCase() as any}
            activeContactId={role === 'patient' ? 'D-456' : 'P-123'}
            activeContactName={role === 'patient' ? 'Dr. Sarah Jenkins' : 'John Doe'}
          />

          {/* Incoming Call Popup */}
          <IncomingCallSystem userId={role === 'patient' ? 'P-123' : 'D-456'} />
        </>
      )}
    </div>
  );
}

// Global listener for incoming calls outside main render path
function IncomingCallSystem({ userId }: { userId: string }) {
  const { incomingCall, setIncomingCall } = useWebSocket(userId);
  
  if (!incomingCall) return null;

  return (
    <IncomingCallOverlay 
      callerName={incomingCall.senderId === 'D-456' ? 'Dr. Sarah Jenkins' : 'John Doe'}
      type={incomingCall.content?.includes('VIDEO') ? 'VIDEO' : 'VOICE'}
      onAccept={() => {
        alert('Telemedicine Handshake Secure... Opening Link.');
        setIncomingCall(null);
      }}
      onReject={() => {
        setIncomingCall(null);
      }}
    />
  );
}
