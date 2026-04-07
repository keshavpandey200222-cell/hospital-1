import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useDemoData, DEMO_ACCOUNTS } from '../context/DemoDataContext'

export default function Login() {
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-darkBG font-sans">
      <Head>
        <title>Sign In | Nexus Health</title>
      </Head>

      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary-600/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-secondary/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 mx-4 glass-panel rounded-3xl animate-fade-in-up">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/30 text-white font-bold text-2xl mb-6 hover:scale-105 transition-transform">
            N
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 font-light">Access your secure health portal</p>
        </div>

        {/* Demo Quick-Login Cards */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 text-center">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.role} onClick={() => quickLogin(acc)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-500/30 transition-all text-center group">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  acc.role === 'patient' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20' :
                  acc.role === 'doctor' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                  'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                }`}>{acc.initials}</div>
                <p className="text-xs text-white font-medium capitalize">{acc.role}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase">or sign in manually</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
               </span>
               <input 
                 type="email" 
                 className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-500"
                 placeholder="patient@nexus.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
            </div>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </span>
               <input 
                 type="password" 
                 className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all text-white placeholder-slate-500"
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
            className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center group"
          >
             {loading ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
             ) : (
                <span className="flex items-center gap-2">
                   Sign In 
                   <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
             )}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-slate-500">
          Demo credentials: <span className="text-slate-400">patient123</span> / <span className="text-slate-400">doctor123</span> / <span className="text-slate-400">admin123</span>
        </p>
      </div>
    </div>
  )
}
