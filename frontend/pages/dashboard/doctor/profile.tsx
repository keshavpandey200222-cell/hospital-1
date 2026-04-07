import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/Layout/DashboardLayout';

export default function DoctorProfile() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    title: 'MD, FACC',
    email: 'dr.jenkins@nexushealth.com',
    phone: '+1 (555) 901-2345',
    specialty: 'Cardiology',
    department: 'Cardiovascular Medicine',
    licenseNumber: 'MED-CA-2018-44921',
    npiNumber: '1234567890',
    education: 'Harvard Medical School, Class of 2012',
    residency: 'Johns Hopkins Hospital — Internal Medicine',
    fellowship: 'Mayo Clinic — Interventional Cardiology',
    yearsExperience: '12',
    languages: 'English, Spanish',
    bio: 'Board-certified cardiologist specializing in interventional procedures, heart failure management, and preventive cardiology. Passionate about telemedicine and improving patient outcomes through technology.',
    officeHours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    consultationFee: '$250',
    telemedicineAvailable: 'Yes',
  });

  const handleChange = (key: string, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, field, type = 'text', span = false }: { label: string; field: string; type?: string; span?: boolean }) => (
    <div className={span ? 'sm:col-span-2' : ''}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{label}</label>
      {editing ? (
        field === 'bio' ? (
          <textarea value={(profile as any)[field]} onChange={e => handleChange(field, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors resize-none h-28" />
        ) : (
          <input type={type} value={(profile as any)[field]} onChange={e => handleChange(field, e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors" />
        )
      ) : (
        <p className="text-white font-medium py-3 px-1">{(profile as any)[field] || '—'}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout role="doctor" title="My Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dr.%20Sarah%20Jenkins&backgroundColor=transparent" alt="" className="w-24 h-24" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">Dr. {profile.firstName} {profile.lastName}</h1>
              <p className="text-emerald-400 text-sm font-medium mt-1">{profile.title} — {profile.specialty}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">⭐ 4.9 Rating</span>
                <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full border border-primary-500/20 font-semibold">📹 Telemedicine</span>
                <span className="text-xs bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 font-semibold">12 Years Exp.</span>
              </div>
            </div>
            <div className="flex gap-3">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => setEditing(false)} className="border border-white/10 text-slate-300 px-5 py-3 rounded-full font-semibold hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">Save Changes</button>
                </>
              )}
            </div>
          </div>
          {saved && (
            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold animate-fade-in-up flex items-center gap-2 z-20">
              ✓ Profile updated successfully!
            </div>
          )}
        </div>

        {/* Professional */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">⚕️ Professional Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Specialty" field="specialty" />
            <Field label="Department" field="department" />
            <Field label="License Number" field="licenseNumber" />
            <Field label="NPI Number" field="npiNumber" />
            <Field label="Years of Experience" field="yearsExperience" />
            <Field label="Languages" field="languages" />
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">📞 Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Email Address" field="email" type="email" />
            <Field label="Phone Number" field="phone" type="tel" />
            <Field label="Office Hours" field="officeHours" />
            <Field label="Consultation Fee" field="consultationFee" />
            <Field label="Telemedicine Available" field="telemedicineAvailable" />
          </div>
        </div>

        {/* Education */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">🎓 Education & Training</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="Medical School" field="education" span />
            <Field label="Residency" field="residency" span />
            <Field label="Fellowship" field="fellowship" span />
          </div>
        </div>

        {/* Bio */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">📝 Bio & About</h2>
          <Field label="Professional Biography" field="bio" span />
        </div>

        {/* Logout */}
        <Link href="/login" className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-semibold transition-all mb-8 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </Link>
      </div>
    </DashboardLayout>
  );
}
