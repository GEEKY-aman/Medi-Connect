
import React from 'react';
import { mockStore } from './store/mockStore';

const AdminDashboard: React.FC = () => {
  const doctors = mockStore.getDoctors();
  const patients = mockStore.getPatients();
  const appointments = mockStore.getAllAppointments();

  const stats = [
    { label: 'Total Doctors', val: doctors.length, icon: '🩺', color: 'bg-blue-500' },
    { label: 'Total Patients', val: patients.length, icon: '👥', color: 'bg-indigo-500' },
    { label: 'Appointments', val: appointments.length, icon: '📅', color: 'bg-green-500' },
    { label: 'System Health', val: '99.9%', icon: '🛡️', color: 'bg-teal-500' },
  ];

  const distribution = [
    { name: 'Cardiology', percentage: 40, color: 'bg-blue-500' },
    { name: 'Neurology', percentage: 30, color: 'bg-indigo-500' },
    { name: 'General', percentage: 20, color: 'bg-emerald-500' },
    { name: 'Other', percentage: 10, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stat.val}</p>
            </div>
            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800">Specialty Distribution</h3>
            <span className="text-sm text-slate-400 font-medium">Real-time Data</span>
          </div>
          <div className="space-y-6">
            {distribution.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2 font-bold">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="text-slate-800">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-800">New Providers</h3>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[400px]">
            {doctors.map(doc => (
              <div key={doc.id} className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                  {doc.name.split(' ').pop()?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{doc.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{doc.specialization}</p>
                </div>
                <div className="ml-auto">
                  <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Review</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">System Logs</h3>
          <button className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Event</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.slice(0, 5).map((apt, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-700 text-sm">Appointment Created</p>
                    <p className="text-[10px] text-slate-400">ID: {apt.id}</p>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium text-sm">Patient P-{apt.patientId}</td>
                  <td className="px-8 py-5">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Pending</span>
                  </td>
                  <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-400">2024-06-01 14:32:0{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
