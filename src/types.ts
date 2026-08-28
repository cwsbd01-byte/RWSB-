export type Language = 'bn' | 'en';

export type RabbitGender = 'male' | 'female' | 'neutered_male' | 'spayed_female';

export interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: RabbitGender;
  birthDate?: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  color: string;
  microchipNo?: string;
  photoUrl?: string;
  notes?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerCity?: string;
  createdAt: string;
  updatedAt: string;
}

export type PoopQuality = 
  | 'healthy_golden'     // Normal large golden round crumbly fiber balls
  | 'small_dry'          // Reduced fiber / dehydration warning
  | 'soft_cecotropes'    // Unconsumed cecotropes (excess protein/sugar)
  | 'stringy_hair'       // Hairballs / molting ingestion
  | 'diarrhea'           // True diarrhea (Lethal emergency in rabbits)
  | 'no_poop';           // Zero poop for hours (CRITICAL EMERGENCY)

export type ActivityLevel = 
  | 'binky_hyper'        // Binkying, zoomies, very happy
  | 'active_normal'      // Exploring, alert, normal hops
  | 'quiet_relaxed'      // Lounging, loafing comfortably
  | 'lethargic'          // Dull, reluctant to move, low energy
  | 'hunched_pain';      // Pressed belly, tooth grinding, pain posture (EMERGENCY)

export interface DailyHealthLog {
  id: string;
  rabbitId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  poopQuality: PoopQuality;
  poopQuantityRating: 1 | 2 | 3 | 4 | 5; // 1 = very low / none, 5 = plentiful
  hayIntakePct: number; // 0 to 100%
  pelletIntake: 'normal' | 'low' | 'none' | 'overfed';
  waterIntake: 'normal' | 'low' | 'excessive' | 'none';
  greensGiven: string[];
  activityLevel: ActivityLevel;
  earMiteCheck: 'clean' | 'mild_wax' | 'crusty_mites' | 'head_tilt';
  eyeNoseCheck: 'clean' | 'watery_eyes' | 'white_nasal_discharge' | 'crusty';
  teethGrinding: boolean; // Loud painful grinding vs gentle purr
  temperatureCelsius?: number; // Normal is 38.3 - 39.4 °C (101 - 103 °F)
  weightGrams?: number;
  notes?: string;
  stasisRiskLevel: 'safe' | 'warning' | 'emergency';
}

export interface WeightRecord {
  id: string;
  rabbitId: string;
  date: string;
  weightGrams: number;
  weightKg: number;
  changeGrams?: number;
  notes?: string;
}

export type MedicalType = 
  | 'vaccine' 
  | 'deworming' 
  | 'vet_visit' 
  | 'medication' 
  | 'surgery_neuter' 
  | 'dental_trim' 
  | 'grooming_nails';

export interface MedicalRecord {
  id: string;
  rabbitId: string;
  date: string;
  type: MedicalType;
  title: string;
  clinicName?: string;
  vetDoctor?: string;
  costBDT?: number;
  nextDueDate?: string;
  notes?: string;
  prescribedMeds?: string;
}

export interface VetClinicBD {
  id: string;
  name: string;
  division: 'Dhaka' | 'Chattogram' | 'Sylhet' | 'Rajshahi' | 'Khulna' | 'Barishal' | 'Rangpur' | 'Mymensingh';
  area: string;
  address: string;
  phone: string;
  altPhone?: string;
  emergency24h: boolean;
  hasExoticSpecialist: boolean;
  notes?: string;
}

export interface DietItem {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'hay_grass' | 'safe_greens' | 'limited_treat' | 'toxic_danger';
  benefitOrRiskBn: string;
  benefitOrRiskEn: string;
  servingAdviceBn: string;
  servingAdviceEn: string;
  localAvailabilityBD: string;
  iconName: string;
}

export interface TriageResult {
  urgency: 'EMERGENCY' | 'URGENT' | 'MONITOR';
  urgencyTitle: string;
  possibleCauses: string[];
  immediateActions: string[];
  whatToAvoid: string[];
  stasisRiskAssessment: string;
  bangladeshSpecificAdvice: string;
  recommendedVetQuestions: string[];
  summary: string;
  rawText?: string;
}
