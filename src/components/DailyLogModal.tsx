import React, { useState } from 'react';
import { DailyHealthLog, Language, PoopQuality, ActivityLevel } from '../types';
import { translations } from '../data/translations';
import { X, Save, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (log: DailyHealthLog) => void;
  rabbitId: string;
  rabbitName: string;
  language: Language;
}

const COMMON_GREENS_BD = [
  'ধনেপাতা (Coriander)',
  'পুদিনা পাতা (Mint)',
  'রোমেইন লেটুস (Romaine Lettuce)',
  'কলমি শাক (Water Spinach - Small)',
  'গাজরের পাতা (Carrot Tops)',
  'দুর্বা ঘাস (Durba/Bermuda Grass)',
  'পালং শাক (Spinach - Very Little)',
  'তুলসী পাতা (Basil/Tulsi)'
];

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  onSaveLog,
  rabbitId,
  rabbitName,
  language,
}) => {
  const t = translations[language];

  const todayStr = new Date().toISOString().split('T')[0];
  const timeNow = new Date().toTimeString().slice(0, 5);

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(timeNow);
  const [poopQuality, setPoopQuality] = useState<PoopQuality>('healthy_golden');
  const [poopQuantityRating, setPoopQuantityRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [hayIntakePct, setHayIntakePct] = useState(80);
  const [pelletIntake, setPelletIntake] = useState<'normal' | 'low' | 'none' | 'overfed'>('normal');
  const [waterIntake, setWaterIntake] = useState<'normal' | 'low' | 'excessive' | 'none'>('normal');
  const [greensGiven, setGreensGiven] = useState<string[]>(['ধনেপাতা (Coriander)']);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('active_normal');
  const [earMiteCheck, setEarMiteCheck] = useState<'clean' | 'mild_wax' | 'crusty_mites' | 'head_tilt'>('clean');
  const [eyeNoseCheck, setEyeNoseCheck] = useState<'clean' | 'watery_eyes' | 'white_nasal_discharge' | 'crusty'>('clean');
  const [teethGrinding, setTeethGrinding] = useState(false);
  const [temperatureCelsius, setTemperatureCelsius] = useState<string>('');
  const [weightGrams, setWeightGrams] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Calculate Stasis Risk dynamically
  const calculateRisk = (): 'safe' | 'warning' | 'emergency' => {
    if (
      poopQuality === 'no_poop' ||
      poopQuality === 'diarrhea' ||
      activityLevel === 'hunched_pain' ||
      hayIntakePct < 25 ||
      waterIntake === 'none' ||
      earMiteCheck === 'head_tilt' ||
      teethGrinding
    ) {
      return 'emergency';
    }
    if (
      poopQuality === 'small_dry' ||
      poopQuality === 'soft_cecotropes' ||
      poopQuantityRating <= 2 ||
      hayIntakePct < 60 ||
      waterIntake === 'low' ||
      activityLevel === 'lethargic' ||
      eyeNoseCheck === 'white_nasal_discharge' ||
      earMiteCheck === 'crusty_mites'
    ) {
      return 'warning';
    }
    return 'safe';
  };

  const currentRisk = calculateRisk();

  const toggleGreen = (green: string) => {
    setGreensGiven((prev) =>
      prev.includes(green) ? prev.filter((g) => g !== green) : [...prev, green]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: DailyHealthLog = {
      id: `log-${Date.now()}`,
      rabbitId,
      date,
      time,
      poopQuality,
      poopQuantityRating,
      hayIntakePct,
      pelletIntake,
      waterIntake,
      greensGiven,
      activityLevel,
      earMiteCheck,
      eyeNoseCheck,
      teethGrinding,
      temperatureCelsius: temperatureCelsius ? parseFloat(temperatureCelsius) : undefined,
      weightGrams: weightGrams ? parseInt(weightGrams) : undefined,
      notes: notes.trim() || undefined,
      stasisRiskLevel: currentRisk,
    };

    onSaveLog(newLog);

    if (currentRisk === 'safe') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">🩺</span>
              <h2 className="text-lg font-bold tracking-tight">{t.modalLogTitle}</h2>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              {language === 'bn' ? `রোগী: ${rabbitName}` : `Rabbit Patient: ${rabbitName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Stasis Alert Banner inside modal */}
        {currentRisk === 'emergency' && (
          <div className="bg-rose-600 text-white px-5 py-2.5 flex items-center space-x-2 text-xs font-semibold animate-pulse">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {language === 'bn'
                ? 'সতর্কতা: লক্ষণগুলো তীব্র জিআই স্ট্যাসিস (GI Stasis) বা জরুরি অসুস্থতা নির্দেশ করছে!'
                : 'CRITICAL ALERT: Selected signs indicate potential Acute GI Stasis or Emergency!'}
            </span>
          </div>
        )}

        {currentRisk === 'warning' && (
          <div className="bg-amber-500 text-slate-900 px-5 py-2 flex items-center space-x-2 text-xs font-semibold">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              {language === 'bn'
                ? 'পরামর্শ: খাদ্য ও মলের পরিমাণ কমেছে। নিবিড় পর্যবেক্ষণ করুন ও প্রচুর ঘাস দিন।'
                : 'Caution: Reduced motility or appetite observed. Monitor closely and hydrate.'}
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="log-input-date" className="block text-xs font-semibold text-slate-700 mb-1">{t.date}</label>
              <input
                id="log-input-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label htmlFor="log-input-time" className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সময় (Time)' : 'Time'}
              </label>
              <input
                id="log-input-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 1: Poop Condition (Vital Rabbit Health Metric) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>💩</span>
                <span>{t.poopQualityLabel} *</span>
              </label>
              <span className="text-[11px] text-amber-800 font-medium">
                {language === 'bn' ? 'খরগোশের মলের অবস্থা তার অন্ত্রের আয়না' : 'Poop is the direct mirror of rabbit gut'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { id: 'healthy_golden', label: t.poop_healthy_golden, color: 'border-emerald-400 bg-emerald-50 text-emerald-900', badge: '🟢 Optimal' },
                { id: 'small_dry', label: t.poop_small_dry, color: 'border-amber-400 bg-amber-50 text-amber-900', badge: '🟡 Fiber Low' },
                { id: 'soft_cecotropes', label: t.poop_soft_cecotropes, color: 'border-orange-400 bg-orange-50 text-orange-900', badge: '🟠 Excess Sugar' },
                { id: 'stringy_hair', label: t.poop_stringy_hair, color: 'border-purple-400 bg-purple-50 text-purple-900', badge: '🟣 Hairball' },
                { id: 'diarrhea', label: t.poop_diarrhea, color: 'border-rose-500 bg-rose-50 text-rose-900', badge: '🔴 Fatal Risk' },
                { id: 'no_poop', label: t.poop_no_poop, color: 'border-red-600 bg-red-100 text-red-950 font-bold', badge: '🚨 Stasis Alert' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPoopQuality(item.id as PoopQuality)}
                  className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer text-xs flex flex-col justify-between space-y-1.5 ${
                    poopQuality === item.id
                      ? `${item.color} ring-2 ring-emerald-500 shadow-xs font-semibold`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="leading-snug">{item.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 w-fit">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Poop Count Rating */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-medium text-amber-950 mb-1">
                <span>{t.poopQuantity}</span>
                <span className="font-bold text-amber-900">{poopQuantityRating} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={poopQuantityRating}
                onChange={(e) => setPoopQuantityRating(parseInt(e.target.value) as any)}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{t.poopQuantity1}</span>
                <span>{t.poopQuantity3}</span>
                <span>{t.poopQuantity5}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hay Intake & Diet (Crucial 80% Hay Rule) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌾</span>
                <span>{t.hayPercentage} *</span>
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hayIntakePct >= 75 ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {hayIntakePct}% {hayIntakePct >= 75 ? '✅ Healthy' : '⚠️ Too Low!'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-800">{t.hayHelpText}</p>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={hayIntakePct}
              onChange={(e) => setHayIntakePct(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span className="text-rose-600 font-bold">0% (Danger)</span>
              <span>50%</span>
              <span className="text-emerald-700 font-bold">80-85% (Target)</span>
              <span>100%</span>
            </div>

            {/* Pellets & Water in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">{t.pelletIntakeLabel}</label>
                <select
                  value={pelletIntake}
                  onChange={(e) => setPelletIntake(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-hidden"
                >
                  <option value="normal">{t.pellet_normal}</option>
                  <option value="low">{t.pellet_low}</option>
                  <option value="none">{t.pellet_none}</option>
                  <option value="overfed">{t.pellet_overfed}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-emerald-950 mb-1">{t.waterIntakeLabel}</label>
                <select
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-hidden"
                >
                  <option value="normal">{t.water_normal}</option>
                  <option value="low">{t.water_low}</option>
                  <option value="excessive">{t.water_excessive}</option>
                  <option value="none">{t.water_none}</option>
                </select>
              </div>
            </div>

            {/* Safe Greens Given Today */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-emerald-950 mb-1.5">{t.greensListLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_GREENS_BD.map((green) => {
                  const selected = greensGiven.includes(green);
                  return (
                    <button
                      key={green}
                      type="button"
                      onClick={() => toggleGreen(green)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {green} {selected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Energy, Posture & Behavior */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
            <label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🐇</span>
              <span>{t.energyLevelLabel} *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'binky_hyper', label: t.act_binky_hyper, icon: '🎉' },
                { id: 'active_normal', label: t.act_active_normal, icon: '🐾' },
                { id: 'quiet_relaxed', label: t.act_quiet_relaxed, icon: '🍞' },
                { id: 'lethargic', label: t.act_lethargic, icon: '⚠️' },
                { id: 'hunched_pain', label: t.act_hunched_pain, icon: '🚨' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivityLevel(item.id as ActivityLevel)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs flex items-center space-x-2 ${
                    activityLevel === item.id
                      ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Pain / Teeth Grinding checkbox */}
            <div className="pt-2 flex items-center space-x-2 bg-white/90 p-2.5 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                id="teeth-grind-check"
                checked={teethGrinding}
                onChange={(e) => setTeethGrinding(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="teeth-grind-check" className="text-xs font-semibold text-rose-900 cursor-pointer">
                {t.teethGrindLabel}
              </label>
            </div>
          </div>

          {/* Section 4: Physical Checks (Ears, Mites, Snuffles, Temp) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.earMiteLabel}</label>
              <select
                value={earMiteCheck}
                onChange={(e) => setEarMiteCheck(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="clean">{t.ear_clean}</option>
                <option value="mild_wax">{t.ear_mild_wax}</option>
                <option value="crusty_mites">{t.ear_crusty_mites}</option>
                <option value="head_tilt">{t.ear_head_tilt}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.eyeNoseLabel}</label>
              <select
                value={eyeNoseCheck}
                onChange={(e) => setEyeNoseCheck(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="clean">{t.eye_clean}</option>
                <option value="watery_eyes">{t.eye_watery_eyes}</option>
                <option value="white_nasal_discharge">{t.eye_white_nasal_discharge}</option>
                <option value="crusty">{t.eye_crusty}</option>
              </select>
            </div>

            <div>
              <label htmlFor="log-input-temp" className="block text-xs font-semibold text-slate-700 mb-1">{t.tempOptional}</label>
              <input
                id="log-input-temp"
                type="number"
                step="0.1"
                min="35"
                max="43"
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(e.target.value)}
                placeholder="e.g. 38.6"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="log-input-weight" className="block text-xs font-semibold text-slate-700 mb-1">{t.weightOptional}</label>
              <input
                id="log-input-weight"
                type="number"
                min="200"
                max="10000"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                placeholder="e.g. 1850"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Observation Notes */}
          <div>
            <label htmlFor="log-input-notes" className="block text-xs font-semibold text-slate-700 mb-1">{t.notesLabel}</label>
            <textarea
              id="log-input-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. নতুন জাতের ঘাস খেলো, ফ্যানের নিচে আরাম করে ঘুমিয়েছে..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            ></textarea>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-600">{t.stasisRisk}:</span>
              {currentRisk === 'safe' && (
                <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> {t.stasisRiskSafe}
                </span>
              )}
              {currentRisk === 'warning' && (
                <span className="inline-flex items-center text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                  <Info className="w-3.5 h-3.5 mr-1" /> {t.stasisRiskWarning}
                </span>
              )}
              {currentRisk === 'emergency' && (
                <span className="inline-flex items-center text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> {t.stasisRiskEmergency}
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.btnSaveLog}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
