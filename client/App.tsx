
import React, { useState } from 'react';
import { mockStore } from './store/mockStore';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import PatientDashboard from './components/PatientDashboard';
import SymptomChecker from './components/SymptomChecker';
import HospitalFinder from './components/HospitalFinder';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(mockStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('john@example.com');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockStore.login(loginEmail);
    if (user) {
      setCurrentUser(user);
      setActiveTab('dashboard');
    } else {
      alert("Invalid email. Try john@example.com, sarah@mediconnect.com, or admin@mediconnect.com");
    }
  };

  const handleLogout = () => {
    mockStore.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-blue-600 mb-2">⚕️ MediConnect</h1>
            <p className="text-slate-500">Your AI-Powered Healthcare Companion</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-center text-slate-500 text-sm">
              Don't have an account? <button className="text-blue-600 font-bold hover:underline">Register Now</button>
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <button onClick={() => setLoginEmail('john@example.com')} className="text-[10px] bg-slate-100 px-2 py-1 rounded">Patient (John)</button>
            <button onClick={() => setLoginEmail('sarah@mediconnect.com')} className="text-[10px] bg-slate-100 px-2 py-1 rounded">Doctor (Sarah)</button>
            <button onClick={() => setLoginEmail('admin@mediconnect.com')} className="text-[10px] bg-slate-100 px-2 py-1 rounded">Admin</button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentUser.role) {
      case UserRole.PATIENT:
        if (activeTab === 'dashboard') return <PatientDashboard user={currentUser} />;
        if (activeTab === 'symptoms') return <SymptomChecker />;
        if (activeTab === 'hospitals') return <HospitalFinder />;
        if (activeTab === 'history') return <div className="p-10 text-center bg-white rounded-2xl border border-slate-100">Appointment history view...</div>;
        break;
      case UserRole.DOCTOR:
        if (activeTab === 'dashboard') return <DoctorDashboard user={currentUser} />;
        if (activeTab === 'appointments') return <DoctorDashboard user={currentUser} />;
        if (activeTab === 'patients') return <div className="p-10 text-center bg-white rounded-2xl border border-slate-100">Complete patient lists...</div>;
        break;
      case UserRole.ADMIN:
        return <AdminDashboard />;
    }
    return <PatientDashboard user={currentUser} />;
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
