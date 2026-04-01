import React, { useState } from 'react';
import { LayoutDashboard, Lock, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid admin credentials. Access Denied.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-10 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-tn-black"></div>
        
        <div className="text-center space-y-4">
           <div className="mx-auto w-20 h-20 bg-tn-black text-white rounded-3xl flex items-center justify-center shadow-xl shadow-tn-black/20">
              <ShieldAlert size={40} />
           </div>
           <div className="space-y-1">
                <h2 className="text-3xl font-black text-tn-black tracking-tighter">Admin Portal</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Authorized Personnel Only</p>
           </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-5 bg-tn-red text-white rounded-2xl text-xs font-black uppercase tracking-widest animate-pulse">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Username</label>
            <div className="relative group">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-tn-black focus:bg-white rounded-[1.5rem] transition-all outline-none font-bold"
              />
              <Lock className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tn-black transition-colors" size={20} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Access Key</label>
            <div className="relative group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-tn-black focus:bg-white rounded-[1.5rem] transition-all outline-none font-bold tracking-widest"
              />
              <KeyRound className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tn-black transition-colors" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-tn-black text-white rounded-[1.5rem] font-black tracking-widest uppercase hover:bg-tn-red hover:shadow-2xl hover:shadow-tn-red/40 transition-all flex items-center justify-center gap-4 group"
          >
            Access Dashboard
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           Secure Terminal ID: <span className="font-mono text-tn-red">TN-9X-ALPHA</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
