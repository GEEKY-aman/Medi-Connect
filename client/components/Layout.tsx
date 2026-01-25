
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const navItems = {
    [UserRole.PATIENT]: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'symptoms', label: 'Symptom Checker', icon: '🧠' },
      { id: 'hospitals', label: 'Find Hospitals', icon: '📍' },
      { id: 'history', label: 'My Appointments', icon: '📅' },
    ],
    [UserRole.DOCTOR]: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'appointments', label: 'Manage Appointments', icon: '📅' },
      { id: 'patients', label: 'Patient List', icon: '👥' },
    ],
    [UserRole.ADMIN]: [
      { id: 'dashboard', label: 'Analytics', icon: '📊' },
      { id: 'manage-doctors', label: 'Doctors', icon: '🩺' },
      { id: 'manage-patients', label: 'Patients', icon: '👥' },
    ]
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span className="text-3xl">⚕️</span> MediConnect
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems[user.role].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-4 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10 md:hidden">
          <h1 className="text-xl font-bold text-blue-600">MediConnect</h1>
          <button className="text-slate-600">☰</button>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
