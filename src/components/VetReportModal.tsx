import React, { useState } from 'react';
import { Rabbit, DailyHealthLog, WeightRecord, MedicalRecord, Language } from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  Printer, 
  Download, 
  Heart, 
  FileText, 
  Code, 
  MessageSquare, 
  Copy, 
  Check, 
  Filter, 
  Share2, 
  Stethoscope,
  Info
} from 'lucide-react';
import { 
  generateVetTextSummary, 
  downloadVetTextFile, 
  downloadVetJsonFile, 
  generateQuickVetClipboardSnippet,
  ExportOptions 
} from '../utils/exportReport';

interface VetReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rabbit: Rabbit | null;
  logs: DailyHealthLog[];
  weightRecords: WeightRecord[];
  medicalRecords: MedicalRecord[];
  language: Language;
}

type ModalTab = 'clinical_print' | 'text_file' | 'json_file' | 'quick_share';

export const VetReportModal: React.FC<VetReportModalProps> = ({
  isOpen,
  onClose,
  rabbit,
  logs,
  weightRecords,
  medicalRecords,
  language,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<ModalTab>('clinical_print');
  const [daysFilter, setDaysFilter] = useState<number | undefined>(undefined);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !rabbit) return null;

  const exportOptions: ExportOptions = {
    daysRange: daysFilter,
    includeLogs: true,
    includeWeights: true,
    includeMedical: true,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    downloadVetTextFile(rabbit, logs, weightRecords, medicalRecords, language, exportOptions);
  };

  const handleDownloadJson = () => {
    downloadVetJsonFile(rabbit, logs, weightRecords, medicalRecords, exportOptions);
  };

  const handleCopyText = async () => {
    const fullText = generateVetTextSummary(rabbit, logs, weightRecords, medicalRecords, language, exportOptions);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyQuickSnippet = async () => {
    const snippet = generateQuickVetClipboardSnippet(rabbit, logs, medicalRecords, language);
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedType('quick');
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  };

  const textSummary = generateVetTextSummary(rabbit, logs, weightRecords, medicalRecords, language, exportOptions);

  // Filtered dataset for clinical view
  let filteredLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let filteredWeights = [...weightRecords].sort((a, b) => b.date.localeCompare(a.date));
  let filteredMed = [...medicalRecords].sort((a, b) => b.date.localeCompare(a.date));

  if (daysFilter) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysFilter);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    filteredLogs = filteredLogs.filter((l) => l.date >= cutoffStr);
    filteredWeights = filteredWeights.filter((w) => w.date >= cutoffStr);
    filteredMed = filteredMed.filter((m) => m.date >= cutoffStr);
  }

  const latestLog = filteredLogs.length > 0 ? filteredLogs[0] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span>{language === 'bn' ? 'অফিসিয়াল ভেটেরিনারি স্বাস্থ্য রিপোর্ট ও এক্সপোর্ট' : 'Veterinary Clinical Health Export'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {rabbit.name} • {rabbit.breed} ({rabbit.weightKg} kg)
              </p>
            </div>
          </div>

          {/* Quick Global Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Filter */}
            <div className="flex items-center bg-slate-800 rounded-xl px-2.5 py-1 border border-slate-700 text-xs">
              <Filter className="w-3 h-3 text-slate-400 mr-1.5" />
              <select
                value={daysFilter === undefined ? 'all' : daysFilter}
                onChange={(e) => setDaysFilter(e.target.value === 'all' ? undefined : Number(e.target.value))}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-hidden cursor-pointer"
                title="Filter Date Range"
              >
                <option value="all" className="bg-slate-800 text-white">{language === 'bn' ? 'সকল রেকর্ড (All)' : 'All Records'}</option>
                <option value="7" className="bg-slate-800 text-white">{language === 'bn' ? 'বিগত ৭ দিন (7 Days)' : 'Past 7 Days'}</option>
                <option value="14" className="bg-slate-800 text-white">{language === 'bn' ? 'বিগত ১৪ দিন (14 Days)' : 'Past 14 Days'}</option>
                <option value="30" className="bg-slate-800 text-white">{language === 'bn' ? 'বিগত ৩০ দিন (30 Days)' : 'Past 30 Days'}</option>
              </select>
            </div>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Download clean plain-text file for vet"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '.TXT ফাইল ডাউনলোড' : 'Download .TXT'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Download full machine-readable JSON data"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON Backup</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Print document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Mode Navigation Tabs (Hidden on print) */}
        <div className="bg-slate-100 px-5 sm:px-6 py-2 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto print:hidden">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('clinical_print')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'clinical_print'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'ক্লিনিক্যাল সামারি শিট' : 'Clinical Summary Sheet'}</span>
            </button>

            <button
              onClick={() => setActiveTab('text_file')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'text_file'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'টেক্সট ফাইল (.TXT) প্রিভিউ' : 'Plain Text (.TXT) Report'}</span>
            </button>

            <button
              onClick={() => setActiveTab('json_file')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'json_file'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'JSON ডাটা কাঠামো' : 'Raw JSON Data'}</span>
            </button>

            <button
              onClick={() => setActiveTab('quick_share')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'quick_share'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ / SMS স্নাইপেট' : 'WhatsApp / Quick Message'}</span>
            </button>
          </div>

          <div className="hidden md:flex items-center text-[11px] text-slate-500">
            <span>{language === 'bn' ? 'সহজেই ডাক্তারের সাথে শেয়ার করুন' : 'Export & Share with any Exotic Vet'}</span>
          </div>
        </div>

        {/* Tab 1: Clinical Printable Report */}
        {activeTab === 'clinical_print' && (
          <div id="printable-report" className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0 print:overflow-visible">
            {/* Header with Organization Branding */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  RABBIT WELFARE SOCIETY OF BANGLADESH
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  খরগোশ স্বাস্থ্য ও ক্লিনিক্যাল পর্যবেক্ষণ রিপোর্ট • Veterinary Health Summary
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>Helpline: +880 1987-580017</div>
              </div>
            </div>

            {/* Patient Card Grid */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">{t.rabbitName}:</span>
                <span className="font-bold text-slate-900 text-sm">{rabbit.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{t.rabbitBreed}:</span>
                <span className="font-semibold text-slate-800">{rabbit.breed}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{t.rabbitGender}:</span>
                <span className="font-semibold text-slate-800">{rabbit.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Age / Weight:</span>
                <span className="font-semibold text-slate-800">{rabbit.ageYears}y {rabbit.ageMonths}m • {rabbit.weightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Color / ID:</span>
                <span className="font-semibold text-slate-800">{rabbit.color} {rabbit.microchipNo ? `(${rabbit.microchipNo})` : ''}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Guardian:</span>
                <span className="font-semibold text-slate-800">{rabbit.ownerName || '-'} ({rabbit.ownerPhone || '-'})</span>
              </div>
            </div>

            {/* Current Vital Status */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Current Vital Signs & Gut Motility (Latest Log)
              </h2>
              {latestLog ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Poop Quality:</span>
                    <span className="font-bold text-slate-900">{t[`poop_${latestLog.poopQuality}` as keyof typeof t]}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Hay Intake:</span>
                    <span className="font-bold text-emerald-700">{latestLog.hayIntakePct}%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Activity / Energy:</span>
                    <span className="font-bold text-slate-900">{t[`act_${latestLog.activityLevel}` as keyof typeof t]}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Stasis Risk:</span>
                    <span className="font-bold text-rose-700 uppercase">{latestLog.stasisRiskLevel}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">{t.noDataYet}</p>
              )}
            </div>

            {/* Weight History */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Weight Curve Log ({filteredWeights.length} Records)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Weight (Grams)</th>
                      <th className="py-2 px-3">Weight (kg)</th>
                      <th className="py-2 px-3">Delta</th>
                      <th className="py-2 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWeights.slice(-6).map((w) => (
                      <tr key={w.id}>
                        <td className="py-2 px-3">{w.date}</td>
                        <td className="py-2 px-3 font-bold">{w.weightGrams} g</td>
                        <td className="py-2 px-3">{w.weightKg} kg</td>
                        <td className="py-2 px-3">{w.changeGrams ? `${w.changeGrams}g` : '-'}</td>
                        <td className="py-2 px-3 text-slate-500">{w.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Medical Records */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                3. Past Medical Treatments & Vaccinations ({filteredMed.length} Records)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Treatment / Procedure</th>
                      <th className="py-2 px-3">Clinic & Doctor</th>
                      <th className="py-2 px-3">Prescribed Meds</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMed.slice(0, 6).map((m) => (
                      <tr key={m.id}>
                        <td className="py-2 px-3 whitespace-nowrap">{m.date}</td>
                        <td className="py-2 px-3 uppercase font-semibold text-[10px] text-slate-600">{m.type}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{m.title}</td>
                        <td className="py-2 px-3 text-slate-600">{m.clinicName} {m.vetDoctor ? `(${m.vetDoctor})` : ''}</td>
                        <td className="py-2 px-3 text-slate-700">{m.prescribedMeds || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature & Disclaimer Footer */}
            <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="max-w-md">
                <p className="font-semibold text-slate-700">Rabbit Welfare Society of Bangladesh (RWSB)</p>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-0.5">
                  This document is generated for clinical evaluation by a licensed veterinarian. Rabbits require specialized exotic handling, anesthesia without fasting, and specific safe antibiotics.
                </p>
              </div>
              <div className="text-right border-t border-slate-300 pt-2 min-w-[150px]">
                <span className="text-[11px] text-slate-400 block">Attending Veterinarian Signature</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Plain Text File Preview & Actions */}
        {activeTab === 'text_file' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    {language === 'bn' ? 'ভেটেরিনারি ক্লিনিক্যাল টেক্সট ফাইল (.TXT)' : 'Veterinary Plain Text Report (.TXT)'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {language === 'bn'
                      ? 'যেকোনো মোবাইল বা কম্পিউটারে সহজে পড়ার জন্য সাজানো হয়েছে। যেকোনো ভেটের কাছে ইমেইল বা মেসেজে পাঠানোর উপযোগী।'
                      : 'Structured plain-text report ready to open in any text editor, send via email, or copy for exotic vets.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyText}
                  className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedType === 'text' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedType === 'text' ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'টেক্সট কপি করুন' : 'Copy All')}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'bn' ? '.TXT ফাইল ডাউনলোড' : 'Download .TXT File'}</span>
                </button>
              </div>
            </div>

            {/* Live Monospace Text Box */}
            <div className="relative">
              <pre className="bg-slate-900 text-emerald-300 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[50vh] whitespace-pre-wrap select-all">
                {textSummary}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: JSON Data Format */}
        {activeTab === 'json_file' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Code className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'bn' ? 'পূর্ণাঙ্গ JSON ডাটা ফাইল' : 'Complete Clinical JSON Export'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {language === 'bn'
                      ? 'খরগোশের সমস্ত প্রোফাইল, দৈনিক লগ, ওজন তালিকা ও মেডিকেল রেকর্ডের মেশিন রিডেবল ব্যাকআপ।'
                      : 'Structured JSON schema containing demographic attributes, daily GI checkups, weight trends, and medical history.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify({
                      rabbit,
                      dailyHealthLogs: filteredLogs,
                      weightRecords: filteredWeights,
                      medicalRecords: filteredMed,
                      exportedAt: new Date().toISOString(),
                    }, null, 2);
                    navigator.clipboard.writeText(jsonStr);
                    setCopiedType('json');
                    setTimeout(() => setCopiedType(null), 2500);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedType === 'json' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedType === 'json' ? 'JSON Copied!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{language === 'bn' ? '.JSON ফাইল ডাউনলোড' : 'Download .JSON File'}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-[50vh] whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    metadata: {
                      exportedAt: new Date().toISOString(),
                      organization: 'Rabbit Welfare Society of Bangladesh (RWSB)',
                      version: '1.2.0',
                    },
                    rabbit,
                    latestVitals: latestLog,
                    dailyHealthLogs: filteredLogs,
                    weightRecords: filteredWeights,
                    medicalRecords: filteredMed,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Quick WhatsApp / SMS Snippet */}
        {activeTab === 'quick_share' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-teal-950">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপ ও মেসেঞ্জারে সরাসরি পাঠানোর সারসংক্ষেপ' : 'Quick WhatsApp / SMS Snippet for Vet Consult'}
                  </h4>
                  <p className="text-xs text-teal-800 mt-0.5">
                    {language === 'bn'
                      ? 'জরুরি অবস্থায় পশু চিকিৎসককে সংক্ষেপে সমস্ত লক্ষণ ও মেডিকেল হিস্টোরি জানাতে এই বার্তাটি এক ক্লিকে কপি করে পাঠিয়ে দিন।'
                      : 'Concise, ready-formatted message highlighting current GI symptoms, poop quality, pain signs, and recent medications.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyQuickSnippet}
                className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                {copiedType === 'quick' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'quick' ? (language === 'bn' ? 'মেসেজ কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'মেসেজ কপি করুন' : 'Copy Message')}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>{language === 'bn' ? 'বার্তা প্রিভিউ' : 'Message Preview'}</span>
              </div>
              <pre className="bg-slate-50 text-slate-800 p-4 rounded-xl text-xs font-sans whitespace-pre-wrap leading-relaxed border border-slate-200/80">
                {generateQuickVetClipboardSnippet(rabbit, logs, medicalRecords, language)}
              </pre>
            </div>
          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 print:hidden">
          <div className="flex items-center space-x-1.5">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Rabbit Welfare Society of Bangladesh (RWSB) • Confidential Vet Records</span>
          </div>
          <div>
            <span>Format: UTF-8 Plain Text & JSON v1.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
