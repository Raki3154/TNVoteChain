import React, { useState, useEffect } from 'react';
import { getBlockchain } from '../blockchain';

const PARTIES = [
  { id: 'TVK', name: 'Tamizhaga Vettri Kazhagam', color: 'bg-tn-red' },
  { id: 'NTK', name: 'Naam Tamilar Katchi', color: 'bg-tn-green' },
  { id: 'DMK', name: 'Dravida Munnetra Kazhagam', color: 'bg-tn-black' },
  { id: 'AIADMK', name: 'All India Anna Dravida Munnetra Kazhagam', color: 'bg-gray-400' }
];

const Results = () => {
  const [totals, setTotals] = useState({ TVK: 0, NTK: 0, DMK: 0, AIADMK: 0, total: 0 });
  const [constituencyResults, setConstituencyResults] = useState([]);

  useEffect(() => {
    const chain = getBlockchain();
    const newTotals = { TVK: 0, NTK: 0, DMK: 0, AIADMK: 0, total: 0 };
    const consMap = {};

    chain.forEach(block => {
      if (block.voterId === 'GENESIS') return;
      newTotals[block.party]++;
      newTotals.total++;

      if (!consMap[block.constituency]) {
        consMap[block.constituency] = { name: block.constituency, TVK: 0, NTK: 0, DMK: 0, AIADMK: 0, total: 0 };
      }
      consMap[block.constituency][block.party]++;
      consMap[block.constituency].total++;
    });

    setTotals(newTotals);
    setConstituencyResults(Object.values(consMap).sort((a, b) => b.total - a.total));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-tn-black mb-2 uppercase tracking-tighter">Election Results Portal</h2>
        <p className="text-gray-500">Live Blockchain-Verified Vote Tally</p>
      </div>

      {/* Hero Breakdown */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {PARTIES.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-tn-black relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full -mr-10 -mt-10 ${p.color}`}></div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-1">{p.id}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-tn-black">{totals[p.id]}</span>
              <span className="text-xs font-bold text-gray-400">VOTES</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
               <div 
                className={`h-full ${p.color} transition-all duration-1000`} 
                style={{ width: `${totals.total > 0 ? (totals[p.id] / totals.total) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase">{p.name}</p>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-tn-black">Constituency-wise Performance</h3>
            <span className="text-xs font-bold py-1 px-3 bg-tn-green text-white rounded-full">Blockchain Synced</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th className="px-8 py-4">Constituency</th>
                <th className="px-4 py-4">TVK</th>
                <th className="px-4 py-4">NTK</th>
                <th className="px-4 py-4">DMK</th>
                <th className="px-4 py-4">AIADMK</th>
                <th className="px-8 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {constituencyResults.length === 0 ? (
                <tr>
                    <td colSpan="6" className="px-8 py-10 text-center text-gray-400 italic">No votes recorded yet...</td>
                </tr>
              ) : (
                constituencyResults.map((res, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-tn-black">{res.name}</td>
                    <td className="px-4 py-5 text-tn-red font-mono font-bold">{res.TVK}</td>
                    <td className="px-4 py-5 text-tn-green font-mono font-bold">{res.NTK}</td>
                    <td className="px-4 py-5 text-tn-black font-mono font-bold">{res.DMK}</td>
                    <td className="px-4 py-5 text-gray-500 font-mono font-bold">{res.AIADMK}</td>
                    <td className="px-8 py-5 text-right font-black text-tn-black">{res.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-medium">
        Authenticated via Distributed Ledger Technology • 2026 Tamil Nadu State Elections
      </p>
    </div>
  );
};

export default Results;
