import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Book, School, Target, Save, CheckCircle2, Coins, Play, Zap, ShieldCheck, ExternalLink, Info } from 'lucide-react';
import NativeAd from './NativeAd';

interface SettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-20">
      {/* PROFILE SECTION */}
      <div className="bg-white card-surface p-10 lg:p-12 rounded-[3rem] border shadow-sm relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="relative z-10 mb-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Book size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h2>
            <p className="text-slate-400 font-medium">Manage your academic identity.</p>
          </div>
        </div>

        {showSaved && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 size={20} />
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <User size={14} className="text-blue-500" /> Full Name
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Alex Johnson"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Zap size={14} className="text-blue-500" /> Class / Grade
              </label>
              <input 
                type="text" 
                value={formData.grade}
                onChange={e => setFormData({...formData, grade: e.target.value})}
                placeholder="e.g., Year 12 / CS Major"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <School size={14} className="text-blue-500" /> School / College Name
              </label>
              <input 
                type="text" 
                value={formData.school}
                onChange={e => setFormData({...formData, school: e.target.value})}
                placeholder="e.g., Stanford University"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
          >
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>

      {/* POINTS EARNING INSTRUCTIONS (UNDER THE BOOK/PROFILE) */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 lg:p-10 rounded-[2.5rem] border border-yellow-200 shadow-sm mb-10 overflow-hidden relative group">
        <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
           <Coins size={140} className="text-yellow-600" />
        </div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
           <div className="w-12 h-12 bg-yellow-400 text-yellow-950 rounded-xl flex items-center justify-center shadow-lg">
              <Info size={24} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800">How to Earn Points?</h3>
              <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Scholar Rewards System</p>
           </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-yellow-100">
             <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">1</div>
             <p className="text-sm text-slate-700 font-semibold leading-relaxed">
               <span className="text-blue-600 font-black">Tasks:</span> Har task pura karne par aapko <span className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-700">+10 Points</span> milte hain.
             </p>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-yellow-100">
             <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">2</div>
             <p className="text-sm text-slate-700 font-semibold leading-relaxed">
               <span className="text-emerald-600 font-black">Routine:</span> Daily habits check karne par <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">+5 Points</span> add honge.
             </p>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-yellow-100">
             <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-lg flex items-center justify-center shrink-0 font-black text-xs">3</div>
             <div className="space-y-2">
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  <span className="text-yellow-700 font-black">Free Points:</span> Sidebar mein "Free +10 Pts" par click karein.
                </p>
                <div className="text-[11px] bg-yellow-400/20 p-2 rounded-lg border border-yellow-300/30 text-yellow-800 font-bold">
                   <span className="font-black underline">Important:</span> Ad par click karke 5 seconds rukiye (Verification) tabhi points milenge!
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ADSTERRA NATIVE BANNER AREA - SETTINGS */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="h-px flex-1 bg-slate-300"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
            Academic Sponsor <ExternalLink size={10} />
          </span>
          <div className="h-px flex-1 bg-slate-300"></div>
        </div>
        <NativeAd />
      </div>
    </div>
  );
};

export default Settings;