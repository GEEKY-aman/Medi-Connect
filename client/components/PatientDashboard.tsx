
import React, { useState } from 'react';
import { User, Appointment } from '../types';
import { mockStore } from '../store/mockStore';

interface PatientDashboardProps {
  user: User;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user }) => {
  const appointments = mockStore.getAppointmentsByPatient(user.id);
  const doctors = mockStore.getDoctors();
  const [bookingDoc, setBookingDoc] = useState<User | null>(null);

  const handleBook = (doctor: User) => {
    const newApt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: user.id,
      doctorId: doctor.id,
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      status: 'PENDING',
      symptoms: []
    };
    mockStore.addAppointment(newApt);
    alert(`Request sent to ${doctor.name}!`);
    setBookingDoc(null);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Hello, {user.name}! 👋</h2>
        <p className="opacity-90 max-w-lg">How are you feeling today? Check your symptoms or find a specialist to get started.</p>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Upcoming Appointments</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">{appointments.filter(a => a.status === 'APPROVED').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Pending Requests</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">{appointments.filter(a => a.status === 'PENDING').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Health Score</p>
          <p className="text-4xl font-bold text-green-500 mt-2">92%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recommended Doctors */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Specialists Near You</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {doctors.map(doc => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  👨‍⚕️
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{doc.name}</h4>
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{doc.specialization}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{doc.hospital}</p>
                </div>
                <button 
                  onClick={() => handleBook(doc)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent History Sidebar */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
          <div className="space-y-4">
            {appointments.length > 0 ? appointments.slice(0, 5).map(apt => (
              <div key={apt.id} className="flex gap-4 items-start border-l-2 border-slate-100 pl-4 pb-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Appointment with {mockStore.getDoctors().find(d => d.id === apt.doctorId)?.name}</p>
                  <p className="text-xs text-slate-500">{apt.date} • {apt.time}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    apt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    apt.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-center py-10">No recent activity.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
