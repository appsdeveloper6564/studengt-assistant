
import React, { useState } from 'react';
import { Subject, Flashcard, DocumentSummary } from '../types';
import { Brain, FileText, ChevronRight, BookOpen, RotateCcw, Plus, Trash2, X, Sparkles, Loader2, PlayCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { GoogleGenAI, Type } from "@google/genai";
import { AIService } from '../services/ai';

interface LearningHubProps {
  subjects: Subject[];
}

const LearningHub: React.FC<LearningHubProps> = ({ subjects = [] }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'notes' | 'ai-summaries'>('flashcards');
  const [selectedSubject, setSelectedSubject] = useState<string>((subjects || [])[0]?.id || '');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(StorageService.getFlashcards() || []);
  const [summaries, setSummaries] = useState<DocumentSummary[]>(StorageService.getDocSummaries() || []);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<string | null>(null);
  
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [summaryInput, setSummaryInput] = useState('');

  const filteredCards = (flashcards || []).filter(c => c.subjectId === selectedSubject);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      front: newFront,
      back: newBack,
      subjectId: selectedSubject
    };
    const updated = [...(flashcards || []), newCard];
    setFlashcards(updated);
    StorageService.saveFlashcards(updated);
    setNewFront('');
    setNewBack('');
    setIsAdding(false);
  };

  const generateQuizFromSummary = async (summary: DocumentSummary) => {
    setIsGeneratingQuiz(summary.id);
    const quiz = await AIService.generateQuiz(summary.summary);
    if (quiz) {
      alert(`AI has generated a quiz: "${quiz.title}". You can now find it in the Mock Tests section.`);
    }
    setIsGeneratingQuiz(null);
  };

  const handleSummarize = async () => {
    if (!summaryInput.trim() || isSummarizing) return;
    setIsSummarizing(true);
    try {
      const apiKey = AIService.getApiKey();
      if (!apiKey) throw new Error("API Key Missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Summarize: "${summaryInput.substring(0, 4000)}". Generate 3 flashcards.`;

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { front: { type: Type.STRING }, back: { type: Type.STRING } },
                  required: ["front", "back"]
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const newSummary: DocumentSummary = {
        id: crypto.randomUUID(),
        title: summaryInput.substring(0, 30) + '...',
        summary: data.summary || "Summary generated.",
        flashcards: data.flashcards || []
      };

      const updatedSummaries = [newSummary, ...(summaries || [])];
      setSummaries(updatedSummaries);
      StorageService.saveDocSummaries(updatedSummaries);

      const newGeneratedCards: Flashcard[] = (data.flashcards || []).map((f: any) => ({
        id: crypto.randomUUID(),
        front: f.front,
        back: f.back,
        subjectId: selectedSubject
      }));
      
      const updatedFlashcards = [...(flashcards || []), ...newGeneratedCards];
      setFlashcards(updatedFlashcards);
      StorageService.saveFlashcards(updatedFlashcards);

      setSummaryInput('');
    } catch (err) {
      alert("AI Error. Guru couldn't process this request.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Learning <span className="text-brand-blue">Hub</span></h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">AI-Powered Revision</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['flashcards', 'notes', 'ai-summaries'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-200'}`}
            >
              {tab === 'ai-summaries' ? 'AI Summaries' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {(subjects || []).map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubject(s.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${selectedSubject === s.id ? 'bg-white text-brand-deep border-white shadow-xl' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {activeTab === 'flashcards' && (
        <div className="flex flex-col items-center justify-center py-10 space-y-10">
          {(filteredCards || []).length > 0 ? (
            <>
              <div onClick={() => setIsFlipped(!isFlipped)} className="relative w-full max-w-md h-72 cursor-pointer perspective-1000 group">
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-10 backface-hidden shadow-2xl">
                    <p className="text-2xl font-black text-white text-center">{(filteredCards || [])[currentCardIdx]?.front}</p>
                    <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       <RotateCcw size={12} /> Tap to flip
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-brand-blue border-2 border-brand-blue/50 rounded-[3rem] flex items-center justify-center p-10 rotate-y-180 backface-hidden shadow-2xl">
                    <p className="text-2xl font-black text-white text-center">{(filteredCards || [])[currentCardIdx]?.back}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentCardIdx(p => Math.max(0, p-1))} className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center"><ChevronRight className="rotate-180" /></button>
                <span className="font-black">{currentCardIdx + 1} / {(filteredCards || []).length}</span>
                <button onClick={() => setCurrentCardIdx(p => Math.min((filteredCards || []).length-1, p+1))} className="w-14 h-14 bg-brand-blue rounded-2xl flex items-center justify-center"><ChevronRight /></button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[3rem] w-full">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-500 font-bold">No cards here. Use AI Summaries to generate some!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai-summaries' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="bg-slate-900/50 p-8 rounded-[3rem] border border-slate-800 space-y-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles size={20} className="text-brand-orange" /> Note Alchemist
            </h3>
            <textarea 
              value={summaryInput}
              onChange={e => setSummaryInput(e.target.value)}
              placeholder="Paste text here..."
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm font-medium outline-none text-slate-200"
            />
            <button onClick={handleSummarize} disabled={isSummarizing} className="w-full py-4 bg-festive-gradient text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
              {isSummarizing ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(summaries || []).map(s => (
              <div key={s.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 space-y-4">
                <h4 className="font-black text-white truncate">{s.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed italic">"{s.summary}"</p>
                <button 
                  onClick={() => generateQuizFromSummary(s)} 
                  disabled={!!isGeneratingQuiz}
                  className="w-full py-3 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white transition-all"
                >
                  {isGeneratingQuiz === s.id ? <Loader2 className="animate-spin" size={14} /> : <PlayCircle size={14} />} 
                  Generate AI Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHub;
