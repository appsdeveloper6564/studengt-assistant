
import React, { useState, useEffect } from 'react';
import { Subject, Quiz, QuizResult } from '../types';
import { BookOpen, Timer, ChevronRight, CheckCircle2, Trophy, TrendingUp, Sparkles, Loader2, Wand2, BrainCircuit, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AdService } from '../services/adService';

interface MockTestsProps {
  subjects: Subject[];
}

const MockTests: React.FC<MockTestsProps> = ({ subjects = [] }) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<QuizResult[]>(StorageService.getQuizResults() || []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1', title: 'Biology Foundations', subjectId: '2',
      questions: [
        { question: "Which organelle is responsible for cellular respiration?", options: ["Ribosome", "Mitochondria", "Nucleus", "Vacuole"], correctAnswer: 1 },
        { question: "What is the primary function of DNA?", options: ["Energy Storage", "Structural Support", "Genetic Encoding", "Transport"], correctAnswer: 2 },
        { question: "Who is known as the father of genetics?", options: ["Darwin", "Mendel", "Einstein", "Pasteur"], correctAnswer: 1 }
      ]
    }
  ]);

  const profile = StorageService.getProfile();

  const generateAiQuiz = async () => {
    if (!topicInput.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const quiz = await AIService.generateCustomQuiz(topicInput, profile.grade);
      if (quiz) {
        startQuiz(quiz);
        setTopicInput('');
      } else {
        alert("Guru is busy studying. Try again in a minute!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeResults = () => {
    AdService.showSmartlink();
    alert("Analyzing deep performance data... Redirecting to Secure Ad-Server.");
  };

  useEffect(() => {
    let timer: any;
    if (activeQuiz && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeQuiz && !isFinished) {
      handleQuizEnd();
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft, isFinished]);

  const handleQuizEnd = () => {
    setIsFinished(true);
    if (activeQuiz) {
      const newResult: QuizResult = {
        id: crypto.randomUUID(),
        quizTitle: activeQuiz.title,
        score,
        total: (activeQuiz.questions || []).length,
        date: new Date().toLocaleDateString()
      };
      const updatedResults = [newResult, ...(results || [])];
      setResults(updatedResults);
      StorageService.saveQuizResults(updatedResults);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft((quiz.questions || []).length * 60); 
    setIsFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (idx === (activeQuiz?.questions || [])[currentQuestion]?.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < (activeQuiz?.questions || []).length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleQuizEnd();
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (isFinished && activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-brand-orange text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl neon-orange rotate-6">
           <Trophy size={48} />
        </div>
        <div>
           <h2 className="text-4xl font-black text-white mb-2">Assessment Complete!</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Final Performance Report</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
           <div className="text-7xl font-black text-brand-blue mb-4">{activeQuiz.questions?.length > 0 ? Math.round((score/activeQuiz.questions.length)*100) : 0}%</div>
           <p className="text-xl font-bold text-slate-300">Total Score: {score} out of {(activeQuiz.questions || []).length}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => setActiveQuiz(null)} className="px-10 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-slate-700 transition-all">Back to Lobby</button>
          <button onClick={handleAnalyzeResults} className="px-10 py-5 bg-brand-orange text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <TrendingUp size={18}/> Analyze Mastery (Earn Points)
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const q = (activeQuiz.questions || [])[currentQuestion];
    if (!q) return null;
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/20">
                 <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-black text-white truncate max-w-[200px]">{activeQuiz.title}</h3>
           </div>
           <div className="flex items-center gap-3 bg-brand-orange/10 px-4 py-2 rounded-xl border border-brand-orange/20 text-brand-orange font-black text-lg tabular-nums">
              <Timer size={18} /> {formatTime(timeLeft)}
           </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 h-1 bg-brand-blue transition-all duration-500" style={{ width: `${((currentQuestion+1)/(activeQuiz.questions || []).length)*100}%` }}></div>
           <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-6">Question {currentQuestion + 1} of {(activeQuiz.questions || []).length}</p>
           <h4 className="text-2xl md:text-3xl font-black text-white mb-10 leading-tight">{q.question}</h4>
           <div className="grid grid-cols-1 gap-4">
              {(q.options || []).map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left p-6 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-300 hover:border-brand-blue hover:bg-slate-800 hover:text-white transition-all flex justify-between items-center group"
                >
                  <span className="flex-1">{opt}</span>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all text-brand-blue shrink-0" />
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* AI Quiz Generator Banner */}
      <div className="bg-[#0f172a] p-8 md:p-12 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-brand-purple text-white rounded-3xl flex items-center justify-center shadow-2xl neon-purple">
                 <BrainCircuit size={32} />
              </div>
              <div>
                 <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">AI Test Architect</h2>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Generate Instant Academic Quizzes</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
               <input 
                 type="text" 
                 value={topicInput}
                 onChange={e => setTopicInput(e.target.value)}
                 placeholder="Enter topic (e.g., Trigonometry, Periodic Table)..." 
                 className="flex-1 px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl text-white font-bold outline-none focus:border-brand-purple transition-all" 
               />
               <button 
                 onClick={generateAiQuiz}
                 disabled={isGenerating || !topicInput.trim()}
                 className="px-10 py-5 bg-brand-purple text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
               >
                 {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} Create AI Test
               </button>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {(quizzes || []).map(quiz => (
            <div key={quiz.id} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 hover:border-brand-blue/40 transition-all group flex flex-col h-full shadow-lg">
              <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{quiz.title}</h4>
              <p className="text-xs text-slate-500 font-bold mb-10">{(quiz.questions || []).length} Questions • {(quiz.questions || []).length} Minutes</p>
              <button onClick={() => startQuiz(quiz)} className="mt-auto w-full py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-brand-blue/20 transition-all uppercase tracking-widest text-xs active:scale-95">Take Assessment</button>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 space-y-8 h-fit">
          <h3 className="text-xl font-black text-white flex items-center gap-3"><TrendingUp size={24} className="text-brand-orange" /> Proficiency Log</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
            {(results || []).length > 0 ? (results || []).map(r => (
              <div key={r.id} className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => AdService.showSmartlink()}>
                <div>
                  <p className="text-xs font-black text-white truncate max-w-[150px]">{r.quizTitle}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{r.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-blue">{r.total > 0 ? Math.round((r.score/r.total)*100) : 0}%</p>
                  <p className="text-[9px] font-black text-slate-500">{r.score}/{r.total} ACCURACY</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto text-slate-700 mb-2" size={32} />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">No recent data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTests;
