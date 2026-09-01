import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Dumbbell,
  Bot,
  Utensils,
  TrendingUp,
  LayoutDashboard,
  Activity,
  MessageSquare,
  Users,
  Settings,
  BookOpen,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, messages, t } = useApp();

  const unreadCount = messages.filter((m) => !m.isRead && m.senderRole === 'trainer').length;

  if (activeRole === 'trainer') {
    const trainerTabs = [
      { id: 'dashboard', label: t('navHome'), icon: LayoutDashboard },
      { id: 'activity', label: t('navActivity'), icon: Activity },
      {
        id: 'messages',
        label: t('navMessages'),
        icon: MessageSquare,
        badge: unreadCount > 0 ? unreadCount : 3,
      },
      { id: 'clients', label: t('navClients'), icon: Users },
      { id: 'settings', label: t('navMenu'), icon: Settings },
    ];

    return (
      <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/90 backdrop-blur-xl border-t border-[#eceef0] shadow-[0_-1px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-2">
          {trainerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative ${
                  isActive ? 'text-[#506600]' : 'text-[#565e74] hover:text-[#191c1e]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#ccff00] text-[#191c1e] text-[9px] font-extrabold flex items-center justify-center border border-white shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-semibold ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#506600]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Client Navigation Tabs
  const clientTabs = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'workouts', label: t('navWorkouts'), icon: Dumbbell },
    { id: 'ai-coach', label: t('navAiCoach'), icon: Bot, isCenter: true },
    { id: 'nutrition', label: t('navNutrition'), icon: Utensils },
    { id: 'recipes', label: t('navRecipes'), icon: BookOpen },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/92 backdrop-blur-xl border-t border-[#eceef0] shadow-[0_-1px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-1 relative">
        {clientTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="flex flex-col items-center justify-end flex-1 h-full pb-1 relative">
                <button
                  onClick={() => setActiveTab('ai-coach')}
                  className={`w-13 h-13 rounded-full flex items-center justify-center absolute -top-4 shadow-lg border-4 border-white transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-[#506600] text-white shadow-[#506600]/30'
                      : 'bg-[#ccff00] text-[#191c1e] shadow-[#ccff00]/40 hover:scale-105'
                  }`}
                  title={tab.label}
                >
                  <Bot className="w-6 h-6 stroke-[2.2px]" />
                </button>
                <span
                  className={`text-[10px] tracking-tight mt-auto pt-1 font-bold ${
                    isActive ? 'text-[#506600]' : 'text-[#565e74]'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors relative ${
                isActive ? 'text-[#506600]' : 'text-[#565e74] hover:text-[#191c1e]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              <span className={`text-[11px] font-semibold ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-[#506600]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
