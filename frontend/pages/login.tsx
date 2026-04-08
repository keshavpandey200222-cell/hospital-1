import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDemoData, DEMO_ACCOUNTS } from '../context/DemoDataContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useDemoData()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = login(email, password)
      if (user) {
        router.push(`/dashboard/${user.role}`)
      } else {
        setError('Invalid credentials. Use one of the demo accounts below.')
        setLoading(false)
      }
    }, 800)
  }

  const quickLogin = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setLoading(true)
    setTimeout(() => {
      login(account.email, account.password)
      router.push(`/dashboard/${account.role}`)
    }, 600)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex items-center justify-center font-sans transition-all duration-500 ${theme === 'dark' ? 'bg-[#050505]' : 'bg-[#EAEAEA]'}`}>
      <Head>
        <title>Sign In | Nexus Health</title>
      </Head>

      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[50%] ${theme === 'dark' ? 'bg-primary-600/20' : 'bg-emerald-500/10'} blur-[120px] rounded-full animate-pulse-slow`}></div>
         <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] ${theme === 'dark' ? 'bg-secondary/15' : 'bg-blue-500/10'} blur-[120px] rounded-full animate-pulse-slow`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 mx-4 glass-panel rounded-[32px] animate-fade-in-up shadow-2xl border-[#73628A]/10 dark:border-white/5">
        
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 text-white font-bold text-3xl mb-6 hover:scale-110 transition-transform">
            N
          </Link>
          <h1 className="text-4xl font-bold tracking-tight theme-text-primary mb-3">Welcome Back</h1>
          <p className="theme-text-muted font-medium text-sm letter-spacing-tight">Access your secure healthcare portal</p>
        </div>

        {/* Demo Quick-Login Cards */}
        <div className="mb-8">
          <p className="text-[10px] font-bold theme-text-muted uppercase tracking-[0.2em] mb-4 text-center">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-3">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.role} onClick={() => quickLogin(acc)}
                className="p-4 rounded-2xl dark:bg-white/5 bg-[#CBC5EA]/10 border dark:border-white/10 border-[#73628A]/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-center group active:scale-95 shadow-sm hover:shadow-md">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-3 shadow-sm ${
                  acc.role === 'patient' ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' :
                  acc.role === 'doctor' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                  'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                }`}>{acc.initials}</div>
                <p className="text-xs theme-text-primary font-bold capitalize">{acc.role}</p>
                <p className="text-[9px] theme-text-muted mt-1 truncate font-bold">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t dark:border-white/10 border-[#73628A]/10"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold theme-text-muted uppercase tracking-widest">or sign in manually</span>
          <div className="flex-grow border-t dark:border-white/10 border-[#73628A]/10"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold theme-text-muted ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
               </span>
               <input 
                 type="email" 
                 className="w-full pl-12 pr-4 py-4 dark:bg-white/5 bg-[#CBC5EA]/5 border dark:border-white/10 border-[#73628A]/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all theme-text-primary placeholder:text-slate-400 font-medium"
                 placeholder="patient@nexus.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold theme-text-muted uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted opacity-50">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </span>
               <input 
                 type="password" 
                 className="w-full pl-12 pr-4 py-4 dark:bg-white/5 bg-[#CBC5EA]/5 border dark:border-white/10 border-[#73628A]/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all theme-text-primary placeholder:text-slate-400 font-medium"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center group"
          >
             {loading ? (
                <span className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
             ) : (
                <span className="flex items-center gap-2">
                   Sign In 
                   <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
             )}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] theme-text-muted font-bold uppercase tracking-wider">
          Demo credentials: <span className="theme-text-primary">patient123</span> / <span className="theme-text-primary">doctor123</span> / <span className="theme-text-primary">admin123</span>
        </p>
      </div>
    </div>
  )
}
