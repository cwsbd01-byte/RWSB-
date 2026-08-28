import React, { useState } from 'react';
import { Language } from '../types';
import { MessageCircle, Users, X } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  language: Language;
}

export const WHATSAPP_COMMUNITY_LINK =
  'https://chat.whatsapp.com/KgEHuJDfCsE8DHB8rnyRNR?s=cl&p=a&mlu=4';

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  language,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end group">
      {/* Tooltip bubble (can be dismissed or opens group) */}
      {showTooltip && (
        <div className="relative mb-2.5 max-w-[260px] sm:max-w-xs bg-slate-900/95 backdrop-blur-md text-white text-xs p-3 rounded-2xl shadow-2xl border border-emerald-500/30 animate-bounce duration-1000">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute -top-2 -left-2 w-5 h-5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 flex items-center justify-center text-[10px] cursor-pointer shadow-sm"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-3 h-3" />
          </button>
          
          <a
            href={WHATSAPP_COMMUNITY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="block space-y-1 hover:opacity-90"
          >
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <Users className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'হোয়াটসঅ্যাপ গ্রুপ কমিউনিটি' : 'WhatsApp Community Group'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              {language === 'bn'
                ? 'ক্লিক করে আমাদের গ্রুপে যুক্ত হোন ও খরগোশ পালকদের সাথে কথা বলুন।'
                : 'Click to join our group and chat directly with rabbit guardians.'}
            </p>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={WHATSAPP_COMMUNITY_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join WhatsApp Group Community"
        className="relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 sm:px-4 sm:py-3.5 rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold cursor-pointer group"
      >
        {/* Animated pulse ring */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white text-[10px] text-emerald-700 font-black items-center justify-center">
            •
          </span>
        </span>

        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        <span className="text-xs sm:text-sm font-extrabold tracking-wide whitespace-nowrap">
          {language === 'bn' ? 'হোয়াটসঅ্যাপ গ্রুপ' : 'WhatsApp Group'}
        </span>
      </a>
    </div>
  );
};
