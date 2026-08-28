import React, { useState } from 'react';
import { Language } from '../types';
import { RABBIT_DIET_GUIDE } from '../data/bangladeshVetsAndDiet';
import { 
  Leaf, 
  AlertTriangle, 
  Search, 
  Info,
  CheckCircle,
  Apple,
  Wheat,
  Sprout,
  Ban
} from 'lucide-react';

interface DietAndCareGuideProps {
  language: Language;
}

export const DietAndCareGuide: React.FC<DietAndCareGuideProps> = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDiet = RABBIT_DIET_GUIDE.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.nameBn.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query) ||
      item.benefitOrRiskBn.toLowerCase().includes(query) ||
      item.benefitOrRiskEn.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'hay_grass':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <Wheat className="w-3 h-3" />
            <span>{language === 'bn' ? '৮০% প্রধান খাদ্য (Hay & Grass)' : '80% Primary Hay'}</span>
          </span>
        );
      case 'safe_greens':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            <span>{language === 'bn' ? 'নিরাপদ শাকসবজি (Safe Greens)' : 'Safe Greens'}</span>
          </span>
        );
      case 'limited_treat':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
            <Apple className="w-3 h-3" />
            <span>{language === 'bn' ? 'পরিমিত ট্রিট (Limited Treat)' : 'Limited Treat'}</span>
          </span>
        );
      case 'toxic_danger':
        return (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
            <Ban className="w-3 h-3" />
            <span>{language === 'bn' ? '☠️ বিষাক্ত / সম্পূর্ণ নিষিদ্ধ' : '☠️ Toxic / Poison'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Pyramid Visual */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-800">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'bn' ? 'খরগোশের নিরাপদ খাদ্য ও পুষ্টি নির্দেশিকা' : 'Rabbit Nutrition & Safe Diet Guide'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {language === 'bn'
              ? 'খরগোশের পাকস্থলীর গঠন অন্যান্য প্রাণীর চেয়ে সম্পূর্ণ আলাদা। ভুল খাবার এক নিমেষেই প্রাণঘাতী পেট ফাঁপা ও ডায়রিয়া সৃষ্টি করে।'
              : 'Rabbits have delicate digestive systems requiring high crude fiber and low starches/sugars.'}
          </p>
        </div>

        {/* 4-Tier Nutrition Pyramid Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-2xl font-black text-emerald-700">80-85%</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {language === 'bn' ? 'ঘাস / শুকনো হে (Grass Hay)' : 'Timothy & Grass Hay'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn' ? '২৪ ঘণ্টা আনলিমিটেড তাজা ঘাস বা হে' : 'Unlimited 24/7 access'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
            <div className="text-2xl font-black text-teal-700">10-15%</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {language === 'bn' ? 'তাজা শাকসবজি (Safe Greens)' : 'Fresh Leafy Greens'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn' ? 'ধনেপাতা, পুদিনা, রোমেইন লেটুস' : 'Coriander, Mint, Romaine'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="text-2xl font-black text-blue-700">5%</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {language === 'bn' ? 'মানসম্মত পিলেটস (Pellets)' : 'Plain Pellets'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn' ? '১-২ টেবিল চামচ পরিমিত' : 'Strict 1-2 tbsp / day'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-2xl font-black text-amber-700">1-2%</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {language === 'bn' ? 'ট্রিট / ফলমূল (Treats)' : 'Fruit Treats'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'bn' ? 'ছোট এক টুকরো আপেল বা কলা' : 'Thumb-size slice max'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'খাবারের নাম দিয়ে খুঁজুন...' : 'Search foods in Bangladesh...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: language === 'bn' ? 'সকল খাবার' : 'All' },
              { id: 'hay_grass', label: language === 'bn' ? '🌾 ঘাস ও হে' : '🌾 Hay' },
              { id: 'safe_greens', label: language === 'bn' ? '🥬 নিরাপদ শাক' : '🥬 Greens' },
              { id: 'limited_treat', label: language === 'bn' ? '🍎 ট্রিট' : '🍎 Treats' },
              { id: 'toxic_danger', label: language === 'bn' ? '☠️ বিষাক্ত' : '☠️ Toxic' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredDiet.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.category === 'toxic_danger'
                  ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
                  : 'border-slate-200 hover:border-emerald-300 bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-sm font-bold text-slate-900">
                  {language === 'bn' ? item.nameBn : item.nameEn}
                </h4>
                {getCategoryBadge(item.category)}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {language === 'bn' ? item.benefitOrRiskBn : item.benefitOrRiskEn}
              </p>

              <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100 text-slate-700">
                <div className="flex items-start gap-1">
                  <span className="font-bold text-slate-900">
                    {language === 'bn' ? 'খাওয়ানোর নিয়ম:' : 'Feeding Rule:'}
                  </span>
                  <span>{language === 'bn' ? item.servingAdviceBn : item.servingAdviceEn}</span>
                </div>
                <div className="flex items-start gap-1 text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {language === 'bn' ? 'প্রাপ্তিস্থান (BD):' : 'Local BD Source:'}
                  </span>
                  <span>{item.localAvailabilityBD}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
