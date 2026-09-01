import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Globe, UserCheck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, toggleLanguage, activeRole, switchRole, user, t } = useApp();

  const isRtl = language === 'ar';

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#eceef0] pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-2">
        {/* App Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center font-extrabold text-base shadow-sm border border-[#506600]/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#191c1e] leading-tight tracking-tight">
              {activeRole === 'trainer' ? t('trainerTitle') : 'Shawky App'}
            </span>
            <span className="text-[10px] font-semibold text-[#506600] uppercase tracking-wider">
              {activeRole === 'trainer' ? t('trainerDashboard') : (isRtl ? 'لياقة وتغذية' : 'Fitness & Nutrition')}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#191c1e] text-xs font-bold transition-colors border border-[#e0e3e5]"
            title="Switch Language / تبديل اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-[#506600]" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={switchRole}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeRole === 'trainer'
                ? 'bg-[#506600] text-white border-[#506600]'
                : 'bg-[#ccff00]/20 text-[#506600] border-[#ccff00] hover:bg-[#ccff00]/30'
            }`}
            title="Switch Client/Trainer Mode"
          >
            {activeRole === 'trainer' ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>{isRtl ? 'المدرب' : 'Trainer'}</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isRtl ? 'العميل' : 'Client'}</span>
              </>
            )}
          </button>

          {/* User Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#ccff00]/50 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#506600] ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
