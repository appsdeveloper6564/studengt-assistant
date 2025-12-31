
import React, { useState } from 'react';
import { UserProfile, ForumPost } from '../types';
// Added X to the list of icons imported from lucide-react
import { MessageSquare, ThumbsUp, MessageCircle, Search, Plus, User, Clock, X } from 'lucide-react';

interface ScholarForumProps {
  profile: UserProfile;
}

const ScholarForum: React.FC<ScholarForumProps> = ({ profile }) => {
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: '1', author: 'Rahul S.', title: 'Struggling with Organic Chemistry reactions', content: 'Anyone have a simple way to remember the SN1 vs SN2 reaction mechanisms? I keep getting confused during practice tests.', timestamp: '2h ago', upvotes: 24, commentsCount: 8 },
    { id: '2', author: 'Ananya P.', title: 'JEE Main Physics strategy', content: 'Sharing my formula sheet for Kinematics and Laws of Motion. Hope it helps everyone!', timestamp: '5h ago', upvotes: 56, commentsCount: 12 },
  ]);
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPost: ForumPost = {
      id: crypto.randomUUID(),
      author: profile.name || 'Anonymous Scholar',
      title: newTitle,
      content: newContent,
      timestamp: 'Just now',
      upvotes: 1,
      commentsCount: 0
    };
    setPosts([newPost, ...posts]);
    setIsPosting(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Community <span className="text-brand-purple">Forum</span></h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Learn and grow together</p>
        </div>
        <button onClick={() => setIsPosting(true)} className="flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-2xl font-black hover:bg-purple-600 transition-all shadow-xl shadow-brand-purple/20 active:scale-95">
          <Plus size={20} /> Start Discussion
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input type="text" placeholder="Search threads, topics or scholars..." className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-slate-800 rounded-3xl focus:border-brand-purple font-bold text-slate-200 outline-none shadow-inner" />
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 hover:border-brand-purple/30 transition-all group shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500">
                   <User size={20} />
                </div>
                <div>
                   <p className="text-xs font-black text-white">{post.author}</p>
                   <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase"><Clock size={10} /> {post.timestamp}</p>
                </div>
             </div>
             <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-purple transition-colors leading-tight">{post.title}</h3>
             <p className="text-slate-400 font-medium mb-8 leading-relaxed line-clamp-3">{post.content}</p>
             <div className="flex items-center gap-6 pt-6 border-t border-slate-800/50">
                <button className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors">
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
                <h3 className="text-2xl font-black text-white">Start a Discussion</h3>
                <button onClick={() => setIsPosting(false)}><X size={28} /></button>
             </div>
             <form onSubmit={handlePost} className="p-10 space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Thread Title</label>
                  <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What's on your mind?" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white outline-none focus:border-brand-purple" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Content</label>
                  <textarea rows={6} value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Provide details, ask a question, or share resources..." className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white outline-none focus:border-brand-purple resize-none" />
                </div>
                <button type="submit" className="w-full py-6 bg-brand-purple text-white font-black rounded-2xl shadow-xl shadow-brand-purple/20 uppercase tracking-widest text-xs active:scale-95 transition-all">Publish Thread</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScholarForum;
