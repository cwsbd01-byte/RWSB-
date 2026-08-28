import React from 'react';
import { Rabbit, DailyHealthLog, WeightRecord, MedicalRecord, Language } from '../types';
import { translations } from '../data/translations';
import { 
  Plus, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Trash2,
  Calendar,
  Thermometer,
  FileText,
  Download,
  Settings2
} from 'lucide-react';
import { downloadVetTextFile, downloadVetJsonFile } from '../utils/exportReport';

interface HealthOverviewProps {
  rabbit: Rabbit | null;
  logs: DailyHealthLog[];
  weightRecords?: WeightRecord[];
  medicalRecords?: MedicalRecord[];
  onOpenLogModal: () => void;
  onOpenVetReport?: () => void;
  onOpenEditRabbit?: () => void;
  onOpenAddRabbit?: () => void;
  onSelectTab: (tab: string) => void;
  onDeleteLog: (id: string) => void;
  language: Language;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({
  rabbit,
  logs,
  weightRecords = [],
  medicalRecords = [],
  onOpenLogModal,
  onOpenVetReport,
  onOpenEditRabbit,
  onOpenAddRabbit,
  onSelectTab,
  onDeleteLog,
  language,
}) => {
  const t = translations[language];

  if (!rabbit) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xs max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🐰
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {language === 'bn' ? 'কোনো খরগোশ পাওয়া যায়নি' : 'No Rabbit Selected'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {language === 'bn'
            ? 'আপনার প্রিয় খরগোশের স্বাস্থ্য ট্র্যাক করতে নতুন প্রোফাইল যোগ করুন।'
            : 'Add a new rabbit profile to begin logging daily health & vital records.'}
        </p>
        {onOpenAddRabbit && (
          <button
            onClick={onOpenAddRabbit}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addRabbit}</span>
          </button>
        )}
      </div>
    );
  }

  const latestLog = logs.length > 0 ? logs[0] : null;
  const todayStr = new Date().toISOString().split('T')[0];
  const isLoggedToday = latestLog ? latestLog.date === todayStr : false;

  // Compute 0-100 Health Score based on logs
  const computeHealthScore = (): number => {
    if (!latestLog) return 85;
    let score = 100;
    if (latestLog.stasisRiskLevel === 'emergency') score -= 50;
    else if (latestLog.stasisRiskLevel === 'warning') score -= 25;

    if (latestLog.hayIntakePct < 70) score -= (70 - latestLog.hayIntakePct) / 2;
    if (latestLog.poopQuantityRating < 4) score -= (4 - latestLog.poopQuantityRating) * 5;
    if (latestLog.teethGrinding) score -= 15;
    if (latestLog.earMiteCheck !== 'clean') score -= 10;
    if (latestLog.eyeNoseCheck !== 'clean') score -= 10;

    return Math.max(10, Math.min(100, Math.round(score)));
  };

  const healthScore = computeHealthScore();

  const handleQuickDownloadTxt = () => {
    downloadVetTextFile(rabbit, logs, weightRecords, medicalRecords, language);
  };

  const handleQuickDownloadJson = () => {
    downloadVetJsonFile(rabbit, logs, weightRecords, medicalRecords);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Rabbit Identity + Health Status */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 top-6 opacity-10 text-9xl pointer-events-none select-none">
          🐇
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and Basic Profile */}
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-800/80 border-2 border-emerald-400/40 p-1 overflow-hidden shrink-0 shadow-lg flex items-center justify-center">
              {rabbit.photoUrl ? (
                <img src={rabbit.photoUrl} alt={rabbit.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-4xl">🐰</span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {rabbit.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {rabbit.gender.includes('female') ? (language === 'bn' ? 'মহিলা ♀' : 'Female ♀') : (language === 'bn' ? 'পুরুষ ♂' : 'Male ♂')}
                </span>
                {onOpenEditRabbit && (
                  <button
                    onClick={onOpenEditRabbit}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 text-emerald-100 rounded-lg backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
                    title={t.editRabbit}
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>{t.edit}</span>
                  </button>
                )}
              </div>
              <p className="text-sm text-emerald-200/90 mt-1">
                {rabbit.breed} • {rabbit.ageYears}y {rabbit.ageMonths}m • {rabbit.weightKg} kg
              </p>
              {rabbit.ownerCity && (
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                  <span>📍 {rabbit.ownerCity}</span>
                  {rabbit.microchipNo && <span>• ID: {rabbit.microchipNo}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Health Score Gauge & Stasis Risk Status */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-black text-emerald-300">{healthScore}%</div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-100 font-semibold">{t.healthScore}</div>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <div className="text-xs text-slate-300 font-medium">{t.stasisRisk}</div>
              <div className="flex items-center space-x-1.5 mt-0.5">
                {latestLog?.stasisRiskLevel === 'emergency' ? (
                  <span className="inline-flex items-center text-xs font-bold text-rose-300 bg-rose-500/30 px-2 py-0.5 rounded-md animate-pulse">
                    <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                    {t.stasisRiskEmergency}
                  </span>
                ) : latestLog?.stasisRiskLevel === 'warning' ? (
                  <span className="inline-flex items-center text-xs font-bold text-amber-300 bg-amber-500/30 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    {t.stasisRiskWarning}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-bold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {t.stasisRiskSafe}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar inside Header Banner */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-emerald-200">
            <Calendar className="w-4 h-4" />
            <span>
              {isLoggedToday ? (
                <span className="text-emerald-300 font-medium">{t.loggedToday} ({latestLog?.date})</span>
              ) : (
                <span className="text-amber-300 font-medium">{t.notLoggedToday}</span>
              )}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenLogModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.btnLogToday}</span>
            </button>
            <button
              onClick={() => onSelectTab('aiDoctor')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.navAiDoctor}</span>
            </button>
            {onOpenVetReport && (
              <button
                onClick={onOpenVetReport}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all cursor-pointer backdrop-blur-xs border border-white/20"
                title="Open Vet Export & Report Center"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-300" />
                <span>{language === 'bn' ? 'ডাক্তারের এক্সপোর্ট (.TXT / .JSON)' : 'Export for Vet'}</span>
              </button>
            )}
            <button
              onClick={() => onSelectTab('stasisEmergency')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition-all cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-200" />
              <span>{t.navStasisEmergency}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Alert Card if Stasis Risk is high */}
      {latestLog?.stasisRiskLevel === 'emergency' && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 shadow-md flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-rose-950 flex items-center justify-between">
              <span>{language === 'bn' ? 'জরুরি চিকিৎসা সতর্কতা (GI Stasis Alert)' : 'Emergency Clinical Alert'}</span>
              <span className="text-xs bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">Act Now</span>
            </h3>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              {language === 'bn'
                ? 'আপনার খরগোশের খাবার বা মলের পরিমাণ বিপজ্জনকভাবে কমেছে। খরগোশের অন্ত্র স্তব্ধ হওয়া জীবনঘাতী। অবিলম্বে জরুরি প্রটোকল দেখুন এবং অভিজ্ঞ ভেটেরিনারি চিকিৎসকের সাথে যোগাযোগ করুন।'
                : 'Your rabbit has alarming signs of digestive shutdown. Rabbits cannot survive long without eating or pooping. Follow emergency steps immediately.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onSelectTab('stasisEmergency')}
                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 cursor-pointer shadow-xs"
              >
                {language === 'bn' ? 'জরুরি প্রাথমিক চিকিৎসা নির্দেশিকা' : 'Open Emergency First-Aid Protocol'}
              </button>
              <button
                onClick={() => onSelectTab('vetsBD')}
                className="px-3 py-1.5 bg-white border border-rose-300 text-rose-900 text-xs font-bold rounded-lg hover:bg-rose-100 cursor-pointer"
              >
                {language === 'bn' ? 'নিকটস্থ ভেট ক্লিনিক কল করুন' : 'Call BD Vet Clinic'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Poop Condition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.poopQualityLabel}</span>
            <span className="text-xl">💩</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {latestLog ? t[`poop_${latestLog.poopQuality}` as keyof typeof t] : t.noDataYet}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{language === 'bn' ? 'আউটপুট রেটিং' : 'Output count'}:</span>
            <span className="font-semibold text-emerald-700">{latestLog ? `${latestLog.poopQuantityRating}/5` : '-'}</span>
          </div>
        </div>

        {/* Card 2: Hay Intake */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dailyHayIntake}</span>
            <span className="text-xl">🌾</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {latestLog ? `${latestLog.hayIntakePct}%` : '-'}
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                (latestLog?.hayIntakePct || 0) >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${latestLog?.hayIntakePct || 0}%` }}
            ></div>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'bn' ? 'লক্ষ্যমাত্রা: ৮০-৮৫% ঘাস' : 'Target: 80-85% grass hay'}
          </div>
        </div>

        {/* Card 3: Energy & Behavior */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.energyLevelLabel}</span>
            <span className="text-xl">🐇</span>
          </div>
          <div className="text-sm font-bold text-slate-900">
            {latestLog ? t[`act_${latestLog.activityLevel}` as keyof typeof t] : t.noDataYet}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{language === 'bn' ? 'দাঁত কিড়মিড় (ব্যথা)' : 'Teeth grinding'}:</span>
            <span className={`font-semibold ${latestLog?.teethGrinding ? 'text-rose-600 font-bold' : 'text-emerald-700'}`}>
              {latestLog?.teethGrinding ? (language === 'bn' ? 'হ্যাঁ (ব্যথা)' : 'Yes (Pain)') : (language === 'bn' ? 'না (স্বাভাবিক)' : 'No')}
            </span>
          </div>
        </div>

        {/* Card 4: Weight & Physical */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.currentWeight}</span>
            <span className="text-xl">⚖️</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {rabbit.weightKg} <span className="text-sm font-semibold text-slate-500">kg</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'bn' ? 'তাপমাত্রা' : 'Temp'}:</span>
            </span>
            <span className="font-semibold text-slate-700">
              {latestLog?.temperatureCelsius ? `${latestLog.temperatureCelsius}°C` : '38.6°C (Normal)'}
            </span>
          </div>
        </div>
      </div>

      {/* Health Check History Table & Export Hub Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'দৈনিক স্বাস্থ্য ও জিআই স্ট্যাসিস লগ' : 'Daily Health & GI Stasis Logs'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'ডাক্তার দেখানোর আগে এক ক্লিকে সম্পূর্ণ লগ ডাউনলোড বা কপি করে নিতে পারেন' : 'Export or copy full digestive logs before consulting your vet'}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleQuickDownloadTxt}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 cursor-pointer transition-colors shadow-2xs"
              title="Download structured .TXT file"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>.TXT ডাউনলোড</span>
            </button>
            <button
              onClick={handleQuickDownloadJson}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              title="Download .JSON machine data"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>.JSON</span>
            </button>
            {onOpenVetReport && (
              <button
                onClick={onOpenVetReport}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ রিপোর্ট' : 'Full Vet Center'}</span>
              </button>
            )}
            <button
              onClick={onOpenLogModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.btnLogToday}</span>
            </button>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            {t.noDataYet}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">{t.poopQualityLabel}</th>
                  <th className="py-3 px-4">{t.dailyHayIntake}</th>
                  <th className="py-3 px-4">{t.energyLevelLabel}</th>
                  <th className="py-3 px-4">{t.stasisRisk}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'মন্তব্য' : 'Notes'}</th>
                  <th className="py-3 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.slice(0, 6).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {log.date} <span className="text-[11px] text-slate-400 font-normal">{log.time}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[11px] bg-slate-100 text-slate-800">
                        {t[`poop_${log.poopQuality}` as keyof typeof t]}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {log.hayIntakePct}%
                    </td>
                    <td className="py-3 px-4">
                      {t[`act_${log.activityLevel}` as keyof typeof t]}
                    </td>
                    <td className="py-3 px-4">
                      {log.stasisRiskLevel === 'emergency' ? (
                        <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md text-[10px]">
                          🚨 Critical
                        </span>
                      ) : log.stasisRiskLevel === 'warning' ? (
                        <span className="text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">
                          ⚠️ Caution
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                          🟢 Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                      {log.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteLog(log.id)}
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
    </div>
  );
};
