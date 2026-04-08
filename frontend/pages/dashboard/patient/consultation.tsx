import React from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import SmartAssistant from '../../../components/Consultation/SmartAssistant';
import Head from 'next/head';

export default function PatientConsultationPage() {
  return (
    <DashboardLayout role="patient" title="Smart Health Assistant">
      <Head>
        <title>Smart Health Assistant | HMS</title>
        <meta name="description" content="AI-powered symptom checker and health assistant." />
      </Head>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Consultation Assistant</h1>
          <p className="mt-2 text-lg text-slate-400">Get intelligent health suggestions and find the right care instantly.</p>
        </div>

        <SmartAssistant />

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pb-12">
          <div className="glass-card rounded-3xl p-8 border-white/5 group hover:border-primary-500/20 transition-all">
            <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Privacy & Security</h3>
            <p className="text-slate-400 leading-relaxed">
              Your symptom analysis is private and secure. Data is only used to suggest the most appropriate specialists and is encrypted end-to-end.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border-white/5 group hover:border-emerald-500/20 transition-all">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              📉
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ranking Algorithm</h3>
            <p className="text-slate-400 leading-relaxed">
              Our smart ranking organizes suggestions by analyzing distance, hospital capacity, and doctor experience to ensure you get the best care, fast.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
