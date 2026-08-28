import React, { useState, useEffect } from 'react';
import { Rabbit, Language } from '../types';
import { translations } from '../data/translations';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Plus, 
  Globe, 
  PhoneCall, 
  FileText, 
  Sparkles,
  ChevronDown,
  Download,
  Smartphone,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  rabbits: Rabbit[];
  activeRabbit?: Rabbit | null;
  activeRabbitId?: string | null;
  onSelectRabbit: (id: string) => void;
  onOpenAddRabbit: () => void;
  onOpenEditRabbit?: () => void;
  onOpenVetReport?: () => void;
  onOpenExportReport?: () => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  onToggleLanguage?: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  hidden?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  rabbits,
  activeRabbit,
  activeRabbitId,
  onSelectRabbit,
  onOpenAddRabbit,
  onOpenEditRabbit,
  onOpenVetReport,
  onOpenExportReport,
  language,
  onLanguageChange,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  hidden = false,
}) => {
  const t = translations[language];
  const { user, userProfile, signOut } = useAuth();

  const currentActiveRabbit = activeRabbit || (activeRabbitId ? rabbits.find(r => r.id === activeRabbitId) : rabbits[0]) || null;
  const currentRabbitId = currentActiveRabbit?.id || activeRabbitId || '';

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(language === 'bn' 
        ? 'অ্যাপটি সরাসরি আপনার ব্রাউজার মেন্যু (৩টি ডট / Share বাটন) থেকে "Add to Home Screen" বা "Install App" এ ক্লিক করে ইনস্টল করতে পারেন।'
        : 'You can install this app directly from your browser menu (3 dots / Share button) -> "Add to Home screen" or "Install App".'
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleToggleLang = () => {
    const nextLang: Language = language === 'bn' ? 'en' : 'bn';
    if (onLanguageChange) onLanguageChange(nextLang);
    else if (onToggleLanguage) onToggleLanguage();
  };

  const handleOpenExport = () => {
    if (onOpenVetReport) onOpenVetReport();
    else if (onOpenExportReport) onOpenExportReport();
  };

  return (
    <header 
      id="rwsb-header" 
      className={`bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs transition-all duration-300 ${
        hidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Top Banner with Helpline and RWSB affiliation */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t.orgName} • {language === 'bn' ? 'অফিসিয়াল খরগোশ সুরক্ষা পোর্টাল' : 'Official Rabbit Care Portal'}</span>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="https://chat.whatsapp.com/KgEHuJDfCsE8DHB8rnyRNR?s=cl&p=a&mlu=4"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-emerald-200 hover:text-white font-semibold transition-colors bg-emerald-800/80 px-2.5 py-0.5 rounded-lg border border-emerald-700/60"
          >
            <span className="text-emerald-400">💬</span>
            <span>{t.emergencyHelpline}</span>
          </a>
          <button
            onClick={handleToggleLang}
            className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors border border-emerald-700 cursor-pointer text-xs"
            title="Change Language"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-emerald-700">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-200/90 max-w-[140px] truncate" title={user.email || ''}>
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{userProfile?.displayName || user.email?.split('@')[0] || 'User'}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-900/60 hover:bg-rose-800 text-rose-200 hover:text-white text-[11px] font-semibold transition-all border border-rose-700/50 cursor-pointer"
                title={language === 'bn' ? 'লগআউট করুন' : 'Sign Out'}
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md text-white">
              <Heart className="w-6 h-6 fill-white text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>{t.appName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                    RWSB
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Rabbit Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {rabbits.length > 0 ? (
              <div className="relative inline-block">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 hover:border-emerald-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mr-2 overflow-hidden shrink-0">
                    {currentActiveRabbit?.photoUrl ? (
                      <img src={currentActiveRabbit.photoUrl} alt={currentActiveRabbit.name} className="w-full h-full object-cover" />
                    ) : (
                      '🐰'
                    )}
                  </div>
                  <select
                    id="rabbit-dropdown-select"
                    value={currentRabbitId}
                    onChange={(e) => onSelectRabbit(e.target.value)}
                    aria-label={t.selectRabbit}
                    className="bg-transparent text-sm font-semibold text-slate-800 focus:outline-hidden pr-6 cursor-pointer"
                  >
                    {rabbits.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.weightKg} kg)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none -ml-4 mr-1" />
                </div>
              </div>
            ) : null}

            {currentActiveRabbit && onOpenEditRabbit && (
              <button
                id="btn-edit-rabbit-profile"
                onClick={onOpenEditRabbit}
                className="px-2.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title={t.editRabbit}
              >
                {t.editRabbit}
              </button>
            )}

            <button
              id="btn-add-new-rabbit"
              onClick={onOpenAddRabbit}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addRabbit}</span>
            </button>

            <button
              id="btn-export-vet-report"
              onClick={handleOpenExport}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Download TXT / JSON or Print Vet Report"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'bn' ? 'ডাক্তারের রিপোর্ট ও এক্সপোর্ট' : 'Export for Vet'}</span>
            </button>

            {!isAppInstalled && (
              <button
                id="btn-install-pwa-app"
                onClick={handleInstallClick}
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-xs animate-in fade-in"
                title="Install Rabbit Care BD Progressive Web App"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অ্যাপ ইনস্টল' : 'Install App'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto mt-3 pb-1 border-t border-slate-100 pt-2 scrollbar-none text-xs sm:text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navOverview}
          </button>
          <button
            onClick={() => onSelectTab('dailyLog')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dailyLog'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navDailyLog}
          </button>
          <button
            onClick={() => onSelectTab('weight')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'weight'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navWeight}
          </button>
          <button
            onClick={() => onSelectTab('medical')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'medical'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navMedical}
          </button>
          <button
            onClick={() => onSelectTab('aiDoctor')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'aiDoctor'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'hover:bg-purple-50 text-purple-700 bg-purple-50/50 border border-purple-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.navAiDoctor}</span>
          </button>
          <button
            onClick={() => onSelectTab('stasisEmergency')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'stasisEmergency'
                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                : 'hover:bg-rose-50 text-rose-700 bg-rose-50/40 border border-rose-200/60'
            }`}
          >
            {t.navStasisEmergency}
          </button>
          <button
            onClick={() => onSelectTab('dietGuide')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'dietGuide'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navDietGuide}
          </button>
          <button
            onClick={() => onSelectTab('vetsBD')}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vetsBD'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {t.navVetsBD}
          </button>
        </nav>
      </div>
    </header>
  );
};
