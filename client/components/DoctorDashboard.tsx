
import React, { useState } from 'react';
import { User, Appointment } from '../types';
import { mockStore } from '../store/mockStore';

interface DoctorDashboardProps {
  user: User;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockStore.getAppointmentsByDoctor(user.id));
  const patients = mockStore.getPatients();

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    mockStore.updateAppointmentStatus(id, status);
    setAppointments([...mockStore.getAppointmentsByDoctor(user.id)]);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome back, {user.name}</h2>
          <p className="text-slate-500">You have {appointments.filter(a => a.status === 'PENDING').length} new appointment requests today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            View Schedule
          </button>
          <button className="px-6 py-2 bg-blue-600 rounded-xl font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Edit Profile
          </button>
        </div>
      </header>

      {/* Appointment Requests Table */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Appointment Requests</h3>
          <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">New Requests</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Requested Date</th>
                <th className="px-6 py-4">Symptoms</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map(apt => {
                const patient = patients.find(p => p.id === apt.patientId);
                return (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {patient?.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700">{patient?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{apt.date}</p>
                      <p className="text-xs text-slate-400">{apt.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {apt.symptoms?.length ? apt.symptoms.map(s => (
                          <span key={s} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{s}</span>
                        )) : <span className="text-slate-300 text-xs italic">Not specified</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        apt.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                        apt.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {apt.status === 'PENDING' && (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'APPROVED')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                          >
                            ✓
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DoctorDashboard;
