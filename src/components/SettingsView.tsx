import React, { useState } from 'react';
import { useApp, SUBSCRIPTION_PAGE_URL } from '../context/AppContext';
import {
  User,
  Key,
  Globe,
  Bell,
  LogOut,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Edit2,
  Check,
  ClipboardList,
  Ruler,
  Plus,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { ClientOnboardingModal } from './ClientOnboardingModal';

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    accessCodes,
    redeemAccessCode,
    language,
    setLanguage,
    activeRole,
    switchRole,
    logout,
    resetOnboarding,
    measurementLocations,
    addMeasurementLocation,
    removeMeasurementLocation,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [inputCode, setInputCode] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; msg: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone || '');

  // Add custom measurement location state (for Trainer)
  const [newLocationEn, setNewLocationEn] = useState('');
  const [newLocationAr, setNewLocationAr] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = redeemAccessCode(inputCode);
    if (res.success) {
      setRedeemFeedback({
        success: true,
        msg: t(res.messageKey),
      });
      setInputCode('');
    } else {
      setRedeemFeedback({
        success: false,
        msg: t(res.messageKey),
      });
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
    }));
    setShowEditProfile(false);
  };

  const handleAddMeasurementLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLocationEn.trim() && newLocationAr.trim()) {
      addMeasurementLocation({
        en: newLocationEn.trim(),
        ar: newLocationAr.trim(),
      });
      setNewLocationEn('');
      setNewLocationAr('');
      setShowAddLocation(false);
    }
  };

  const entitlementList = [
    {
      id: 'full_access',
      title: t('fullAccessProduct'),
      active: user.entitlements.hasTraining && user.entitlements.hasNutrition && user.entitlements.hasRecipeBook,
      expiry: user.entitlements.trainingExpires || '2026-12-31',
    },
    {
      id: 'training',
      title: t('trainingProduct'),
      active: user.entitlements.hasTraining,
      expiry: user.entitlements.trainingExpires || '2026-12-31',
    },
    {
      id: 'nutrition',
      title: t('nutritionProduct'),
      active: user.entitlements.hasNutrition,
      expiry: user.entitlements.nutritionExpires || '2026-12-31',
    },
    {
      id: 'recipe_book',
      title: t('recipeBookProduct'),
      active: user.entitlements.hasRecipeBook,
      expiry: user.entitlements.recipeBookExpires || '2026-12-31',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-6 animate-fade-in text-start">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-[#ccff00]">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#191c1e]">{user.name}</h2>
            <p className="text-xs text-[#565e74]">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#506600] bg-[#ccff00]/30 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              {activeRole === 'trainer' ? 'Certified Head Coach' : 'VIP Athlete • Shawky Elite'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-bold transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{t('editProfile')}</span>
          </button>
        </div>
      </div>

      {/* Client Onboarding Profile Card (For Client Mode) */}
      {activeRole === 'client' && (
        <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#191c1e]">
                  {isRtl ? 'ملف الاستبيان والتقييم البدني (Onboarding)' : 'Client Onboarding & Assessment Profile'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#f7faf0] text-[#506600] text-[10px] font-black border border-[#506600]/20">
                  {user.onboardingCompleted ? (isRtl ? 'مكتمل ومحفوظ' : 'Completed') : (isRtl ? 'غير مكتمل' : 'Pending')}
                </span>
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                {isRtl
                  ? 'عرض وتعديل بيانات الهدف، جدول التمرين، التفضيلات الغذائية، الحساسية، والإصابات'
                  : 'View or update your goals, schedule, food preferences, allergies, & injury history'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-[#191c1e] text-white text-xs font-black hover:bg-[#2c3135] transition-all flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عرض وتعديل الاستبيان' : 'Edit Onboarding Profile'}</span>
            </button>
            <button
              onClick={resetOnboarding}
              title="Reset Onboarding to test first-login experience"
              className="p-2.5 rounded-2xl bg-[#f2f4f6] text-[#565e74] hover:text-[#ba1a1a] hover:bg-[#fff0f0] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Trainer Body Measurement Locations Manager (Trainer Mode) */}
      {activeRole === 'trainer' && (
        <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#191c1e]">
                  {isRtl ? 'إدارة أماكن قياسات الجسم للعملاء' : 'Manage Client Body Measurement Locations'}
                </h3>
                <p className="text-xs text-[#565e74]">
                  {isRtl
                    ? 'الأماكن المعتمدة التي يقوم المشتركون بتسجيل قياساتها في الاستبيان والتقارير الأسبوعية'
                    : 'Locations required from clients during onboarding and weekly progress check-ins'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddLocation(!showAddLocation)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة موضع' : 'Add Location'}</span>
            </button>
          </div>

          {showAddLocation && (
            <form onSubmit={handleAddMeasurementLocation} className="p-4 rounded-2xl bg-[#fafbfc] border border-[#e0e3e5] flex flex-col sm:flex-row items-center gap-2 animate-fade-in">
              <input
                type="text"
                value={newLocationEn}
                onChange={(e) => setNewLocationEn(e.target.value)}
                placeholder="English Name (e.g. Shoulders, Neck)"
                className="w-full sm:w-1/2 h-10 px-3 rounded-xl bg-white text-xs font-medium border border-[#e0e3e5] outline-none"
                required
              />
              <input
                type="text"
                value={newLocationAr}
                onChange={(e) => setNewLocationAr(e.target.value)}
                placeholder="الاسم بالعربي (مثال: الأكتاف، الرقبة)"
                className="w-full sm:w-1/2 h-10 px-3 rounded-xl bg-white text-xs font-medium border border-[#e0e3e5] outline-none"
                required
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-4 h-10 rounded-xl bg-[#191c1e] text-white text-xs font-black"
                >
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLocation(false)}
                  className="px-3 h-10 rounded-xl bg-[#f2f4f6] text-[#565e74] text-xs font-bold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {measurementLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-3 rounded-2xl bg-[#fafbfc] border border-[#e0e3e5] flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-[#191c1e] block">
                    {isRtl ? loc.name.ar : loc.name.en}
                  </span>
                  <span className="text-[10px] text-[#565e74]">
                    {isRtl ? loc.name.en : loc.name.ar}
                  </span>
                </div>
                {measurementLocations.length > 3 && (
                  <button
                    onClick={() => removeMeasurementLocation(loc.id)}
                    className="text-[#ba1a1a] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#fff0f0] rounded-lg"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade to Coaching Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] text-white p-6 shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#ccff00] uppercase tracking-wider block mb-1">
              Shawky Coaching Plans
            </span>
            <h3 className="text-xl font-black text-white">
              {t('upgradeToCoaching')}
            </h3>
            <p className="text-xs text-white/80 max-w-sm mt-1">
              {t('featureLockedDesc')}
            </p>
          </div>
          <a
            href={SUBSCRIPTION_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-2 hover:bg-[#b8e600] active:scale-95 transition-all shadow-md shadow-[#ccff00]/25 shrink-0"
          >
            <span>{t('viewPlans')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Access Code Redemption Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#191c1e]">
              {t('redeemCode')}
            </h3>
            <p className="text-xs text-[#565e74]">
              {t('accessCodeDesc')}
            </p>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="e.g. SHAWKY-VIP-FULL"
            className="flex-1 h-12 px-4 rounded-2xl bg-[#f2f4f6] text-xs font-black tracking-wider text-[#191c1e] outline-none uppercase"
          />
          <button
            type="submit"
            className="px-6 h-12 rounded-2xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600] transition-colors"
          >
            {t('redeem')}
          </button>
        </form>

        {redeemFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold ${
              redeemFeedback.success
                ? 'bg-[#f7faf0] text-[#506600] border border-[#506600]/30'
                : 'bg-[#fff0f0] text-[#ba1a1a] border border-[#ffdad6]'
            }`}
          >
            {redeemFeedback.msg}
          </div>
        )}
      </div>

      {/* Entitlements Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
        <h3 className="text-base font-black text-[#191c1e]">
          {t('activeEntitlements')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {entitlementList.map((ent) => (
            <div
              key={ent.id}
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                ent.active
                  ? 'bg-[#f7faf0] border-[#506600]/30'
                  : 'bg-[#f2f4f6]/60 border-[#e0e3e5] opacity-60'
              }`}
            >
              <div>
                <h4 className="text-xs font-extrabold text-[#191c1e]">
                  {ent.title}
                </h4>
                <span className="text-[10px] text-[#565e74]">
                  {ent.active ? `${t('expiresOn')}: ${ent.expiry}` : t('featureLocked')}
                </span>
              </div>
              {ent.active ? (
                <span className="px-2.5 py-1 rounded-full bg-[#506600] text-white text-[10px] font-black">
                  {t('activeStatus')}
                </span>
              ) : (
                <Lock className="w-4 h-4 text-[#565e74]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* General Settings Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-5">
        <h3 className="text-base font-black text-[#191c1e]">{t('settings')}</h3>

        {/* Language Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#506600]" />
            <div>
              <h4 className="text-sm font-bold text-[#191c1e]">{t('language')}</h4>
              <p className="text-xs text-[#565e74]">
                {language === 'ar' ? t('arabic') : t('english')}
              </p>
            </div>
          </div>
          <div className="flex bg-[#f2f4f6] p-1 rounded-xl border border-[#e0e3e5]">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'ar' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#565e74]'
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en' ? 'bg-white text-[#191c1e] shadow-xs' : 'text-[#565e74]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center justify-between pt-3 border-t border-[#eceef0]">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#506600]" />
            <div>
              <h4 className="text-sm font-bold text-[#191c1e]">{t('roleSwitcher')}</h4>
              <p className="text-xs text-[#565e74]">
                {activeRole === 'client' ? t('clientMode') : t('trainerMode')}
              </p>
            </div>
          </div>
          <button
            onClick={switchRole}
            className="px-3.5 py-1.5 rounded-xl bg-[#ccff00]/30 hover:bg-[#ccff00] text-[#191c1e] text-xs font-bold border border-[#ccff00] transition-colors"
          >
            {activeRole === 'client' ? t('trainerMode') : t('clientMode')}
          </button>
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between pt-3 border-t border-[#eceef0]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#506600]" />
            <div>
              <h4 className="text-sm font-bold text-[#191c1e]">{t('pushNotifications')}</h4>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'تنبيهات التمارين والتغذية ورسائل المدرب' : 'Daily workout reminders and coach alerts'}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#506600] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full h-12 rounded-2xl bg-white hover:bg-[#fff0f0] border border-[#ffdad6] text-[#ba1a1a] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('logOut')}</span>
      </button>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <h3 className="text-lg font-black text-[#191c1e]">
              {t('editProfile')}
            </h3>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {t('fullName')}
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {isRtl ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs"
                >
                  {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 h-11 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Onboarding Modal from Profile/Settings */}
      {showOnboardingModal && (
        <ClientOnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          initialData={user.onboardingData}
        />
      )}
    </div>
  );
};
