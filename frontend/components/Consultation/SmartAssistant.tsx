import React, { useState } from 'react';
import { useDemoData, RecommendedDoctor } from '../../context/DemoDataContext';

const SmartAssistant: React.FC = () => {
  const { getSuggestions } = useDemoData();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    specialty: string;
    isEmergency: boolean;
    recommendations: RecommendedDoctor[];
  } | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    const data = await getSuggestions(symptoms);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Search Input Section */}
      <div className="glass-card rounded-3xl p-8 border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-4xl">🧠</span> Smart Health Assistant
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl">
            Describe your symptoms in natural language. Our AI will analyze them to suggest the right specialist and nearby hospitals.
          </p>

          <form onSubmit={handleAnalyze} className="relative max-w-3xl">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., 'I have persistent chest pain, feeling dizzy and sweating since morning'..."
              className="w-full bg-slate-900/40 border border-white/10 rounded-2xl p-6 text-white text-lg outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all min-h-[120px] placeholder:text-slate-600 shadow-inner"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute bottom-4 right-4 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Symptoms
                  <span className="text-xl">⚡</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Emergency Alert */}
      {result?.isEmergency && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-pulse">
          <div className="w-16 h-16 bg-rose-500 flex items-center justify-center rounded-2xl text-3xl shadow-lg shadow-rose-500/40">
            ⚠️
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-rose-400">Emergency Detected</h3>
            <p className="text-rose-300/80">Your symptoms indicate a possible medical emergency. Please visit the nearest emergency room immediately or call emergency services.</p>
          </div>
          <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20">
            Call Ambulance Now
          </button>
        </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div className="animate-fade-in-up">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-primary-400 font-semibold tracking-wider text-sm uppercase">Analysis Complete</span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Recommended Specialist: <span className="text-primary-500">{result.specialty}</span>
              </h3>
            </div>
            <div className="text-slate-400 text-sm">
              Sorted by Proximity & Rating
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.recommendations.map((doc) => (
              <div key={doc.id} className="glass-card rounded-2xl p-6 border-white/5 hover:border-primary-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:rotate-6 transition-transform">
                    {doc.firstName[0]}{doc.lastName[0]}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/20 text-sm font-bold">
                    ⭐ {doc.rating}
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">Dr. {doc.firstName} {doc.lastName}</h4>
                <p className="text-slate-400 text-sm mb-4">{doc.specialty} • {doc.experienceYears} yrs exp.</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-lg">🏥</span>
                    {doc.hospitalName}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <span className="text-lg">📍</span>
                    {doc.distance} km away
                  </div>
                  {doc.isEmergencyReady && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                      Emergency Support Available
                    </div>
                  )}
                </div>

                <button className="w-full bg-white/5 hover:bg-primary-600 text-white py-3 rounded-xl font-bold border border-white/10 hover:border-primary-500 transition-all active:scale-95">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
