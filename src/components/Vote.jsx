import React, { useState, useEffect } from 'react';
import { addBlock } from '../utils/blockchain';
import { hasUserVoted } from '../utils/storage';
import { ShieldCheck, Vote as VoteIcon, User, MapPin, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Vote = ({ user, onVoteComplete }) => {
   const [hasVoted, setHasVoted] = useState(false);
   const [selectedParty, setSelectedParty] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState('');

   const parties = [
      { name: 'DMK', color: 'bg-tn-black' },
      { name: 'AIADMK', color: 'bg-tn-green' },
      { name: 'TVK', color: 'bg-tn-red' },
      { name: 'NTK', color: 'bg-tn-green' },

   ];

   useEffect(() => {
      if (user && hasUserVoted(user.voterId)) {
         setHasVoted(true);
         setMessage('You have already voted. Double voting is restricted by Blockchain integrity.');
      }
   }, [user]);

   const handleVote = async (party) => {
      if (hasVoted) return;

      setSelectedParty(party);
      setIsSubmitting(true);

      // Simulate blockchain mining/delay
      setTimeout(() => {
         addBlock(user.voterId, user.constituency, party.name);
         setHasVoted(true);
         setIsSubmitting(false);

         // Auto logout after message
         setTimeout(() => {
            onVoteComplete();
         }, 3000);
      }, 1500);
   };

   if (hasVoted && !isSubmitting && !message) {
      return (
         <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
            <div className="mx-auto w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-xl">
               <CheckCircle size={56} />
            </div>
            <h2 className="text-4xl font-black text-tn-black tracking-tighter mb-4">Vote Secured!</h2>
            <p className="text-gray-500 font-bold mb-8 italic">Your choice has been cryptographically recorded in the decentralized TN ledger.</p>
            <div className="flex items-center gap-3 justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Logging out in 3s...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto py-8 space-y-12">
         {/* Session Header Card */}
         <div className="relative overflow-hidden bg-tn-black p-8 rounded-[3rem] text-white shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck size={120} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="w-20 h-20 bg-tn-red text-white rounded-3xl flex items-center justify-center shadow-lg border-4 border-white/10 group hover:rotate-12 transition-transform">
                     <User size={40} />
                  </div>
                  <div>
                     <h2 className="text-4xl font-black tracking-tighter italic">{user.name}</h2>
                     <div className="flex items-center gap-3 mt-1.5 opacity-60">
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Voter Authenticated</span>
                        <div className="w-1.5 h-1.5 bg-tn-red rounded-full"></div>
                        <span className="text-xs font-bold font-mono">#{user.voterId}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col items-center md:items-end gap-2 px-8 py-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-tn-red">
                     <MapPin size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/50 leading-none">Assembly Constituency</span>
                  </div>
                  <p className="text-4xl font-black tracking-tighter">No. {user.constituency}</p>
               </div>
            </div>
         </div>

         {message && (
            <div className="flex items-center justify-between gap-6 p-8 bg-tn-red/5 border-2 border-tn-red/10 rounded-[2.5rem] animate-slide-up">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-tn-red text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-tn-red/20">
                     <AlertCircle size={32} />
                  </div>
                  <p className="text-lg font-black text-tn-red leading-tight tracking-tight uppercase max-w-md">{message}</p>
               </div>
               <button
                  onClick={onVoteComplete}
                  className="px-8 py-4 bg-tn-red text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
               >
                  Exit Portal
               </button>
            </div>
         )}

         {/* Voting Area */}
         <div className={`space-y-8 ${hasVoted ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-100 text-tn-black rounded-2xl flex items-center justify-center shadow-sm">
                     <VoteIcon size={24} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-tn-black tracking-tight">Ballot Paper</h3>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <div className="w-1.5 h-1.5 bg-tn-red rounded-full"></div>
                        <span>Select one candidate from the list below</span>
                     </div>
                  </div>
               </div>
               <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-400 tracking-widest border border-gray-100">
                  <Info size={14} />
                  Secure SSL/TLS
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
               {parties.map((party) => (
                  <div
                     key={party.name}
                     className={`relative group bg-white p-10 rounded-[3.5rem] border-2 transition-all overflow-hidden flex flex-col gap-8 ${selectedParty?.name === party.name
                           ? 'border-tn-red shadow-[0_25px_50px_-12px_rgba(212,20,20,0.15)] bg-tn-red/5'
                           : 'border-transparent shadow-xl shadow-gray-100/50 hover:border-gray-200'
                        }`}
                  >
                     <div className="absolute top-0 right-0 p-10 select-none opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all">
                        <p className="text-9xl font-black italic">{party.name}</p>
                     </div>

                     <div className="flex items-center gap-8 relative z-10">
                        <div className={`text-7xl w-24 h-24 flex items-center justify-center rounded-[2rem] bg-gray-50 border-2 border-gray-500/5 group-hover:scale-110 transition-all ${selectedParty?.name === party.name ? 'rotate-12 bg-white' : ''}`}>
                           {party.symbol}
                        </div>
                        <div>
                           <p className="text-3xl font-black text-tn-black tracking-tighter leading-none">{party.name}</p>
                           <div className="flex items-center gap-2 mt-2">
                              <div className="w-1.5 h-1.5 bg-tn-green rounded-full"></div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Candidate • Ready</p>
                           </div>
                        </div>
                     </div>

                     <button
                        onClick={() => handleVote(party)}
                        disabled={hasVoted || isSubmitting}
                        className={`relative z-10 w-full py-5 rounded-[2rem] font-black tracking-widest uppercase transition-all shadow-lg ${selectedParty?.name === party.name
                              ? 'bg-tn-red text-white shadow-tn-red/30'
                              : 'bg-tn-black text-white hover:bg-tn-red hover:shadow-tn-red/30 active:scale-95'
                           } ${isSubmitting && selectedParty?.name !== party.name ? 'opacity-10' : ''}`}
                     >
                        {isSubmitting && selectedParty?.name === party.name ? (
                           <div className="flex items-center justify-center gap-3">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>SECURE HASHING...</span>
                           </div>
                        ) : 'Cast Vote Securely'}
                     </button>
                  </div>
               ))}
            </div>
         </div>

         <div className="text-center p-12 border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-[3rem] space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tn-red text-white rounded-full text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={12} />
               Blockchain Integrity Protocol
            </div>
            <p className="text-xs font-bold text-gray-400 max-w-xl mx-auto leading-relaxed">
               Your vote is encrypted using standard SHA-256 protocols. Once the block is added to the VoteChain ledger, it becomes immutable and verifiable by any entity on the decentralized network.
            </p>
         </div>
      </div>
   );
};

export default Vote;
