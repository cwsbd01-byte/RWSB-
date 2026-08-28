import React, { useState } from 'react';
import { Rabbit, WeightRecord, Language } from '../types';
import { translations } from '../data/translations';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Scale, 
  Save, 
  X 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface WeightTrackerProps {
  rabbit: Rabbit | null;
  weightRecords: WeightRecord[];
  onSaveWeight: (record: WeightRecord) => void;
  onDeleteWeight: (id: string) => void;
  language: Language;
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({
  rabbit,
  weightRecords,
  onSaveWeight,
  onDeleteWeight,
  language,
}) => {
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weightGrams, setWeightGrams] = useState<number>(rabbit ? Math.round(rabbit.weightKg * 1000) : 1800);
  const [notes, setNotes] = useState('');

  if (!rabbit) {
    return <div className="text-center py-10 text-slate-500">{t.noDataYet}</div>;
  }

  // Calculate percentage weight changes
  const chartData = weightRecords.map((rec) => ({
    date: rec.date,
    grams: rec.weightGrams,
    kg: (rec.weightGrams / 1000).toFixed(2),
    notes: rec.notes,
  }));

  const latestRecord = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1] : null;
  const previousRecord = weightRecords.length > 1 ? weightRecords[weightRecords.length - 2] : null;

  let weightChangePct = 0;
  let hasDangerousDrop = false;

  if (latestRecord && previousRecord) {
    const diff = latestRecord.weightGrams - previousRecord.weightGrams;
    weightChangePct = (diff / previousRecord.weightGrams) * 100;
    if (weightChangePct <= -10) {
      hasDangerousDrop = true;
    }
  }

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightGrams || weightGrams <= 0) return;

    const grams = Number(weightGrams);
    const prevRec = weightRecords.length > 0 ? weightRecords[weightRecords.length - 1] : null;
    const change = prevRec ? grams - prevRec.weightGrams : 0;

    const newRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      rabbitId: rabbit.id,
      date,
      weightGrams: grams,
      weightKg: parseFloat((grams / 1000).toFixed(3)),
      changeGrams: change,
      notes: notes.trim() || undefined,
    };

    onSaveWeight(newRecord);
    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header card with quick metrics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">{t.weightTrackerTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t.weightSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-xs text-slate-500">{t.currentWeight}</div>
            <div className="text-xl font-extrabold text-slate-900">
              {latestRecord ? (latestRecord.weightGrams / 1000).toFixed(2) : rabbit.weightKg} kg
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnAddWeight}</span>
          </button>
        </div>
      </div>

      {/* Dangerous Drop Alert */}
      {hasDangerousDrop && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-sm flex items-start space-x-3 text-rose-900">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-rose-950">
              {language === 'bn' ? 'সতর্কতা: দ্রুত ওজন হ্রাস!' : 'Critical Alert: Sudden Weight Drop!'}
            </h3>
            <p className="text-xs text-rose-800 mt-1">{t.weightWarning}</p>
          </div>
        </div>
      )}

      {/* Recharts Area Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
          <span>{language === 'bn' ? 'ওজনের পরিবর্তন কার্ভ (Grams over Time)' : 'Weight Trend Curve (Grams)'}</span>
          {latestRecord && previousRecord && (
            <span className={`text-xs font-bold flex items-center gap-1 ${
              weightChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {weightChangePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{Math.abs(weightChangePct).toFixed(1)}% vs previous</span>
            </span>
          )}
        </h3>

        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip
                  formatter={(val: any) => [`${val} g (${(Number(val) / 1000).toFixed(2)} kg)`, 'Weight']}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderColor: '#e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="grams"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                  dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#047857' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
            {t.noDataYet}
          </div>
        )}
      </div>

      {/* Weight History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          {language === 'bn' ? 'সকল ওজন পরিমাপের তালিকা' : 'Weight Log Records'}
        </h3>
        {weightRecords.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">{t.noDataYet}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">{t.weightGramsLabel}</th>
                  <th className="py-3 px-4">{t.weightKgLabel}</th>
                  <th className="py-3 px-4">{t.weightChange}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'নোটস' : 'Notes'}</th>
                  <th className="py-3 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[...weightRecords].reverse().map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.date}</td>
                    <td className="py-3 px-4 font-bold text-emerald-800">{rec.weightGrams} g</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{(rec.weightGrams / 1000).toFixed(2)} kg</td>
                    <td className="py-3 px-4">
                      {rec.changeGrams !== undefined ? (
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                          rec.changeGrams > 0
                            ? 'text-emerald-700 bg-emerald-50'
                            : rec.changeGrams < 0
                            ? 'text-rose-700 bg-rose-50'
                            : 'text-slate-600 bg-slate-100'
                        }`}>
                          {rec.changeGrams > 0 ? `+${rec.changeGrams}g` : `${rec.changeGrams}g`}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{rec.notes || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteWeight(rec.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Weight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>{t.btnAddWeight}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWeight} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.date}</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.weightGramsLabel} *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="15000"
                    required
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 1850"
                    className="w-full px-3.5 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">
                    g ({(weightGrams / 1000).toFixed(2)} kg)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'মন্তব্য (ঐচ্ছিক)' : 'Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. রুটিন ওজন চেক, ডায়েট পরিবর্তন..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
