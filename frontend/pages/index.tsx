import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import BodySymptomChecker from '../components/Home/BodySymptomChecker'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun, Globe } from 'lucide-react'

export default function Home() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'hi' : 'en'
    i18n.changeLanguage(nextLng)
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-emerald-500/30 selection:text-emerald-400 overflow-x-hidden`}>
      <Head>
        <title>NexusHealth | Precision Healthcare Management</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Outfit', sans-serif; }
          .bg-dots { background-image: radial-gradient(${theme === 'dark' ? '#1a1a1a' : '#e2e8f0'} 1px, transparent 1px); background-size: 30px 30px; }
        `}</style>
      </Head>

      {/* Background Decor */}
      <div className="fixed inset-0 bg-dots pointer-events-none opacity-40"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4 ${scrolled ? (theme === 'dark' ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
               N
             </div>
             <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">NexusHealth</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-sm font-medium theme-text-muted">
             <a href="#features" className="hover:text-emerald-400 transition-colors">{t('patient_portal')}</a>
             <a href="#solutions" className="hover:text-emerald-400 transition-colors">{t('clinician_hub')}</a>
             <a href="#resources" className="hover:text-emerald-400 transition-colors">{t('admin_command')}</a>
          </div>

          <div className="flex items-center gap-4">
             {/* Language Toggle */}
             <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-slate-500/10 transition-colors theme-text-muted flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">{i18n.language}</span>
             </button>

             {/* Theme Toggle */}
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-500/10 transition-colors theme-text-muted">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
             </button>

             <Link href="/login" className="text-sm font-semibold theme-text-muted hover:text-emerald-500 transition-colors px-4 py-2">
               Sign In
             </Link>
             <Link href="/login" className="bg-emerald-500 text-slate-950 text-sm font-bold px-6 py-2.5 rounded-full hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
               Get Started
             </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-10 border-emerald-500/20 bg-emerald-500/5 transition-transform hover:scale-105 cursor-default">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
             </span>
             <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">v2.0 &mdash; AI Triage Engine Now Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.95] theme-text-primary">
            {i18n.language === 'hi' ? 'स्वास्थ्य सेवा के लिए' : 'Precision control'} <br />
            {i18n.language === 'hi' ? 'सटीक नियंत्रण' : 'for'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">{i18n.language === 'hi' ? 'NexusHealth' : 'healthcare'}</span>
          </h1>

          <p className="text-lg md:text-xl theme-text-muted max-w-2xl mb-12 leading-relaxed font-medium">
            Unify clinical workflows, scale telemedicine, and automate patient management 
            with a platform designed for the next era of medicine.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-20">
             <Link href="/login" className="px-10 py-5 bg-emerald-500 text-slate-950 font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3 group">
                Launch Hospital Portal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </Link>
             <button className="px-10 py-5 glass-card rounded-2xl font-bold theme-text-primary hover:bg-slate-500/5 transition-all">
                Schedule Consultation
             </button>
          </div>

          {/* Featured Roles */}
          <div className="flex flex-wrap justify-center gap-4 mb-24 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 duration-500">
             {['Patient Portal', 'Clinician Hub', 'Admin Command', 'Pharmacy Lab', 'AI Diagnostic'].map((role) => (
               <div key={role} className="px-6 py-2 rounded-full border dark:border-white/10 border-slate-200 text-xs font-bold tracking-widest uppercase theme-text-muted hover:border-emerald-500/50 hover:text-emerald-400 transition-all dark:bg-white/5 bg-slate-50">
                 {role}
               </div>
             ))}
          </div>

          {/* 3D Mockup Area */}
          <div className="relative w-full max-w-6xl mx-auto perspective-1000">
             <div className="relative z-10 w-full aspect-[16/10] dark:bg-[#0c0c0c] bg-white rounded-3xl border dark:border-white/10 border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden scale-[0.9] hover:scale-100 transition-transform duration-700 animate-float">
                {/* Mockup Header */}
                <div className="h-12 dark:bg-white/5 bg-slate-50 border-b dark:border-white/5 border-slate-100 flex items-center px-6 justify-between">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                   </div>
                   <div className="text-xs text-slate-500 font-medium font-mono">nexus-v2.admin.hub</div>
                   <div className="w-12"></div>
                </div>
                
                {/* Mockup Body Content Preview */}
                <div className="p-8 flex gap-8 h-full">
                   <div className="w-1/4 h-full border-r dark:border-white/5 border-slate-100 space-y-4">
                      <div className="h-4 w-3/4 dark:bg-white/10 bg-slate-200 rounded"></div>
                      <div className="h-4 w-1/2 dark:bg-white/5 bg-slate-100 rounded"></div>
                      <div className="h-4 w-1/2 dark:bg-white/5 bg-slate-100 rounded"></div>
                      <div className="pt-8 space-y-3">
                         {[1,2,3,4].map(i => <div key={i} className="h-8 w-full dark:bg-emerald-500/5 bg-emerald-50 rounded-lg border dark:border-emerald-500/10 border-emerald-100"></div>)}
                      </div>
                   </div>
                   <div className="flex-1 space-y-8">
                      <div className="grid grid-cols-3 gap-6">
                         {[1,2,3].map(i => (
                           <div key={i} className="h-32 rounded-2xl bg-gradient-to-br dark:from-white/5 from-slate-50 to-transparent border dark:border-white/5 border-slate-100 p-4">
                              <div className="h-3 w-12 bg-emerald-400/20 rounded mb-4"></div>
                              <div className="h-8 w-20 dark:bg-white/10 bg-slate-200 rounded"></div>
                           </div>
                         ))}
                      </div>
                      <div className="h-64 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Floating Elements around Mockup */}
             <div className="absolute -top-10 -right-10 w-64 h-80 glass-card rounded-3xl p-6 z-20 animate-float-delayed border-emerald-500/30 hidden lg:block">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">🏥</div>
                   <div>
                      <p className="text-xs font-bold theme-text-primary">Emergency Level 4</p>
                      <p className="text-[10px] text-red-500">High Capacity</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="h-1 w-full dark:bg-white/10 bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full w-[85%] bg-red-500"></div>
                   </div>
                   <div className="flex justify-between text-[10px] theme-text-muted font-bold">
                      <span>Beds Occupied</span>
                      <span>85/100</span>
                   </div>
                </div>
                <button className="w-full mt-10 py-3 rounded-xl dark:bg-white/5 bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/10 border dark:border-white/10 border-slate-200 text-[10px] font-bold uppercase transition-all theme-text-primary">Optimize Flow</button>
             </div>

             <div className="absolute -bottom-10 -left-10 w-72 glass-card rounded-3xl p-6 z-20 animate-float border-blue-500/30 hidden lg:block">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-xs font-bold theme-text-primary">Live Telemedicine</p>
                </div>
                <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden relative">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=transparent" className="w-full h-full object-cover scale-150 grayscale" alt="" />
                   <div className="absolute top-2 right-2 bg-red-600 px-2 py-0.5 rounded text-[8px] font-bold text-white">REC</div>
                </div>
                <p className="text-[10px] theme-text-muted font-medium">Consulting with Dr. Sarah Jenkins</p>
             </div>
          </div>
        </div>
      </section>

      {/* Interactive Symptom Checker Section */}
      <section className="relative py-24 border-y dark:border-white/5 border-slate-200 bg-emerald-500/[0.01]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"></div>
        <BodySymptomChecker />
      </section>

      {/* Feature Section */}
      <section id="features" className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
               <div className="max-w-2xl text-left">
                  <h2 className="text-emerald-500 dark:text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4">The Platform</h2>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 theme-text-primary">Intelligent tools for the modern clinic</h3>
                  <p className="theme-text-muted text-lg font-medium">We&apos;ve rebuilt hospital management from the ground up to focus on what matters: the patient outcome.</p>
               </div>
               <button className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors flex items-center gap-2 mb-2">
                  Explore Enterprise 
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { title: 'Telemedicine Hub', desc: 'Real-time encrypted P2P video conferencing with built-in triage nodes.', icon: '📹', color: 'emerald' },
                 { title: 'AI Diagnostics', desc: 'Advanced ML models trained on clinical data for symptom correlation.', icon: '🧠', color: 'blue' },
                 { title: 'Workflow Engine', desc: 'Automated staff scheduling and patient queuing with predictive analytics.', icon: '⚡', color: 'amber' },
                 { title: 'Pharmacy Node', desc: 'Integrated prescription tracking and automated refill synchronization.', icon: '💊', color: 'violet' },
                 { title: 'Lab Integrations', desc: 'Direct secure relay of test results from pathology units to patients.', icon: '🔬', color: 'rose' },
                 { title: 'Patient Command', desc: 'Full-spectrum control for patients over their records and documents.', icon: '👤', color: 'indigo' }
               ].map((feature, i) => (
                 <div key={i} className="glass-card p-10 rounded-[32px] border dark:border-white/5 border-slate-200 hover:border-emerald-500/20 group transition-all duration-500">
                    <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform`}>
                       {feature.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-4 theme-text-primary">{feature.title}</h4>
                    <p className="theme-text-muted text-sm leading-relaxed font-medium">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Trust & Stats (Solutions) */}
      <section id="solutions" className="py-32 px-6 relative dark:bg-white/[0.02] bg-slate-50 border-y dark:border-white/5 border-slate-200">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
               <h2 className="text-emerald-500 dark:text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4">The Solution</h2>
               <h3 className="text-4xl font-bold mb-8 italic font-serif theme-text-primary">Enterprise-grade infrastructure for any scale</h3>
               <p className="theme-text-muted text-lg mb-12 leading-relaxed font-medium">Whether you&apos;re a private clinic or a nationwide hospital network, NexusHealth scales with you. Our modular architecture allows for seamless deployment of new clinical nodes.</p>
               <div className="grid grid-cols-2 gap-10">
                  <div className="p-6 glass-card rounded-2xl border dark:border-white/5 border-slate-200">
                     <p className="text-4xl font-bold text-emerald-500 mb-2">99.9%</p>
                     <p className="text-xs font-bold uppercase tracking-widest theme-text-muted">Uptime SLA</p>
                  </div>
                  <div className="p-6 glass-card rounded-2xl border dark:border-white/5 border-slate-200">
                     <p className="text-4xl font-bold text-blue-400 mb-2">HIPAA</p>
                     <p className="text-xs font-bold uppercase tracking-widest theme-text-muted">Certified Security</p>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="glass-card rounded-[40px] p-10 border-emerald-500/10 dark:bg-emerald-500/[0.02] bg-emerald-50 relative z-10">
                  <p className="text-xl font-medium leading-relaxed italic theme-text-muted mb-8">
                     &ldquo;The scalability of NexusHealth allowed us to onboarding 200+ doctors in under a week. The UI is a breathe of fresh air compared to traditional EMRs.&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border border-emerald-500/30 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=transparent" alt="" />
                     </div>
                     <div>
                        <p className="font-bold text-sm theme-text-primary">Dr. Marcus Lee</p>
                        <p className="text-[10px] theme-text-muted uppercase tracking-widest font-bold">Chief Technology Officer, City General</p>
                     </div>
                  </div>
               </div>
               <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full"></div>
            </div>
         </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-emerald-500 dark:text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4">Resources Hub</h2>
               <h3 className="text-4xl font-bold theme-text-primary">Clinical excellence starts here</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { title: 'Security Protocol', tag: 'Whitepaper', time: '12 min read' },
                 { title: 'API Documentation', tag: 'Technical', time: 'Updated daily' },
                 { title: 'Clinical ROI Study', tag: 'Case Study', time: '8 min read' },
                 { title: 'Compliance Matrix', tag: 'Regulatory', time: 'v4.2 live' }
               ].map((res, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="aspect-video dark:bg-white/5 bg-slate-100 border dark:border-white/5 border-slate-200 rounded-2xl mb-4 group-hover:border-emerald-500/20 transition-all flex items-center justify-center overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">📄</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-400/10 px-2 py-0.5 rounded">{res.tag}</span>
                    <h4 className="text-lg font-bold mt-2 theme-text-primary group-hover:text-emerald-500 transition-colors">{res.title}</h4>
                    <p className="text-xs theme-text-muted mt-1 font-bold">{res.time}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-6 border-t dark:border-white/5 border-slate-200">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
               <div className="col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-lg">N</div>
                    <span className="text-lg font-bold theme-text-primary">NexusHealth</span>
                  </div>
                  <p className="theme-text-muted text-sm max-w-sm font-medium">The world&apos;s first unified clinical operating system built for healthcare enterprises and patients alike.</p>
               </div>
               <div>
                  <h5 className="font-bold mb-6 text-sm theme-text-primary">Platform</h5>
                  <ul className="theme-text-muted text-sm space-y-4 font-medium">
                     <li><a href="#" className="hover:text-emerald-400">Telemedicine</a></li>
                     <li><a href="#" className="hover:text-emerald-400">Diagnostics</a></li>
                     <li><a href="#" className="hover:text-emerald-400">Queue Engine</a></li>
                  </ul>
               </div>
               <div>
                  <h5 className="font-bold mb-6 text-sm theme-text-primary">Company</h5>
                  <ul className="theme-text-muted text-sm space-y-4 font-medium">
                     <li><a href="#" className="hover:text-emerald-500">About</a></li>
                     <li><a href="#" className="hover:text-emerald-400">Clinical Research</a></li>
                     <li><a href="#" className="hover:text-emerald-400">Security</a></li>
                  </ul>
               </div>
               <div>
                  <h5 className="font-bold mb-6 text-sm theme-text-primary">Support</h5>
                  <ul className="theme-text-muted text-sm space-y-4 font-medium">
                     <li><a href="#" className="hover:text-emerald-400">Documentation</a></li>
                     <li><a href="#" className="hover:text-emerald-400">System Status</a></li>
                     <li><a href="#" className="hover:text-emerald-400">Contact Hub</a></li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t dark:border-white/5 border-slate-200 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase font-bold tracking-widest text-slate-500">
               <p>&copy; 2026 NexusHealth Technologies. Built for clinical excellence.</p>
               <div className="flex gap-8">
                  <a href="#" className="hover:text-emerald-500">Privacy Policy</a>
                  <a href="#" className="hover:text-emerald-500">Terms of Service</a>
                  <a href="#" className="hover:text-emerald-500">Security Nodes</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  )
}
