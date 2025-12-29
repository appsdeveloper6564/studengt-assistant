import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Book, School, Target, Save, CheckCircle2, Coins, Play, Zap, ShieldCheck, ExternalLink } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSaved, setShowSaved] = useState(false);

  // Dynamically Load Native Banner for Settings
  useEffect(() => {
    const scriptId = 'adsterra-native-banner-script-settings';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl28355175.effectivegatecpm.com/d455aae87c3654e56936461ee385ca0f/invoke.js';
      document.body.appendChild(script);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="bg-white card-surface p-10 lg:p-12 rounded-[3rem] border shadow-sm relative overflow-hidden mb-10">
        {/* Visual background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="relative z-10 mb-12">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">My Profile</h2>
          <p className="text-slate-400 font-medium">Personalize your student assistant experience.</p>
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
                <Book size={14} className="text-blue-500" /> Class / Grade
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

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Target size={14} className="text-blue-500" /> Main Study Goal
              </label>
              <textarea 
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value})}
                placeholder="e.g., Ace my Calculus final and learn Python basics."
                rows={3}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800 transition-all resize-none"
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

      {/* SCHOLAR POINTS GUIDE (INSTRUCTION AREA) */}
      <div className="bg-white card-surface p-10 lg:p-12 rounded-[3rem] border shadow-sm mb-10 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
           <Coins size={120} className="text-yellow-600" />
        </div>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="w-14 h-14 bg-yellow-400 text-yellow-950 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-100">
              <Zap size={28} />
           </div>
           <div>
              <h3 className="text-2xl font-black text-slate-800">Scholar Points Guide</h3>
              <p className="text-xs font-black text-yellow-600 uppercase tracking-widest">Earn rewards for productivity</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
             <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={20} className="text-blue-600" />
                <h4 className="font-black text-slate-800">Complete Tasks</h4>
             </div>
             <p className="text-sm text-slate-500 font-medium mb-3">Complete any academic task from your list to earn points instantly.</p>
             <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black">+10 Pts</div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all">
             <div className="flex items-center gap-3 mb-3">
                <Play size={20} className="text-emerald-600" />
                <h4 className="font-black text-slate-800">Daily Routine</h4>
             </div>
             <p className="text-sm text-slate-500 font-medium mb-3">Maintain consistency by checking off your daily habits and routines.</p>
             <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black">+5 Pts</div>
          </div>

          <div className="p-6 bg-yellow-50 rounded-3xl border border-yellow-100 hover:border-yellow-300 transition-all md:col-span-2">
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={20} className="text-yellow-700" />
                <h4 className="font-black text-slate-800">Free Bonus Points (Verification)</h4>
             </div>
             <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
                Click "Free +10 Pts" in the sidebar. To secure points, you must click <span className="font-black">"Visit & Verify"</span> and stay on the partner page for <span className="font-black">5 seconds</span>. This helps us keep the app free and prevents spam!
             </p>
             <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-yellow-400 text-yellow-950 rounded-lg text-xs font-black">Ad Reward: +10 Pts</div>
                <div className="px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-black border border-yellow-200">Timer: 5s</div>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
           <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
             Points are stored locally on this device.
           </p>
        </div>
      </div>

      {/* ADSTERRA NATIVE BANNER AREA - SETTINGS */}
      <div className="mt-10 pt-10 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-6 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="h-px flex-1 bg-slate-300"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
            Sponsored Student Tool <ExternalLink size={10} />
          </span>
          <div className="h-px flex-1 bg-slate-300"></div>
        </div>
        
        <div className="bg-white card-surface rounded-[2rem] overflow-hidden border shadow-sm flex items-center justify-center min-h-[160px] p-2">
           <div id="container-d455aae87c3654e56936461ee385ca0f" className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Settings;