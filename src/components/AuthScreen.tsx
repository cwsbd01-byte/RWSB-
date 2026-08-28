import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { translations } from '../data/translations';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight,
  Heart
} from 'lucide-react';

interface AuthScreenProps {
  language: Language;
  onLanguageToggle: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ language, onLanguageToggle }) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('ঢাকা (Dhaka)');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে ইমেইল বা আইডি দিন।' : 'Please enter your email or ID.');
      return;
    }

    if (isForgot) {
      try {
        setLoading(true);
        await resetPassword(email.trim());
        setSuccessMsg(
          language === 'bn'
            ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে! ইনবক্স চেক করুন।'
            : 'Password reset link sent to your email! Please check your inbox.'
        );
      } catch (err: any) {
        setErrorMsg(err.message || (language === 'bn' ? 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।' : 'Password reset failed.'));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        if (!name.trim()) {
          setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন।' : 'Please enter your name.');
          setLoading(false);
          return;
        }
        await signUp(email.trim(), password, name.trim(), phone.trim(), city);
        setSuccessMsg(language === 'bn' ? 'একাউন্ট সফলভাবে তৈরি হয়েছে!' : 'Account created successfully!');
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: any) {
      let msg = err.message || '';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
        msg = language === 'bn' ? 'ভুল ইমেইল আইডি বা পাসওয়ার্ড দেওয়া হয়েছে।' : 'Invalid email or password.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = language === 'bn' ? 'এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।' : 'This email is already registered. Please login.';
      } else if (msg.includes('auth/weak-password')) {
        msg = language === 'bn' ? 'পাসওয়ার্ডটি খুব দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।' : 'Password is too weak.';
      }
      setErrorMsg(msg || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Authentication failed. Please retry.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-between text-white p-4 sm:p-6 md:p-8">
      {/* Top Header */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-2xl">
            🐰
          </div>
          <div>
            <h1 className="font-bold text-lg text-emerald-100 leading-tight">
              {language === 'bn' ? 'র্যাবিট ওয়েলফেয়ার' : 'Rabbit Welfare'}
            </h1>
            <p className="text-xs text-emerald-300/80">
              {language === 'bn' ? 'সোসাইটি অফ বাংলাদেশ • পার্সোনাল ট্র্যাকার' : 'Society of Bangladesh • Personal Tracker'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLanguageToggle}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-md transition-all border border-white/10"
        >
          {language === 'bn' ? 'English' : 'বাংলা'}
        </button>
      </header>

      {/* Main Auth Card */}
      <main className="max-w-md w-full mx-auto my-auto bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '১০০% ব্যক্তিগত ও সুরক্ষিত ডেটা' : '100% Private & Isolated Data'}</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {isForgot
              ? language === 'bn'
                ? 'পাসওয়ার্ড রিসেট করুন'
                : 'Reset Password'
              : isSignUp
              ? language === 'bn'
                ? 'নতুন একাউন্ট খুলুন'
                : 'Create an Account'
              : language === 'bn'
              ? 'লগইন করুন'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-emerald-200/70 mt-1">
            {isForgot
              ? language === 'bn'
                ? 'আপনার একাউন্টের ইমেইল দিন, পাসওয়ার্ড পরিবর্তনের লিংক পাঠানো হবে।'
                : 'Enter your email to receive a password reset link.'
              : isSignUp
              ? language === 'bn'
                ? 'আপনার খরগোশের স্বাস্থ্য রেকর্ড সম্পূর্ণ সুরক্ষিত রাখুন।'
                : 'Keep your rabbit medical & health records private.'
              : language === 'bn'
              ? 'আপনার আইডি ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।'
              : 'Sign in with your email and password.'}
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                  {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: জাহিদুল ইসলাম রাজু' : 'e.g. John Doe'}
                    className="w-full bg-slate-800/80 border border-emerald-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                    {language === 'bn' ? 'জেলা / শহর' : 'City / District'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-800/80 border border-emerald-500/20 rounded-xl py-2.5 pl-9 pr-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="ঢাকা (Dhaka)">ঢাকা (Dhaka)</option>
                      <option value="চট্টগ্রাম (Chattogram)">চট্টগ্রাম (Chattogram)</option>
                      <option value="সিলেট (Sylhet)">সিলেট (Sylhet)</option>
                      <option value="রাজশাহী (Rajshahi)">রাজশাহী (Rajshahi)</option>
                      <option value="খুলনা (Khulna)">খুলনা (Khulna)</option>
                      <option value="বরিশাল (Barishal)">বরিশাল (Barishal)</option>
                      <option value="রংপুর (Rangpur)">রংপুর (Rangpur)</option>
                      <option value="ময়মনসিংহ (Mymensingh)">ময়মনসিংহ (Mymensingh)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-800/80 border border-emerald-500/20 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-1.5">
              {language === 'bn' ? 'ইমেইল আইডি' : 'Email Address / User ID'} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800/80 border border-emerald-500/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              />
            </div>
          </div>

          {!isForgot && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-emerald-200">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-emerald-500/20 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'bn' ? 'কমপক্ষে ৬ বা তার বেশি অক্ষরের পাসওয়ার্ড দিন।' : 'Minimum 6 characters.'}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {isForgot
                    ? language === 'bn'
                      ? 'রিসেট লিংক পাঠান'
                      : 'Send Reset Link'
                    : isSignUp
                    ? language === 'bn'
                      ? 'রেজিস্ট্রেশন সম্পন্ন করুন'
                      : 'Create Account'
                    : language === 'bn'
                    ? 'লগইন করুন'
                    : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          {isForgot ? (
            <button
              type="button"
              onClick={() => {
                setIsForgot(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {language === 'bn' ? '← লগইন স্ক্রিনে ফিরে যান' : '← Back to Sign In'}
            </button>
          ) : isSignUp ? (
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'ইতিমধ্যে একটি একাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              {language === 'bn' ? 'নতুন ব্যবহারকারী?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                {language === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Sign Up Free'}
              </button>
            </p>
          )}
        </div>
      </main>

      {/* Privacy & Society Footer */}
      <footer className="max-w-md w-full mx-auto text-center py-4 text-xs text-emerald-200/50">
        <p className="flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Rabbit Welfare Society of Bangladesh (RWSB)</span>
        </p>
        <p className="text-[11px] mt-1 text-slate-400">
          {language === 'bn'
            ? 'প্রতিটি ব্যবহারকারীর ডেটা স্বয়ংক্রিয়ভাবে ক্লাউডে এনক্রিপ্ট ও বিচ্ছিন্ন থাকে।'
            : 'Each user account is strictly isolated and cloud-encrypted.'}
        </p>
      </footer>
    </div>
  );
};
