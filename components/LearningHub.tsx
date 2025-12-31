
import React, { useState } from 'react';
import { Subject, Flashcard } from '../types';
import { Brain, FileText, ChevronRight, BookOpen, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface LearningHubProps {
  subjects: Subject[];
}

const LearningHub: React.FC<LearningHubProps> = ({ subjects }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes'>('flashcards');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || '');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', front: 'What is the powerhouse of the cell?', back: 'Mitochondria', subjectId: '2' },
    { id: '2', front: 'Formula for Newton\'s Second Law?', back: 'F = ma', subjectId: '2' },
  ]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const filteredCards = flashcards.filter(c => c.subjectId === selectedSubject);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
        <div>
          <h2 className="text-3xl font-black text-white">Learning <span className="text-brand-blue">Hub</span></h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Interactive Study Materials</p>
        </div>
        <div className="flex gap-2">
          {(['flashcards', 'notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedSubject(s.id); setCurrentCardIdx(0); setIsFlipped(false); }}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${selectedSubject === s.id ? 'bg-white text-slate-900 border-white' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center justify-center py-10 space-y-10">
          {filteredCards.length > 0 ? (
            <>
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full max-w-md h-64 cursor-pointer perspective-1000 group`}
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-[3rem] flex items-center justify-center p-10 backface-hidden shadow-2xl">
                    <p className="text-2xl font-black text-white text-center leading-tight">{filteredCards[currentCardIdx].front}</p>
                    <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       <RotateCcw size={12} /> Tap to flip
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 bg-brand-blue border-2 border-brand-blue/50 rounded-[3rem] flex items-center justify-center p-10 rotate-y-180 backface-hidden shadow-2xl">
                    <p className="text-2xl font-black text-white text-center leading-tight">{filteredCards[currentCardIdx].back}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <button 
                  onClick={() => { setCurrentCardIdx(prev => Math.max(0, prev - 1)); setIsFlipped(false); }}
                  disabled={currentCardIdx === 0}
                  className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <span className="text-xl font-black text-slate-500">{currentCardIdx + 1} / {filteredCards.length}</span>
                <button 
                  onClick={() => { setCurrentCardIdx(prev => Math.min(filteredCards.length - 1, prev + 1)); setIsFlipped(false); }}
                  disabled={currentCardIdx === filteredCards.length - 1}
                  className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800 w-full">
              <BookOpen size={64} className="mx-auto text-slate-700 mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No flashcards for this subject</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {[1, 2, 3].map(n => (
             <div key={n} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800 hover:border-brand-blue/50 transition-all group flex items-start gap-6">
                <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center shrink-0 border border-brand-blue/20">
                   <FileText size={24} />
                </div>
                <div className="flex-1">
                   <h4 className="text-xl font-black text-white mb-1 group-hover:text-brand-blue transition-colors">Digital Notes - Lecture {n}</h4>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Last Modified: 2 days ago</p>
                   <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-800 text-xs font-black rounded-lg hover:bg-slate-700 transition-colors">READ</button>
                      <button className="px-4 py-2 bg-brand-blue text-xs font-black rounded-lg shadow-lg">STUDY</button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default LearningHub;
