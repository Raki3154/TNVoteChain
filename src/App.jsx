import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Home as HomeIcon, LayoutDashboard, UserCircle, Flag } from 'lucide-react';

// Components
import Home from './components/Home';
import UserLogin from './components/UserLogin';
import Register from './components/Register';
import Vote from './components/Vote';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Utils
import { getBlockchain } from './utils/blockchain';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [chainLength, setChainLength] = useState(0);

  useEffect(() => {
    // Check if user is already logged in (session storage or local storage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('vote');
    }
    
    // Initial chain check
    const chain = getBlockchain();
    setChainLength(chain.length);
  }, []);

  const handleLogin = (voter) => {
    setUser(voter);
    localStorage.setItem('currentUser', JSON.stringify(voter));
    setCurrentPage('vote');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const onVoteComplete = () => {
    const chain = getBlockchain();
    setChainLength(chain.length);
    handleLogout();
  };

  const navigate = (page, data = null) => {
    setCurrentPage(page);
    if (data) setRegistrationData(data);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => navigate(id)}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black transition-all text-xs uppercase tracking-widest ${
        currentPage === id || (id === 'vote' && user)
        ? 'bg-tn-black text-white shadow-xl shadow-tn-black/20' 
        : 'text-gray-400 hover:bg-gray-50 hover:text-tn-black border border-transparent hover:border-gray-100'
      }`}
    >
      <Icon size={16} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-tn-white flex flex-col font-sans selection:bg-tn-red selection:text-white">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => navigate('home')}>
             <div className="bg-tn-black p-3 rounded-[1.25rem] text-white shadow-lg shadow-tn-black/20 group-hover:bg-tn-red transition-colors">
                <ShieldCheck size={32} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-tn-black tracking-tighter leading-none italic uppercase">VOTE<span className="text-tn-red">CHAIN</span></h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-tn-red rounded-full"></div>
                   TN Smart Elections
                </p>
             </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-gray-50/50 p-2 rounded-[1.5rem] border border-gray-100">
            <NavItem id="home" icon={HomeIcon} label="Portal" />
            {(user || currentPage === 'vote') && <NavItem id="vote" icon={UserCircle} label="Ballot" />}
            <NavItem id="admin-dashboard" icon={LayoutDashboard} label="Admin" />
          </div>

          <div className="flex items-center gap-4">
             {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Encrypted Session</p>
                      <p className="text-sm font-black text-tn-black leading-none italic">{user.name}</p>
                   </div>
                   <button 
                    onClick={handleLogout}
                    className="p-3.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-tn-red hover:text-white transition-all shadow-sm hover:shadow-tn-red/30 active:scale-95"
                   >
                    <LogOut size={20} />
                   </button>
                </div>
             ) : (
                <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-tn-red/5 border border-tn-red/10 rounded-2xl">
                   <div className="w-2 h-2 bg-tn-red rounded-full animate-pulse shadow-[0_0_10px_rgba(212,20,20,0.5)]"></div>
                   <span className="text-[10px] font-black text-tn-red uppercase tracking-[0.2em]">NETWORK ACTIVE • {chainLength} BLOCKS</span>
                </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        {currentPage === 'home' && <Home onNavigate={navigate} />}
        
        {currentPage === 'login' && <UserLogin onLogin={handleLogin} onNavigate={navigate} />}
        
        {currentPage === 'register' && <Register initialData={registrationData} onRegister={handleLogin} onNavigate={navigate} />}
        
        {currentPage === 'vote' && (
          user ? (
            <Vote user={user} onVoteComplete={onVoteComplete} />
          ) : (
            <UserLogin onLogin={handleLogin} onNavigate={navigate} />
          )
        )}
        
        {currentPage === 'admin-login' && <AdminLogin onLogin={() => navigate('admin-dashboard')} />}
        
        {currentPage === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 pointer-events-none">
           <Flag size={200} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="text-center md:text-left space-y-2">
            <h4 className="text-lg font-black text-tn-black tracking-tight uppercase">VOTECHAIN TN 2026</h4>
            <p className="text-xs text-gray-400 font-bold max-w-xs">Building trust in democracy through cryptography and decentralized ledger technology.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 uppercase tracking-widest shadow-sm">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                Status: SECURE END-TO-END
             </div>
             <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 uppercase tracking-widest shadow-sm">
                SYSTEM ID: #TNE-BLOCK-ALPHA
             </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-50 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Developed for Tamil Nadu State Election Simulation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
