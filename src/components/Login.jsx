import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [voterName, setVoterName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!voterName || !voterId) {
      setError('Please fill in all fields');
      return;
    }

    const voters = JSON.parse(localStorage.getItem('voters') || '[]');
    const alreadyVoted = voters.some(v => v.voterId === voterId);

    if (alreadyVoted) {
      setError('This Voter ID has already recorded a vote.');
      return;
    }

    const newVoter = { voterName, voterId, timestamp: Date.now() };
    // We don't save to 'voters' here, we just pass to onLogin. 
    // The vote itself will be the final record.
    onLogin(newVoter);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-tn-red">
        <h2 className="text-3xl font-bold text-tn-black mb-6 text-center">Voter Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tn-red focus:border-transparent outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID Number</label>
            <input
              type="text"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tn-red focus:border-transparent outline-none transition-all"
              placeholder="TNXXXXXX"
            />
          </div>
          {error && <p className="text-tn-red text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-tn-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg mt-4"
          >
            Access Voting Portal
          </button>
        </form>
        <p className="mt-6 text-xs text-center text-gray-500 uppercase tracking-widest">
          Tamil Nadu Election Commission • Secure Blockchain Proto
        </p>
      </div>
    </div>
  );
};

export default Login;
