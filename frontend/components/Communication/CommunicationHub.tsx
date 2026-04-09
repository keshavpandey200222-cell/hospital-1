import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getApiBaseUrl } from '@/lib/runtimeConfig';

interface CommunicationHubProps {
  userId: string;
  userName: string;
  role: 'PATIENT' | 'DOCTOR';
  activeContactId?: string;
  activeContactName?: string;
}

export default function CommunicationHub({ userId, userName, role, activeContactId, activeContactName }: CommunicationHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'CALL'>('CHAT');
  const [inputValue, setInputValue] = useState('');
  const { sendMessage, sendReadReceipt, messages, status } = useWebSocket(userId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync read status on mount and when activeContactId changes
  useEffect(() => {
    if (activeContactId && isOpen) {
      // Mark existing messages as read in DB
      fetch(`${getApiBaseUrl()}/api/communication/mark-read?senderId=${activeContactId}&receiverId=${userId}`, { method: 'POST' });
      // Tell sender we've seen them (ensuring activeContactId is defined)
      if (activeContactId) sendReadReceipt(activeContactId);
    }
  }, [activeContactId, isOpen, userId, sendReadReceipt]);

  // Handle incoming messages while chat is open
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId === activeContactId && isOpen && activeContactId) {
       sendReadReceipt(activeContactId);
    }
  }, [messages, activeContactId, isOpen, sendReadReceipt]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeContactId) return;
    sendMessage(activeContactId, inputValue);
    setInputValue('');
  };

  const handleAttach = () => {
    if (!activeContactId) return;
    const fileName = prompt('Enter report or prescription filename to share:', 'patient_report_0408.pdf');
    if (fileName) {
      sendMessage(activeContactId, `📎 Shared File: ${fileName} [View Report]`, 'CHAT');
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const getFilteredMessages = () => {
    if (!activeContactId) return [];
    return messages.filter(m => 
      (m.senderId === userId && m.receiverId === activeContactId) ||
      (m.senderId === activeContactId && m.receiverId === userId)
    );
  };

  return (
    <div className={`fixed right-0 top-0 h-full z-[1000] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-12px)]'}`}>
      {/* Toggle Tab */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-10 h-32 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-l-2xl flex flex-col items-center justify-center gap-4 group transition-all"
      >
        <div className="flex flex-col items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
          <span className="[writing-mode:vertical-rl] text-[10px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-white transition-colors">NexNet</span>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Main Panel */}
      <div className="w-80 md:w-96 h-full bg-slate-950/90 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Communication</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{status}</span>
              </div>
            </div>
          </div>

          <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('CHAT')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'CHAT' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              CHAT
            </button>
            <button 
              onClick={() => setActiveTab('CALL')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'CALL' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              CALL
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'CHAT' ? (
            <div className="flex-1 flex flex-col">
              {/* Contact Info */}
              {activeContactId ? (
                <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeContactName}&backgroundColor=transparent`} 
                      alt="" 
                      className="w-8 h-8"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{activeContactName}</p>
                    <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-wider font-bold">Online</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-white/5">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <h3 className="text-white font-bold mb-2">Select a Contact</h3>
                  <p className="text-xs text-slate-500">Pick a {role === 'PATIENT' ? 'doctor' : 'patient'} from your list to start a real-time conversation.</p>
                </div>
              )}

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {getFilteredMessages().map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.senderId === userId 
                        ? 'bg-primary-600 text-white rounded-br-none shadow-[0_4px_15px_rgba(37,99,235,0.3)]' 
                        : 'bg-white/10 text-slate-200 border border-white/10 rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <p className={`text-[9px] font-mono ${msg.senderId === userId ? 'text-primary-200' : 'text-slate-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {msg.senderId === userId && (
                          <div className="flex items-center gap-0.5">
                            <svg className={`w-3 h-3 ${msg.isRead ? 'text-emerald-400' : 'text-primary-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              {msg.isRead && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 13l4 4L23 7" className="-translate-x-1" />}
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              {activeContactId && (
                <div className="p-6 border-t border-white/10 bg-black/20">
                  <div className="relative">
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder-slate-500 outline-none focus:border-primary-500 transition-colors"
                    />
                    <button 
                      onClick={handleAttach}
                      className="absolute left-2 top-2 w-12 h-12 text-slate-400 hover:text-white flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 rounded-xl"
                      title="Attach File"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <button 
                      onClick={handleSend}
                      className="absolute right-2 top-2 w-12 h-12 bg-primary-600 hover:bg-primary-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
                    >
                      <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mb-6 relative">
                <span className="w-16 h-16 rounded-full bg-emerald-500/20 animate-ping absolute" />
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Telemedicine Engine</h3>
              <p className="text-xs text-slate-500 mb-6">High-fidelity voice and video consultations are currently handled through the Secure Bridge.</p>
              
              <button 
                 onClick={() => activeContactId && alert('Starting Session...')}
                 className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Launch Virtual Exam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
