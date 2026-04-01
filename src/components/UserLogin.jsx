import React, { useState } from 'react';
import { getUserByVoterId } from '../utils/storage';
import { UserCircle, KeyRound, AlertCircle } from 'lucide-react';

const UserLogin = ({ onLogin, onNavigate }) => {
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voterId || !name) {
      setError('Please fill in all fields');
      return;
    }

    const user = getUserByVoterId(voterId);
    if (user) {
      // Check if name matches (simple case-insensitive check)
      if (user.name.toLowerCase() === name.toLowerCase()) {
        onLogin(user);
      } else {
        setError('Name does not match Voter ID records');
      }
    } else {
      // Redirect to registration
      onNavigate('register', { voterId, name });
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
           <div className="mx-auto w-16 h-16 bg-tn-red/10 text-tn-red rounded-full flex items-center justify-center">
              <UserCircle size={32} />
           </div>
           <h2 className="text-3xl font-black text-tn-black tracking-tighter">User Login</h2>
           <p className="text-sm text-gray-500 font-medium tracking-tight uppercase">Enter credentials to proceed</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-tn-red/5 border border-tn-red/20 text-tn-red rounded-2xl text-xs font-bold leading-none">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Full Name</label>
            <div className="relative group">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vijay Joseph"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold"
              />
              <UserCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tn-red transition-colors" size={20} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Voter ID Number</label>
            <div className="relative group">
              <input 
                type="text" 
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                placeholder="Ex: ABC1234567"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold uppercase tracking-widest"
              />
              <KeyRound className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tn-red transition-colors" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-tn-black text-white rounded-2xl font-black tracking-widest uppercase hover:bg-tn-red hover:shadow-2xl hover:shadow-tn-red/40 transition-all flex items-center justify-center gap-3"
          >
            Authenticate Securely
          </button>
        </form>

        <p className="text-center text-xs font-bold text-gray-400">
           Not registered? Proceeding will take you to the <span className="text-tn-red underline">Registration Page</span>.
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
