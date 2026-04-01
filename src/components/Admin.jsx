import React, { useState, useEffect } from 'react';
import { getBlockchain, isValidChain } from '../blockchain';

const PARTIES = ['TVK', 'NTK', 'DMK', 'AIADMK'];
const CONSTITUENCIES = Array.from({ length: 234 }, (_, i) => `Constituency ${i + 1}`);

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blockchain, setBlockchain] = useState([]);
  const [stats, setStats] = useState({});
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'chain'

  useEffect(() => {
    const chain = getBlockchain();
    setBlockchain(chain);
    
    // Calculate stats
    const newStats = {};
    CONSTITUENCIES.forEach(cons => {
      newStats[cons] = { TVK: 0, NTK: 0, DMK: 0, AIADMK: 0, total: 0, leader: 'N/A' };
    });

    chain.forEach(block => {
      if (block.voterId === 'GENESIS') return;
      if (newStats[block.constituency]) {
        newStats[block.constituency][block.party]++;
        newStats[block.constituency].total++;
        
        // Update leader
        let maxVotes = -1;
        let leader = 'Tied';
        PARTIES.forEach(p => {
          if (newStats[block.constituency][p] > maxVotes) {
            maxVotes = newStats[block.constituency][p];
            leader = p;
          } else if (newStats[block.constituency][p] === maxVotes && maxVotes > 0) {
            leader = 'Tied';
          }
        });
        newStats[block.constituency].leader = leader;
      }
    });
    setStats(newStats);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid admin credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-tn-black">
          <h2 className="text-2xl font-bold text-tn-black mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-tn-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-tn-black"
            />
            <button
              type="submit"
              className="w-full bg-tn-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
            >
              Login to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-tn-black p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Election Monitoring Center</h2>
            <p className="text-gray-400 text-sm">Blockchain Integrity: 
              <span className={isValidChain(blockchain) ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                {isValidChain(blockchain) ? '✓ VALID' : '✗ COMPROMISED'}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-tn-red text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('chain')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'chain' ? 'bg-tn-red text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Examine Blockchain
            </button>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-tn-black border-b pb-2">Constituency Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {CONSTITUENCIES.map(cons => (
                <div key={cons} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-tn-black">{cons}</h4>
                    <span className="text-[10px] bg-tn-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {PARTIES.map(p => (
                      <div key={p} className="flex justify-between items-center">
                        <span className="text-gray-600">{p}</span>
                        <span className="font-mono font-bold text-tn-black">{stats[cons][p]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-xs text-gray-500 uppercase font-bold">Leading:</span>
                    <span className={`text-sm font-bold ${stats[cons].leader === 'N/A' ? 'text-gray-400' : 'text-tn-red'}`}>
                      {stats[cons].leader}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-tn-black border-b pb-2">Immutable Ledger View</h3>
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {blockchain.map((block, i) => (
                <div key={i} className="p-4 bg-gray-900 rounded-xl border border-gray-800 font-mono text-[10px] text-green-400">
                  <div className="flex justify-between text-gray-500 mb-2 border-b border-gray-800 pb-1">
                    <span>BLOCK #{block.index}</span>
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  <p><span className="text-tn-red">VOTER_ID:</span> {block.voterId}</p>
                  <p><span className="text-tn-red">LOCATION:</span> {block.constituency}</p>
                  <p><span className="text-tn-red">ASSERTION:</span> {block.party}</p>
                  <p className="mt-2 text-gray-500">PREV_HASH: {block.previousHash}</p>
                  <p className="text-white">BLOCK_HASH: {block.hash}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
