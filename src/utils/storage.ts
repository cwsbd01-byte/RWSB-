import { Rabbit, DailyHealthLog, WeightRecord, MedicalRecord, Language } from '../types';

const STORAGE_KEYS = {
  RABBITS: 'rwsb_rabbits_v1',
  HEALTH_LOGS: 'rwsb_health_logs_v1',
  WEIGHT_RECORDS: 'rwsb_weight_records_v1',
  MEDICAL_RECORDS: 'rwsb_medical_records_v1',
  ACTIVE_RABBIT_ID: 'rwsb_active_rabbit_id_v1',
  LANGUAGE: 'rwsb_language_v1',
};

// Initial realistic seed data for Bangladesh Rabbit Welfare
const INITIAL_RABBITS: Rabbit[] = [
  {
    id: 'rab-tuktuki-01',
    name: 'Tuktuki (টুকটুকি)',
    breed: 'Holland Lop Mix (বাংলাদেশী লোকাল মিক্স)',
    gender: 'spayed_female',
    ageYears: 1,
    ageMonths: 8,
    weightKg: 1.85,
    color: 'Broken Orange & White (সাদা-কমলা)',
    microchipNo: 'BD-RWS-8842',
    notes: 'উদ্ধারকৃত খরগোশ। প্রচুর দুর্বা ঘাস এবং ধনেপাতা পছন্দ করে। পেটের গ্যাস হওয়ার প্রবণতা রয়েছে।',
    ownerName: 'জাহিদুল ইসলাম রাজু',
    ownerPhone: '',
    ownerCity: 'ঢাকা (Dhaka)',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-08-25T14:30:00.000Z',
  },
  {
    id: 'rab-shada-02',
    name: 'Misty (মিষ্টি)',
    breed: 'Netherland Dwarf (সাদা খরগোশ)',
    gender: 'neutered_male',
    ageYears: 2,
    ageMonths: 3,
    weightKg: 1.25,
    color: 'Pure White with Ruby Eyes (সাদা লাল চোখ)',
    microchipNo: 'BD-RWS-9912',
    notes: 'খুবই চঞ্চল ও বিনকি করে। নিয়মিত নখ ট্রিম করাতে হয়।',
    ownerName: 'তানিয়া রহমান',
    ownerPhone: '01819-556677',
    ownerCity: 'চট্টগ্রাম (Chattogram)',
    createdAt: '2026-02-15T11:00:00.000Z',
    updatedAt: '2026-08-26T18:00:00.000Z',
  }
];

const INITIAL_LOGS: DailyHealthLog[] = [
  {
    id: 'log-01',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-27',
    time: '09:30',
    poopQuality: 'healthy_golden',
    poopQuantityRating: 5,
    hayIntakePct: 85,
    pelletIntake: 'normal',
    waterIntake: 'normal',
    greensGiven: ['ধনেপাতা (Coriander)', 'পুদিনা পাতা (Mint)'],
    activityLevel: 'binky_hyper',
    earMiteCheck: 'clean',
    eyeNoseCheck: 'clean',
    teethGrinding: false,
    temperatureCelsius: 38.6,
    weightGrams: 1850,
    notes: 'সকালে দারুণ বিনকি করেছে। লিটার বক্সে বড় সোনালী মল ত্যাগ করেছে।',
    stasisRiskLevel: 'safe'
  },
  {
    id: 'log-02',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-26',
    time: '20:15',
    poopQuality: 'healthy_golden',
    poopQuantityRating: 4,
    hayIntakePct: 80,
    pelletIntake: 'normal',
    waterIntake: 'normal',
    greensGiven: ['রোমেইন লেটুস (Romaine)', 'গাজরের পাতা'],
    activityLevel: 'active_normal',
    earMiteCheck: 'clean',
    eyeNoseCheck: 'clean',
    teethGrinding: false,
    temperatureCelsius: 38.8,
    weightGrams: 1840,
    notes: 'সন্ধ্যায় স্বাভাবিক খেলেছে।',
    stasisRiskLevel: 'safe'
  },
  {
    id: 'log-03',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-25',
    time: '18:00',
    poopQuality: 'small_dry',
    poopQuantityRating: 3,
    hayIntakePct: 65,
    pelletIntake: 'low',
    waterIntake: 'low',
    greensGiven: ['ধনেপাতা'],
    activityLevel: 'quiet_relaxed',
    earMiteCheck: 'clean',
    eyeNoseCheck: 'clean',
    teethGrinding: false,
    temperatureCelsius: 39.0,
    weightGrams: 1820,
    notes: 'দুপুরে গরমে কিছুটা অলস ছিল। ফ্যানের কাছে বরফের বোতল তোয়ালেতে মুড়িয়ে দেওয়া হয়।',
    stasisRiskLevel: 'warning'
  }
];

const INITIAL_WEIGHTS: WeightRecord[] = [
  {
    id: 'w-1',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-01',
    weightGrams: 1780,
    weightKg: 1.78,
    notes: 'মাসিক রুটিন ওজন চেক'
  },
  {
    id: 'w-2',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-08',
    weightGrams: 1810,
    weightKg: 1.81,
    changeGrams: 30,
    notes: 'ওজন স্বাস্থ্যকরভাবে বাড়ছে'
  },
  {
    id: 'w-3',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-15',
    weightGrams: 1830,
    weightKg: 1.83,
    changeGrams: 20,
    notes: 'দুর্বা ঘাসের পরিমাণ বাড়ানো হয়েছে'
  },
  {
    id: 'w-4',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-22',
    weightGrams: 1845,
    weightKg: 1.845,
    changeGrams: 15,
    notes: 'সুস্থ ও স্বাভাবিক'
  },
  {
    id: 'w-5',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-27',
    weightGrams: 1850,
    weightKg: 1.85,
    changeGrams: 5,
    notes: 'আদর্শ ওজন বজায় রয়েছে'
  }
];

const INITIAL_MEDICAL: MedicalRecord[] = [
  {
    id: 'med-1',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-06-15',
    type: 'deworming',
    title: 'নিয়মিত কৃমিনাশক ডোজ (Albendazole)',
    clinicName: 'SAU Veterinary Hospital Dhaka',
    vetDoctor: 'Dr. Md. Rafiqul Islam (Vet Surgeon)',
    costBDT: 450,
    nextDueDate: '2026-09-15',
    notes: 'শরীরের ওজন অনুযায়ী তরল ড্রপস প্রয়োগ করা হয়েছে। কোনো পার্শ্বপ্রতিক্রিয়া নেই।',
    prescribedMeds: 'Albendazole Oral Suspension 0.4ml single dose'
  },
  {
    id: 'med-2',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-04-10',
    type: 'surgery_neuter',
    title: 'স্পে অপারেশন (Ovariohysterectomy)',
    clinicName: 'Pet Animal Care & Treatment Clinic Dhanmondi',
    vetDoctor: 'Dr. Shamima Akhter',
    costBDT: 4500,
    notes: 'সফলভাবে স্পে সম্পন্ন। ইউটেরাইন ক্যান্সার প্রতিরোধ ও শান্ত আচরণের জন্য। ক্ষত সম্পূর্ণ শুকিয়ে গেছে।',
    prescribedMeds: 'Meloxicam pain relief (3 days), Chlorpheniramine'
  },
  {
    id: 'med-3',
    rabbitId: 'rab-tuktuki-01',
    date: '2026-08-05',
    type: 'dental_trim',
    title: 'রুটিন ইনসিসর ও মোলার দাঁত পরীক্ষা',
    clinicName: 'Central Veterinary Hospital, Dhaka',
    vetDoctor: 'Dr. Farhan Tanvir',
    costBDT: 600,
    nextDueDate: '2026-11-05',
    notes: 'দাঁতে কোনো স্পার নেই। পর্যাপ্ত হে খাওয়ার কারণে মোলার সঠিক গঠনে ক্ষয় হচ্ছে।'
  }
];

export const getRabbits = (): Rabbit[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RABBITS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RABBITS, JSON.stringify(INITIAL_RABBITS));
      return INITIAL_RABBITS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_RABBITS;
  }
};

export const saveRabbits = (rabbits: Rabbit[]): void => {
  localStorage.setItem(STORAGE_KEYS.RABBITS, JSON.stringify(rabbits));
};

export const getActiveRabbitId = (): string => {
  const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_RABBIT_ID);
  if (active) return active;
  const rabbits = getRabbits();
  return rabbits.length > 0 ? rabbits[0].id : '';
};

export const setActiveRabbitId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_RABBIT_ID, id);
};

export const getHealthLogs = (rabbitId?: string): DailyHealthLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HEALTH_LOGS);
    const logs: DailyHealthLog[] = data ? JSON.parse(data) : INITIAL_LOGS;
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.HEALTH_LOGS, JSON.stringify(INITIAL_LOGS));
    }
    if (rabbitId) {
      return logs.filter((l) => l.rabbitId === rabbitId).sort((a, b) => b.date.localeCompare(a.date));
    }
    return logs.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return INITIAL_LOGS;
  }
};

export const saveHealthLogs = (logs: DailyHealthLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.HEALTH_LOGS, JSON.stringify(logs));
};

export const getWeightRecords = (rabbitId?: string): WeightRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS);
    const records: WeightRecord[] = data ? JSON.parse(data) : INITIAL_WEIGHTS;
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(INITIAL_WEIGHTS));
    }
    if (rabbitId) {
      return records.filter((w) => w.rabbitId === rabbitId).sort((a, b) => a.date.localeCompare(b.date));
    }
    return records.sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return INITIAL_WEIGHTS;
  }
};

export const saveWeightRecords = (records: WeightRecord[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEIGHT_RECORDS, JSON.stringify(records));
};

export const getMedicalRecords = (rabbitId?: string): MedicalRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS);
    const records: MedicalRecord[] = data ? JSON.parse(data) : INITIAL_MEDICAL;
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(INITIAL_MEDICAL));
    }
    if (rabbitId) {
      return records.filter((m) => m.rabbitId === rabbitId).sort((a, b) => b.date.localeCompare(a.date));
    }
    return records.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return INITIAL_MEDICAL;
  }
};

export const saveMedicalRecords = (records: MedicalRecord[]): void => {
  localStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS, JSON.stringify(records));
};

export const getPreferredLanguage = (): Language => {
  const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return lang === 'en' ? 'en' : 'bn';
};

export const setPreferredLanguage = (lang: Language): void => {
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
};
