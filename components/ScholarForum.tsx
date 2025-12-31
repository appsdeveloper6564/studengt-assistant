
import React, { useState, useEffect } from 'react';
import { UserProfile, ForumPost } from '../types';
import { MessageSquare, ThumbsUp, MessageCircle, Search, Plus, User, Clock, X, Bot, Sparkles, Loader2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';

interface ScholarForumProps {
  profile: UserProfile;
}

const ScholarForum: React.FC<ScholarForumProps> = ({ profile }) => {
  const [posts, setPosts] = useState<ForumPost[]>(StorageService.getForumPosts());
  const [isPosting, setIsPosting] = useState(false);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: ForumPost = {
      id: crypto.randomUUID(),
      author: profile.name || 'Scholar',
      title: newTitle,
      content: newContent,
      timestamp: 'Just now',
      upvotes: 1,
      commentsCount: 0
    };

    setIsAiAnswering(true);
    const aiSuggestion = await AIService.getForumSuggestion(newPost);
    
    // Add AI comment automatically
    const updated = [newPost, ...posts];
    setPosts(updated);
    StorageService.saveForumPosts(updated);
    
    setIsPosting(false);
    setNewTitle('');
    setNewContent('');
    setIsAiAnswering(false);
    
    // Save AI response as a comment in logic (here we just alert or show in UI for simplicity)
    // In a real DB, you'd add this to a Comments table
  };

  const handleUpvote = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p);
    setPosts(updated);
    StorageService.saveForumPosts(updated);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Community <span className="text-brand-purple">Forum</span></h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">AI-Moderated Peer Ecosystem</p>
        </div>
        <button onClick={() => setIsPosting(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-600 transition-all shadow-xl shadow-brand-purple/20 active:scale-95">
          <Plus size={20} /> New Discussion
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input type="text" placeholder="Search topics, questions or strategies..." className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-slate-800 rounded-3xl focus:border-brand-purple font-bold text-slate-200 outline-none shadow-inner" />
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 hover:border-brand-purple/30 transition-all group shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500 shadow-inner">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-xs font-black text-white">{post.author}</p>
                   <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter"><Clock size={10} /> {post.timestamp}</p>
                </div>
                <div className="ml-auto bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase flex items-center gap-1">
                   <Bot size={12} /> AI Assisted
                </div>
             </div>
             <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-purple transition-colors leading-tight">{post.title}</h3>
             <p className="text-slate-400 font-medium mb-8 leading-relaxed line-clamp-3">{post.content}</p>
             <div className="flex items-center gap-6 pt-6 border-t border-slate-800/50">
                <button 
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors bg-slate-900/50 px-4 py-2 rounded-xl"
                >
                   <ThumbsUp size={16} /> {post.upvotes} UPVOTES
                </button>
                <button className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-brand-blue transition-colors">
                   <MessageCircle size={16} /> {post.commentsCount} DISCUSSIONS
                </button>
             </div>
          </div>
        ))}
      </div>

      {isPosting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-brand-purple/10">
                <h3 className="text-2xl font-black text-white">Launch Discussion</h3>
                <button onClick={() => setIsPosting(false)}><X size={28} /></button>
             </div>
             <form onSubmit={handlePost} className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject Header</label>
                  <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., Best way to solve Quadratic Equations?" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white outline-none focus:border-brand-purple shadow-inner" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Query Content</label>
                  <textarea rows={6} value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Provide context, formulas or specific hurdles..." className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white outline-none focus:border-brand-purple resize-none shadow-inner" />
                </div>
                <button type="submit" disabled={isAiAnswering} className="w-full py-6 bg-brand-purple text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-95 transition-all">
                  {isAiAnswering ? <><Loader2 size={20} className="animate-spin" /> Consultant AI Peer...</> : 'Post to Community'}
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarForum;
