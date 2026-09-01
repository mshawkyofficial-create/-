import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ClientHome } from './components/ClientHome';
import { WorkoutView } from './components/WorkoutView';
import { NutritionView } from './components/NutritionView';
import { RecipeLibraryView } from './components/RecipeLibraryView';
import { AiAssistantView } from './components/AiAssistantView';
import { ProgressCheckInView } from './components/ProgressCheckInView';
import { MessagesView } from './components/MessagesView';
import { SettingsView } from './components/SettingsView';
import { TrainerDashboardView } from './components/TrainerDashboardView';
import { AuthModal } from './components/AuthModal';
import { ClientOnboardingModal } from './components/ClientOnboardingModal';

const AppLayout: React.FC = () => {
  const { activeRole, activeTab, user } = useApp();

  const isClientFirstLogin = activeRole === 'client' && !user.onboardingCompleted;

  const renderContent = () => {
    if (activeRole === 'trainer') {
      switch (activeTab) {
        case 'dashboard':
        case 'activity':
        case 'clients':
          return <TrainerDashboardView />;
        case 'messages':
          return <MessagesView />;
        case 'settings':
        case 'menu':
          return <SettingsView />;
        default:
          return <TrainerDashboardView />;
      }
    }

    // Client First Login Onboarding Flow - Block Dashboard access until completed
    if (isClientFirstLogin) {
      return <ClientOnboardingModal isMandatory={true} />;
    }

    // Client Dashboard & Normal Views
    switch (activeTab) {
      case 'home':
        return <ClientHome />;
      case 'workouts':
        return <WorkoutView />;
      case 'nutrition':
        return <NutritionView />;
      case 'recipes':
        return <RecipeLibraryView />;
      case 'ai-coach':
        return <AiAssistantView />;
      case 'progress':
        return <ProgressCheckInView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <ClientHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] antialiased selection:bg-[#ccff00] selection:text-[#191c1e] flex flex-col">
      <Header />
      <main className="w-full flex-1">
        {renderContent()}
      </main>
      {!isClientFirstLogin && <BottomNav />}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
