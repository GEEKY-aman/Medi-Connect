
import React, { useState } from 'react';
import { predictDisease } from '../services/geminiService';
import { DiseaseRecommendation } from '../types';

const COMMON_SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Chest Pain', 
  'Shortness of breath', 'Skin Rash', 'Sore Throat', 'Body Ache', 
  'Loss of Appetite', 'Joint Pain', 'Dizziness', 'Vision Problems'
];

const SymptomChecker: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<DiseaseRecommendation | null>(null);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
    }
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const res = await predictDisease(selectedSymptoms);
      setRecommendation(res);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Symptom Checker</h2>
        <p className="text-slate-500 mb-6">Select your symptoms for an AI-powered preliminary analysis.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {COMMON_SYMPTOMS.map(s => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSymptoms.includes(s)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomSymptom} className="flex gap-2 mb-8">
          <input
            type="text"
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            placeholder="Other symptoms..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200"
          >
            Add
          </button>
        </form>

        <button
          onClick={analyzeSymptoms}
          disabled={loading || selectedSymptoms.length === 0}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Analyzing Symptoms...' : 'Analyze Now'}
        </button>
      </div>

      {recommendation && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{recommendation.disease}</h3>
              <p className="text-slate-500">Predicted Disease (AI Analysis)</p>
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${
              recommendation.urgency === 'HIGH' ? 'bg-red-100 text-red-600' :
              recommendation.urgency === 'MEDIUM' ? 'bg-orange-100 text-orange-600' :
              'bg-green-100 text-green-600'
            }`}>
              {recommendation.urgency} URGENCY
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">💊 Suggested Medicines</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {recommendation.medicines.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
              <p className="text-[10px] text-slate-400 italic">Disclaimer: These are AI suggestions. Consult a professional before taking any medication.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">🛡️ Precautions</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {recommendation.precautions.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">AI Advice</h4>
            <ul className="space-y-2">
              {recommendation.suggestions.map((s, i) => (
                <li key={i} className="text-blue-700 text-sm flex gap-2">
                  <span className="text-blue-400">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
