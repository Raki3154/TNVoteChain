import React, { useState, useEffect } from 'react';
import { saveUser } from '../utils/storage';
import { UserPlus, Calendar, MapPin, Hash, IdCard, AlertTriangle, CheckCircle } from 'lucide-react';

const Register = ({ initialData, onRegister, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    voterId: initialData?.voterId || '',
    place: '',
    dob: '',
    constituency: '',
    aadharFile: '',
  });

  const [age, setAge] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [formData.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, aadharFile: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (age < 18) {
      setError('Not eligible to vote: Age must be 18 or above');
      return;
    }
    
    if (!formData.constituency || !formData.place || !formData.aadharFile) {
        setError('Please fill all required fields');
        return;
    }

    const newUser = { ...formData, age };
    saveUser(newUser);
    setSuccess(true);
    setTimeout(() => {
        onRegister(newUser);
    }, 2000);
  };

  const constituencies = Array.from({ length: 234 }, (_, i) => i + 1);

  if (success) {
    return (
        <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
             <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={48} />
             </div>
             <h2 className="text-3xl font-black text-tn-black tracking-tighter">Registration Successful!</h2>
             <p className="text-gray-500 font-medium">Redirecting you to the voting portal...</p>
        </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-10 animate-slide-up">
        <div className="text-center space-y-2">
           <div className="mx-auto w-16 h-16 bg-tn-red/10 text-tn-red rounded-full flex items-center justify-center">
              <UserPlus size={32} />
           </div>
           <h2 className="text-3xl font-black text-tn-black tracking-tighter">Voter Registration</h2>
           <p className="text-sm text-gray-500 font-medium tracking-tight uppercase">Enter details as per official documents</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-tn-red/5 border border-tn-red/20 text-tn-red rounded-2xl text-xs font-bold leading-none">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold"
                  />
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Voter ID</label>
                  <input 
                    name="voterId"
                    value={formData.voterId}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold uppercase"
                  />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Place/City</label>
                  <input 
                    name="place"
                    placeholder="Ex: Coimbatore"
                    value={formData.place}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold"
                  />
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Constituency</label>
                  <select 
                    name="constituency"
                    value={formData.constituency}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select constituency</option>
                    {constituencies.map(c => <option key={c} value={c}>No. {c}</option>)}
                  </select>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Date of Birth</label>
                  <div className="relative">
                    <input 
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-tn-red focus:bg-white rounded-2xl transition-all outline-none font-bold cursor-pointer"
                    />
                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                  </div>
              </div>
              <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Calculated Age</label>
                  <div className={`w-full px-6 py-4 bg-gray-50 rounded-2xl font-black text-xl flex items-center justify-between ${age >= 18 ? 'text-tn-green' : 'text-tn-red'}`}>
                    <span>{age || 0} Years</span>
                    <span className="text-[10px] uppercase px-2 py-1 bg-white rounded-lg shadow-sm border border-gray-100">Verified System Age</span>
                  </div>
              </div>
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest">Aadhaar Card Upload (Simulation)</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 hover:border-tn-red transition-colors group cursor-pointer">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                      <IdCard size={32} className="text-gray-300 group-hover:text-tn-red transition-colors" />
                      <p className="text-xs font-bold text-gray-500">
                          {formData.aadharFile ? `File: ${formData.aadharFile}` : 'Drag & drop or click to upload Aadhaar'}
                      </p>
                  </div>
              </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-tn-black text-white rounded-2xl font-black tracking-widest uppercase hover:bg-tn-red hover:shadow-2xl hover:shadow-tn-red/40 transition-all flex items-center justify-center gap-3"
          >
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
