import { TriageResult, Language } from '../types';

export function getClientClinicalTriage(params: {
  rabbitName?: string;
  symptoms: string;
  duration?: string;
  poopStatus?: string;
  appetite?: string;
  language: Language;
}): TriageResult {
  const {
    rabbitName = 'খরগোশ',
    symptoms = '',
    duration = '',
    poopStatus = '',
    appetite = '',
    language = 'bn',
  } = params;

  const lowerText = `${symptoms} ${poopStatus} ${appetite} ${duration}`.toLowerCase();

  // High emergency indicators
  const isEmergency =
    lowerText.includes('no poop') ||
    lowerText.includes('পায়খানা বন্ধ') ||
    lowerText.includes('খাচ্ছে না') ||
    lowerText.includes('not eating') ||
    lowerText.includes('bloat') ||
    lowerText.includes('পেট শক্ত') ||
    lowerText.includes('hunched') ||
    lowerText.includes('কুঁজো') ||
    lowerText.includes('teeth grinding') ||
    lowerText.includes('দাঁত কিড়মিড়') ||
    lowerText.includes('cold ear') ||
    lowerText.includes('কান ঠান্ডা') ||
    lowerText.includes('diarrhea') ||
    lowerText.includes('পাতলা পায়খানা') ||
    lowerText.includes('stasis') ||
    lowerText.includes('১০ ঘণ্টা') ||
    lowerText.includes('12 hours') ||
    lowerText.includes('8 hours');

  const isUrgent =
    !isEmergency &&
    (lowerText.includes('small poop') ||
      lowerText.includes('ছোট পায়খানা') ||
      lowerText.includes('eye') ||
      lowerText.includes('চোখ') ||
      lowerText.includes('mite') ||
      lowerText.includes('উঁকুন') ||
      lowerText.includes('খোসপাঁচড়া') ||
      lowerText.includes('sneezing') ||
      lowerText.includes('হাঁচি') ||
      lowerText.includes('snuffle'));

  if (language === 'bn') {
    if (isEmergency) {
      return {
        urgency: 'EMERGENCY',
        urgencyTitle: 'তাত্ক্ষণিক ভেটেরিনারি জরুরি অবস্থা (সম্ভাব্য GI Stasis / পেটে গ্যাস)',
        possibleCauses: [
          'গ্যাস্ট্রোইনটেস্টাইনাল স্ট্যাসিস (GI Stasis - অন্ত্রের চলাচল বন্ধ হওয়া)',
          'পেটে অতিরিক্ত গ্যাস বা ব্লট (Bloat)',
          'দাঁতের অতিরিক্ত বৃদ্ধি (Dental Spurs) যার কারণে তীব্র ব্যথা',
          'তীব্র পানিশূন্যতা বা গরমের কারণে হিট স্ট্রোক',
        ],
        immediateActions: [
          'বিলম্ব না করে নিকটস্থ অভিজ্ঞ ভেটেরিনারি সার্জনের শরণাপন্ন হোন।',
          'খরগোশের কান স্পর্শ করে দেখুন—যদি ঠান্ডা হয়, তোয়ালে বা কুসুম গরম পানির বোতল দিয়ে শরীর উষ্ণ রাখুন।',
          'যদি খরগোশ নিজে না খায় এবং পেট শক্ত না থাকে, তবে অবিলম্বে ক্রাইটিক্যাল কেয়ার বা সিরিঞ্জে কুসুম গরম পানিতে মেশানো ঘাসের পেস্ট খাওয়ানো লাগতে পারে (ভেটের পরামর্শ অনুযায়ী)।',
          'পেটে মৃদু ক্লকওয়াইজ আলতো ম্যাসাজ দিন যদি পেট পাথরের মতো শক্ত না থাকে।',
        ],
        whatToAvoid: [
          'কখনই খরগোশকে কোনো ব্যথানাশক বা মানুষের ওষুধ ভেটের পরামর্শ ছাড়া খাওয়াবেন না।',
          'পেট যদি ড্রামের মতো শক্ত ও ফোলা থাকে (Bloat), তবে জোর করে খাবার (Force feed) খাওয়াবেন না।',
          'কানের ওপর ধরে খরগোশকে কখনই তুলবেন না।',
        ],
        stasisRiskAssessment:
          'খরগোশের পৌষ্টিকতন্ত্র পেটের ব্যাকটেরিয়া ও ক্রমাগত আঁশের ওপর নির্ভরশীল। ৮-১২ ঘণ্টার বেশি পায়খানা ও খাবার বন্ধ থাকা প্রাণঘাতী হতে পারে।',
        bangladeshSpecificAdvice:
          'বাংলাদেশের আবহাওয়ায় আর্দ্রতা ও অতিরিক্ত গরমে খরগোশের পানিশূন্যতা খুব দ্রুত হয়। ঢাকার সেন্ট্রাল ভেটেরিনারি হাসপাতাল বা আপনার জেলার অভিজ্ঞ প্রাণী চিকিৎসকের সাথে ফোনে যোগাযোগ করুন।',
        recommendedVetQuestions: [
          'খরগোশটির কি গাট মটিলিটি ওষুধ (Metoclopramide/Cisapride) এবং ব্যথানাশক (Meloxicam) প্রয়োজন?',
          'সাবকিউটেনিয়াস স্যালাইন দেওয়ার প্রয়োজন আছে কি?',
        ],
        summary: `${rabbitName}-এর জন্য এটি একটি সর্বোচ্চ জরুরি অবস্থা। অবিলম্বে ভেটেরিনারি ডাক্তারের পরামর্শ নিন।`,
      };
    } else if (isUrgent) {
      return {
        urgency: 'URGENT',
        urgencyTitle: 'আজকের মধ্যেই ডাক্তারের পরামর্শ ও যত্ন প্রয়োজন',
        possibleCauses: [
          'প্রাথমিক গাট স্লো-ডাউন (Mild Motility Drop)',
          'হাঁচি বা শ্বাসনালীর সংক্রমণ (Pasteurella/Snuffles)',
          'দাঁতের সমস্যা বা কানের মাইট ইনফেকশন',
        ],
        immediateActions: [
          'প্রচুর তাজা সবুজ দুর্বা ঘাস / বারমুডা ঘাস বা ওট হে খেতে দিন।',
          'খাবার পানির পাত্র পরিষ্কার রাখুন এবং প্রতিদিনের ড্রপিং সাইজ পর্যবেক্ষণ করুন।',
          'আজকের মধ্যে ভেট অ্যাপয়েন্টমেন্ট শিডিউল করুন।',
        ],
        whatToAvoid: ['মিষ্টি ফল, অতিরিক্ত শস্য বা কমার্শিয়াল কালারফুল প্যাকেট ফিড বন্ধ রাখুন।'],
        stasisRiskAssessment:
          'হজমে প্রাথমিক ধীরগতি লক্ষ্য করা গেছে, দ্রুত সুষম আঁশ দিলে স্ট্যাসিস প্রতিরোধ সম্ভব।',
        bangladeshSpecificAdvice:
          'বাংলাদেশে পাওয়া পরিষ্কার দুর্বা ঘাস ভালো করে ধুয়ে শুকিয়ে খেতে দিন। ভেজা ঘাস খাওয়াবেন না।',
        recommendedVetQuestions: [
          'দাঁত ও মোলার স্পার পরীক্ষা করা হয়েছে কি?',
          'কোনো অ্যান্টিবায়োটিক ড্রপ প্রয়োজন কি?',
        ],
        summary: `${rabbitName}-এর উপসর্গগুলো নজরদারিতে রাখুন এবং দ্রুত ভেটের পরামর্শ নিশ্চিত করুন।`,
      };
    } else {
      return {
        urgency: 'MONITOR',
        urgencyTitle: 'নিয়মিত পর্যবেক্ষণ ও সাধারণ পুষ্টি যত্ন',
        possibleCauses: ['সামান্য মানসিক চাপ বা পরিবেশ পরিবর্তন', 'খাবারের ধরনে হঠাৎ পরিবর্তন'],
        immediateActions: [
          '৮০% এর বেশি তাজা সবুজ ঘাস নিশ্চিত করুন।',
          'পর্যাপ্ত পরিষ্কার পানি এবং ঠান্ডা ছায়াযুক্ত পরিবেশ দিন।',
          'পরবর্তী ৬ ঘণ্টা পায়খানার পরিমাণ ও আচরণ পর্যবেক্ষণ করুন।',
        ],
        whatToAvoid: ['হঠাৎ খাবার পরিবর্তন করবেন না।'],
        stasisRiskAssessment: 'বর্তমানে স্বাভাবিক নজরদারির আওতায় রয়েছে।',
        bangladeshSpecificAdvice:
          'গরমের দিনে খরগোশের ঘরে ফ্যান বা ঠান্ডা বরফের বোতল তোয়ালে জড়িয়ে রাখুন।',
        recommendedVetQuestions: ['রুটিন স্বাস্থ্য ও ওজন পরীক্ষা কবে করানো উচিত?'],
        summary: `${rabbitName}-কে ভালো ঘাস ও পানি দিয়ে শান্ত পরিবেশে পর্যবেক্ষণ করুন।`,
      };
    }
  } else {
    // English fallback
    if (isEmergency) {
      return {
        urgency: 'EMERGENCY',
        urgencyTitle: 'Immediate Veterinary Emergency (Potential GI Stasis / Severe Disturbance)',
        possibleCauses: [
          'Gastrointestinal Stasis (GI Stasis - Cessation of digestive motility)',
          'Severe cecal gas / Bloat',
          'Acute pain from dental spurs or internal distress',
        ],
        immediateActions: [
          'Contact an emergency small animal / exotic veterinarian immediately.',
          'Check ear temperature; if cold, gently warm with a soft towel or warm water bottle.',
          'Keep in a quiet, low-stress, dim environment.',
        ],
        whatToAvoid: [
          'Never give human painkillers or unprescribed antibiotics.',
          'Do not force-feed if the abdomen is hard and drum-like (bloat risk).',
        ],
        stasisRiskAssessment:
          'Lack of gut motility for >8 hours is a critical clinical emergency in rabbits.',
        bangladeshSpecificAdvice:
          'Reach out to small animal vets in Dhaka or your nearest veterinary hospital immediately.',
        recommendedVetQuestions: [
          'Does my rabbit need gut motility agents (e.g. Metoclopramide) and analgesia?',
          'Is sub-Q fluid therapy indicated?',
        ],
        summary: `Immediate medical attention is required for ${rabbitName}. Please consult a veterinarian without delay.`,
      };
    } else {
      return {
        urgency: 'URGENT',
        urgencyTitle: 'Urgent Veterinary Assessment Recommended',
        possibleCauses: ['Early digestive slowdown', 'Dental spurs', 'Respiratory irritation'],
        immediateActions: [
          'Provide fresh Timothy/Bermuda/Oat hay and fresh clean water.',
          'Monitor fecal pellet output and posture hourly.',
          'Consult a veterinarian today.',
        ],
        whatToAvoid: ['Avoid sugary treats and high-starch pellets.'],
        stasisRiskAssessment: 'Early intervention prevents full GI shut down.',
        bangladeshSpecificAdvice:
          'Keep in a cool, ventilated area away from direct heat and humid drafts.',
        recommendedVetQuestions: ['Can you examine molars and check for gut sounds?'],
        summary: `Monitor ${rabbitName} closely and arrange a veterinary checkup today.`,
      };
    }
  }
}
