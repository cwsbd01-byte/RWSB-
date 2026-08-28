import React, { useState } from 'react';
import { Rabbit, MedicalRecord, Language, MedicalType } from '../types';
import { translations } from '../data/translations';
import { 
  Plus, 
  Trash2, 
  Syringe, 
  Stethoscope, 
  Scissors, 
  Calendar, 
  Save, 
  X, 
  Clock,
  FileText,
  Download
} from 'lucide-react';
import { downloadVetTextFile, downloadVetJsonFile } from '../utils/exportReport';

interface MedicalRecordsProps {
  rabbit: Rabbit | null;
  records: MedicalRecord[];
  onSaveRecord: (record: MedicalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenVetReport?: () => void;
  language: Language;
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({
  rabbit,
  records,
  onSaveRecord,
  onDeleteRecord,
  onOpenVetReport,
  language,
}) => {
  const t = translations[language];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<MedicalType>('deworming');
  const [title, setTitle] = useState('');
  const [clinicName, setClinicName] = useState('SAU Veterinary Hospital Dhaka');
  const [vetDoctor, setVetDoctor] = useState('');
  const [costBDT, setCostBDT] = useState<string>('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [prescribedMeds, setPrescribedMeds] = useState('');
  const [notes, setNotes] = useState('');

  if (!rabbit) {
    return <div className="text-center py-10 text-slate-500">{t.noDataYet}</div>;
  }

  const getTypeIcon = (medType: MedicalType) => {
    switch (medType) {
      case 'vaccine':
      case 'deworming':
        return <Syringe className="w-4 h-4 text-emerald-600" />;
      case 'vet_visit':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'surgery_neuter':
      case 'dental_trim':
      case 'grooming_nails':
        return <Scissors className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecord: MedicalRecord = {
      id: `med-${Date.now()}`,
      rabbitId: rabbit.id,
      date,
      type,
      title: title.trim(),
      clinicName: clinicName.trim() || undefined,
      vetDoctor: vetDoctor.trim() || undefined,
      costBDT: costBDT ? parseFloat(costBDT) : undefined,
      nextDueDate: nextDueDate || undefined,
      prescribedMeds: prescribedMeds.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSaveRecord(newRecord);
    setIsModalOpen(false);
    setTitle('');
    setPrescribedMeds('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">{t.medicalTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t.medicalSubtitle}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 self-start md:self-auto">
          {onOpenVetReport && (
            <button
              onClick={onOpenVetReport}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl border border-slate-300/80 transition-all cursor-pointer shadow-2xs"
              title="Export all medical & vital records for vet"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'bn' ? 'চিকিৎসা রিপোর্ট এক্সপোর্ট' : 'Export Medical File'}</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnAddMedical}</span>
          </button>
        </div>
      </div>

      {/* Upcoming Reminders Box */}
      {records.some((r) => r.nextDueDate) && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'আসন্ন চিকিৎসা ও বুস্টার ডেট' : 'Upcoming Reminders & Boosters'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {records
              .filter((r) => r.nextDueDate)
              .map((r) => (
                <div key={r.id} className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">{r.type}</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{r.title}</div>
                  <div className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{r.nextDueDate}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Records Cards List */}
      <div className="space-y-4">
        {records.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center text-slate-400 text-sm border border-slate-200">
            {t.noDataYet}
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(rec.type)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t[`medType${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}` as keyof typeof t] || rec.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">📅 {rec.date}</span>
                    {rec.costBDT && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        ৳ {rec.costBDT} BDT
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>

                  {(rec.clinicName || rec.vetDoctor) && (
                    <p className="text-xs text-slate-500 flex flex-wrap gap-2">
                      {rec.clinicName && <span>🏥 {rec.clinicName}</span>}
                      {rec.vetDoctor && <span>👨‍⚕️ {rec.vetDoctor}</span>}
                    </p>
                  )}

                  {rec.prescribedMeds && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900">💊 {t.prescribedMeds}: </span>
                      <span>{rec.prescribedMeds}</span>
                    </div>
                  )}

                  {rec.notes && <p className="text-xs text-slate-600 italic">"{rec.notes}"</p>}
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-start">
                {rec.nextDueDate && (
                  <div className="text-right text-xs bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    <div className="text-[10px] uppercase font-bold text-amber-900">{t.nextDueDate}</div>
                    <div className="font-bold text-amber-950">{rec.nextDueDate}</div>
                  </div>
                )}
                <button
                  onClick={() => onDeleteRecord(rec.id)}
                  className="text-slate-400 hover:text-rose-600 p-2 transition-colors cursor-pointer rounded-xl hover:bg-slate-50"
                  title={t.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Medical Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in">
            <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                <span>{t.btnAddMedical}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.date} *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MedicalType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  >
                    <option value="vaccine">{t.medTypeVaccine}</option>
                    <option value="deworming">{t.medTypeDeworming}</option>
                    <option value="vet_visit">{t.medTypeVetVisit}</option>
                    <option value="medication">{t.medTypeMedication}</option>
                    <option value="surgery_neuter">{t.medTypeSurgery}</option>
                    <option value="dental_trim">{t.medTypeDental}</option>
                    <option value="grooming_nails">{t.medTypeGrooming}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'চিকিৎসা বা টিকার নাম' : 'Title / Reason'} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. রুটিন কৃমিনাশক / RHDV ভ্যাকসিন"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.clinicName}</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="SAU Vet Clinic / CVH Dhaka"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.vetDoctor}</label>
                  <input
                    type="text"
                    value={vetDoctor}
                    onChange={(e) => setVetDoctor(e.target.value)}
                    placeholder="Dr. Name"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.costBDT}</label>
                  <input
                    type="number"
                    value={costBDT}
                    onChange={(e) => setCostBDT(e.target.value)}
                    placeholder="৳ BDT"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.nextDueDate}</label>
                  <input
                    type="date"
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.prescribedMeds}</label>
                <input
                  type="text"
                  value={prescribedMeds}
                  onChange={(e) => setPrescribedMeds(e.target.value)}
                  placeholder="e.g. Meloxicam 0.3ml twice daily, Critical Care"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.notesLabel}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. ডাক্তার বলেছেন প্রচুর ঘাস খাওয়াতে..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
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
