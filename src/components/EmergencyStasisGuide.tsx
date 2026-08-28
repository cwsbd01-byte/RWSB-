import React, { useState } from 'react';
import { Rabbit, Language } from '../types';
import { GI_STASIS_EMERGENCY_STEPS, RABBIT_WELFARE_SOCIETY_INFO } from '../data/bangladeshVetsAndDiet';
import { 
  AlertOctagon, 
  Flame, 
  PhoneCall, 
  ChevronRight, 
  CheckSquare, 
  HeartHandshake
} from 'lucide-react';

interface EmergencyStasisGuideProps {
  rabbit: Rabbit | null;
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const EmergencyStasisGuide: React.FC<EmergencyStasisGuideProps> = ({
  rabbit,
  language,
  onSelectTab,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [rabbitWeight, setRabbitWeight] = useState<number>(rabbit?.weightKg || 1.8);

  const toggleStepComplete = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  // Critical care dosage calculation: ~15-20ml of prepared slurry per kg body weight daily in divided doses
  const dailySyringeVolumeMl = Math.round(rabbitWeight * 18);
  const perFeedVolumeMl = Math.round(dailySyringeVolumeMl / 4);

  return (
    <div className="space-y-6">
      {/* Red Alert Emergency Hero */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-rose-600/60 border border-rose-400/40 text-white">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'bn' ? 'জরুরি জিআই স্ট্যাসিস ও প্রাথমিক চিকিৎসা' : 'Acute GI Stasis Emergency Protocol'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-rose-200 mt-2 max-w-2xl leading-relaxed">
              {language === 'bn'
                ? 'খরগোশ যদি ৬-৮ ঘণ্টা ধরে ঘাস না খায় বা মলত্যাগ বন্ধ করে দেয়, তবে প্রতি মিনিট মূল্যবান। অবিলম্বে নিচের ৬টি ধাপ অনুসরণ করুন এবং ভেটেরিনারি হাসপাতালে যাওয়ার প্রস্তুতি নিন।'
                : 'A rabbit that stops eating or pooping for 6-8+ hours is in acute medical crisis. Follow this veterinarian-approved protocol immediately.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <a
              href={`tel:${RABBIT_WELFARE_SOCIETY_INFO.helpline}`}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 bg-white hover:bg-rose-50 text-rose-900 text-xs font-extrabold rounded-2xl shadow-lg transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? 'জরুরি হেল্পলাইনে কল করুন' : 'Call RWSB Helpline'}</span>
            </a>
            <button
              onClick={() => onSelectTab('vetsBD')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-800 hover:bg-rose-700 text-rose-100 text-xs font-bold rounded-2xl border border-rose-600 transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'বাংলাদেশ ভেট ডিরেক্টরি' : 'View BD Vet Clinics'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Protocol Interactive Carousel / List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-sm">
              6
            </span>
            <span>{language === 'bn' ? 'জীবনরক্ষাকারী ৬টি পদক্ষেপ (Life-Saving Steps)' : '6-Step First-Aid Guide'}</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {completedSteps.length} of 6 {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
          </span>
        </div>

        <div className="space-y-3.5">
          {GI_STASIS_EMERGENCY_STEPS.map((s) => {
            const isCompleted = completedSteps.includes(s.step);
            const isSelected = activeStep === s.step;

            return (
              <div
                key={s.step}
                className={`rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-rose-300 bg-rose-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div
                  onClick={() => setActiveStep(s.step)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start space-x-3.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCompleted ? '✓' : s.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === 'bn' ? s.titleBn : s.titleEn}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {language === 'bn' ? s.descBn : s.descEn}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepComplete(s.step);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Syringe Feeding & Critical Care Calculator Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Syringe Feeding Dosage Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-emerald-800">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'সিরিঞ্জে খাবার (Critical Care) হিসাবকারক' : 'Syringe Feeding Dosage Calculator'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? 'সতর্কতা: পেটে ব্লট (Bloat / শক্ত বেলুনের মতো ফোলা) থাকলে জোর করে খাওয়াবেন না! শুধুমাত্র পেট নরম থাকলে ধীরে ধীরে সিরিঞ্জের পাশ দিয়ে দিন।'
              : 'CAUTION: Never syringe feed if the belly is hard, distended or bloated! Only feed if belly is soft and gut is safe.'}
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="stasis-calc-weight" className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'খরগোশের ওজন (কেজি)' : 'Rabbit Body Weight (kg)'}:
              </label>
              <input
                id="stasis-calc-weight"
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                value={rabbitWeight}
                onChange={(e) => setRabbitWeight(parseFloat(e.target.value) || 1.5)}
                className="w-20 px-2.5 py-1 text-xs font-bold text-right bg-white border border-slate-300 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  {language === 'bn' ? 'দৈনিক মোট' : 'Daily Total'}
                </div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {dailySyringeVolumeMl} ml
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  {language === 'bn' ? 'প্রতিবারে (৪ বার/দিন)' : 'Per Meal (4x / day)'}
                </div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  ~{perFeedVolumeMl} ml
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              {language === 'bn'
                ? 'ফার্মেসির ১ মিলি বা ৫ মিলি নিডল ছাড়া সিরিঞ্জ ব্যবহার করুন। Oxbow Critical Care অথবা পিলেটস হালকা গরম পানিতে ভিজিয়ে পেস্ট তৈরি করে দেওয়া যায়।'
                : 'Use 1ml or 5ml needleless syringe. Feed warm soaked pellet paste or Oxbow Critical Care.'}
            </p>
          </div>
        </div>

        {/* Heatstroke in Bangladesh Summer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-700">
            <Flame className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'বাংলাদেশে গরমের হিটস্ট্রোক প্রতিরোধ' : 'Bangladesh Heatstroke Prevention'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? 'খরগোশ ঘামতে পারে না। বাংলাদেশে ২৮° সে-এর বেশি তাপমাত্রা এদের জন্য প্রাণঘাতী হিটস্ট্রোক ডেকে আনতে পারে।'
              : 'Rabbits cannot sweat or pant efficiently. Temperatures above 28°C (82°F) can trigger fatal heatstroke quickly.'}
          </p>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
              <span className="text-rose-600 font-bold">1.</span>
              <span>
                {language === 'bn'
                  ? 'হিমায়িত বরফের বোতল (Ice bottle wrapped in cloth) খাঁচায় রাখুন যাতে খরগোশ গা লাগিয়ে শুতে পারে।'
                  : 'Place frozen water bottles wrapped in towels near the rabbit to lean against.'}
              </span>
            </div>
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
              <span className="text-rose-600 font-bold">2.</span>
              <span>
                {language === 'bn'
                  ? 'কখনোই খরগোশকে সরাসরি বরফের পানিতে ডুবাবেন না (শক লেগে মারা যেতে পারে)। কানের বাইরে হালকা ভেজা তুলো আলতো করে লাগিয়ে দিন।'
                  : 'Never submerge in cold water. Gently mist or wipe the outside of rabbit ears with a damp cloth.'}
              </span>
            </div>
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-100 flex items-start gap-2">
              <span className="text-rose-600 font-bold">3.</span>
              <span>
                {language === 'bn'
                  ? 'প্রচুর মাটির পাত্রে পরিষ্কার ঠান্ডা পানি রাখুন (বাটি থেকে ড্রিপ বোতলের চেয়ে খরগোশ বেশি পানি পান করে)।'
                  : 'Provide heavy ceramic water bowls instead of bottles for higher water consumption.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
