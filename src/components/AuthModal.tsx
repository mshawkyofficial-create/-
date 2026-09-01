import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Key, Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    loginWithCredentials,
    activateWithCode,
    language,
    t,
  } = useApp();

  const [email, setEmail] = useState('m.shawkyofficial@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [name, setName] = useState('Mahmoud Shawky');
  const [accessCode, setAccessCode] = useState('SHAWKY-VIP');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAuthModal) return null;

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg(isRtl ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    const ok = loginWithCredentials(email, password);
    if (!ok) {
      setErrorMsg(isRtl ? 'بيانات الاعتماد غير صالحة' : 'Invalid credentials');
    }
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!accessCode.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال كود الاشتراك' : 'Please enter your access code');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    const ok = activateWithCode(name, email, accessCode, password);
    if (ok) {
      setSuccessMsg(t('accountActivatedSuccess'));
    } else {
      setErrorMsg(t('invalidCode'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#eceef0] my-8">
        {/* Top Logo & Close */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center text-2xl font-black mb-3 shadow-md shadow-[#ccff00]/20 border border-[#506600]/20">
            S
          </div>
          <h2 className="text-2xl font-black text-[#191c1e] tracking-tight">
            {authMode === 'activate' ? t('activateYourAccount') : authMode === 'welcome' ? t('welcomeToShawkyApp') : t('loginBtn')}
          </h2>
          <p className="text-xs sm:text-sm text-[#565e74] mt-1 max-w-xs">
            {authMode === 'activate'
              ? t('activateAccountDesc')
              : t('yourClientsWaiting')}
          </p>
        </div>

        {/* Demo Quick Codes Pill Bar */}
        <div className="mb-5 p-3 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5]">
          <span className="text-[10px] font-bold text-[#506600] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {isRtl ? 'أكواد تجريبية سريعة للنقر والتفعيل:' : 'Quick Demo Codes (Click to auto-fill):'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: 'SHAWKY-VIP', label: 'Full Access (VIP)' },
              { code: 'SHAWKY-RECIPES', label: 'Recipe Book' },
              { code: 'SHAWKY-TRAIN', label: 'Pro Training' },
              { code: 'SHAWKY-NUTRITION', label: 'Nutrition' },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setAccessCode(item.code);
                  setAuthMode('activate');
                }}
                className="px-2 py-1 rounded-lg bg-white border border-[#506600]/20 hover:border-[#506600] text-[#191c1e] text-[11px] font-bold shadow-xs active:scale-95 transition-all"
              >
                <span className="text-[#506600] font-black">{item.code}</span> ({item.label})
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#ccff00]/30 text-[#191c1e] text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#506600]" />
            {successMsg}
          </div>
        )}

        {authMode === 'welcome' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAuthMode('activate')}
              className="w-full h-14 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/30 transition-all active:scale-[0.98]"
            >
              <span>{t('dontHaveAccount')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setAuthMode('login')}
              className="w-full h-13 rounded-2xl bg-white hover:bg-[#f7f9fb] text-[#191c1e] border border-[#e0e3e5] font-bold text-sm flex items-center justify-center transition-colors"
            >
              <span>{t('loginBtn')}</span>
            </button>

            <button
              onClick={() => setShowAuthModal(false)}
              className="text-xs text-[#565e74] hover:text-[#191c1e] text-center pt-2 underline underline-offset-4"
            >
              {isRtl ? 'تخطي والدخول كزائر تجريبي' : 'Continue into preview'}
            </button>
          </div>
        )}

        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-9 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="coach@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-9 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3.5 right-3 rtl:left-3 rtl:right-auto text-[#565e74] hover:text-[#191c1e]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-13 mt-2 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-[#ccff00]/25 transition-all active:scale-[0.98]"
            >
              <span>{t('loginBtn')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('activate')}
                className="text-[#506600] font-bold hover:underline"
              >
                {t('dontHaveAccount')}
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[#565e74] hover:underline"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}

        {authMode === 'activate' && (
          <form onSubmit={handleActivate} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                {t('accessCodeLabel')}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#506600] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full h-11 px-9 rounded-xl bg-[#ccff00]/15 text-[#191c1e] font-extrabold text-sm tracking-wider border border-[#506600]/30 focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="e.g. SHAWKY-VIP"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-9 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="Mahmoud Shawky"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                {t('emailOrPhone')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-9 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="m.shawkyofficial@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1 text-start">
                  {t('confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-medium text-sm border border-transparent focus:border-[#506600] focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-13 mt-2 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/30 transition-all active:scale-[0.98]"
            >
              <span>{t('activateYourAccount')}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-[#506600] font-bold hover:underline"
              >
                {t('alreadyHaveAccount')}
              </button>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[#565e74] hover:underline"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
