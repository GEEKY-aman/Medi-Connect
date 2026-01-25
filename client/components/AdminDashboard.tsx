
import React from 'react';
import { mockStore } from '../store/mockStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const doctors = mockStore.getDoctors();
  const patients = mockStore.getPatients();
  const appointments = mockStore.getAllAppointments();

  const data = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 12 },
    { name: 'Fri', count: 8 },
    { name: 'Sat', count: 3 },
    { name: 'Sun', count: 2 },
  ];

  const pieData = [
    { name: 'Cardiology', value: 400 },
    { name: 'Neurology', value: 300 },
    { name: 'General', value: 300 },
    { name: 'Dermatology', value: 200 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Doctors', val: doctors.length, icon: '🩺' },
          { label: 'Total Patients', val: patients.length, icon: '👥' },
          { label: 'Appointments', val: appointments.length, icon: '📅' },
          { label: 'Growth', val: '+12.5%', icon: '📈' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stat.val}</p>
            </div>
            <div className="