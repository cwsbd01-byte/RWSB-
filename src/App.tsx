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
  getRabbits, 
  saveRabbits, 
  getActiveRabbitId, 
  setActiveRabbitId as setStorageActiveRabbitId,
  getHealthLogs, 
  saveHealthLogs, 
  getWeightRecords, 
  saveWeightRecords, 
  getMedicalRecords, 
  saveMedicalRecords,
  getPreferredLanguage,
  setPreferredLanguage
} from './utils/storage';
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
import { RABBIT_WELFARE_SOCIETY_INFO } from './data/bangladeshVetsAndDiet';
import { Heart, PhoneCall, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
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

  // Initial Data Load
  useEffect(() => {
    const savedLang = getPreferredLanguage();
    setLanguage(savedLang);

    // Read URL query params for PWA shortcut deep-linking
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'emergency', 'ai-checker', 'diet', 'records', 'weight', 'vets'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const loadedRabbits = getRabbits();
    setRabbits(loadedRabbits);

    const currentId = getActiveRabbitId();
    if (currentId && loadedRabbits.some((r) => r.id === currentId)) {
      setActiveRabbitId(currentId);
    } else if (loadedRabbits.length > 0) {
      setActiveRabbitId(loadedRabbits[0].id);
      setStorageActiveRabbitId(loadedRabbits[0].id);
    }

    setLogs(getHealthLogs());
    setWeightRecords(getWeightRecords());
    setMedicalRecords(getMedicalRecords());
  }, []);

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
        // Scroll the input into unobstructed center view
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
    setStorageActiveRabbitId(id);
  };

  const handleSaveRabbit = (rabbit: Rabbit) => {
    let updated: Rabbit[];
    const exists = rabbits.some((r) => r.id === rabbit.id);
    if (exists) {
      updated = rabbits.map((r) => (r.id === rabbit.id ? rabbit : r));
    } else {
      updated = [...rabbits, rabbit];
    }
    setRabbits(updated);
    saveRabbits(updated);
    setActiveRabbitId(rabbit.id);
    setStorageActiveRabbitId(rabbit.id);
    setEditingRabbit(null);
  };

  const handleDeleteRabbit = (id: string) => {
    const updated = rabbits.filter((r) => r.id !== id);
    setRabbits(updated);
    saveRabbits(updated);
    if (activeRabbitId === id) {
      const nextId = updated.length > 0 ? updated[0].id : null;
      setActiveRabbitId(nextId);
      if (nextId) setStorageActiveRabbitId(nextId);
    }
  };

  const handleSaveLog = (newLog: DailyHealthLog) => {
    const updated = [newLog, ...logs.filter((l) => l.id !== newLog.id)];
    setLogs(updated);
    saveHealthLogs(updated);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    saveHealthLogs(updated);
  };

  const handleSaveWeight = (rec: WeightRecord) => {
    const updated = [...weightRecords.filter((w) => w.id !== rec.id), rec].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setWeightRecords(updated);
    saveWeightRecords(updated);

    // Also update active rabbit's weightKg
    if (activeRabbit) {
      const updatedRabbit = { ...activeRabbit, weightKg: rec.weightKg };
      handleSaveRabbit(updatedRabbit);
    }
  };

  const handleDeleteWeight = (id: string) => {
    const updated = weightRecords.filter((w) => w.id !== id);
    setWeightRecords(updated);
    saveWeightRecords(updated);
  };

  const handleSaveMedical = (rec: MedicalRecord) => {
    const updated = [rec, ...medicalRecords.filter((m) => m.id !== rec.id)];
    setMedicalRecords(updated);
    saveMedicalRecords(updated);
  };

  const handleDeleteMedical = (id: string) => {
    const updated = medicalRecords.filter((m) => m.id !== id);
    setMedicalRecords(updated);
    saveMedicalRecords(updated);
  };

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
                href={`tel:${RABBIT_WELFARE_SOCIETY_INFO.helpline}`}
                className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Helpline: {RABBIT_WELFARE_SOCIETY_INFO.helpline}</span>
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
    </div>
  );
}
