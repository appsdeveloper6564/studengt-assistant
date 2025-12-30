
import React, { useState, useEffect } from 'react';
import { UserProfile, Subject } from '../types';
import { User, Book, School, Save, CheckCircle2, Coins, Zap, ExternalLink, Info, Plus, Trash2, Palette, ShieldCheck, GraduationCap } from 'lucide-react';
import { StorageService } from '../services/storage';
import AdsterraAd from './AdsterraAd';

interface SettingsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, setProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects());
  const [showSaved, setShowSaved] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const colors = ['#3b82f6', '#f97316', '#a855f7', '#10b981', '#f43f5e'];
    const newSubject: Subject = { id: crypto.randomUUID(), name: newSubjectName, color: colors[subjects.length % colors.length] };
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    setNewSubjectName('');
  };

  const removeSubject = (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    StorageService.saveSubjects(updated);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-20 space-y-12">
      <div className="bg-[#0f172a] p-12 lg:p-16 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
        
        <div className="relative z-10 mb-12 flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-blue text-white rounded-[2rem] flex items-center justify-center shadow-2xl neon-blue">
             <GraduationCap size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Academic Identity</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Configure your hub profile</p>
          </div>
        </div>

        {showSaved && (
          <div className="mb-10 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 font-black text-sm animate-in fade-in">
            <ShieldCheck size={24} /> Configuration Updated Successfully
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">
                Scholar Full Name
              </label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Alex Johnson" className="w-full px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl focus:border-brand-blue font-bold text-white outline-none transition-all shadow-inner" />
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">
                Current Level / Grade
              </label>
              <input type="text" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="e.g., Year 12" className="w-full px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl focus:border-brand-blue font-bold text-white outline-none transition-all shadow-inner" />
            </div>
          </div>
          <button type="submit" className="w-full py-6 bg-brand-blue text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-xl shadow-brand-blue/20 uppercase tracking-widest text-sm active:scale-[0.98]">Synchronize Profile</button>
        </form>
      </div>

      <div className="bg-[#0f172a] p-12 lg:p-16 rounded-[4rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-6 mb-12">
           <div className="w-16 h-16 bg-brand-purple text-white rounded-[1.8rem] flex items-center justify-center shadow-xl neon-purple">
              <Palette size={32} />
           </div>
           <div>
              <h3 className="text-3xl font-black text-white tracking-tight">Focus Disciplines</h3>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Manage your active subjects</p>
           </div>
        </div>

        <div className="flex gap-4 mb-12">
           <input 
             type="text" 
             value={newSubjectName} 
             onChange={e => setNewSubjectName(e.target.value)} 
             placeholder="Add discipline..." 
             className="flex-1 px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl font-bold text-white focus:border-brand-purple outline-none shadow-inner"
           />
           <button onClick={addSubject} className="px-10 bg-brand-purple text-white rounded-3xl font-black flex items-center gap-2 shadow-xl shadow-brand-purple/20 hover:bg-purple-600 active:scale-95 transition-all uppercase tracking-widest text-xs">Add</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {subjects.map(s => (
             <div key={s.id} className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-[2rem] group hover:border-brand-purple transition-all">
                <div className="flex items-center gap-5">
                   <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}66` }}></div>
                   <span className="font-black text-slate-200 uppercase tracking-wider text-sm">{s.name}</span>
                </div>
                <button onClick={() => removeSubject(s.id)} className="text-slate-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2"><Trash2 size={20} /></button>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-12 lg:p-16 rounded-[4rem] border border-slate-800 shadow-2xl relative group overflow-hidden">
        <div className="absolute -right-12 -bottom-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
           <Coins size={280} className="text-brand-orange" />
        </div>
        <div className="flex items-center gap-6 mb-10 relative z-10">
           <div className="w-16 h-16 bg-brand-orange/20 text-brand-orange rounded-3xl flex items-center justify-center shadow-xl border border-brand-orange/30 neon-orange">
              <Zap size={32} />
           </div>
           <h3 className="text-3xl font-black text-white tracking-tight">Economic Growth</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
          <div className="p-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-800">
             <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">Completion Rewards</p>
             <p className="text-3xl font-black text-white">+10 PTS</p>
             <p className="text-xs font-medium text-slate-500 mt-2">Earned per mission target achieved.</p>
          </div>
          <div className="p-8 bg-slate-900/80 rounded-[2.5rem] border border-slate-800">
             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Daily Consistency</p>
             <p className="text-3xl font-black text-white">+5 PTS</p>
             <p className="text-xs font-medium text-slate-500 mt-2">Earned for routine habit logging.</p>
          </div>
        </div>
      </div>

      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default Settings;
