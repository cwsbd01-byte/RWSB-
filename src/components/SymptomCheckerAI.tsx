import React, { useState, useRef } from 'react';
import { Rabbit, Language, TriageResult } from '../types';
import { translations } from '../data/translations';
import { 
  Sparkles, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  PhoneCall, 
  MessageSquare,
  Maximize2,
  Minimize2,
  Check,
  Zap
} from 'lucide-react';

interface SymptomCheckerAIProps {
  rabbit: Rabbit | null;
  language: Language;
  onSelectTab: (tab: string) => void;
  onSetWritingFocus?: (focused: boolean) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const SymptomCheckerAI: React.FC<SymptomCheckerAIProps> = ({
  rabbit,
  language,
  onSelectTab,
  onSetWritingFocus,
}) => {
  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<'triage' | 'chat'>('triage');

  // Triage state
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('Past 4-6 hours');
  const [poopStatus, setPoopStatus] = useState('No poop / Very small');
  const [appetite, setAppetite] = useState('Refusing grass and pellets');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);

  // Focus & Floating input state
  const [isSymptomFocused, setIsSymptomFocused] = useState(false);
  const [isFloatingModalOpen, setIsFloatingModalOpen] = useState(false);
  const symptomBoxRef = useRef<HTMLDivElement>(null);

  const quickSymptomTagsBn = [
    'পায়খানা বন্ধ (৮+ ঘণ্টা)',
    'ঘাস ও খাবার খাচ্ছে না',
    'পেট ফোলা ও শক্ত (Bloat)',
    'দাঁত কিড়মিড় করছে (ব্যথা)',
    'কুঁজো হয়ে বসে আছে',
    'কান অনেক ঠান্ডা',
    'হাঁচি ও চোখে পানি',
  ];

  const quickSymptomTagsEn = [
    'No poop (8+ hrs)',
    'Refusing hay & food',
    'Hard / bloated belly',
    'Teeth grinding (Pain)',
    'Hunched posture',
    'Cold ears',
    'Sneezing / eye discharge',
  ];

  const handleAddQuickTag = (tag: string) => {
    setSymptoms((prev) => (prev ? `${prev}, ${tag}` : tag));
  };

  const handleSymptomFocus = () => {
    setIsSymptomFocused(true);
    if (onSetWritingFocus) onSetWritingFocus(true);
    // Smoothly scroll the symptom box to the top of the viewport
    setTimeout(() => {
      symptomBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSymptomBlur = () => {
    // Keep focus state active briefly so clicks on quick tags or action buttons don't immediately jump
    setTimeout(() => {
      setIsSymptomFocused(false);
      if (onSetWritingFocus) onSetWritingFocus(false);
    }, 200);
  };

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      text:
        language === 'bn'
          ? `আসসালামু আলাইকুম! আমি "খরগোশ বন্ধু" (BunnyCare AI) - র‌্যাবিট ওয়েলফেয়ার সোসাইটি অফ বাংলাদেশ-এর ডিজিটাল সহকারী। আপনার খরগোশ ${rabbit ? rabbit.name : ''} এর স্বাস্থ্য, পুষ্টি বা যেকোনো যত্ন নিয়ে প্রশ্ন করতে পারেন।`
          : `Hello! I am BunnyCare AI, digital veterinary guide from Rabbit Welfare Society of Bangladesh. How can I help you care for ${rabbit ? rabbit.name : 'your rabbit'} today?`,
    },
  ]);

  const handleRunTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    setTriageError(null);
    setTriageResult(null);

    try {
      const response = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rabbitName: rabbit?.name || 'My Rabbit',
          age: rabbit ? `${rabbit.ageYears}y ${rabbit.ageMonths}m` : 'Adult',
          breed: rabbit?.breed || 'Domestic',
          weight: rabbit?.weightKg || 1.8,
          symptoms,
          duration,
          poopStatus,
          appetite,
          language,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setTriageResult(data.data);
      } else {
        setTriageError(data.error || 'Failed to analyze symptoms. Please check connectivity.');
      }
    } catch (err: any) {
      setTriageError(err.message || 'Error communicating with AI service');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userText = chatInput.trim();
    setChatInput('');
    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: userText }];
    setChatHistory(updatedHistory);
    setIsChatting(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          rabbitContext: rabbit
            ? {
                name: rabbit.name,
                breed: rabbit.breed,
                age: `${rabbit.ageYears}y ${rabbit.ageMonths}m`,
                weight: rabbit.weightKg,
              }
            : null,
          history: updatedHistory.slice(-6),
          language,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setChatHistory((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'model',
            text: language === 'bn' ? 'দুঃখিত, উত্তর পেতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Sorry, failed to generate reply. Please try again.',
          },
        ]);
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'model',
          text: language === 'bn' ? 'সার্ভার সংযোগে ত্রুটি দেখা দিয়েছে।' : 'Server connection error.',
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Subtabs */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.aiTriageTitle}</h2>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
              {t.aiTriageSubtitle}
            </p>
          </div>

          {/* Subtab Toggle Buttons */}
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('triage')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'triage'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জরুরি ট্রায়াজ' : 'Emergency Triage'}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'chat'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.aiChatTab}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Triage Assessment Form & Result */}
      {activeSubTab === 'triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🩺</span>
              <span>{language === 'bn' ? 'উপসর্গ ও লক্ষণ ইনপুট' : 'Clinical Signs Input'}</span>
            </h3>

            <form onSubmit={handleRunTriage} className="space-y-4">
              {/* Symptoms Input Container with Floating Focus */}
              <div 
                ref={symptomBoxRef}
                className={`transition-all duration-300 rounded-2xl ${
                  isSymptomFocused 
                    ? 'p-3 bg-purple-50/70 border-2 border-purple-500 shadow-lg -mx-1' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{language === 'bn' ? 'উপসর্গের বিস্তারিত বিবরণ' : 'Describe Symptoms'} *</span>
                    {isSymptomFocused && (
                      <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-medium animate-pulse">
                        {language === 'bn' ? 'ফোকাস মোড' : 'Writing Mode'}
                      </span>
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsFloatingModalOpen(true)}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-100/80 hover:bg-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    title={language === 'bn' ? 'বড় ফ্লোটিং বক্সে লিখুন' : 'Expand to Floating Window'}
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'ফ্লোটিং মোড' : 'Floating Box'}</span>
                  </button>
                </div>

                <textarea
                  rows={isSymptomFocused ? 5 : 3}
                  required
                  value={symptoms}
                  onFocus={handleSymptomFocus}
                  onBlur={handleSymptomBlur}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.aiInputPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 transition-all leading-relaxed"
                ></textarea>

                {/* Quick Symptom Tags Chips */}
                <div className="mt-2">
                  <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>{language === 'bn' ? 'কুইক সিম্পটম ট্যাগ (ক্লিক করে যোগ করুন):' : 'Quick Symptoms (Click to add):'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(language === 'bn' ? quickSymptomTagsBn : quickSymptomTagsEn).map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddQuickTag(tag)}
                        className="text-[10px] bg-white hover:bg-purple-100 text-slate-700 hover:text-purple-800 border border-slate-200 hover:border-purple-300 px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>+</span>
                        <span>{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.symptomDuration}
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4-6 hours, since morning"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.poopQualityLabel}
                </label>
                <input
                  type="text"
                  value={poopStatus}
                  onChange={(e) => setPoopStatus(e.target.value)}
                  placeholder="e.g. No poop for 6 hours, small & dry"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'খাবার ও পানি গ্রহণের অবস্থা' : 'Appetite & Water'}
                </label>
                <input
                  type="text"
                  value={appetite}
                  onChange={(e) => setAppetite(e.target.value)}
                  placeholder="e.g. Refusing grass, not drinking water"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingText}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{t.btnAnalyze}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Result Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {triageError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs">
                {triageError}
              </div>
            )}

            {!triageResult && !isAnalyzing && (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl">
                  🤖
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {language === 'bn' ? 'AI প্রাথমিক চিকিৎসা ও ট্রায়াজ রিপোর্ট' : 'AI Veterinary Triage Assessment'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'বামে আপনার খরগোশের উপসর্গগুলো লিখে বিশ্লেষণ বাটনে ক্লিক করুন। এআই খরগোশের অন্ত্রের গতি, সম্ভাব্য ঝুঁকি এবং তাৎক্ষণিক করণীয় নির্ধারণ করে দেবে।'
                    : 'Fill in your rabbit symptoms on the left to generate an instant risk triage and immediate life-saving steps.'}
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div className="text-sm font-bold text-slate-800">{t.analyzingText}</div>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'খরগোশের জিআই স্ট্যাসিস এবং ক্লিনিক্যাল প্যারামিটার যাচাই করা হচ্ছে...' : 'Evaluating digestive motility and clinical parameters...'}
                </p>
              </div>
            )}

            {triageResult && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
                {/* Urgency Badge */}
                <div
                  className={`p-4 rounded-2xl flex items-start space-x-3.5 ${
                    triageResult.urgency === 'EMERGENCY'
                      ? 'bg-rose-50 border-2 border-rose-300 text-rose-950'
                      : triageResult.urgency === 'URGENT'
                      ? 'bg-amber-50 border-2 border-amber-300 text-amber-950'
                      : 'bg-emerald-50 border-2 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {triageResult.urgency === 'EMERGENCY' ? (
                      <AlertOctagon className="w-6 h-6 text-rose-600 animate-pulse" />
                    ) : triageResult.urgency === 'URGENT' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black uppercase tracking-wider">
                      {triageResult.urgency === 'EMERGENCY'
                        ? t.urgencyEmergency
                        : triageResult.urgency === 'URGENT'
                        ? t.urgencyUrgent
                        : t.urgencyMonitor}
                    </div>
                    <div className="text-sm font-bold mt-0.5">{triageResult.urgencyTitle}</div>
                  </div>
                </div>

                {/* Stasis Risk Assessment */}
                {triageResult.stasisRiskAssessment && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900">🔬 GI Motility Analysis: </span>
                    <span>{triageResult.stasisRiskAssessment}</span>
                  </div>
                )}

                {/* Immediate Actions */}
                {triageResult.immediateActions && triageResult.immediateActions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>✅</span>
                      <span>{t.immediateActionsLabel}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                      {triageResult.immediateActions.map((action, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold shrink-0">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What to avoid */}
                {triageResult.whatToAvoid && triageResult.whatToAvoid.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🚫</span>
                      <span>{t.whatToAvoidLabel}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
                      {triageResult.whatToAvoid.map((avoid, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-rose-600 font-bold shrink-0">✕</span>
                          <span>{avoid}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bangladesh Specific Advice */}
                {triageResult.bangladeshSpecificAdvice && (
                  <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <span>🇧🇩</span>
                      <span>{t.bangladeshAdviceLabel}</span>
                    </div>
                    <p className="leading-relaxed">{triageResult.bangladeshSpecificAdvice}</p>
                  </div>
                )}

                {/* Summary and Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectTab('vetsBD')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'নিকটস্থ ভেট ডিরেক্টরি' : 'Find BD Vets'}</span>
                  </button>

                  <button
                    onClick={() => onSelectTab('stasisEmergency')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100 cursor-pointer"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>{t.navStasisEmergency}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Interactive AI Care Assistant Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>{language === 'bn' ? 'খরগোশ বন্ধু উত্তর প্রস্তুত করছে...' : 'BunnyCare AI is typing...'}</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-slate-50 border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t.aiChatPlaceholder}
              className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isChatting || !chatInput.trim()}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.btnSend}</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Symptom Writer Modal (ভাসমান ও ফুলস্ক্রিন ইনপুট মোড) */}
      {isFloatingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 mt-4 sm:mt-10 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">
                    {language === 'bn' ? 'উপসর্গের বিস্তারিত বিবরণ (ভাসমান লেখার বক্স)' : 'Detailed Symptoms Description (Floating Editor)'}
                  </h4>
                  <p className="text-[11px] text-purple-100">
                    {language === 'bn' ? 'এখানে স্বচ্ছন্দে বড় করে বিস্তারিত লিখুন' : 'Comfortable floating focus space for detailed input'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFloatingModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {language === 'bn' ? 'খরগোশের লক্ষণ ও শারীরিক অবস্থা লিখুন:' : 'Enter Rabbit Symptoms & Clinical Signs:'}
                </label>
                <textarea
                  rows={6}
                  autoFocus
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.aiInputPlaceholder}
                  className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 leading-relaxed"
                ></textarea>
              </div>

              {/* Quick Suggestion Tags inside modal */}
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'bn' ? 'প্রচলিত জরুরি লক্ষণসমূহ (ক্লিক করে যুক্ত করুন):' : 'Common Emergency Signs (Click to add):'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(language === 'bn' ? quickSymptomTagsBn : quickSymptomTagsEn).map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddQuickTag(tag)}
                      className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <span>+</span>
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFloatingModalOpen(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লেখা সম্পন্ন (সংরক্ষণ)' : 'Done & Return'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
