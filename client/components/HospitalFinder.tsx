
import React, { useState, useEffect } from 'react';
import { findNearbyHospitals } from '../services/geminiService';
import { Hospital } from '../types';

const HospitalFinder: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("Geolocation denied", err)
    );
  }, []);

  const searchHospitals = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await findNearbyHospitals(searchQuery || undefined, searchQuery ? undefined : (location || undefined));
      setHospitals(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Hospital Finder</h2>
        <p className="text-slate-500 mb-6">Search for medical facilities by location, pincode, city, or country.</p>
        
        <form onSubmit={searchHospitals} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Pincode, City, or Country (e.g. 90210, London, India)"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">📍</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? 'Searching...' : '🔍 Search Hospitals'}
            </button>
            
            {!searchQuery && (
              <button
                type="button"
                onClick={() => searchHospitals()}
                disabled={loading}
                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Use My Location
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {hospitals.map((hospital, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{hospital.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{hospital.address.startsWith('http') ? 'View details on maps' : hospital.address}</p>
              </div>
              {hospital.uri && (
                <a 
                  href={hospital.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0 ml-4 px-4 py-2 bg-slate-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  View on Maps
                </a>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded">24/7 Service</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded">Emergency Care</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-50 text-amber-600 px-2 py-1 rounded">Pharmacy</span>
            </div>
          </div>
        ))}
        {!loading && hospitals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-4xl mb-4 text-slate-200">🏥</div>
            <p className="text-slate-400 font-medium">No hospitals found yet. Try searching for a location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalFinder;
