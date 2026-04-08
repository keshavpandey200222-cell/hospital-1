import React, { useState } from 'react';
import Link from 'next/link';

interface SymptomInfo {
  specialist: string;
  problems: string[];
  advice: string;
  isEmergency?: boolean;
}

const BODY_DATA: Record<string, SymptomInfo> = {
  head: {
    specialist: 'Neurologist',
    problems: ['Frontal Headache', 'Temporal Pain', 'Dizziness', 'Confusion'],
    advice: 'Try resting in a dark room. If pain is severe or accompanied by speech issues, seek urgent care.',
  },
  chest: {
    specialist: 'Cardiologist',
    problems: ['Chest Pain', 'Pectoral Pressure', 'Heart Palpitations'],
    advice: 'Avoid physical exertion. Seek immediate medical help if pain radiates to the arm or jaw.',
    isEmergency: true,
  },
  abdomen: {
    specialist: 'Gastroenterologist',
    problems: ['Abdominal Cramps', 'Acidity', 'Bloating', 'Nausea'],
    advice: 'Try to eat light, non-spicy food and stay hydrated. If pain is sharp and persistent, consult a doctor.',
  },
  arms: {
    specialist: 'Orthopedic / Physiotherapist',
    problems: ['Shoulder Pain', 'Elbow Stiffness', 'Wrist Ache'],
    advice: 'Rest the affected limb and apply ice. If pain persists after 48 hours, seek professional advice.',
  },
  legs: {
    specialist: 'Orthopedic / Vascular Specialist',
    problems: ['Knee Pain', 'Ankle Swelling', 'Thigh Muscle Strain'],
    advice: 'Avoid putting weight on the limb. Use elevation and compression if there is swelling.',
  },
};

const BodySymptomChecker: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  // Derive activeData with total safety
  const partToLookup = selectedPart || '';
  const activeData = BODY_DATA[partToLookup] || null;

  const handlePartClick = (part: string) => {
    setSelectedPart(part);
    setSelectedSymptom(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-32 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
        
        {/* Left: Hyper-Realistic 3D Anatomical Model */}
        <div className="lg:col-span-6 flex justify-center relative min-h-[700px] group">
          
          {/* Background Glows */}
          <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full animate-pulse-slow"></div>
          
          {/* The Realistic 3D Muscle Image */}
          <div className="relative w-full max-w-[450px] aspect-[2/3] animate-float">
             <img 
               src="/assets/anatomy/pro_muscles.png" 
               alt="Anatomical Muscular System" 
               className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(16,185,129,0.15)] select-none pointer-events-none"
             />
             
             {/* Scanning Laser Beam Effect */}
             <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanner opacity-40 z-20 pointer-events-none"></div>

             {/* Interactive SVG Overlay (Invisible Hitboxes) */}
             <svg
               viewBox="0 0 400 600"
               className="absolute inset-0 w-full h-full z-30"
               xmlns="http://www.w3.org/2000/svg"
             >
                {/* HEAD HITBOX */}
                <path 
                  d="M165 40 Q200 25 235 40 L235 110 Q200 125 165 110 Z" 
                  className="fill-transparent cursor-pointer hover:fill-emerald-400/10 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handlePartClick('head'); }}
                  onMouseEnter={() => setHoveredPart('Neural Nodes / Head')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* CHEST HITBOX */}
                <path 
                   d="M150 120 Q200 110 250 120 L260 210 Q200 230 140 210 Z" 
                   className="fill-transparent cursor-pointer hover:fill-emerald-400/10 transition-colors"
                   onClick={(e) => { e.stopPropagation(); handlePartClick('chest'); }}
                   onMouseEnter={() => setHoveredPart('Cardiopulmonary / Chest')}
                   onMouseLeave={() => setHoveredPart(null)}
                />

                {/* ABDOMEN HITBOX */}
                <path 
                   d="M155 220 L245 220 L240 330 L160 330 Z" 
                   className="fill-transparent cursor-pointer hover:fill-emerald-400/10 transition-colors"
                   onClick={(e) => { e.stopPropagation(); handlePartClick('abdomen'); }}
                   onMouseEnter={() => setHoveredPart('Gastrointestinal / Abdomen')}
                   onMouseLeave={() => setHoveredPart(null)}
                />

                {/* ARMS HITBOX */}
                <g onClick={(e) => { e.stopPropagation(); handlePartClick('arms'); }} className="cursor-pointer group/arm" onMouseEnter={() => setHoveredPart('Brachial / Arms')} onMouseLeave={() => setHoveredPart(null)}>
                  <path d="M120 130 L90 250 L140 250 Z" className="fill-transparent group-hover/arm:fill-emerald-400/10" />
                  <path d="M280 130 L310 250 L260 250 Z" className="fill-transparent group-hover/arm:fill-emerald-400/10" />
                </g>

                {/* LEGS HITBOX */}
                <g onClick={(e) => { e.stopPropagation(); handlePartClick('legs'); }} className="cursor-pointer group/leg" onMouseEnter={() => setHoveredPart('Musculoskeletal / Legs')} onMouseLeave={() => setHoveredPart(null)}>
                  <path d="M160 340 L195 340 L195 550 L150 550 Z" className="fill-transparent group-hover/leg:fill-emerald-400/10" />
                  <path d="M205 340 L240 340 L250 550 L205 550 Z" className="fill-transparent group-hover/leg:fill-emerald-400/10" />
                </g>

                {/* Dynamic Leader Lines */}
                {(hoveredPart || selectedPart === 'head') && (
                  <g className="animate-fade-in pointer-events-none">
                    <line x1="200" y1="45" x2="350" y2="45" className="stroke-emerald-400/40" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="350" cy="45" r="3" fill="#10b981" />
                  </g>
                )}
                {(hoveredPart || selectedPart === 'chest') && (
                  <g className="animate-fade-in pointer-events-none">
                    <line x1="250" y1="160" x2="370" y2="160" className="stroke-emerald-400/40" strokeWidth="1" strokeDasharray="5 5" />
                    <circle cx="370" cy="160" r="3" fill="#10b981" />
                  </g>
                )}
             </svg>

             {/* HUD Label Overlay */}
             <div className="absolute top-10 right-0 glass-card px-6 py-4 rounded-3xl border-white/5 backdrop-blur-3xl translate-x-1/2 z-40 pointer-events-none">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Optical Scan</p>
                <p className="text-sm font-bold text-white tracking-tight">{hoveredPart || (selectedPart ? selectedPart.toUpperCase() : 'SCANNING...')}</p>
             </div>
          </div>
        </div>

        {/* Right: AI Triage Panel */}
        <div className="lg:col-span-6 space-y-10">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               <span className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Deep Muscular Analysis v3.0</span>
            </div>
            <h2 className="text-6xl font-bold mb-8 tracking-tighter leading-[0.9] italic font-serif text-white">
              Real-time <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-200 to-blue-400">Anatomic Triage</span>
            </h2>
            <p className="text-slate-400 text-xl leading-relaxed max-w-xl font-light">
              Our highest-fidelity triage model identifies muscular and systemic anomalies with medical precision. Interact with the 3D render to begin.
            </p>
          </div>

          {!selectedPart ? (
            <div className="p-20 border border-dashed border-white/10 rounded-[4rem] bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-8 animate-pulse-slow">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-5xl">🔭</div>
              <div>
                <p className="text-white font-bold text-xl mb-2">Initialize Scanner</p>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Click any region on the 3D anatomical model to start clinical mapping.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex items-center justify-between p-8 glass-card rounded-[2.5rem] border-white/10 bg-gradient-to-r from-emerald-500/10 to-transparent">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-emerald-500 text-black rounded-2xl flex items-center justify-center text-3xl font-black shadow-2xl shadow-emerald-500/30">
                     {selectedPart[0].toUpperCase()}
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight italic">{selectedPart} Node Active</h4>
                      <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Structural Analysis in progress...</p>
                   </div>
                </div>
                <button 
                  onClick={() => { setSelectedPart(null); setSelectedSymptom(null); }} 
                  className="p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Symptom Grid */}
              {activeData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {activeData.problems.map((prob) => (
                    <button
                      key={prob}
                      onClick={() => setSelectedSymptom(prob)}
                      className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative group overflow-hidden ${
                        selectedSymptom === prob 
                          ? 'bg-emerald-500 border-emerald-500 text-black font-black scale-95 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.5)]' 
                          : 'bg-white/5 border-white/5 text-white hover:border-emerald-500/30 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg relative z-10">{prob}</span>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  ))}
                </div>
              )}

              {/* Pro Recommendation Card */}
              {selectedSymptom && activeData && (
                <div className={`p-12 rounded-[3.5rem] border-t border-white/10 animate-fade-in-up relative overflow-hidden shadow-2xl ${activeData.isEmergency ? 'bg-rose-950/20 border-rose-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
                  <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl">🩺</div>
                  
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Recommended Clinical Tier</p>
                    <h4 className="text-5xl font-black text-white italic tracking-tighter mb-8 leading-tight">
                      Consult <br />
                      <span className={activeData.isEmergency ? 'text-rose-500' : 'text-emerald-400'}>{activeData.specialist}</span>
                    </h4>
                    
                    <p className="text-slate-300 text-xl leading-relaxed mb-12 italic border-l-4 border-white/10 pl-8 font-light">
                       &ldquo;{activeData.advice}&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                      <Link 
                        href="/login" 
                        className={`flex-[3] py-6 rounded-3xl font-black text-center transition-all active:scale-95 text-xl tracking-tight uppercase shadow-2xl ${
                          activeData.isEmergency 
                            ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20' 
                            : 'bg-white text-black hover:bg-emerald-400 shadow-white/10'
                        }`}
                      >
                        {activeData.isEmergency ? 'ACTIVATE SOS PROTOCOL' : 'Book Clinical Session'}
                      </Link>
                      <button className="flex-1 py-6 rounded-3xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                        Specs
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
         @keyframes scanner {
           0% { top: 0; opacity: 0; }
           10% { opacity: 0.5; }
           90% { opacity: 0.5; }
           100% { top: 100%; opacity: 0; }
         }
         .animate-scanner {
           animation: scanner 4s ease-in-out infinite;
         }
      `}</style>
    </div>
  );
};

export default BodySymptomChecker;
