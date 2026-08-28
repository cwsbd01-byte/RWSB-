import React, { useState } from 'react';
import { Language } from '../types';
import { BANGLADESH_VET_CLINICS, RABBIT_WELFARE_SOCIETY_INFO } from '../data/bangladeshVetsAndDiet';
import { 
  Building2, 
  PhoneCall, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  Search,
  CheckCircle2
} from 'lucide-react';

interface VetDirectoryBDProps {
  language: Language;
}

const DIVISIONS = ['All', 'Dhaka', 'Chattogram', 'Sylhet', 'Mymensingh', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur'];

export const VetDirectoryBD: React.FC<VetDirectoryBDProps> = ({ language }) => {
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [onlyExotic, setOnlyExotic] = useState(false);

  const filteredVets = BANGLADESH_VET_CLINICS.filter((v) => {
    const matchesDiv = selectedDivision === 'All' || v.division === selectedDivision;
    const matchesEmergency = !onlyEmergency || v.emergency24h;
    const matchesExotic = !onlyExotic || v.hasExoticSpecialist;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(query) ||
      v.area.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query) ||
      v.division.toLowerCase().includes(query) ||
      v.phone.includes(query);
    return matchesDiv && matchesEmergency && matchesExotic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Helpline */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'bn' ? 'বাংলাদেশ ভেটেরিনারি ক্লিনিক ডিরেক্টরি' : 'Bangladesh Rabbit Veterinary Directory'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-teal-200 mt-1 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'খরগোশ চিকিৎসায় অভিজ্ঞ বাংলাদেশের সরকারি ও বেসরকারি ভেটেরিনারি হাসপাতাল ও বিশেষজ্ঞদের তালিকা।'
              : 'Verified veterinary hospitals and avian/exotic small animal practitioners across Bangladesh.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs shrink-0">
          <div className="text-amber-300 font-bold uppercase tracking-wider text-[10px]">
            {language === 'bn' ? 'সোসাইটি জরুরি হটলাইন' : 'RWSB Hotline'}
          </div>
          <a
            href={`tel:${RABBIT_WELFARE_SOCIETY_INFO.helpline}`}
            className="text-base font-extrabold text-white hover:text-emerald-300 transition-colors flex items-center gap-1.5 mt-1"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>{RABBIT_WELFARE_SOCIETY_INFO.helpline}</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'এলাকা, জেলা বা হাসপাতালের নাম...' : 'Search clinic, district or area...'}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {DIVISIONS.map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedDivision === div
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyEmergency(!onlyEmergency)}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                  onlyEmergency
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'শুধুমাত্র ২৪/৭ ইমার্জেন্সি' : '24/7 Emergency Only'}</span>
              </button>
              <button
                onClick={() => setOnlyExotic(!onlyExotic)}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                  onlyExotic
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'খরগোশ বিশেষজ্ঞ ডাক্তার' : 'Exotic Specialist Only'}</span>
              </button>
            </div>

            <div className="text-slate-500 font-semibold text-xs">
              {language === 'bn' ? `মোট ক্লিনিক: ${filteredVets.length} টি` : `Total Clinics: ${filteredVets.length}`}
            </div>
          </div>
        </div>

        {/* Vet Clinic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredVets.map((clinic) => (
            <div
              key={clinic.id}
              className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white shadow-2xs transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    📍 {clinic.division} ({clinic.area})
                  </span>
                  <div className="flex gap-1.5">
                    {clinic.emergency24h && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>24/7 Emergency</span>
                      </span>
                    )}
                    {clinic.hasExoticSpecialist && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Exotic/Small Animal</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{clinic.name}</h3>

                <p className="text-xs text-slate-500 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{clinic.address}</span>
                </p>

                {clinic.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    ℹ️ {clinic.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    <span className="font-semibold">📞 Phone: </span>
                    <a href={`tel:${clinic.phone}`} className="font-bold text-slate-900 hover:text-emerald-700 underline decoration-slate-300">
                      {clinic.phone}
                    </a>
                  </div>
                  {clinic.altPhone && (
                    <div className="text-[11px] text-slate-500">
                      <span>Alt: </span>
                      <a href={`tel:${clinic.altPhone}`} className="hover:text-emerald-700">
                        {clinic.altPhone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${clinic.phone}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'কল করুন' : 'Call Now'}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
