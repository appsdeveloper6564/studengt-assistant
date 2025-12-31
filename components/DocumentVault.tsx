
import React, { useState } from 'react';
import { Subject, DocResource } from '../types';
import { Files, Download, Search, FileText, Video, Plus, Tag, X, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';

interface DocumentVaultProps {
  subjects: Subject[];
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [resources, setResources] = useState<DocResource[]>(StorageService.getDocs().length > 0 ? StorageService.getDocs() : [
    { id: '1', name: 'Mathematics Revision Guide.pdf', type: 'pdf', subjectId: '1', size: '2.4 MB', tags: ['exam', 'revision'] },
    { id: '2', name: 'Chemical Bonding Notes.pdf', type: 'pdf', subjectId: '2', size: '1.8 MB', tags: ['chemistry', 'notes'] },
  ]);

  const handleAiAnalyze = async (res: DocResource) => {
    setIsAnalyzing(res.id);
    const summary = await AIService.askGuru(`Please provide a professional academic summary of this resource: ${res.name}`, 'High School', 'English');
    alert(`Guru Analysis for ${res.name}:\n\n${summary}`);
    setIsAnalyzing(null);
  };

  const filtered = resources.filter(r => 
    r.subjectId === selectedSubject && 
    (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags?.some(t => t.includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-[2rem] flex items-center justify-center border border-brand-blue/20">
              <Files size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Document <span className="text-brand-blue">Vault</span></h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Resource Repository</p>
           </div>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search docs or tags..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-12 pr-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar">
         {subjects.map(s => (
           <button 
             key={s.id} 
             onClick={() => setSelectedSubject(s.id)}
             className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${selectedSubject === s.id ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}
           >
             {s.name}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(res => (
          <div key={res.id} className="bg-[#0f172a] p-6 rounded-[2.5rem] border border-slate-800 hover:border-brand-blue transition-all group shadow-lg flex flex-col items-center text-center relative">
             <button 
               onClick={() => handleAiAnalyze(res)}
               className="absolute top-4 right-4 p-2 bg-brand-purple/10 text-brand-purple rounded-lg border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all"
             >
                {isAnalyzing === res.id ? <Loader2 className="animate-spin" size={14} /> : <BrainCircuit size={14} />}
             </button>
             <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:bg-brand-blue/10 transition-all ${res.type === 'video' ? 'text-brand-orange' : 'text-brand-blue'}`}>
                {res.type === 'video' ? <Video size={36} /> : <FileText size={36} />}
             </div>
             <h4 className="text-sm font-black text-white mb-2 leading-tight line-clamp-2 px-4">{res.name}</h4>
             <div className="flex flex-wrap gap-1 justify-center mb-6">
                {res.tags?.map(tag => (
                  <span key={tag} className="text-[7px] font-black uppercase tracking-tighter bg-slate-900 text-slate-500 px-2 py-0.5 rounded border border-slate-800">#{tag}</span>
                ))}
             </div>
             <button className="mt-auto w-full py-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Download
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentVault;
