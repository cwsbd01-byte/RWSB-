import React, { useState, useEffect } from 'react';
import { Rabbit, Language, RabbitGender } from '../types';
import { translations } from '../data/translations';
import { X, Camera, Save, Trash2, AlertTriangle } from 'lucide-react';

interface RabbitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRabbit: (rabbit: Rabbit) => void;
  onDeleteRabbit?: (id: string) => void;
  rabbitToEdit?: Rabbit | null;
  language: Language;
  totalRabbitsCount?: number;
}

const COMMON_BREEDS_BD = [
  'Local Domestic Rabbit (বাংলাদেশী দেশি খরগোশ)',
  'Holland Lop (হল্যান্ড লপ)',
  'Netherland Dwarf (নেদারল্যান্ড ডোয়ার্ফ)',
  'Lionhead (লায়নহেড)',
  'New Zealand White (নিউজিল্যান্ড হোয়াইট)',
  'Mini Rex / Rex (মিনি রেক্স)',
  'Flemish Giant (ফ্লেমিশ জায়ান্ট)',
  'Angora Rabbit (অ্যাঙ্গোরা)',
  'Local Cross Breed (দেশি সংকর জাত)'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518796745738-41048802f99a?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1591382696684-38c427c7547a?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&auto=format&fit=crop&q=80'
];

export const RabbitSelectorModal: React.FC<RabbitSelectorModalProps> = ({
  isOpen,
  onClose,
  onSaveRabbit,
  onDeleteRabbit,
  rabbitToEdit,
  language,
  totalRabbitsCount = 1,
}) => {
  const t = translations[language];

  const [name, setName] = useState('');
  const [breed, setBreed] = useState(COMMON_BREEDS_BD[0]);
  const [gender, setGender] = useState<RabbitGender>('neutered_male');
  const [ageYears, setAgeYears] = useState(1);
  const [ageMonths, setAgeMonths] = useState(6);
  const [weightKg, setWeightKg] = useState(1.8);
  const [color, setColor] = useState('');
  const [microchipNo, setMicrochipNo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerCity, setOwnerCity] = useState('Dhaka');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setShowDeleteConfirm(false);
    if (rabbitToEdit) {
      setName(rabbitToEdit.name);
      setBreed(rabbitToEdit.breed);
      setGender(rabbitToEdit.gender);
      setAgeYears(rabbitToEdit.ageYears);
      setAgeMonths(rabbitToEdit.ageMonths);
      setWeightKg(rabbitToEdit.weightKg);
      setColor(rabbitToEdit.color);
      setMicrochipNo(rabbitToEdit.microchipNo || '');
      setPhotoUrl(rabbitToEdit.photoUrl || '');
      setNotes(rabbitToEdit.notes || '');
      setOwnerName(rabbitToEdit.ownerName || '');
      setOwnerPhone(rabbitToEdit.ownerPhone || '');
      setOwnerCity(rabbitToEdit.ownerCity || 'Dhaka');
    } else {
      setName('');
      setBreed(COMMON_BREEDS_BD[0]);
      setGender('neutered_male');
      setAgeYears(1);
      setAgeMonths(2);
      setWeightKg(1.75);
      setColor('White & Brown');
      setMicrochipNo('');
      setPhotoUrl(PRESET_AVATARS[0]);
      setNotes('');
      setOwnerName('');
      setOwnerPhone('');
      setOwnerCity('Dhaka');
    }
  }, [rabbitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRabbit: Rabbit = {
      id: rabbitToEdit ? rabbitToEdit.id : `rab-${Date.now()}`,
      name: name.trim(),
      breed,
      gender,
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      weightKg: Number(weightKg) || 1.5,
      color: color.trim() || 'Mixed',
      microchipNo: microchipNo.trim() || undefined,
      photoUrl: photoUrl || undefined,
      notes: notes.trim() || undefined,
      ownerName: ownerName.trim() || undefined,
      ownerPhone: ownerPhone.trim() || undefined,
      ownerCity: ownerCity.trim() || undefined,
      createdAt: rabbitToEdit ? rabbitToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveRabbit(newRabbit);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐰</span>
            <h2 className="text-lg font-bold tracking-tight">
              {rabbitToEdit ? t.editProfileTitle : t.createProfileTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar / Photo Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {language === 'bn' ? 'খরগোশের ছবি (Photo / Avatar)' : 'Rabbit Photo / Avatar'}
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {photoUrl ? (
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🐰</span>
                )}
                <label 
                  htmlFor="photo-upload-input"
                  className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-semibold"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input 
                  id="photo-upload-input" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  aria-label={language === 'bn' ? 'খরগোশের ছবি আপলোড করুন' : 'Upload rabbit photo'}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-slate-500 mb-2">
                  {language === 'bn' ? 'ডিফল্ট ছবি পছন্দ করুন অথবা আপনার খরগোশের ছবি আপলোড করুন:' : 'Choose a preset or upload your own:'}
                </p>
                <div className="flex gap-2">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        photoUrl === url ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <label 
                    htmlFor="custom-photo-file-btn"
                    className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium flex items-center gap-1 text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input 
                      id="custom-photo-file-btn" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      aria-label="Upload custom photo"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rabbit-input-name" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rabbitName} *
              </label>
              <input
                id="rabbit-input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tuktuki / টুকটুকি"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="rabbit-select-breed" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rabbitBreed}
              </label>
              <select
                id="rabbit-select-breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {COMMON_BREEDS_BD.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rabbit-select-gender" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rabbitGender}
              </label>
              <select
                id="rabbit-select-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as RabbitGender)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="neutered_male">{t.genderNeuteredMale}</option>
                <option value="spayed_female">{t.genderSpayedFemale}</option>
                <option value="male">{t.genderMale}</option>
                <option value="female">{t.genderFemale}</option>
              </select>
            </div>

            <div>
              <label htmlFor="rabbit-input-weight" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rabbitWeight}
              </label>
              <input
                id="rabbit-input-weight"
                type="number"
                step="0.01"
                min="0.2"
                max="12"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="rabbit-input-age-years" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.rabbitAgeYears}
                </label>
                <input
                  id="rabbit-input-age-years"
                  type="number"
                  min="0"
                  max="16"
                  value={ageYears}
                  onChange={(e) => setAgeYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="rabbit-input-age-months" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.rabbitAgeMonths}
                </label>
                <input
                  id="rabbit-input-age-months"
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rabbit-input-color" className="block text-xs font-semibold text-slate-700 mb-1">
                {t.rabbitColor}
              </label>
              <input
                id="rabbit-input-color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Orange & White, Brown, Agouti"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Microchip / Guardian Details */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {language === 'bn' ? 'অভিভাবক ও সুরক্ষা তথ্য (Bangladesh Guardian Info)' : 'Guardian & Identification'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="rabbit-input-owner-name" className="block text-xs font-medium text-slate-600 mb-1">{t.ownerName}</label>
                <input
                  id="rabbit-input-owner-name"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. জাহিদুল ইসলাম"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor="rabbit-input-owner-phone" className="block text-xs font-medium text-slate-600 mb-1">{t.ownerPhone}</label>
                <input
                  id="rabbit-input-owner-phone"
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label htmlFor="rabbit-input-owner-city" className="block text-xs font-medium text-slate-600 mb-1">{t.ownerCity}</label>
                <input
                  id="rabbit-input-owner-city"
                  type="text"
                  value={ownerCity}
                  onChange={(e) => setOwnerCity(e.target.value)}
                  placeholder="Dhaka / Chattogram"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="rabbit-input-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'বিশেষ স্বভাব বা অ্যালার্জি ও উদ্ধার ইতিহাস' : 'Special Traits, Allergies & Notes'}
            </label>
            <textarea
              id="rabbit-input-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. উদ্ধারকৃত খরগোশ, গ্যাস্ট্রিকের সমস্যা রয়েছে..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div>
              {rabbitToEdit && onDeleteRabbit && (
                <div>
                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{t.btnDeleteRabbit}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 bg-rose-50 p-2 rounded-xl border border-rose-200 animate-in fade-in duration-150">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-[11px] font-medium text-rose-800">
                        {language === 'bn' ? 'মুছে ফেলবেন?' : 'Confirm delete?'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteRabbit(rabbitToEdit.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer transition-colors shadow-2xs"
                      >
                        {language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg cursor-pointer transition-colors"
                      >
                        {t.btnCancel}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {t.btnCancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.btnSaveProfile}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
