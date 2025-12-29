
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Book, School, Target, Save, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white card-surface p-12 rounded-[3rem] border shadow-sm relative overflow-hidden">
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

        <div className="mt-12 p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
           <h4 className="font-black text-blue-900 mb-2 uppercase text-xs tracking-widest">About Point Earnings</h4>
           <p className="text-blue-700/70 text-sm leading-relaxed font-medium">
             Your points are tied to your local browser storage. Complete your tasks and daily routines to climb the scholar ranks! To monetize your app like a pro, consider integrating an ad provider like Google AdMob once you compile for mobile.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
