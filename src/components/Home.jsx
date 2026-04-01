import React from 'react';
import { LayoutDashboard, UserCircle, Flag } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const parties = [
    { name: 'TVK', symbol: '🚩', color: 'bg-tn-red' },
    { name: 'NTK', symbol: '🐅', color: 'bg-tn-green' },
    { name: 'DMK', symbol: '☀️', color: 'bg-tn-black' },
    { name: 'AIADMK', symbol: '🍃', color: 'bg-tn-green' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tn-red/10 text-tn-red rounded-full text-xs font-black tracking-widest uppercase">
          <Flag size={14} />
          Tamil Nadu Smart Election System
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-tn-black tracking-tighter leading-tight">
          VOTE<span className="text-tn-red">CHAIN</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">
          A secure, decentralized blockchain prototype for the Tamil Nadu 2026 general assembly elections.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {parties.map((party) => (
          <div key={party.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 hover:scale-105 transition-transform text-center space-y-3">
             <div className="text-4xl">{party.symbol}</div>
             <div className="font-black text-tn-black tracking-tight">{party.name}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
        <button 
          onClick={() => onNavigate('login')}
          className="group w-full md:w-64 flex items-center justify-between px-8 py-5 bg-tn-black text-white rounded-2xl font-bold transition-all hover:bg-tn-red hover:shadow-2xl hover:shadow-tn-red/30"
        >
          <span className="flex items-center gap-3">
            <UserCircle size={20} />
            User Login
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>

        <button 
          onClick={() => onNavigate('admin-login')}
          className="group w-full md:w-64 flex items-center justify-between px-8 py-5 bg-white border-2 border-tn-black text-tn-black rounded-2xl font-bold transition-all hover:bg-gray-50"
        >
          <span className="flex items-center gap-3">
            <LayoutDashboard size={20} />
            Admin Login
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
