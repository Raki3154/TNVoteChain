import React, { useState, useEffect } from 'react';
import { getBlockchain, isValidChain } from '../utils/blockchain';
import { LayoutDashboard, Database, TrendingUp, Users, ShieldCheck, MapPin, Search, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [chain, setChain] = useState([]);
  const [stats, setStats] = useState({
    totalVotes: 0,
    leadingParty: 'N/A',
    topConstituency: 'N/A',
    isValid: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('summary'); // 'summary', 'blockchain'

  useEffect(() => {
    const data = getBlockchain();
    setChain(data);
    
    // Calculate stats
    const votes = data.filter(block => block.voterId !== 'GENESIS');
    const total = votes.length;
    
    // Counting parties
    const partyCounts = votes.reduce((acc, vote) => {
      acc[vote.party] = (acc[vote.party] || 0) + 1;
      return acc;
    }, {});
    
    const leading = Object.entries(partyCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['N/A', 0])[0];
    
    // Counting constituencies
    const constituencyCounts = votes.reduce((acc, vote) => {
        acc[vote.constituency] = (acc[vote.constituency] || 0) + 1;
        return acc;
    }, {});
    
    const topConst = Object.entries(constituencyCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['N/A', 0])[0];

    setStats({
      totalVotes: total,
      leadingParty: leading,
      topConstituency: topConst,
      isValid: isValidChain(data)
    });
  }, []);

  const getConstituencyResults = () => {
    const votes = chain.filter(block => block.voterId !== 'GENESIS');
    const results = {};
    
    for (let i = 1; i <= 234; i++) {
        results[i] = {
            TVK: 0, NTK: 0, DMK: 0, AIADMK: 0, total: 0
        };
    }
    
    votes.forEach(vote => {
        if (results[vote.constituency]) {
            results[vote.constituency][vote.party]++;
            results[vote.constituency].total++;
        }
    });

    return results;
  };

  const constituencyResults = getConstituencyResults();
  const filteredConstNames = Object.keys(constituencyResults).filter(c => c.includes(searchTerm));

  return (
    <div className="max-w-7xl mx-auto py-8 space-y-12 animate-fade-in mb-20">
      {/* Top Section / Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Votes Logged" 
            value={stats.totalVotes} 
            icon={<Users size={24} />} 
            color="bg-tn-black" 
          />
          <MetricCard 
            title="Leading Party" 
            value={stats.leadingParty} 
            icon={<TrendingUp size={24} />} 
            color="bg-tn-red" 
          />
          <MetricCard 
            title="Top Active Seat" 
            value={stats.topConstituency !== 'N/A' ? `No. ${stats.topConstituency}` : 'N/A'} 
            icon={<MapPin size={24} />} 
            color="bg-tn-green" 
          />
          <MetricCard 
            title="Chain Integrity" 
            value={stats.isValid ? 'Verified' : 'Breached'} 
            icon={stats.isValid ? <ShieldCheck size={24} /> : <AlertCircle size={24} />} 
            color={stats.isValid ? 'bg-green-600' : 'bg-tn-red'} 
          />
      </div>

      {/* Navigation for Admin */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
         <button 
           onClick={() => setView('summary')}
           className={`px-6 py-2 font-black transition-all rounded-t-xl ${view === 'summary' ? 'bg-white border-x border-t border-gray-100 text-tn-black' : 'text-gray-400 hover:text-tn-black'}`}
         >
           Constituency Summary
         </button>
         <button 
           onClick={() => setView('blockchain')}
           className={`px-6 py-2 font-black transition-all rounded-t-xl ${view === 'blockchain' ? 'bg-white border-x border-t border-gray-100 text-tn-black' : 'text-gray-400 hover:text-tn-black'}`}
         >
           Blockchain Inspector
         </button>
      </div>

      {view === 'summary' ? (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 className="text-3xl font-black text-tn-black tracking-tighter">Tamil Nadu Results Dashboard</h3>
                <div className="relative w-full md:w-96 group">
                   <input 
                     type="text" 
                     placeholder="Search Constituency ID..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full px-12 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-tn-red/20 outline-none font-bold"
                   />
                   <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-tn-red" />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden shadow-gray-100/50">
               <div className="max-h-[600px] overflow-y-auto overscroll-contain">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-100">
                          <tr>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">ID</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">TVK</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">NTK</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">DMK</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">AIADMK</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Total Votes</th>
                              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-gray-400">Winning Party</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {filteredConstNames.map(id => {
                              const res = constituencyResults[id];
                              const max = Math.max(res.TVK, res.NTK, res.DMK, res.AIADMK);
                              const winner = max > 0 ? Object.keys(res).find(k => res[k] === max && k !== 'total') : 'No Votes';
                              
                              return (
                                <tr key={id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-6">
                                       <span className="w-10 h-10 bg-tn-black text-white rounded-lg flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                                          {id}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold">{res.TVK}</td>
                                    <td className="px-8 py-6 font-bold">{res.NTK}</td>
                                    <td className="px-8 py-6 font-bold">{res.DMK}</td>
                                    <td className="px-8 py-6 font-bold">{res.AIADMK}</td>
                                    <td className="px-8 py-6">
                                       <span className="px-4 py-1.5 bg-gray-100 rounded-full font-black text-xs">{res.total}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                       {winner !== 'No Votes' ? (
                                           <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-xs uppercase tracking-tight shadow-lg shadow-${winner === 'DMK' ? 'tn-black' : winner === 'TVK' ? 'tn-red' : 'tn-green'}/20 ${winner === 'DMK' ? 'bg-tn-black' : winner === 'TVK' ? 'bg-tn-red' : 'bg-tn-green'}`}>
                                              <CheckCircle size={14} />
                                              {winner}
                                           </div>
                                       ) : (
                                           <span className="text-gray-300 font-bold text-xs uppercase italic tracking-widest">No Polls</span>
                                       )}
                                    </td>
                                </tr>
                              );
                          })}
                      </tbody>
                  </table>
               </div>
            </div>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-4 p-8 bg-tn-black text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <Database className="absolute -right-10 opacity-10" size={200} />
                <div className="p-4 bg-tn-red rounded-3xl shrink-0">
                    <Database size={32} />
                </div>
                <div>
                    <h3 className="text-3xl font-black tracking-tighter">Blockchain Ledger</h3>
                    <p className="text-xs font-bold text-white/50 tracking-widest uppercase">Decentralized immutable data explorer</p>
                </div>
            </div>

            <div className="space-y-4">
               {chain.map((block, i) => (
                 <div key={block.hash} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-100/30 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'bg-tn-red text-white' : 'bg-tn-green text-white'}`}>
                          {i === 0 ? 'Genesis Block' : `Block #${block.index}`}
                       </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Voter ID Hash</p>
                           <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded-lg border border-gray-100">{block.voterId}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Party Cast</p>
                           <p className="font-black text-xl text-tn-black tracking-tighter">{block.party}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Timestamp</p>
                           <p className="font-bold text-gray-500 text-sm">
                             {new Date(block.timestamp).toLocaleString()}
                           </p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</p>
                           <div className="flex items-center gap-2 text-tn-green font-black text-xs uppercase">
                              <ShieldCheck size={14} />
                              Verified Node
                           </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-100 space-y-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Previous Hash</p>
                           <p className="font-mono text-[10px] break-all opacity-40">{block.previousHash}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Current Block Hash</p>
                           <p className="font-mono text-[10px] break-all text-tn-red font-bold">{block.hash}</p>
                        </div>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }) => (
    <div className={`p-8 rounded-[2.5rem] ${color} text-white shadow-2xl relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform">
           {icon}
        </div>
        <div className="relative z-10 space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{title}</h4>
            <p className="text-4xl font-black tracking-tighter">{value}</p>
        </div>
    </div>
);

export default AdminDashboard;
