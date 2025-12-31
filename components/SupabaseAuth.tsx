
import React, { useState } from 'react';
import { CloudStorage } from '../services/supabase';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck, Loader2, X } from 'lucide-react';

interface SupabaseAuthProps {
  onSuccess: () => void;
  onClose: () => void;
}

const SupabaseAuth: React.FC<SupabaseAuthProps> = ({ onSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = isLogin 
        ? await CloudStorage.signIn(email, password)
        : await CloudStorage.signUp(email, password);

      if (authError) throw authError;
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
      <div className="bg-[#0f172a] w-full max-w-md rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white"><X size={24}/></button>
        
        <div className="p-10 text-center space-y-6">
          <div className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto shadow-xl neon-blue mb-4">
             <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">{isLogin ? 'Cloud Sync Login' : 'Create Scholar Account'}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Access your hub from any device</p>
          
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-brand-blue" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-brand-blue" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>)}
              {isLogin ? 'Sign Into Cloud' : 'Create Account'}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupabaseAuth;
