import { Rabbit, DailyHealthLog, WeightRecord, MedicalRecord, Language } from '../types';
import { translations } from '../data/translations';

export interface ExportOptions {
  daysRange?: number; // e.g. 7, 14, 30, or undefined for all
  includeLogs?: boolean;
  includeWeights?: boolean;
  includeMedical?: boolean;
}

/**
 * Generate a clean, highly structured plain-text clinical report suitable for veterinarians,
 * clinic referrals, email, or instant messaging.
 */
export const generateVetTextSummary = (
  rabbit: Rabbit,
  logs: DailyHealthLog[],
  weightRecords: WeightRecord[],
  medicalRecords: MedicalRecord[],
  language: Language = 'en',
  options: ExportOptions = {}
): string => {
  const t = translations[language];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Filter by date range if requested
  let filteredLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let filteredWeights = [...weightRecords].sort((a, b) => b.date.localeCompare(a.date));
  let filteredMed = [...medicalRecords].sort((a, b) => b.date.localeCompare(a.date));

  if (options.daysRange && options.daysRange > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.daysRange);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    filteredLogs = filteredLogs.filter((l) => l.date >= cutoffStr);
    filteredWeights = filteredWeights.filter((w) => w.date >= cutoffStr);
    filteredMed = filteredMed.filter((m) => m.date >= cutoffStr);
  }

  const latestLog = filteredLogs.length > 0 ? filteredLogs[0] : null;

  const lines: string[] = [];

  // Header & Organization
  lines.push('================================================================================');
  lines.push('       RABBIT WELFARE SOCIETY OF BANGLADESH (RWSB) - CLINICAL REPORT            ');
  lines.push('                খরগোশ স্বাস্থ্য ও ভেটেরিনারি কেস সামারি                            ');
  lines.push('================================================================================');
  lines.push(`Exported On: ${dateStr} at ${timeStr}`);
  lines.push(`Helpline: +880 1987-580017 (01987580017) | Portal: Rabbit Health Tracker BD`);
  lines.push('--------------------------------------------------------------------------------');

  // Patient Identity
  lines.push('PATIENT DEMOGRAPHICS (রোগীর বিবরণ):');
  lines.push(`• Patient Name:       ${rabbit.name}`);
  lines.push(`• Breed:              ${rabbit.breed}`);
  lines.push(`• Gender / Status:    ${rabbit.gender.replace('_', ' ').toUpperCase()}`);
  lines.push(`• Age:                ${rabbit.ageYears} Year(s), ${rabbit.ageMonths} Month(s)`);
  lines.push(`• Current Weight:     ${rabbit.weightKg} kg (${Math.round(rabbit.weightKg * 1000)} g)`);
  lines.push(`• Color / Markings:   ${rabbit.color}`);
  if (rabbit.microchipNo) {
    lines.push(`• Microchip / ID:     ${rabbit.microchipNo}`);
  }
  lines.push(`• Guardian (Owner):   ${rabbit.ownerName || 'Not specified'}`);
  lines.push(`• Contact Phone:      ${rabbit.ownerPhone || 'Not specified'}`);
  lines.push(`• Location / City:    ${rabbit.ownerCity || 'Bangladesh'}`);
  if (rabbit.notes) {
    lines.push(`• General Notes:      ${rabbit.notes}`);
  }
  lines.push('--------------------------------------------------------------------------------');

  // Section 1: Latest Vital Signs
  lines.push('1. CURRENT GASTROINTESTINAL & VITAL STATUS (সর্বশেষ পেটের ও শারীরিক অবস্থা):');
  if (latestLog) {
    lines.push(`• Check Date & Time:   ${latestLog.date} ${latestLog.time}`);
    lines.push(`• GI Stasis Risk:      ${latestLog.stasisRiskLevel.toUpperCase()}`);
    lines.push(`• Poop Quality:        ${t[`poop_${latestLog.poopQuality}` as keyof typeof t] || latestLog.poopQuality}`);
    lines.push(`• Poop Output (1-5):   ${latestLog.poopQuantityRating}/5`);
    lines.push(`• Hay / Fiber Intake:  ${latestLog.hayIntakePct}% (Target: >80%)`);
    lines.push(`• Pellets Intake:      ${latestLog.pelletIntake}`);
    lines.push(`• Water Intake:        ${latestLog.waterIntake}`);
    lines.push(`• Activity / Mood:     ${t[`act_${latestLog.activityLevel}` as keyof typeof t] || latestLog.activityLevel}`);
    lines.push(`• Teeth Grinding Pain: ${latestLog.teethGrinding ? 'YES (Active Pain Indicator)' : 'NO'}`);
    lines.push(`• Temperature:         ${latestLog.temperatureCelsius ? `${latestLog.temperatureCelsius} °C (Normal: 38.3 - 39.4 °C)` : 'Not measured'}`);
    lines.push(`• Ear Mite Check:      ${latestLog.earMiteCheck}`);
    lines.push(`• Eye / Nose Check:    ${latestLog.eyeNoseCheck}`);
    if (latestLog.greensGiven && latestLog.greensGiven.length > 0) {
      lines.push(`• Greens Given:        ${latestLog.greensGiven.join(', ')}`);
    }
    if (latestLog.notes) {
      lines.push(`• Owner Observation:   ${latestLog.notes}`);
    }
  } else {
    lines.push('• No daily health logs recorded yet.');
  }
  lines.push('--------------------------------------------------------------------------------');

  // Section 2: Daily Logs History
  if (options.includeLogs !== false) {
    lines.push(`2. DAILY HEALTH & STASIS LOGS HISTORY (${filteredLogs.length} Records):`);
    if (filteredLogs.length === 0) {
      lines.push('• No log records found for this duration.');
    } else {
      filteredLogs.forEach((log, idx) => {
        lines.push(`\n[Log #${idx + 1}] Date: ${log.date} ${log.time} | Stasis Risk: ${log.stasisRiskLevel.toUpperCase()}`);
        lines.push(`  - Poop: ${log.poopQuality} (Rating: ${log.poopQuantityRating}/5)`);
        lines.push(`  - Hay Intake: ${log.hayIntakePct}% | Water: ${log.waterIntake} | Pellets: ${log.pelletIntake}`);
        lines.push(`  - Activity: ${log.activityLevel} | Teeth Grinding: ${log.teethGrinding ? 'YES (Pain)' : 'No'}`);
        if (log.greensGiven && log.greensGiven.length > 0) {
          lines.push(`  - Greens: ${log.greensGiven.join(', ')}`);
        }
        if (log.notes) {
          lines.push(`  - Notes: ${log.notes}`);
        }
      });
    }
    lines.push('\n--------------------------------------------------------------------------------');
  }

  // Section 3: Weight Curve
  if (options.includeWeights !== false) {
    lines.push(`3. WEIGHT MEASUREMENTS & GROWTH CURVE (${filteredWeights.length} Records):`);
    if (filteredWeights.length === 0) {
      lines.push('• No weight records recorded.');
    } else {
      lines.push('  Date       | Weight (g) | Weight (kg) | Change (g) | Notes');
      lines.push('  -----------+------------+-------------+------------+------------------------');
      filteredWeights.forEach((w) => {
        const changeStr = w.changeGrams ? (w.changeGrams > 0 ? `+${w.changeGrams}g` : `${w.changeGrams}g`) : '-';
        const dateCol = w.date.padEnd(10);
        const gCol = `${w.weightGrams}g`.padEnd(10);
        const kgCol = `${w.weightKg} kg`.padEnd(11);
        const chgCol = changeStr.padEnd(10);
        lines.push(`  ${dateCol} | ${gCol} | ${kgCol} | ${chgCol} | ${w.notes || '-'}`);
      });
    }
    lines.push('--------------------------------------------------------------------------------');
  }

  // Section 4: Medical Treatments & Vaccines
  if (options.includeMedical !== false) {
    lines.push(`4. MEDICAL, VACCINATION & SURGICAL RECORDS (${filteredMed.length} Records):`);
    if (filteredMed.length === 0) {
      lines.push('• No past medical or surgery records.');
    } else {
      filteredMed.forEach((m, idx) => {
        lines.push(`\n[Record #${idx + 1}] ${m.date} - ${m.type.toUpperCase()}`);
        lines.push(`  • Procedure / Title:  ${m.title}`);
        if (m.clinicName || m.vetDoctor) {
          lines.push(`  • Clinic / Vet:       ${m.clinicName || '-'} ${m.vetDoctor ? `(Dr. ${m.vetDoctor})` : ''}`);
        }
        if (m.prescribedMeds) {
          lines.push(`  • Prescribed Meds:    ${m.prescribedMeds}`);
        }
        if (m.costBDT) {
          lines.push(`  • Cost:               ${m.costBDT} BDT`);
        }
        if (m.nextDueDate) {
          lines.push(`  • Next Booster / Due: ${m.nextDueDate}`);
        }
        if (m.notes) {
          lines.push(`  • Clinical Notes:     ${m.notes}`);
        }
      });
    }
    lines.push('\n--------------------------------------------------------------------------------');
  }

  // Section 5: Clinical Notes for Vet
  lines.push('5. VETERINARY CLINICAL NOTICE (বিশেষ সতর্কতা):');
  lines.push('• Rabbits are obligate nasal breathers and hindgut fermenters.');
  lines.push('• Never fast rabbits prior to surgery or anesthesia.');
  lines.push('• Banned Antibiotics in Rabbits (Lethal dysbiosis): Amoxicillin, Ampicillin,');
  lines.push('  Clindamycin, Lincomycin, Erythromycin, Cephalosporins.');
  lines.push('• Safe Antibiotics: Enrofloxacin, Trimethoprim-Sulfa, Metronidazole, Azithromycin.');
  lines.push('• Safe Analgesia for GI Stasis: Meloxicam (Metacam), Tramadol, Buprenorphine.');
  lines.push('• Gut Motility Agents (if no obstruction): Metoclopramide, Cisapride.');
  lines.push('================================================================================');
  lines.push('End of Report • Rabbit Welfare Society of Bangladesh (RWSB)');
  lines.push('================================================================================');

  return lines.join('\n');
};

/**
 * Downloads a structured .txt file for the selected rabbit
 */
export const downloadVetTextFile = (
  rabbit: Rabbit,
  logs: DailyHealthLog[],
  weightRecords: WeightRecord[],
  medicalRecords: MedicalRecord[],
  language: Language = 'en',
  options: ExportOptions = {}
): void => {
  const textContent = generateVetTextSummary(rabbit, logs, weightRecords, medicalRecords, language, options);
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanName = rabbit.name.replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_');
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${cleanName}_Veterinary_Report_${dateStamp}.txt`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Downloads a complete JSON data file for the selected rabbit
 */
export const downloadVetJsonFile = (
  rabbit: Rabbit,
  logs: DailyHealthLog[],
  weightRecords: WeightRecord[],
  medicalRecords: MedicalRecord[],
  options: ExportOptions = {}
): void => {
  let filteredLogs = [...logs];
  let filteredWeights = [...weightRecords];
  let filteredMed = [...medicalRecords];

  if (options.daysRange && options.daysRange > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.daysRange);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    filteredLogs = filteredLogs.filter((l) => l.date >= cutoffStr);
    filteredWeights = filteredWeights.filter((w) => w.date >= cutoffStr);
    filteredMed = filteredMed.filter((m) => m.date >= cutoffStr);
  }

  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.2.0',
      source: 'Rabbit Welfare Society of Bangladesh (RWSB)',
      helpline: '+880 1987-580017',
      filterDaysRange: options.daysRange || 'ALL',
    },
    rabbit,
    latestVitals: filteredLogs.length > 0 ? filteredLogs[0] : null,
    dailyHealthLogs: filteredLogs,
    weightRecords: filteredWeights,
    medicalRecords: filteredMed,
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const cleanName = rabbit.name.replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_');
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${cleanName}_Clinical_Data_RWSB_${dateStamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Quick WhatsApp/SMS summary format for messaging a vet
 */
export const generateQuickVetClipboardSnippet = (
  rabbit: Rabbit,
  logs: DailyHealthLog[],
  medicalRecords: MedicalRecord[],
  language: Language = 'bn'
): string => {
  const latestLog = logs.length > 0 ? logs[0] : null;
  const recentMeds = medicalRecords.slice(0, 2);

  if (language === 'bn') {
    return `🐰 *খরগোশের জরুরি স্বাস্থ্য বিবরণী (RWSB)*
👤 নাম: ${rabbit.name} (${rabbit.breed})
⚖️ ওজন: ${rabbit.weightKg} kg | বয়স: ${rabbit.ageYears}y ${rabbit.ageMonths}m
🩺 বর্তমান লক্ষণ (${latestLog?.date || 'আজ'}):
• মল/পায়খানা: ${latestLog ? latestLog.poopQuality : 'লগ নেই'} (রেটিং: ${latestLog?.poopQuantityRating || '-'}/5)
• ঘাস/হে খাওয়া: ${latestLog?.hayIntakePct || '-'}%
• আচরণ: ${latestLog?.activityLevel || '-'}
• দাঁত কিড়মিড় (ব্যথা): ${latestLog?.teethGrinding ? '🚨 হ্যাঁ (ব্যথায় কাতর)' : 'না'}
• স্ট্যাসিস ঝুঁকি: ${latestLog?.stasisRiskLevel?.toUpperCase() || '-'}
${latestLog?.notes ? `• মন্তব্য: ${latestLog.notes}` : ''}
${recentMeds.length > 0 ? `💊 পূর্বের চিকিৎসা: ${recentMeds.map((m) => `${m.title} (${m.date})`).join(', ')}` : ''}
📞 অভিভাবক: ${rabbit.ownerName || '-'} (${rabbit.ownerPhone || '-'})`;
  }

  return `🐰 *Rabbit Clinical Summary for Vet (RWSB)*
Patient: ${rabbit.name} (${rabbit.breed})
Weight: ${rabbit.weightKg} kg | Age: ${rabbit.ageYears}y ${rabbit.ageMonths}m
Latest Vitals (${latestLog?.date || 'Today'}):
• Poop: ${latestLog?.poopQuality || 'N/A'} (Output: ${latestLog?.poopQuantityRating || '-'}/5)
• Hay Intake: ${latestLog?.hayIntakePct || '-'}%
• Activity: ${latestLog?.activityLevel || '-'}
• Teeth Grinding (Pain): ${latestLog?.teethGrinding ? 'YES (Pain Signs)' : 'No'}
• Stasis Risk: ${latestLog?.stasisRiskLevel?.toUpperCase() || '-'}
${latestLog?.notes ? `• Notes: ${latestLog.notes}` : ''}
${recentMeds.length > 0 ? `Past Meds: ${recentMeds.map((m) => `${m.title} (${m.date})`).join(', ')}` : ''}
Guardian: ${rabbit.ownerName || '-'} (${rabbit.ownerPhone || '-'})`;
};
