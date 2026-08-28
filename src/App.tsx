/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Rabbit, 
  DailyHealthLog, 
  WeightRecord, 
  MedicalRecord, 
  Language 
} from './types';
import { translations } from './data/translations';
import { 
  getPreferredLanguage,
  setPreferredLanguage
} from './utils/storage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { 
  subscribeToUserRabbits, 
  saveFirestoreRabbit, 
  deleteFirestoreRabbit,
  subscribeToHealthLogs,
  saveFirestoreHealthLog,
  deleteFirestoreHealthLog,
  subscribeToWeightRecords,
  saveFirestoreWeightRecord,
  deleteFirestoreWeightRecord,
  subscribeToMedicalRecords,
  saveFirestoreMedicalRecord,
  deleteFirestoreMedicalRecord
} from './utils/firestoreService';
import { Header } from './components/Header';
import { HealthOverview } from './components/HealthOverview';
import { WeightTracker } from './components/WeightTracker';
import { MedicalRecords } from './components/MedicalRecords';
import { SymptomCheckerAI } from './components/SymptomCheckerAI';
import { EmergencyStasisGuide } from './components/EmergencyStasisGuide';
import { DietAndCareGuide } from './components/DietAndCareGuide';
import { VetDirectoryBD } from './components/VetDirectoryBD';
import { DailyLogModal } from './components/DailyLogModal';
import { RabbitSelectorModal } from './components/RabbitSelectorModal';
import { VetReportModal } from './components/VetReportModal';
import { WhatsAppFloatingButton, WHATSAPP_COMMUNITY_LINK } from './components/WhatsAppFloatingButton';
import { RABBIT_WELFARE_SOCIETY_INFO } from './data/bangladeshVetsAndDiet';
import { Heart, MessageSquare, ShieldAlert, Sparkles, Lock, Plus } from 'lucide-react';

function AppContent() {
  const { user, userProfile, loading } = useAuth();

  const [language, setLanguage] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [activeRabbitId, setActiveRabbitId] = useState<string | null>(null);
  const [logs, setLogs] = useState<DailyHealthLog[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  // Modal states
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isRabbitModalOpen, setIsRabbitModalOpen] = useState(false);
  const [isVetReportOpen, setIsVetReportOpen] = useState(false);
  const [editingRabbit, setEditingRabbit] = useState<Rabbit | null>(null);
  const [isWritingFocus, setIsWritingFocus] = useState(false);

  // Initial Language and URL Deep Link Load
  useEffect(() => {
    const savedLang = getPreferredLanguage();
    setLanguage(savedLang);

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'emergency', 'ai-checker', 'diet', 'records', 'weight', 'vets'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Strict Realtime Firestore sync scoped to user.uid
  useEffect(() => {
    if (!user) {
      setRabbits([]);
      setActiveRabbitId(null);
      setLogs([]);
      setWeightRecords([]);
      setMedicalRecords([]);
      return;
    }

    const unsubRabbits = subscribeToUserRabbits(user.uid, (userRabbits) => {
      setRabbits(userRabbits);
      setActiveRabbitId((prevId) => {
        if (prevId && userRabbits.some((r) => r.id === prevId)) {
          return prevId;
        }
        return userRabbits.length > 0 ? userRabbits[0].id : null;
      });
    });

    const unsubLogs = subscribeToHealthLogs(user.uid, (userLogs) => {
      setLogs(userLogs);
    });

    const unsubWeights = subscribeToWeightRecords(user.uid, (userWeights) => {
      setWeightRecords(userWeights);
    });

    const unsubMedical = subscribeToMedicalRecords(user.uid, (userMeds) => {
      setMedicalRecords(userMeds);
    });

    return () => {
      unsubRabbits();
      unsubLogs();
      unsubWeights();
      unsubMedical();
    };
  }, [user]);

  // Universal Floating Mode & Writing Focus across all inputs and textareas
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isTextInput =
        (target.tagName === 'INPUT' &&
          !['checkbox', 'radio', 'submit', 'button', 'file', 'color', 'range'].includes(
            (target as HTMLInputElement).type
          )) ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTextInput) {
        setIsWritingFocus(true);
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement;
        const stillInInput =
          active &&
          ((active.tagName === 'INPUT' &&
            !['checkbox', 'radio', 'submit', 'button', 'file', 'color', 'range'].includes(
              (active as HTMLInputElement).type
            )) ||
            active.tagName === 'TEXTAREA' ||
            (active as HTMLElement).isContentEditable);

        if (!stillInInput) {
          setIsWritingFocus(false);
        }
      }, 200);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setPreferredLanguage(newLang);
  };

  const handleSelectRabbit = (id: string) => {
    setActiveRabbitId(id);
  };

  const handleSaveRabbit = async (rabbit: Rabbit) => {
    if (!user) return;
    await saveFirestoreRabbit(user.uid, rabbit);
    setActiveRabbitId(rabbit.id);
    setEditingRabbit(null);
  };

  const handleDeleteRabbit = async (id: string) => {
    if (!user) return;
    await deleteFirestoreRabbit(user.uid, id);
    if (activeRabbitId === id) {
      const remaining = rabbits.filter((r) => r.id !== id);
      setActiveRabbitId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSaveLog = async (newLog: DailyHealthLog) => {
    if (!user) return;
    await saveFirestoreHealthLog(user.uid, newLog);
  };

  const handleDeleteLog = async (id: string) => {
    if (!user) return;
    await deleteFirestoreHealthLog(user.uid, id);
  };

  const handleSaveWeight = async (rec: WeightRecord) => {
    if (!user) return;
    await saveFirestoreWeightRecord(user.uid, rec);

    // Also update active rabbit's weightKg in firestore
    if (activeRabbit) {
      const updatedRabbit = { ...activeRabbit, weightKg: rec.weightKg };
      await saveFirestoreRabbit(user.uid, updatedRabbit);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    if (!user) return;
    await deleteFirestoreWeightRecord(user.uid, id);
  };

  const handleSaveMedical = async (rec: MedicalRecord) => {
    if (!user) return;
    await saveFirestoreMedicalRecord(user.uid, rec);
  };

  const handleDeleteMedical = async (id: string) => {
    if (!user) return;
    await deleteFirestoreMedicalRecord(user.uid, id);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 mb-4 animate-bounce">
          🐰
        </div>
        <div className="w-6 h-6 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-emerald-200">
          {language === 'bn' ? 'নিরাপদ ক্লাউড সংযোগ লোড হচ্ছে...' : 'Connecting to secure private cloud...'}
        </p>
      </div>
    );
  }

  // Not logged in -> Show Authentication Screen
  if (!user) {
    return (
      <AuthScreen
        language={language}
        onLanguageToggle={() => handleLanguageChange(language === 'bn' ? 'en' : 'bn')}
      />
    );
  }

  const activeRabbit = rabbits.find((r) => r.id === activeRabbitId) || null;
  const filteredLogs = logs.filter((l) => l.rabbitId === activeRabbitId);
  const filteredWeight = weightRecords.filter((w) => w.rabbitId === activeRabbitId);
  const filteredMedical = medicalRecords.filter((m) => m.rabbitId === activeRabbitId);

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
        onLanguageChange={handleLanguageChange}
        rabbits={rabbits}
        activeRabbitId={activeRabbitId}
        onSelectRabbit={handleSelectRabbit}
        onOpenAddRabbit={() => {
          setEditingRabbit(null);
          setIsRabbitModalOpen(true);
        }}
        onOpenEditRabbit={() => {
          if (activeRabbit) {
            setEditingRabbit(activeRabbit);
            setIsRabbitModalOpen(true);
          }
        }}
        onOpenVetReport={() => setIsVetReportOpen(true)}
        hidden={isWritingFocus}
      />

      {/* Floating Writing Indicator */}
      {isWritingFocus && (
        <div className="fixed top-3 right-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            type="button"
            onClick={() => setIsWritingFocus(false)}
            className="bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs flex items-center space-x-1.5 border border-slate-700 transition-all cursor-pointer"
            title={language === 'bn' ? 'মেন্যু দেখতে ক্লিক করুন' : 'Click to show menu'}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span>{language === 'bn' ? 'ফ্লোটিং মোড (মেন্যু দেখতে ট্যাপ করুন)' : 'Writing Mode (Tap for Menu)'}</span>
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Empty State if user has 0 rabbits added yet */}
        {rabbits.length === 0 && activeTab === 'overview' && (
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl shadow-xl border border-emerald-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ব্যক্তিগত খরগোশ ডাটাবেজ' : 'Private Rabbit Database'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {language === 'bn' 
                  ? `স্বাগতম, ${userProfile?.displayName || 'খরগোশ অভিভাবক'}!`
                  : `Welcome, ${userProfile?.displayName || 'Rabbit Parent'}!`}
              </h2>
              <p className="text-sm text-emerald-100/80 max-w-xl">
                {language === 'bn'
                  ? 'আপনার একাউন্ট সম্পূর্ণ সুরক্ষিত। ট্র্যাকিং শুরু করতে নিচে ক্লিক করে আপনার খরগোশের নাম ও প্রাথমিক তথ্য যুক্ত করুন।'
                  : 'Your account is strictly private. Add your rabbit profile to begin tracking health, weight and vaccinations.'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingRabbit(null);
                setIsRabbitModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-sm hover:bg-emerald-50 shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>{language === 'bn' ? 'প্রথম খরগোশ যুক্ত করুন' : 'Add First Rabbit'}</span>
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <HealthOverview
            rabbit={activeRabbit}
            logs={filteredLogs}
            weightRecords={filteredWeight}
            medicalRecords={filteredMedical}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onOpenVetReport={() => setIsVetReportOpen(true)}
            onOpenEditRabbit={() => {
              if (activeRabbit) {
                setEditingRabbit(activeRabbit);
                setIsRabbitModalOpen(true);
              }
            }}
            onOpenAddRabbit={() => {
              setEditingRabbit(null);
              setIsRabbitModalOpen(true);
            }}
            onSelectTab={setActiveTab}
            onDeleteLog={handleDeleteLog}
            language={language}
          />
        )}

        {activeTab === 'weight' && (
          <WeightTracker
            rabbit={activeRabbit}
            weightRecords={filteredWeight}
            onSaveWeight={handleSaveWeight}
            onDeleteWeight={handleDeleteWeight}
            language={language}
          />
        )}

        {activeTab === 'medical' && (
          <MedicalRecords
            rabbit={activeRabbit}
            records={filteredMedical}
            onSaveRecord={handleSaveMedical}
            onDeleteRecord={handleDeleteMedical}
            onOpenVetReport={() => setIsVetReportOpen(true)}
            language={language}
          />
        )}

        {activeTab === 'aiDoctor' && (
          <SymptomCheckerAI
            rabbit={activeRabbit}
            language={language}
            onSelectTab={setActiveTab}
            onSetWritingFocus={setIsWritingFocus}
          />
        )}

        {activeTab === 'stasisEmergency' && (
          <EmergencyStasisGuide
            rabbit={activeRabbit}
            language={language}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'dietGuide' && <DietAndCareGuide language={language} />}

        {activeTab === 'vetsBD' && <VetDirectoryBD language={language} />}
      </main>

      {/* Modals */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        rabbit={activeRabbit}
        onSaveLog={handleSaveLog}
        language={language}
      />

      <RabbitSelectorModal
        isOpen={isRabbitModalOpen}
        onClose={() => {
          setIsRabbitModalOpen(false);
          setEditingRabbit(null);
        }}
        onSaveRabbit={handleSaveRabbit}
        onDeleteRabbit={handleDeleteRabbit}
        rabbitToEdit={editingRabbit}
        language={language}
        totalRabbitsCount={rabbits.length}
      />

      <VetReportModal
        isOpen={isVetReportOpen}
        onClose={() => setIsVetReportOpen(false)}
        rabbit={activeRabbit}
        logs={filteredLogs}
        weightRecords={filteredWeight}
        medicalRecords={filteredMedical}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg">
                🐇
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Rabbit Welfare Society of Bangladesh (RWSB)
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'বাংলাদেশের খরগোশ উদ্ধার, সুস্থতা ও সঠিক লালন-পালন সহায়িকা'
                    : 'Rabbit Rescue, Care, Welfare & Veterinary Health Tracking'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href={WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800"
              >
                <span>💬</span>
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন' : 'Join WhatsApp Group'}</span>
              </a>
              <a
                href={RABBIT_WELFARE_SOCIETY_INFO.facebookGroup}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white underline"
              >
                Facebook Community
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} Rabbit Welfare Society of Bangladesh. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {language === 'bn'
                  ? 'এই অ্যাপ্লিকেশনটি প্রাথমিক পর্যবেক্ষণ ও ট্রায়াজের জন্য। জরুরি অবস্থায় সর্বদা পশু চিকিৎসকের পরামর্শ নিন।'
                  : 'For tracking & preliminary triage. Always consult an exotic veterinarian in emergency.'}
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Community Group Button */}
      <WhatsAppFloatingButton language={language} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
