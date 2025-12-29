
import React from 'react';
import { Achievement } from '../types';
import { Trophy, Star, Zap, Brain, CheckCircle, Lock, Medal, Calendar } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  
  const getIcon = (iconName: string, isUnlocked: boolean) => {
    const size = 32;
    const colorClass = isUnlocked ? 'text-blue-600' : 'text-slate-300';
    switch (iconName) {
      case 'CheckCircle': return <CheckCircle size={size} className={colorClass} />;
      case 'Trophy': return <Trophy size={size} className={colorClass} />;
      case 'Star': return <Star size={size} className={colorClass} />;
      case 'Zap': return <Zap size={size} className={colorClass} />;
      case 'Brain': return <Brain size={size} className={colorClass} />;
      default: return <Medal size={size} className={colorClass} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="bg-academic rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shrink-0">
             <Medal size={64} className="text-yellow-400 drop-shadow-lg" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black mb-2">Scholar Hall of Fame</h2>
            <p className="text-blue-100 text-lg font-medium mb-6 opacity-80">
              You've unlocked {unlockedCount} out of {achievements.length} badges!
            </p>
            <div className="w-full md:w-96 h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
               <div 
                className="h-full bg-yellow-400 transition-all duration-1000 ease-out" 
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
               />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Trophy size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            className={`p-8 rounded-[2.5rem] border transition-all duration-300 relative overflow-hidden group ${
              ach.isUnlocked 
              ? 'bg-white border-blue-100 shadow-xl shadow-blue-50 hover:-translate-y-2' 
              : 'bg-slate-50 border-slate-100 grayscale opacity-60'
            }`}
          >
            {ach.isUnlocked && (
              <div className="absolute top-0 right-0 p-4">
                 <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle size={16} />
                 </div>
              </div>
            )}
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${
              ach.isUnlocked ? 'bg-blue-50' : 'bg-slate-100'
            }`}>
              {getIcon(ach.icon, ach.isUnlocked)}
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2">{ach.title}</h3>
            <p className="text-sm text-slate-500 font-bold mb-6">{ach.description}</p>

            {ach.isUnlocked ? (
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                 <Calendar size={12} /> Unlocked {new Date(ach.unlockedAt!).toLocaleDateString()}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <Lock size={12} /> Locked Milestone
              </div>
            )}

            {/* Glassmorphic overlay effect for unlocked cards */}
            {ach.isUnlocked && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
