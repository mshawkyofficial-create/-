import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientOverview, ProductType, TrainingProgram, NutritionPlan, Exercise, Recipe } from '../types';
import {
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Activity,
  Plus,
  Key,
  Shield,
  Eye,
  EyeOff,
  Dumbbell,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Search,
  Apple,
  BookOpen,
  UserPlus,
  FileSpreadsheet,
  Layers,
  Filter,
  Copy,
  Edit3,
  Trash2,
  Send,
  Play,
  Video,
} from 'lucide-react';
import { TrainerClientDetailModal } from './trainer/TrainerClientDetailModal';
import { TrainerAddClientModal } from './trainer/TrainerAddClientModal';
import { TrainerPlanBuilderModal } from './trainer/TrainerPlanBuilderModal';
import { TrainerNutritionBuilderModal } from './trainer/TrainerNutritionBuilderModal';
import { TrainerAddExerciseModal } from './trainer/TrainerAddExerciseModal';
import { TrainerAddRecipeModal } from './trainer/TrainerAddRecipeModal';
import { TrainerEditRecipeModal } from './trainer/TrainerEditRecipeModal';
import { TrainerRecipeDatabaseView } from './trainer/TrainerRecipeDatabaseView';

export const TrainerDashboardView: React.FC = () => {
  const {
    clients,
    recipes,
    trainingPrograms,
    createTrainingProgram,
    updateTrainingProgram,
    deleteTrainingProgram,
    duplicateTrainingProgram,
    assignTrainingProgramToClient,
    nutritionPlans,
    exercises,
    activityFeed,
    trainerNotes,
    addTrainerNote,
    checkIns,
    trainerReviewCheckIn,
    accessCodes,
    generateAccessCode,
    language,
    setActiveTab,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Selected client for master 7-tab workstation
  const [selectedClient, setSelectedClient] = useState<ClientOverview | null>(null);

  // Modals
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showPlanBuilderModal, setShowPlanBuilderModal] = useState(false);
  const [selectedProgramToEdit, setSelectedProgramToEdit] = useState<TrainingProgram | null>(null);
  const [showNutritionBuilderModal, setShowNutritionBuilderModal] = useState(false);
  const [selectedNutritionToEdit, setSelectedNutritionToEdit] = useState<NutritionPlan | null>(null);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [selectedRecipeToEdit, setSelectedRecipeToEdit] = useState<Recipe | null>(null);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // Assign program quick pop-up
  const [assignModalProgram, setAssignModalProgram] = useState<TrainingProgram | null>(null);
  const [assignTargetClientId, setAssignTargetClientId] = useState<string>('');

  // Program filters
  const [programFilter, setProgramFilter] = useState<'all' | 'templates' | 'assigned'>('all');

  // Access Code Generation Tool state
  const [selectedProductType, setSelectedProductType] = useState<ProductType>('full_access');
  const [generatedCodeResult, setGeneratedCodeResult] = useState<string | null>(null);

  // Check-in review quick modal
  const [reviewingCheckInId, setReviewingCheckInId] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('Great consistency! Continue pushing hard on progressive overload.');

  // Search & Filters for Client List
  const [clientSearch, setClientSearch] = useState('');
  const [clientFilter, setClientFilter] = useState<'all' | 'needs_attention' | 'pending_checkin'>('all');

  // Search & Filters for Exercise Library
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseMuscleFilter, setExerciseMuscleFilter] = useState('All');

  // Sub-view toggle on Dashboard (Clients vs Programs vs Nutrition vs Exercises vs Recipes)
  const [dashboardSubView, setDashboardSubView] = useState<'clients' | 'programs' | 'nutrition' | 'exercises' | 'recipes'>('clients');

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = generateAccessCode(selectedProductType);
    setGeneratedCodeResult(newCode.code);
  };

  const handleSaveReview = (checkInId: string) => {
    trainerReviewCheckIn(checkInId, feedbackInput);
    setReviewingCheckInId(null);
  };

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = (clientSearch || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const matchSearch = name.includes(q) || email.includes(q);

    if (!matchSearch) return false;
    if (clientFilter === 'needs_attention') {
      return c.statusAlert?.type === 'missed_workout' || c.statusAlert?.type === 'weight_plateau';
    }
    if (clientFilter === 'pending_checkin') {
      return c.statusAlert?.type === 'new_checkin';
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-6 animate-fade-in text-start">
      {/* Coach Greeting & Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#191c1e]">
              {t('goodMorningCoach')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccff00] text-[#191c1e] text-[10px] font-black tracking-wide uppercase">
              PRO COACH
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#565e74] mt-0.5">
            {isRtl
              ? 'نظام إدارة وتدريب المشتركين، بناء وتعيين الجداول، ومتابعة التقارير.'
              : 'Client management system, training/nutrition builders, and check-in hub.'}
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#191c1e] text-white text-xs font-black hover:bg-[#2c3135] active:scale-95 transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-[#ccff00]" />
            <span>{isRtl ? 'إضافة عميل' : 'Add Client'}</span>
          </button>

          <button
            onClick={() => setShowCodeGenerator(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#ccff00] text-[#191c1e] text-xs font-black shadow-md shadow-[#ccff00]/25 hover:bg-[#b8e600] active:scale-95 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>{t('generateNewCode')}</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Needs Attention */}
        <div
          onClick={() => {
            setDashboardSubView('clients');
            setClientFilter('needs_attention');
          }}
          className="bg-[#fff0f0] rounded-3xl p-4 sm:p-5 border border-[#ffdad6] flex flex-col cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mb-2">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#ba1a1a]">3</span>
          <span className="text-[11px] sm:text-xs font-bold text-[#ba1a1a]">
            {t('needsAttention')}
          </span>
        </div>

        {/* Pending Check-ins */}
        <div
          onClick={() => {
            setDashboardSubView('clients');
            setClientFilter('pending_checkin');
          }}
          className="bg-[#f0f9ff] rounded-3xl p-4 sm:p-5 border border-[#38bdf8]/30 flex flex-col cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0284c7]/10 text-[#0284c7] flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#0284c7]">5</span>
          <span className="text-[11px] sm:text-xs font-bold text-[#0284c7]">
            {t('pendingCheckins')}
          </span>
        </div>

        {/* Active Clients */}
        <div
          onClick={() => {
            setDashboardSubView('clients');
            setClientFilter('all');
          }}
          className="bg-[#f7faf0] rounded-3xl p-4 sm:p-5 border border-[#506600]/30 flex flex-col cursor-pointer hover:shadow-xs transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-[#506600]/10 text-[#506600] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#506600]">
            {clients.length}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-[#506600]">
            {t('activeClientsCount')}
          </span>
        </div>
      </div>

      {/* QUICK ACTIONS BAR (Requested in prompt) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#565e74] uppercase tracking-wider">
            {isRtl ? 'إجراءات سريعة للمدرب' : 'Coach Quick Actions'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {/* Add Client */}
          <button
            onClick={() => setShowAddClientModal(true)}
            className="p-3 rounded-2xl bg-[#f7faf0] hover:bg-[#eaf5d8] border border-[#506600]/20 flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'إضافة عميل' : 'Add Client'}
            </span>
          </button>

          {/* Create Training Plan */}
          <button
            onClick={() => {
              setSelectedProgramToEdit(null);
              setShowPlanBuilderModal(true);
            }}
            className="p-3 rounded-2xl bg-[#f7f9fb] hover:bg-[#eceef0] border border-[#e0e3e5] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#191c1e] text-[#ccff00] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'إنشاء خطة تمرين' : 'New Workout'}
            </span>
          </button>

          {/* Create Nutrition Plan */}
          <button
            onClick={() => {
              setSelectedNutritionToEdit(null);
              setShowNutritionBuilderModal(true);
            }}
            className="p-3 rounded-2xl bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Apple className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'إنشاء خطة تغذية' : 'New Nutrition'}
            </span>
          </button>

          {/* Add Exercise */}
          <button
            onClick={() => setShowAddExerciseModal(true)}
            className="p-3 rounded-2xl bg-[#f7f9fb] hover:bg-[#eceef0] border border-[#e0e3e5] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#f2f4f6] text-[#506600] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'إضافة تمرين' : 'Add Exercise'}
            </span>
          </button>

          {/* Recipe Database */}
          <button
            onClick={() => setDashboardSubView('recipes')}
            className="p-3 rounded-2xl bg-[#f7f9fb] hover:bg-[#eceef0] border border-[#e0e3e5] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#f2f4f6] text-[#d97706] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'قاعدة الوصفات' : 'Recipe DB'}
            </span>
          </button>

          {/* Generate Access Code */}
          <button
            onClick={() => setShowCodeGenerator(true)}
            className="p-3 rounded-2xl bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fde68a] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#d97706] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Key className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'كود اشتراك' : 'Access Code'}
            </span>
          </button>

          {/* View Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className="p-3 rounded-2xl bg-[#f7f9fb] hover:bg-[#eceef0] border border-[#e0e3e5] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'المحادثات' : 'Messages'}
            </span>
          </button>

          {/* View Check-ins */}
          <button
            onClick={() => {
              setDashboardSubView('clients');
              setClientFilter('pending_checkin');
            }}
            className="p-3 rounded-2xl bg-[#f7f9fb] hover:bg-[#eceef0] border border-[#e0e3e5] flex flex-col items-center justify-center text-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#f2f4f6] text-[#0284c7] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-extrabold text-[#191c1e] leading-tight">
              {isRtl ? 'التقارير' : 'Check-ins'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Switcher (Clients vs Training Programs vs Nutrition Plans vs Recipe DB vs Exercises) */}
      <div className="flex items-center justify-between border-b border-[#e0e3e5] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setDashboardSubView('clients')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              dashboardSubView === 'clients'
                ? 'bg-[#191c1e] text-white shadow-2xs'
                : 'bg-white text-[#565e74] hover:bg-[#f2f4f6]'
            }`}
          >
            {isRtl ? 'إدارة المشتركين والعملاء' : 'Clients Management'} ({clients.length})
          </button>
          <button
            onClick={() => setDashboardSubView('programs')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              dashboardSubView === 'programs'
                ? 'bg-[#191c1e] text-white shadow-2xs'
                : 'bg-white text-[#565e74] hover:bg-[#f2f4f6]'
            }`}
          >
            {isRtl ? 'مستودع برامج التمرين' : 'Workout Programs'} ({trainingPrograms.length})
          </button>
          <button
            onClick={() => setDashboardSubView('nutrition')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              dashboardSubView === 'nutrition'
                ? 'bg-[#191c1e] text-white shadow-2xs'
                : 'bg-white text-[#565e74] hover:bg-[#f2f4f6]'
            }`}
          >
            {isRtl ? 'مستودع خطط التغذية' : 'Nutrition Plans'} ({nutritionPlans.length})
          </button>
          <button
            onClick={() => setDashboardSubView('recipes')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              dashboardSubView === 'recipes'
                ? 'bg-[#191c1e] text-white shadow-2xs'
                : 'bg-white text-[#565e74] hover:bg-[#f2f4f6]'
            }`}
          >
            {isRtl ? 'قاعدة الوصفات' : 'Recipe Database'} ({recipes.length})
          </button>
          <button
            onClick={() => setDashboardSubView('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              dashboardSubView === 'exercises'
                ? 'bg-[#191c1e] text-white shadow-2xs'
                : 'bg-white text-[#565e74] hover:bg-[#f2f4f6]'
            }`}
          >
            {isRtl ? 'مكتبة التمارين' : 'Exercise Library'} ({exercises.length})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: CLIENTS MANAGEMENT LIST */}
      {/* ========================================================================= */}
      {dashboardSubView === 'clients' && (
        <div className="flex flex-col gap-3.5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white px-3.5 rounded-2xl border border-[#e0e3e5] shadow-xs">
              <Search className="w-4 h-4 text-[#565e74]" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder={isRtl ? 'ابحث باسم العميل، البريد، أو الباقة...' : 'Search client name or email...'}
                className="w-full h-11 bg-transparent text-xs font-medium text-[#191c1e] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: isRtl ? 'الكل' : 'All' },
                { id: 'needs_attention', label: isRtl ? 'تتطلب انتباه' : 'Needs Attention' },
                { id: 'pending_checkin', label: isRtl ? 'تقارير معلقة' : 'Pending Check-ins' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setClientFilter(f.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    clientFilter === f.id
                      ? 'bg-[#506600] text-white shadow-2xs'
                      : 'bg-white text-[#565e74] border border-[#e0e3e5] hover:bg-[#f2f4f6]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clients Cards Grid */}
          <div className="flex flex-col gap-3">
            {filteredClients.map((c) => {
              const assignedProg = trainingPrograms.find(
                (p) => p.id === c.currentTrainingProgramId || p.clientId === c.id
              );
              const assignedNut = nutritionPlans.find(
                (p) => p.id === c.currentNutritionPlanId || p.clientId === c.id
              );

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] hover:border-[#506600] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-1 ring-[#e0e3e5]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-[#191c1e]">
                          {c.name}
                        </h4>
                        <span className="text-[10px] font-bold text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20">
                          {c.complianceScore}% Adherence
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#565e74] mt-1">
                        <span>{c.weightKg} kg</span>
                        <span>•</span>
                        <span className="text-[#506600] font-bold">
                          🏋️ {assignedProg ? (typeof assignedProg.title === 'string' ? assignedProg.title : isRtl ? (assignedProg.title?.ar || assignedProg.title?.en) : (assignedProg.title?.en || assignedProg.title?.ar)) : 'No workout plan'}
                        </span>
                        <span>•</span>
                        <span className="text-[#0284c7] font-bold">
                          🥗 {assignedNut ? `${assignedNut.dailyCalories} kcal` : 'No diet plan'}
                        </span>
                      </div>

                      {c.statusAlert?.text && (
                        <span
                          className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${
                            c.statusAlert.type === 'weight_plateau'
                              ? 'text-[#d97706]'
                              : c.statusAlert.type === 'missed_workout'
                              ? 'text-[#ba1a1a]'
                              : 'text-[#506600]'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          {typeof c.statusAlert.text === 'string'
                            ? c.statusAlert.text
                            : isRtl
                            ? c.statusAlert.text?.ar || c.statusAlert.text?.en
                            : c.statusAlert.text?.en || c.statusAlert.text?.ar}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(c);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600] transition-colors shadow-2xs"
                    >
                      {isRtl ? 'إدارة الخطط والمتابعة' : 'Manage Client'}
                    </button>
                    <ArrowIcon className="w-4 h-4 text-[#565e74]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: TRAINING PROGRAMS REPOSITORY */}
      {/* ========================================================================= */}
      {dashboardSubView === 'programs' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#191c1e]">
                {isRtl ? 'مستودع البرامج التدريبية والقوالب' : 'Training Programs & Master Templates'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl
                  ? 'بناء وإدارة وتكرار البرامج والقوالب التدريبية وتعيينها للعملاء باستقلالية تامة.'
                  : 'Build, edit, clone, and deploy training programs with full trainer authority.'}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedProgramToEdit(null);
                setShowPlanBuilderModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إنشاء برنامج جديد' : 'New Training Program'}</span>
            </button>
          </div>

          {/* Program Filters */}
          <div className="flex items-center gap-2 border-b border-[#eceef0] pb-2">
            <button
              onClick={() => setProgramFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                programFilter === 'all'
                  ? 'bg-[#191c1e] text-white shadow-2xs'
                  : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
              }`}
            >
              {isRtl ? 'الكل' : 'All Programs'} ({trainingPrograms.length})
            </button>
            <button
              onClick={() => setProgramFilter('templates')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                programFilter === 'templates'
                  ? 'bg-[#191c1e] text-white shadow-2xs'
                  : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
              }`}
            >
              {isRtl ? 'القوالب الرئيسية' : 'Master Templates'} (
              {trainingPrograms.filter((p) => p.isTemplate || !p.clientId).length})
            </button>
            <button
              onClick={() => setProgramFilter('assigned')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                programFilter === 'assigned'
                  ? 'bg-[#191c1e] text-white shadow-2xs'
                  : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
              }`}
            >
              {isRtl ? 'المعينة للعملاء' : 'Assigned to Clients'} (
              {trainingPrograms.filter((p) => !p.isTemplate && p.clientId).length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingPrograms
              .filter((prog) => {
                if (programFilter === 'templates') return prog.isTemplate || !prog.clientId;
                if (programFilter === 'assigned') return !prog.isTemplate && prog.clientId;
                return true;
              })
              .map((prog) => {
                const assignedTo = clients.find((c) => c.id === prog.clientId);
                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3.5 hover:border-[#506600] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            prog.isTemplate || !prog.clientId
                              ? 'text-[#506600] bg-[#f7faf0] border-[#506600]/20'
                              : 'text-[#0284c7] bg-[#f0f9ff] border-[#bae6fd]'
                          }`}
                        >
                          {prog.isTemplate || !prog.clientId
                            ? isRtl
                              ? 'قالب رئيسي عام'
                              : 'Master Template'
                            : isRtl
                            ? `مخصص لـ: ${assignedTo?.name || 'عميل'}`
                            : `Assigned: ${assignedTo?.name || 'Client'}`}
                        </span>
                        <span className="text-xs font-bold text-[#565e74]">
                          {prog.durationWeeks} {isRtl ? 'أسابيع' : 'Weeks'}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-[#191c1e]">
                        {typeof prog.title === 'string'
                          ? prog.title
                          : isRtl
                          ? prog.title?.ar || prog.title?.en
                          : prog.title?.en || prog.title?.ar}
                      </h4>
                      {prog.description && (
                        <p className="text-xs text-[#565e74] mt-1 line-clamp-2">
                          {typeof prog.description === 'string'
                            ? prog.description
                            : isRtl
                            ? prog.description?.ar || prog.description?.en
                            : prog.description?.en || prog.description?.ar}
                        </p>
                      )}

                      {/* Days badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(prog.days || []).map((d, idx) => (
                          <span
                            key={d.id || idx}
                            className="px-2 py-0.5 rounded-lg bg-[#f2f4f6] text-[11px] font-bold text-[#191c1e]"
                          >
                            {typeof d.dayName === 'string'
                              ? d.dayName
                              : isRtl
                              ? d.dayName?.ar || d.dayName?.en || `اليوم ${idx + 1}`
                              : d.dayName?.en || d.dayName?.ar || `Day ${idx + 1}`}{' '}
                            ({d.exercises?.length || 0} ex)
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#f2f4f6]">
                      <button
                        onClick={() => {
                          setSelectedProgramToEdit(prog);
                          setShowPlanBuilderModal(true);
                        }}
                        className="flex-1 h-9 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center justify-center gap-1 hover:bg-[#b8e600] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'تعديل' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => {
                          duplicateTrainingProgram(prog.id);
                        }}
                        title="Duplicate Program"
                        className="px-3 h-9 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#e0e3e5] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isRtl ? 'استنساخ' : 'Duplicate'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setAssignModalProgram(prog);
                          setAssignTargetClientId(clients[0]?.id || '');
                        }}
                        title="Assign Independent Copy to Client"
                        className="px-3 h-9 rounded-xl bg-[#191c1e] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#2c3135] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isRtl ? 'تعيين' : 'Assign'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              isRtl
                                ? 'هل أنت متأكد من رغبتك في حذف هذا البرنامج؟'
                                : 'Are you sure you want to delete this training program?'
                            )
                          ) {
                            deleteTrainingProgram(prog.id);
                          }
                        }}
                        title="Delete Program"
                        className="w-9 h-9 rounded-xl bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center hover:bg-[#ba1a1a]/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: NUTRITION PLANS REPOSITORY */}
      {/* ========================================================================= */}
      {dashboardSubView === 'nutrition' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#191c1e]">
                {isRtl ? 'جميع خطط التغذية والقوالب' : 'All Nutrition Plans & Templates'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'بناء خطط الوجبات بالسعرات والماكروز وتعيينها للمشتركين.' : 'Configured daily diets, meals, and macro splits.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedNutritionToEdit(null);
                setShowNutritionBuilderModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إنشاء خطة تغذية' : 'Create Nutrition Plan'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionPlans.map((plan) => {
              const assignedTo = clients.find((c) => c.id === plan.clientId);
              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3.5 hover:border-[#0284c7] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase text-[#0284c7] bg-[#f0f9ff] px-2 py-0.5 rounded-md border border-[#0284c7]/20">
                        {plan.isTemplate ? (isRtl ? 'قالب عام' : 'Template') : (isRtl ? `مخصص لـ: ${assignedTo?.name || 'عميل'}` : `Assigned to: ${assignedTo?.name || 'Client'}`)}
                      </span>
                      <span className="text-xs font-black text-[#191c1e]">
                        {plan.dailyCalories} kcal
                      </span>
                    </div>

                    <h4 className="text-base font-black text-[#191c1e]">
                      {typeof plan.title === 'string'
                        ? plan.title
                        : isRtl
                        ? plan.title?.ar || plan.title?.en
                        : plan.title?.en || plan.title?.ar}
                    </h4>

                    {/* Macros breakdown */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div className="bg-[#f0f9ff] p-1.5 rounded-lg border border-[#bae6fd]">
                        <span className="text-[10px] text-[#0284c7] font-bold block">{isRtl ? 'بروتين' : 'P'}</span>
                        <span className="text-xs font-black text-[#0284c7]">{plan.proteinGrams}g</span>
                      </div>
                      <div className="bg-[#fffbeb] p-1.5 rounded-lg border border-[#fde68a]">
                        <span className="text-[10px] text-[#d97706] font-bold block">{isRtl ? 'كارب' : 'C'}</span>
                        <span className="text-xs font-black text-[#d97706]">{plan.carbsGrams}g</span>
                      </div>
                      <div className="bg-[#fff0f0] p-1.5 rounded-lg border border-[#ffdad6]">
                        <span className="text-[10px] text-[#ba1a1a] font-bold block">{isRtl ? 'دهون' : 'F'}</span>
                        <span className="text-xs font-black text-[#ba1a1a]">{plan.fatGrams}g</span>
                      </div>
                    </div>

                    <span className="text-[11px] text-[#565e74] mt-2 block">
                      {plan.meals.length} {isRtl ? 'وجبات مبرمجة' : 'meals programmed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#f2f4f6]">
                    <button
                      onClick={() => {
                        setSelectedNutritionToEdit(plan);
                        setShowNutritionBuilderModal(true);
                      }}
                      className="flex-1 h-9 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center justify-center gap-1 hover:bg-[#b8e600]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'تعديل الخطة الغذائية' : 'Edit Plan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: EXERCISE LIBRARY REPOSITORY */}
      {/* ========================================================================= */}
      {dashboardSubView === 'exercises' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#191c1e]">
                {isRtl ? 'مكتبة التمارين الشاملة' : 'Exercise Library Repository'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl
                  ? 'إدارة التمارين، شروحات الأداء، مقاطع الفيديو والمجموعات العضلية.'
                  : 'Manage exercises, video demonstrations, muscle targets, and coach cues.'}
              </p>
            </div>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة تمرين للمكتبة' : 'Add Exercise to Library'}</span>
            </button>
          </div>

          {/* Search & Muscle Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-[#565e74] absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder={isRtl ? 'بحث في التمارين أو المعدات...' : 'Search exercises or equipment...'}
                className="w-full h-11 pl-9 pr-3 rtl:pr-9 rtl:pl-3 rounded-2xl bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e] outline-none shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setExerciseMuscleFilter(muscle)}
                  className={`px-3 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
                    exerciseMuscleFilter === muscle
                      ? 'bg-[#191c1e] text-white shadow-2xs'
                      : 'bg-white text-[#565e74] border border-[#e0e3e5] hover:bg-[#f2f4f6]'
                  }`}
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises Grid */}
          {exercises.filter((ex) => {
            const q = (exerciseSearch || '').toLowerCase();
            const matchQuery =
              (ex.name && ex.name.toLowerCase().includes(q)) ||
              (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(q)) ||
              (ex.equipment && ex.equipment.toLowerCase().includes(q));
            const matchMuscle =
              exerciseMuscleFilter === 'All' ||
              ex.muscleGroup.toLowerCase() === exerciseMuscleFilter.toLowerCase();
            return matchQuery && matchMuscle;
          }).length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-[#e0e3e5] text-xs text-[#565e74]">
              {isRtl ? 'لم يتم العثور على أي تمارين مطابقة.' : 'No matching exercises found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises
                .filter((ex) => {
                  const q = (exerciseSearch || '').toLowerCase();
                  const matchQuery =
                    (ex.name && ex.name.toLowerCase().includes(q)) ||
                    (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(q)) ||
                    (ex.equipment && ex.equipment.toLowerCase().includes(q));
                  const matchMuscle =
                    exerciseMuscleFilter === 'All' ||
                    ex.muscleGroup.toLowerCase() === exerciseMuscleFilter.toLowerCase();
                  return matchQuery && matchMuscle;
                })
                .map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white rounded-3xl p-4 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-3 hover:border-[#506600] transition-all"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div
                        onClick={() => setPreviewExercise(ex)}
                        className="relative w-full h-36 rounded-2xl overflow-hidden bg-[#f2f4f6] cursor-pointer group shadow-2xs"
                      >
                        <img
                          src={ex.thumbnail}
                          alt={ex.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-[#191c1e] flex items-center justify-center shadow-md">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[10px] font-black uppercase text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20">
                            {ex.muscleGroup}
                          </span>
                          <span className="text-[10px] font-bold text-[#565e74] bg-[#f2f4f6] px-2 py-0.5 rounded-md">
                            {ex.equipment}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-[#191c1e] leading-snug">
                          {ex.name}
                        </h4>

                        {ex.instructions && (
                          <p className="text-xs text-[#565e74] mt-1.5 line-clamp-2">
                            {isRtl
                              ? ex.instructions?.ar?.[0] || ex.instructions?.en?.[0]
                              : ex.instructions?.en?.[0] || ex.instructions?.ar?.[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#f2f4f6]">
                      <button
                        onClick={() => setPreviewExercise(ex)}
                        className="flex-1 h-9 rounded-xl bg-[#f7faf0] text-[#506600] border border-[#506600]/20 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#edf5dc]"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'عرض الفيديو والشرح' : 'View Video & Form'}</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: RECIPE DATABASE */}
      {/* ========================================================================= */}
      {dashboardSubView === 'recipes' && (
        <TrainerRecipeDatabaseView
          onAddNewRecipe={() => setShowAddRecipeModal(true)}
          onEditRecipe={(r) => {
            setSelectedRecipeToEdit(r);
            setShowEditRecipeModal(true);
          }}
        />
      )}

      {/* Video Demonstration & Exercise Detail Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-[#eceef0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20">
                  {previewExercise.muscleGroup} • {previewExercise.equipment}
                </span>
                <h3 className="text-lg font-black text-[#191c1e] mt-1">
                  {previewExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewExercise(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player / Demonstration */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner flex items-center justify-center group">
              <img
                src={previewExercise.thumbnail}
                alt={previewExercise.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-bold text-white">
                  {previewExercise.videoUrl
                    ? previewExercise.videoUrl
                    : isRtl
                    ? 'فيديو الشرح التكنيكي عالي الدقة'
                    : 'HD Technique Video Demonstration'}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-[#565e74] uppercase">
                {isRtl ? 'خطوات الأداء والتوجيهات' : 'Form & Execution Steps'}
              </h4>
              <ul className="space-y-1.5">
                {((isRtl
                  ? previewExercise.instructions?.ar || previewExercise.instructions?.en
                  : previewExercise.instructions?.en || previewExercise.instructions?.ar) || [
                  'Perform with controlled form and full range of motion.'
                ]).map(
                  (stepText, sIdx) => (
                    <li key={sIdx} className="text-xs text-[#191c1e] flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#f2f4f6] text-[10px] font-black text-[#565e74] flex items-center justify-center shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <span>{stepText}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <button
              onClick={() => setPreviewExercise(null)}
              className="w-full h-11 rounded-xl bg-[#191c1e] text-white text-xs font-bold hover:bg-[#2c3135] mt-1"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4">
        <h3 className="text-base sm:text-lg font-bold text-[#191c1e]">
          {t('recentActivity')}
        </h3>

        <div className="flex flex-col gap-3.5">
          {activityFeed.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 pb-3 border-b border-[#eceef0] last:border-0 last:pb-0"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center shrink-0 mt-0.5">
                {act.type === 'workout_completed' ? (
                  <Dumbbell className="w-4 h-4" />
                ) : act.type === 'message_sent' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-extrabold text-[#191c1e]">
                    {typeof act.title === 'string'
                      ? act.title
                      : isRtl
                      ? act.title?.ar || act.title?.en
                      : act.title?.en || act.title?.ar}
                  </h5>
                  <span className="text-[10px] text-[#565e74]">
                    {typeof act.timeAgo === 'string'
                      ? act.timeAgo
                      : isRtl
                      ? act.timeAgo?.ar || act.timeAgo?.en
                      : act.timeAgo?.en || act.timeAgo?.ar}
                  </span>
                </div>
                {act.detail && (
                  <p className="text-xs text-[#565e74] mt-0.5">
                    {typeof act.detail === 'string'
                      ? act.detail
                      : isRtl
                      ? act.detail?.ar || act.detail?.en
                      : act.detail?.en || act.detail?.ar}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Master 7-Tab Client Management Workstation Modal */}
      {selectedClient && (
        <TrainerClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <TrainerAddClientModal
          isOpen={showAddClientModal}
          onClose={() => setShowAddClientModal(false)}
          onClientAdded={(newClientId) => {
            const newlyAdded = clients.find((c) => c.id === newClientId);
            if (newlyAdded) setSelectedClient(newlyAdded);
          }}
        />
      )}

      {/* Training Plan Builder Modal */}
      {showPlanBuilderModal && (
        <TrainerPlanBuilderModal
          isOpen={showPlanBuilderModal}
          onClose={() => {
            setShowPlanBuilderModal(false);
            setSelectedProgramToEdit(null);
          }}
          programToEdit={selectedProgramToEdit}
        />
      )}

      {/* Nutrition Plan Builder Modal */}
      {showNutritionBuilderModal && (
        <TrainerNutritionBuilderModal
          isOpen={showNutritionBuilderModal}
          onClose={() => {
            setShowNutritionBuilderModal(false);
            setSelectedNutritionToEdit(null);
          }}
          planToEdit={selectedNutritionToEdit}
        />
      )}

      {/* Add Custom Exercise Modal */}
      {showAddExerciseModal && (
        <TrainerAddExerciseModal
          isOpen={showAddExerciseModal}
          onClose={() => setShowAddExerciseModal(false)}
        />
      )}

      {/* Add Custom Recipe Modal */}
      {showAddRecipeModal && (
        <TrainerAddRecipeModal
          isOpen={showAddRecipeModal}
          onClose={() => setShowAddRecipeModal(false)}
        />
      )}

      {/* Edit Recipe Modal */}
      {showEditRecipeModal && (
        <TrainerEditRecipeModal
          recipe={selectedRecipeToEdit}
          isOpen={showEditRecipeModal}
          onClose={() => {
            setShowEditRecipeModal(false);
            setSelectedRecipeToEdit(null);
          }}
        />
      )}

      {/* Access Code Generation Tool Modal */}
      {showCodeGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-[#191c1e]">
                  {t('accessCodeManager')}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCodeGenerator(false);
                  setGeneratedCodeResult(null);
                }}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateCode} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {t('selectProduct')}
                </label>
                <select
                  value={selectedProductType}
                  onChange={(e: any) => setSelectedProductType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                >
                  <option value="full_access">{t('fullAccessProduct')} (All Features)</option>
                  <option value="training">{t('trainingProduct')}</option>
                  <option value="nutrition">{t('nutritionProduct')}</option>
                  <option value="recipe_book">{t('recipeBookProduct')}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-black text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('generateNewCode')}</span>
              </button>
            </form>

            {generatedCodeResult && (
              <div className="p-4 rounded-2xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col items-center text-center gap-2">
                <span className="text-xs font-bold text-[#506600] uppercase">
                  {t('codeCreated')}
                </span>
                <span className="text-xl font-black text-[#191c1e] tracking-widest bg-white px-4 py-2 rounded-xl border border-[#506600]/40 select-all">
                  {generatedCodeResult}
                </span>
                <span className="text-[11px] text-[#565e74]">
                  {isRtl ? 'يمكن للعميل إدخال هذا الكود لتفعيل اشتراكه فوراً' : 'Share this code with your client to redeem in app'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK ASSIGN PROGRAM TO CLIENT MODAL */}
      {/* ========================================================================= */}
      {assignModalProgram && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#506600]" />
                <div>
                  <h4 className="text-base font-black text-[#191c1e]">
                    {isRtl ? 'تعيين البرنامج لعميل' : 'Assign Program to Client'}
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    {isRtl
                      ? 'سيتم إنشاء نسخة مخصصة ومستقلة تماماً لهذا العميل'
                      : 'Creates an independent client copy; master template stays intact'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAssignModalProgram(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7faf0] border border-[#506600]/20 flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-[#506600]">
                {isRtl ? 'البرنامج المختار' : 'Selected Program'}
              </span>
              <h5 className="text-sm font-black text-[#191c1e]">
                {typeof assignModalProgram.title === 'string'
                  ? assignModalProgram.title
                  : isRtl
                  ? assignModalProgram.title?.ar || assignModalProgram.title?.en
                  : assignModalProgram.title?.en || assignModalProgram.title?.ar}
              </h5>
              <span className="text-[11px] text-[#565e74]">
                {assignModalProgram.days?.length || 0} {isRtl ? 'أيام تدريب' : 'workout days'} •{' '}
                {assignModalProgram.durationWeeks || 8} {isRtl ? 'أسابيع' : 'weeks'}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اختر العميل المستهدف' : 'Select Target Athlete / Client'}
              </label>
              <select
                value={assignTargetClientId}
                onChange={(e) => setAssignTargetClientId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:bg-white focus:ring-2 focus:ring-[#506600]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#eceef0]">
              <button
                type="button"
                onClick={() => setAssignModalProgram(null)}
                className="flex-1 h-11 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5]"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!assignTargetClientId}
                onClick={() => {
                  if (!assignTargetClientId) return;
                  assignTrainingProgramToClient(assignTargetClientId, assignModalProgram.id);
                  setAssignModalProgram(null);
                }}
                className="flex-1 h-11 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-black text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRtl ? 'تأكيد التعيين' : 'Deploy Copy to Client'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
