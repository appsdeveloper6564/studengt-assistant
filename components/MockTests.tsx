
import React, { useState, useEffect } from 'react';
import { Subject, Quiz } from '../types';
import { BookOpen, Timer, ChevronRight, CheckCircle2, AlertCircle, Trophy, RotateCcw } from 'lucide-react';

interface MockTestsProps {
  subjects: Subject[];
}

const MockTests: React.FC<MockTestsProps> = ({ subjects }) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [quizzes] = useState<Quiz[]>([
    {
      id: '1', title: 'Biology Foundations', subjectId: '2',
      questions: [
        { question: "Which organelle is responsible for cellular respiration?", options: ["Ribosome", "Mitochondria", "Nucleus", "Vacuole"], correctAnswer: 1 },
        { question: "What is the primary function of DNA?", options: ["Energy Storage", "Structural Support", "Genetic Encoding", "Transport"], correctAnswer: 2 }
      ]
    },
    {
      id: '2', title: 'Physics Laws', subjectId: '2',
      questions: [
        { question: "What is the unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswer: 2 }
      ]
    }
  ]);

  useEffect(() => {
    let timer: any;
    if (activeQuiz && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && activeQuiz && !isFinished) {
      setIsFinished(true);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft, isFinished]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(quiz.questions.length * 60); // 1 min per q
    setIsFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (idx === activeQuiz!.questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < activeQuiz!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsFinished(true);
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
           <h2 className="text-4xl font-black text-white mb-2">Quiz Concluded!</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analytics for {activeQuiz.title}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
           <div className="text-7xl font-black text-brand-blue mb-4">{Math.round((score/activeQuiz.questions.length)*100)}%</div>
           <p className="text-xl font-bold text-slate-300">You scored {score} out of {activeQuiz.questions.length}</p>
        </div>
        <button onClick={() => setActiveQuiz(null)} className="px-10 py-5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all">Back to Tests</button>
      </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/20">
                 <BookOpen size={20} />
              </div>
              <h3 className="text-xl font-black text-white">{activeQuiz.title}</h3>
           </div>
           <div className="flex items-center gap-3 bg-brand-orange/10 px-4 py-2 rounded-xl border border-brand-orange/20 text-brand-orange font-black text-lg tabular-nums">
              <Timer size={18} /> {formatTime(timeLeft)}
           </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 h-1 bg-brand-blue transition-all duration-500" style={{ width: `${((currentQuestion+1)/activeQuiz.questions.length)*100}%` }}></div>
           <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-6">Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
           <h4 className="text-3xl font-black text-white mb-10 leading-tight">{q.question}</h4>
           <div className="grid grid-cols-1 gap-4">
              {q.options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left p-6 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-300 hover:border-brand-blue hover:bg-slate-800 hover:text-white transition-all flex justify-between items-center group"
                >
                  <span>{opt}</span>
                  <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="bg-festive-gradient p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-black mb-4 tracking-tight">Mock Tests</h2>
            <p className="text-blue-50 text-xl font-medium mb-8 leading-relaxed">Simulate real exams and track your performance analytics.</p>
         </div>
         <BookOpen size={180} className="absolute -bottom-10 -right-10 opacity-20 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 hover:border-brand-blue/40 transition-all group flex flex-col h-full shadow-lg">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-inner">
                   <RotateCcw size={20} />
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest">
                   Live Attempt
                </div>
             </div>
             <h4 className="text-2xl font-black text-white mb-2 tracking-tight">{quiz.title}</h4>
             <p className="text-xs text-slate-500 font-bold mb-10">{quiz.questions.length} Questions • {quiz.questions.length} Minutes</p>
             <button onClick={() => startQuiz(quiz)} className="mt-auto w-full py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl shadow-brand-blue/20 transition-all uppercase tracking-widest text-xs active:scale-95">Start Assessment</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTests;
