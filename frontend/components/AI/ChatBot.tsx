import React, { useState, useRef, useEffect } from 'react';
import { useDemoData } from '../../context/DemoDataContext';
import { useRouter } from 'next/router';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  action?: string;
  specialist?: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm Nexus AI, your virtual health assistant. How can I help you today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { triggerSOS } = useDemoData();
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: data.reply, 
        sender: 'ai', 
        timestamp: new Date(),
        action: data.action,
        specialist: data.specialist
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Handle automatic clinical actions
      if (data.action === 'TRIGGER_SOS') {
        setTimeout(() => triggerSOS(), 2000);
      }

    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', text: "I'm having trouble connecting. Please try again soon.", sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'NAVIGATE_APPOINTMENTS':
      case 'SUGGEST_BOOKING':
        router.push('/dashboard/patient/appointments');
        setIsOpen(false);
        break;
      case 'SHOW_MED_TRACKER':
        router.push('/dashboard/patient'); // Scroll to med tracker logic could go here
        setIsOpen(false);
        break;
      case 'TRIGGER_SOS':
        triggerSOS();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed bottom-32 right-8 z-[110]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[400px] h-[600px] glass-card rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-in origin-bottom-right">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-400 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
               <div>
                  <h3 className="font-bold">Nexus AI</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-80">Virtual Health Assistant</p>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300">✕</button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  {msg.action && msg.action !== 'NONE' && (
                    <button 
                      onClick={() => handleAction(msg.action!)}
                      className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/5"
                    >
                      {msg.action.replace(/_/g, ' ')}
                    </button>
                  )}
                  <p className="text-[8px] opacity-40 mt-1 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex gap-2 overflow-x-auto scrollbar-hide">
             <button onClick={() => handleSend("I have chest pain 🚨")} className="shrink-0 px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[10px] font-bold">SOS Help</button>
             <button onClick={() => handleSend("Book an appointment")} className="shrink-0 px-3 py-1.5 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full text-[10px] font-bold">Book Doctor</button>
             <button onClick={() => handleSend("My medicine schedule")} className="shrink-0 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">Meds Schedule</button>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Nexus AI anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-sm text-white outline-none focus:border-primary-500 transition-all"
            />
            <button 
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center hover:bg-primary-500 transition-colors"
            >
              🚀
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-primary-600 shadow-primary-600/40'
        }`}
      >
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-darkBG animate-bounce"></span>}
        <span className="relative z-10">{isOpen ? '✕' : '🤖'}</span>
        {!isOpen && <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20"></div>}
      </button>
    </div>
  );
};

export default ChatBot;
