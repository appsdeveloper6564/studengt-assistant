
import React, { useState } from 'react';
import { Achievement } from '../types';
import { Trophy, Medal, Lock, CheckCircle, Star, Zap, Brain, Plus, X } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
  onAddAchievement: (ach: Achievement) => void;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, onAddAchievement }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  
  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const size = 32;
    const colorClass = isUnlocked ? 'text-blue-600' : 'text-slate-300';
    switch (iconName) {
      case 'CheckCircle': return <CheckCircle size={size} className={colorClass} />;
      case 'Star': return <Star size={size} className={colorClass} />;
      case 'Zap': return <Zap size={size} className={colorClass} />;
      case 'Brain': return <Brain size={size} className={colorClass} />;
      default: return <Trophy size={size} className={colorClass} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddAchievement({
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDesc,
      icon: 'Trophy',
      requirement: 1,
      type: 'custom',
      isUnlocked: true, // Custom ones are like personal medals
      unlockedAt: new Date().toISOString()
    });
    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-academic rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black mb-2">Scholar Hall of Fame</h2>
          <p className="text-blue-100 text-lg font-medium opacity-80">
            {unlockedCount} Badges Unlocked!
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={20} /> Add Personal Goal
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-xl animate-in zoom-in-95">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Add Achievement (Ad Required)</h3>
              <button onClick={() => setIsAdding(false)}><X /></button>
           </div>
           <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Achievement Title" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:border-blue-500 font-bold" />
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short Description..." className="w-full px-6 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:border-blue-500 font-bold" />
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl">Create Medal</button>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((ach) => (
          <div key={ach.id} className={`p-8 rounded-[2.5rem] border transition-all ${ach.isUnlocked ? 'bg-white border-blue-100 shadow-xl' : 'bg-slate-50 opacity-60 grayscale'}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${ach.isUnlocked ? 'bg-blue-50' : 'bg-slate-100'}`}>
              {getIcon(ach.icon, ach.isUnlocked)}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">{ach.title}</h3>
            <p className="text-sm text-slate-500 font-bold mb-4">{ach.description}</p>
            {ach.isUnlocked && <span className="text-[10px] font-black text-blue-400 uppercase">Earned {new Date(ach.unlockedAt!).toLocaleDateString()}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
