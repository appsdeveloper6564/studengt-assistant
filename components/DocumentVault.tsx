
import React, { useState } from 'react';
import { Subject, DocResource } from '../types';
import { Files, Download, Search, FileText, Video, MoreVertical, Plus, Grid, List } from 'lucide-react';

interface DocumentVaultProps {
  subjects: Subject[];
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id || '');
  const [resources] = useState<DocResource[]>([
    { id: '1', name: 'Mathematics Revision Guide.pdf', type: 'pdf', subjectId: '1', size: '2.4 MB' },
    { id: '2', name: 'Chemical Bonding Notes.pdf', type: 'pdf', subjectId: '2', size: '1.8 MB' },
    { id: '3', name: 'Modern History Overview.pdf', type: 'pdf', subjectId: '3', size: '3.1 MB' },
    { id: '4', name: 'Intro to Quantum Physics.video', type: 'video', subjectId: '2', size: '45 MB' },
  ]);

  const filtered = resources.filter(r => r.subjectId === selectedSubject);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-[2rem] flex items-center justify-center border border-brand-blue/20 shadow-inner">
              <Files size={32} />
           </div>
           <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Document <span className="text-brand-blue">Vault</span></h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Resource Repository</p>
           </div>
        </div>
        <button className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-brand-blue/20 active:scale-95 flex items-center gap-2">
           <Plus size={20} /> Upload Resource
        </button>
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
          <div key={res.id} className="bg-[#0f172a] p-6 rounded-[2.5rem] border border-slate-800 hover:border-brand-blue/40 transition-all group shadow-lg flex flex-col items-center text-center">
             <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-slate-800 group-hover:bg-brand-blue/10 group-hover:border-brand-blue/30 transition-all ${res.type === 'video' ? 'text-brand-orange' : 'text-brand-blue'}`}>
                {res.type === 'video' ? <Video size={36} /> : <FileText size={36} />}
             </div>
             <h4 className="text-sm font-black text-white mb-2 leading-tight line-clamp-2 px-4">{res.name}</h4>
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-8">{res.size || 'N/A'}</p>
             <button className="mt-auto w-full py-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Download File
             </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[3rem] border-4 border-dashed border-slate-800">
             <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No resources found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVault;
