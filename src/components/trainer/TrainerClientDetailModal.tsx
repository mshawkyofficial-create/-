import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClientOverview,
  TrainingProgram,
  NutritionPlan,
  WorkoutDay,
  WorkoutExerciseItem,
  ClientMeal,
  ClientMealFood,
} from '../../types';
import {
  X,
  User,
  Dumbbell,
  Apple,
  TrendingUp,
  Clock,
  MessageSquare,
  FileText,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Flame,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  Search,
  Scale,
  Video,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';
import { TrainerPlanBuilderModal } from './TrainerPlanBuilderModal';
import { TrainerNutritionBuilderModal } from './TrainerNutritionBuilderModal';
import { ClientOnboardingModal } from '../ClientOnboardingModal';

interface TrainerClientDetailModalProps {
  client: ClientOverview;
  onClose: () => void;
}

type TabType = 'overview' | 'onboarding' | 'training' | 'nutrition' | 'progress' | 'checkins' | 'messages' | 'notes';

export const TrainerClientDetailModal: React.FC<TrainerClientDetailModalProps> = ({
  client,
  onClose,
}) => {
  const {
    trainingPrograms,
    nutritionPlans,
    exercises,
    ingredients,
    assignTrainingProgramToClient,
    assignNutritionPlanToClient,
    updateTrainingProgram,
    updateNutritionPlan,
    updateClient,
    trainerNotes,
    addTrainerNote,
    checkIns,
    trainerReviewCheckIn,
    messages,
    sendMessage,
    performanceHistory,
    language,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Currently assigned program and plan objects
  const assignedProgram =
    trainingPrograms.find((p) => p.id === client.currentTrainingProgramId) ||
    trainingPrograms.find((p) => p.clientId === client.id) ||
    trainingPrograms[0];

  const assignedPlan =
    nutritionPlans.find((p) => p.id === client.currentNutritionPlanId) ||
    nutritionPlans.find((p) => p.clientId === client.id) ||
    nutritionPlans[0];

  // Modals for deep building
  const [showProgramBuilder, setShowProgramBuilder] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [showNutritionBuilder, setShowNutritionBuilder] = useState(false);
  const [editingNutrition, setEditingNutrition] = useState<NutritionPlan | null>(null);

  // In-line exercise picker for Training tab
  const [selectedDayIdxForAddEx, setSelectedDayIdxForAddEx] = useState<number | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');

  // In-line food picker for Nutrition tab
  const [selectedMealIdxForAddFood, setSelectedMealIdxForAddFood] = useState<number | null>(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodGramsInput, setFoodGramsInput] = useState(100);

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteIsPrivate, setNewNoteIsPrivate] = useState(true);

  // Messages state
  const [messageInput, setMessageInput] = useState('');

  // Check-in review state
  const [selectedCheckInToReview, setSelectedCheckInToReview] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('Great progress this week! Increase deadlift weight by 5 lbs.');

  // Program selection dropdown
  const [isChangingProgram, setIsChangingProgram] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  // Filter client checkins and notes
  const clientCheckIns = checkIns.filter(
    (chk) => chk.clientId === client.id || (chk as any).userId === client.id || client.id === 'client_1'
  );
  const clientNotes = trainerNotes.filter(
    (note) => note.clientId === client.id || client.id === 'client_1'
  );

  // Filter messages between trainer and this specific client
  const clientMessages = messages.filter(
    (msg) =>
      (msg.recipientId === client.id && msg.senderId === 'trainer_alex_1') ||
      (msg.senderId === client.id && (msg.recipientId === 'trainer_alex_1' || !msg.recipientId)) ||
      (client.id === 'user_mahmoud_1' && (!msg.recipientId || msg.recipientId === 'trainer_alex_1' || msg.senderId === 'user_mahmoud_1'))
  );

  // Quick action to add exercise directly to current day
  const handleQuickAddExercise = (dayIdx: number, exId: string) => {
    if (!assignedProgram) return;
    const ex = exercises.find((item) => item.id === exId);
    if (!ex) return;

    const newItem: WorkoutExerciseItem = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: 3,
      reps: '10',
      restSec: 60,
      tempo: '2-0-1-0',
      trainerNote: (isRtl ? ex.instructions?.ar?.[0] : ex.instructions?.en?.[0]) || '',
      customVideoUrl: ex.videoUrl,
      isCompleted: false,
    };

    const updatedDays = assignedProgram.days.map((d, idx) => {
      if (idx !== dayIdx) return d;
      return { ...d, exercises: [...d.exercises, newItem] };
    });

    updateTrainingProgram(assignedProgram.id, { days: updatedDays });
    setSelectedDayIdxForAddEx(null);
  };

  // Quick action to remove exercise
  const handleQuickRemoveExercise = (dayIdx: number, exIdx: number) => {
    if (!assignedProgram) return;
    const updatedDays = assignedProgram.days.map((d, idx) => {
      if (idx !== dayIdx) return d;
      return { ...d, exercises: d.exercises.filter((_, i) => i !== exIdx) };
    });
    updateTrainingProgram(assignedProgram.id, { days: updatedDays });
  };

  // Quick action to add food to meal
  const handleQuickAddFood = (mealIdx: number, ingId: string, grams: number) => {
    if (!assignedPlan) return;
    const ing = ingredients.find((item) => item.id === ingId);
    if (!ing) return;

    const ratio = grams / 100;
    const newFood: ClientMealFood = {
      id: 'f_' + Date.now(),
      ingredientId: ing.id,
      foodName: { en: ing.name?.en || '', ar: ing.name?.ar || '' },
      amountGrams: grams,
      calories: Math.round(ing.caloriesPer100g * ratio),
      protein: Number((ing.proteinPer100g * ratio).toFixed(1)),
      carbs: Number((ing.carbsPer100g * ratio).toFixed(1)),
      fat: Number((ing.fatPer100g * ratio).toFixed(1)),
    };

    const updatedMeals = assignedPlan.meals.map((m, idx) => {
      if (idx !== mealIdx) return m;
      return { ...m, foods: [...m.foods, newFood] };
    });

    updateNutritionPlan(assignedPlan.id, { meals: updatedMeals });
    setSelectedMealIdxForAddFood(null);
  };

  // Quick action to remove food
  const handleQuickRemoveFood = (mealIdx: number, fIdx: number) => {
    if (!assignedPlan) return;
    const updatedMeals = assignedPlan.meals.map((m, idx) => {
      if (idx !== mealIdx) return m;
      return { ...m, foods: m.foods.filter((_, i) => i !== fIdx) };
    });
    updateNutritionPlan(assignedPlan.id, { meals: updatedMeals });
  };

  // Note submit
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addTrainerNote(client.id, newNoteText.trim(), newNoteIsPrivate);
    setNewNoteText('');
  };

  // Message submit
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(messageInput.trim(), undefined, undefined, client.id);
    setMessageInput('');
  };

  // Check-in review submit
  const handleSaveReview = (checkInId: string) => {
    trainerReviewCheckIn(checkInId, reviewFeedback);
    setSelectedCheckInToReview(null);
  };

  // Clone program
  const handleCloneProgram = () => {
    if (!assignedProgram) return;
    setEditingProgram({
      ...assignedProgram,
      id: '',
      title: {
        en: `${assignedProgram.title.en} (Copy for ${client.name})`,
        ar: `${assignedProgram.title.ar} (نسخة مخصصة لـ ${client.name})`,
      },
      clientId: client.id,
    });
    setShowProgramBuilder(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-[#eceef0] h-[94vh] flex flex-col overflow-hidden">
        {/* Athlete Top Bar */}
        <div className="p-4 sm:p-5 bg-[#f7faf0] border-b border-[#506600]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3.5">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#ccff00] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#191c1e]">{client.name}</h2>
                <span className="text-[10px] font-black text-[#506600] bg-[#ccff00]/40 px-2 py-0.5 rounded-md">
                  {client.complianceScore}% {isRtl ? 'التزام' : 'Adherence'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#565e74] mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {client.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {client.phone || '+971 50 123 4567'}
                </span>
                <span className="text-[11px] font-bold text-[#191c1e] bg-white px-2 py-0.5 rounded border border-[#e0e3e5]">
                  {client.activeProducts.join(' • ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="text-right sm:text-start mr-2">
              <span className="text-[10px] uppercase font-bold text-[#565e74] block">
                {isRtl ? 'الوزن الحالي / المستهدف' : 'Weight / Target'}
              </span>
              <span className="text-xs font-black text-[#191c1e]">
                {client.weightKg} kg → {client.targetWeightKg} kg
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white text-[#191c1e] flex items-center justify-center hover:bg-[#f2f4f6] border border-[#e0e3e5] shadow-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (8 Required Sections) */}
        <div className="flex items-center gap-1 px-4 sm:px-6 bg-white border-b border-[#eceef0] overflow-x-auto shrink-0 py-2">
          {[
            { id: 'overview' as TabType, label: isRtl ? 'نظرة عامة' : 'Overview', icon: User },
            { id: 'onboarding' as TabType, label: isRtl ? 'الملف الأولي' : 'Onboarding Profile', icon: Sparkles },
            { id: 'training' as TabType, label: isRtl ? 'التدريب' : 'Training', icon: Dumbbell },
            { id: 'nutrition' as TabType, label: isRtl ? 'التغذية' : 'Nutrition', icon: Apple },
            { id: 'progress' as TabType, label: isRtl ? 'التقدم' : 'Progress', icon: TrendingUp },
            { id: 'checkins' as TabType, label: isRtl ? 'التقارير والمتابعة' : 'Check-ins', icon: Clock },
            { id: 'messages' as TabType, label: isRtl ? 'الرسائل' : 'Messages', icon: MessageSquare },
            { id: 'notes' as TabType, label: isRtl ? 'الملاحظات' : 'Notes', icon: FileText },
          ].map((tItem) => {
            const Icon = tItem.icon;
            const isActive = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                onClick={() => setActiveTab(tItem.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#191c1e] text-white shadow-2xs'
                    : 'text-[#565e74] hover:text-[#191c1e] hover:bg-[#f2f4f6]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ccff00]' : ''}`} />
                <span>{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fafbfc]">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              {/* Alert Status Card */}
              {client.statusAlert && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    client.statusAlert.type === 'missed_workout'
                      ? 'bg-[#fff0f0] border-[#ffdad6] text-[#ba1a1a]'
                      : client.statusAlert.type === 'weight_plateau'
                      ? 'bg-[#fffbeb] border-[#fde68a] text-[#d97706]'
                      : 'bg-[#f0f9ff] border-[#bae6fd] text-[#0284c7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-extrabold uppercase">
                        {isRtl ? 'حالة التنبيه الحالية' : 'Active Coach Alert'}
                      </h4>
                      <p className="text-xs font-medium">
                        {isRtl ? client.statusAlert.text.ar : client.statusAlert.text.en}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-xs font-black shadow-2xs hover:bg-[#f2f4f6] text-[#191c1e]"
                  >
                    {isRtl ? 'مراسلة العميل' : 'Reach Out'}
                  </button>
                </div>
              )}

              {/* 2 Big Cards: Assigned Training & Assigned Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Training Program Overview */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#506600] uppercase tracking-wider flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4" />
                        {isRtl ? 'برنامج التدريب المعتمد' : 'Assigned Training Program'}
                      </span>
                      <span className="text-[10px] font-bold text-[#565e74] bg-[#f2f4f6] px-2 py-0.5 rounded-md">
                        {assignedProgram?.durationWeeks || 8} {isRtl ? 'أسابيع' : 'Weeks'}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#191c1e]">
                      {assignedProgram
                        ? isRtl
                          ? assignedProgram.title.ar
                          : assignedProgram.title.en
                        : isRtl
                        ? 'لم يتم تعيين برنامج بعد'
                        : 'No Program Assigned'}
                    </h3>
                    <p className="text-xs text-[#565e74] mt-1">
                      {assignedProgram?.days?.length || 0} {isRtl ? 'أيام تمرين أسبوعياً' : 'training days configured'}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(assignedProgram?.days || []).map((d, i) => (
                        <span
                          key={d.id || i}
                          className="px-2 py-1 rounded-lg bg-[#f7faf0] text-[11px] font-bold text-[#506600] border border-[#506600]/20"
                        >
                          {typeof d.dayName === 'string'
                            ? d.dayName
                            : isRtl
                            ? d.dayName?.ar || d.dayName?.en || `اليوم ${i + 1}`
                            : d.dayName?.en || d.dayName?.ar || `Day ${i + 1}`}: {d.exercises?.length || 0} {isRtl ? 'تمارين' : 'ex'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#f2f4f6]">
                    <button
                      onClick={() => setActiveTab('training')}
                      className="flex-1 h-10 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs flex items-center justify-center gap-1.5 hover:bg-[#b8e600] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إدارة وتعديل التمارين' : 'Manage Training Plan'}</span>
                    </button>
                  </div>
                </div>

                {/* Nutrition Plan Overview */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0284c7] uppercase tracking-wider flex items-center gap-1.5">
                        <Apple className="w-4 h-4" />
                        {isRtl ? 'الخطة الغذائية المعتمدة' : 'Assigned Nutrition Plan'}
                      </span>
                      <span className="text-[10px] font-bold text-[#565e74] bg-[#f2f4f6] px-2 py-0.5 rounded-md">
                        {assignedPlan?.dailyCalories || 2200} kcal
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#191c1e]">
                      {assignedPlan
                        ? typeof assignedPlan.title === 'string'
                          ? assignedPlan.title
                          : isRtl
                          ? assignedPlan.title?.ar || assignedPlan.title?.en || 'الخطة الغذائية'
                          : assignedPlan.title?.en || assignedPlan.title?.ar || 'Nutrition Plan'
                        : isRtl
                        ? 'لم يتم تعيين خطة بعد'
                        : 'No Nutrition Plan Assigned'}
                    </h3>

                    {/* Macro pill summary */}
                    <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                      <div className="bg-[#f0f9ff] p-2 rounded-xl border border-[#bae6fd]">
                        <span className="text-[10px] text-[#0284c7] font-bold block">{isRtl ? 'بروتين' : 'Protein'}</span>
                        <span className="text-xs font-black text-[#0284c7]">{assignedPlan?.proteinGrams || 160}g</span>
                      </div>
                      <div className="bg-[#fffbeb] p-2 rounded-xl border border-[#fde68a]">
                        <span className="text-[10px] text-[#d97706] font-bold block">{isRtl ? 'كارب' : 'Carbs'}</span>
                        <span className="text-xs font-black text-[#d97706]">{assignedPlan?.carbsGrams || 240}g</span>
                      </div>
                      <div className="bg-[#fff0f0] p-2 rounded-xl border border-[#ffdad6]">
                        <span className="text-[10px] text-[#ba1a1a] font-bold block">{isRtl ? 'دهون' : 'Fat'}</span>
                        <span className="text-xs font-black text-[#ba1a1a]">{assignedPlan?.fatGrams || 65}g</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#f2f4f6]">
                    <button
                      onClick={() => setActiveTab('nutrition')}
                      className="flex-1 h-10 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs flex items-center justify-center gap-1.5 hover:bg-[#b8e600] transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'إدارة وتعديل الوجبات' : 'Manage Nutrition Plan'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Progress / Activity mini-cards */}
              <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-[#191c1e]">
                    {isRtl ? 'سجل المتابعة والنشاط الأخير' : 'Latest Check-ins & Coach Notes'}
                  </h4>
                  <button
                    onClick={() => setActiveTab('checkins')}
                    className="text-xs font-bold text-[#506600] hover:underline"
                  >
                    {isRtl ? 'عرض الكل' : 'View all'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#f7faf0] border border-[#506600]/20 flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#506600]">
                      {isRtl ? 'آخر تقرير أسبوعي' : 'Last Submitted Check-in'}
                    </span>
                    <span className="text-xs font-black text-[#191c1e]">
                      {clientCheckIns[0] ? `${clientCheckIns[0].weight} kg (${clientCheckIns[0].date})` : 'Pending review'}
                    </span>
                    <p className="text-[11px] text-[#565e74] line-clamp-1">
                      {clientCheckIns[0]?.notes || 'Energy high, workouts completed on schedule.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#565e74]">
                      {isRtl ? 'آخر ملاحظة للكوتش' : 'Latest Coach Note'}
                    </span>
                    <span className="text-xs font-black text-[#191c1e]">
                      {clientNotes[0]?.date || 'Today'}
                    </span>
                    <p className="text-[11px] text-[#565e74] line-clamp-1">
                      {clientNotes[0]?.content || 'Shoulder mobility progressing well with warm-up routine.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ONBOARDING PROFILE (INTAKE ASSESSMENT & BASELINE) */}
          {/* ========================================================================= */}
          {activeTab === 'onboarding' && (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20">
                      {isRtl ? 'استبيان وبيانات التسجيل الأولي' : 'Client Intake & Onboarding Profile'}
                    </span>
                    <span className="text-xs font-bold text-[#565e74]">
                      {client.onboardingData?.completedAt
                        ? new Date(client.onboardingData.completedAt).toLocaleDateString()
                        : isRtl
                        ? 'مكتمل'
                        : 'Completed'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#191c1e] mt-1">
                    {client.name} — {isRtl ? 'الملف الرياضي والغذائي الكامل' : 'Full Fitness & Health Profile'}
                  </h3>
                </div>

                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تعديل أو ملء الاستبيان' : 'Edit Intake Profile'}</span>
                </button>
              </div>

              {/* 4 Core Dimensions of Onboarding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. About & Physical Parameters */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0]">
                    <User className="w-4 h-4 text-[#506600]" />
                    <h4 className="text-sm font-black text-[#191c1e]">
                      {isRtl ? 'البيانات الشخصية والهدف' : 'Personal & Physical Stats'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'العمر' : 'Age'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.age || client.onboardingData?.about?.age || 27} {isRtl ? 'سنة' : 'yrs'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'المستوى' : 'Level'}</span>
                      <span className="font-extrabold text-[#191c1e] capitalize">{client.onboardingData?.trainingLevel || client.onboardingData?.about?.gender || 'Intermediate'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'الطول' : 'Height'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.heightCm || client.heightCm} cm</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'الوزن الحالي والهدف' : 'Weight / Target'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.currentWeightKg || client.weightKg} kg → {client.targetWeightKg} kg</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f7faf0] border border-[#506600]/20 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-[#506600]">{isRtl ? 'الهدف الرئيسي' : 'Primary Goal'}</span>
                    <span className="text-xs font-black text-[#191c1e] capitalize">
                      {client.onboardingData?.goal || client.onboardingData?.about?.fitnessGoal || client.goal}
                      {client.onboardingData?.customGoalText ? ` (${client.onboardingData.customGoalText})` : ''}
                    </span>
                    {client.onboardingData?.trainingExperience && (
                      <span className="text-[11px] text-[#565e74]">{isRtl ? 'الخبرة السابقة:' : 'Experience:'} {client.onboardingData.trainingExperience}</span>
                    )}
                  </div>
                </div>

                {/* 2. Training Schedule & Preferences */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0]">
                    <Dumbbell className="w-4 h-4 text-[#506600]" />
                    <h4 className="text-sm font-black text-[#191c1e]">
                      {isRtl ? 'تفضيلات التدريب والجدول' : 'Training Preferences'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'أيام التدريب' : 'Training Days'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.trainingDaysPerWeek || client.onboardingData?.training?.daysPerWeek || 4} {isRtl ? 'أيام' : 'days/wk'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'أيام الراحة' : 'Rest Days'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.restDaysPerWeek || 3} {isRtl ? 'أيام' : 'days'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'مدة الحصة' : 'Session Duration'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.workoutDurationMin || client.onboardingData?.training?.sessionDurationMin || 60} min</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'وقت التمرين المفضل' : 'Preferred Time'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.preferredWorkoutTime || 'Evening'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f2f4f6] text-xs flex flex-col gap-1.5">
                    {client.onboardingData?.availableEquipment && client.onboardingData.availableEquipment.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'المعدات المتاحة:' : 'Available Equipment:'}</span>
                        <span className="font-bold text-[#191c1e]">{client.onboardingData.availableEquipment.join(', ')}</span>
                      </div>
                    )}
                    {client.onboardingData?.exercisesToAvoid && (
                      <div>
                        <span className="text-[10px] font-bold text-[#ba1a1a] block">{isRtl ? 'تمارين يفضل تجنبها:' : 'Exercises to Avoid:'}</span>
                        <span className="font-bold text-[#191c1e]">{client.onboardingData.exercisesToAvoid}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Nutrition & Dietary Preferences */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0]">
                    <Apple className="w-4 h-4 text-[#506600]" />
                    <h4 className="text-sm font-black text-[#191c1e]">
                      {isRtl ? 'التفضيلات الغذائية والحساسيات' : 'Nutrition & Diet Profile'}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'نمط الأكل' : 'Eating Style'}</span>
                      <span className="font-extrabold text-[#191c1e] capitalize">{client.onboardingData?.eatingStyle || client.onboardingData?.nutrition?.dietPreference || 'Home Cooked'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{isRtl ? 'عدد الوجبات' : 'Meals / Day'}</span>
                      <span className="font-extrabold text-[#191c1e]">{client.onboardingData?.mealsPerDay || client.onboardingData?.nutrition?.mealsPerDay || 3} {isRtl ? 'وجبات' : 'meals'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#eceef0] text-xs flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#ba1a1a] block uppercase">{isRtl ? 'الحساسية أو عدم التحمل' : 'Allergies / Intolerances'}</span>
                      <span className="font-bold text-[#191c1e]">{client.onboardingData?.allergies || (Array.isArray(client.onboardingData?.nutrition?.allergies) ? client.onboardingData.nutrition.allergies.join(', ') : (isRtl ? 'لا يوجد' : 'None reported'))}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#565e74] block uppercase">{isRtl ? 'الأطعمة غير المفضلة / الممنوعة' : 'Foods to Avoid / Disliked'}</span>
                      <span className="font-bold text-[#191c1e]">{client.onboardingData?.foodsToAvoid || (Array.isArray(client.onboardingData?.nutrition?.dislikedFoods) ? client.onboardingData.nutrition.dislikedFoods.join(', ') : (isRtl ? 'لا يوجد' : 'None'))}</span>
                    </div>
                    {client.onboardingData?.preferredFoods && (
                      <div>
                        <span className="text-[10px] font-bold text-[#506600] block uppercase">{isRtl ? 'الأطعمة المفضلة' : 'Preferred Foods'}</span>
                        <span className="font-bold text-[#191c1e]">{client.onboardingData.preferredFoods}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Health, Injuries & Medical Clearances */}
                <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#eceef0]">
                    <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />
                    <h4 className="text-sm font-black text-[#191c1e]">
                      {isRtl ? 'الإصابات والملاحظات الطبية' : 'Injuries & Health Conditions'}
                    </h4>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#fff0f0] border border-[#ffdad6] flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase text-[#ba1a1a]">{isRtl ? 'حالة الإصابات والمحددات' : 'Reported Injuries & Limitations'}</span>
                    <p className="text-xs font-bold text-[#191c1e]">
                      {client.onboardingData?.hasInjuries
                        ? client.onboardingData.injuryDescription || 'Injury reported.'
                        : client.onboardingData?.injuries?.hasInjuries
                        ? client.onboardingData.injuries.injuryDetails || 'Past shoulder impingement, avoid heavy behind-the-neck presses.'
                        : (isRtl ? 'لا توجد إصابات مسجلة.' : 'No active injuries or restrictions reported.')}
                    </p>
                  </div>

                  {client.onboardingData?.nutritionNotes && (
                    <div className="p-3 rounded-xl bg-[#fafbfc] border border-[#eceef0] text-xs">
                      <span className="text-[10px] font-bold text-[#565e74] block uppercase">{isRtl ? 'ملاحظات التغذية الإضافية' : 'Nutrition Notes'}</span>
                      <span className="font-medium text-[#191c1e]">{client.onboardingData.nutritionNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Baseline Measurements */}
              <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#506600]" />
                    <h4 className="text-sm font-black text-[#191c1e]">
                      {isRtl ? 'القياسات البدنية الأولية (Baseline Measurements)' : 'Baseline Body Circumference Measurements'}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center">
                  {[
                    { label: isRtl ? 'الخصر' : 'Waist', val: client.onboardingData?.baselineMeasurements?.waistCm || client.onboardingData?.baseline?.waistCm || 82 },
                    { label: isRtl ? 'البطن' : 'Abdomen', val: client.onboardingData?.baselineMeasurements?.abdomenCm || client.onboardingData?.baseline?.abdomenCm || 86 },
                    { label: isRtl ? 'الصدر' : 'Chest', val: client.onboardingData?.baselineMeasurements?.chestCm || client.onboardingData?.baseline?.chestCm || 102 },
                    { label: isRtl ? 'الأرداف' : 'Hips', val: client.onboardingData?.baselineMeasurements?.hipsCm || client.onboardingData?.baseline?.hipsCm || 98 },
                    { label: isRtl ? 'الذراع' : 'Arm', val: client.onboardingData?.baselineMeasurements?.armCm || client.onboardingData?.baseline?.armCm || 36 },
                    { label: isRtl ? 'الفخذ' : 'Thigh', val: client.onboardingData?.baselineMeasurements?.thighCm || client.onboardingData?.baseline?.thighCm || 58 },
                    { label: isRtl ? 'الساق' : 'Calf', val: client.onboardingData?.baselineMeasurements?.calfCm || client.onboardingData?.baseline?.calfCm || 38 },
                  ].map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#fafbfc] border border-[#eceef0]">
                      <span className="text-[10px] font-bold text-[#565e74] block">{m.label}</span>
                      <span className="text-sm font-black text-[#191c1e]">{m.val} <span className="text-[10px] font-normal text-[#565e74]">cm</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TRAINING (REAL TRAINING PROGRAM MANAGEMENT) */}
          {/* ========================================================================= */}
          {activeTab === 'training' && (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              {/* Program Action Toolbar */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#506600] uppercase tracking-wider">
                    {isRtl ? 'البرنامج التدريبي النشط' : 'Current Active Program'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#191c1e]">
                    {assignedProgram
                      ? typeof assignedProgram.title === 'string'
                        ? assignedProgram.title
                        : isRtl
                        ? assignedProgram.title?.ar || assignedProgram.title?.en || 'البرنامج التدريبي'
                        : assignedProgram.title?.en || assignedProgram.title?.ar || 'Training Program'
                      : 'No Program'}
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    {assignedProgram?.days?.length || 0} {isRtl ? 'أيام تدريب' : 'training days'} • {assignedProgram?.durationWeeks || 8} {isRtl ? 'أسابيع' : 'weeks protocol'}
                  </p>
                </div>

                {/* Quick Builder / Assign buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProgram(assignedProgram);
                      setShowProgramBuilder(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'فتح محرر الخطة الشامل' : 'Full Plan Builder'}</span>
                  </button>

                  <button
                    onClick={() => setIsChangingProgram(!isChangingProgram)}
                    className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e0e3e5] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تغيير الخطة' : 'Switch Program'}</span>
                  </button>

                  <button
                    onClick={handleCloneProgram}
                    className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e0e3e5] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'استنساخ كقالب' : 'Duplicate'}</span>
                  </button>
                </div>
              </div>

              {/* Switch Program Dropdown */}
              {isChangingProgram && (
                <div className="bg-[#f7faf0] rounded-2xl p-4 border border-[#506600]/30 flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#506600] uppercase">
                    {isRtl ? 'اختر خطة تدريبية لتعيينها لهذا العميل فوراً:' : 'Assign a Different Program to this Client:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trainingPrograms.map((prog) => (
                      <div
                        key={prog.id}
                        onClick={() => {
                          assignTrainingProgramToClient(client.id, prog.id);
                          setIsChangingProgram(false);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          prog.id === assignedProgram?.id
                            ? 'bg-[#ccff00]/40 border-[#506600] font-black'
                            : 'bg-white border-[#e0e3e5] hover:border-[#506600]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#191c1e]">
                            {typeof prog.title === 'string'
                              ? prog.title
                              : isRtl
                              ? prog.title?.ar || prog.title?.en
                              : prog.title?.en || prog.title?.ar}
                          </h5>
                          <span className="text-[10px] text-[#565e74]">
                            {prog.days?.length || 0} days • {prog.durationWeeks} weeks
                          </span>
                        </div>
                        {prog.id === assignedProgram?.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#506600]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Days & Exercise Inspector */}
              {assignedProgram && (
                <div className="flex flex-col gap-4">
                  {(assignedProgram.days || []).map((day, dIdx) => (
                    <div
                      key={day.id || dIdx}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3"
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-xl bg-[#ccff00] text-xs font-black text-[#191c1e]">
                            {typeof day.dayName === 'string'
                              ? day.dayName
                              : isRtl
                              ? day.dayName?.ar || day.dayName?.en || `اليوم ${dIdx + 1}`
                              : day.dayName?.en || day.dayName?.ar || `Day ${dIdx + 1}`}
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-[#191c1e]">
                              {typeof day.title === 'string'
                                ? day.title
                                : isRtl
                                ? day.title?.ar || day.title?.en || 'تمرين'
                                : day.title?.en || day.title?.ar || 'Workout'}
                            </h4>
                            <span className="text-[11px] text-[#565e74]">
                              {day.durationMin} min • {day.caloriesBurn} kcal
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedDayIdxForAddEx(dIdx)}
                          className="px-3 py-1.5 rounded-xl bg-[#191c1e] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#2c3135] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'إضافة تمرين' : 'Add Exercise'}</span>
                        </button>
                      </div>

                      {/* Exercises in this Day */}
                      <div className="flex flex-col gap-2">
                        {day.exercises.map((ex, exIdx) => {
                          const exLogs = (performanceHistory || []).filter((l) => l.exerciseId === ex.exerciseId);
                          const latestLog = exLogs[0];

                          return (
                            <div
                              key={ex.exerciseId + '_' + exIdx}
                              className="bg-[#f7f9fb] rounded-2xl p-3.5 border border-[#e0e3e5] flex flex-col gap-2"
                            >
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="flex items-start gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-white text-[11px] font-black text-[#565e74] flex items-center justify-center border border-[#e0e3e5] mt-0.5">
                                    {exIdx + 1}
                                  </span>
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-black text-[#191c1e]">
                                      {ex.exerciseName}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#565e74] mt-0.5">
                                      <span className="bg-white px-2 py-0.5 rounded border border-[#e0e3e5] text-[#191c1e] font-bold">
                                        {ex.sets} {isRtl ? 'مجموعات' : 'Sets'} × {ex.reps} {isRtl ? 'تكرار' : 'Reps'}
                                      </span>
                                      <span>
                                        {isRtl ? 'الراحة' : 'Rest'}: {ex.restSec}s
                                      </span>
                                      <span>
                                        {isRtl ? 'الإيقاع' : 'Tempo'}: {ex.tempo || '3-0-1-0'}
                                      </span>
                                    </div>
                                    {ex.trainerNote && (
                                      <p className="text-[11px] text-[#506600] font-medium bg-[#f7faf0] px-2.5 py-1 rounded-lg border border-[#506600]/20 mt-1.5 flex items-center gap-1.5">
                                        <span>💡</span>
                                        <span>{ex.trainerNote}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleQuickRemoveExercise(dIdx, exIdx)}
                                  className="w-7 h-7 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center hover:bg-[#ba1a1a]/20 shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Latest Client Logged Performance */}
                              {latestLog && (
                                <div className="mt-1 pt-2 border-t border-[#e0e3e5]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
                                  <div className="flex items-center gap-1.5 text-[#565e74]">
                                    <span className="font-bold text-[#191c1e]">
                                      {isRtl ? 'آخر أداء مسجل للعميل' : 'Client Last Logged'}:
                                    </span>
                                    <span className="text-[#506600] font-black">
                                      {(latestLog.sets || [])
                                        .filter((s) => s.isCompleted || s.weightKg !== undefined)
                                        .map((s) => `${s.weightKg ?? '-'}kg × ${s.repsCompleted ?? '-'}`)
                                        .join(', ') || (isRtl ? 'تم إكمال التمرين' : 'Completed')}
                                    </span>
                                    <span className="text-[#565e74]/70">({latestLog.workoutDate || (latestLog as any).date || ''})</span>
                                  </div>
                                  {latestLog.clientNote && (
                                    <span className="text-[10px] italic text-[#565e74] bg-white px-2 py-0.5 rounded border border-[#e0e3e5]">
                                      💬 "{latestLog.clientNote}"
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Exercise Picker for this Day */}
                      {selectedDayIdxForAddEx === dIdx && (
                        <div className="p-3 bg-[#f7faf0] rounded-2xl border border-[#506600]/30 flex flex-col gap-2.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#506600]">
                              {isRtl ? 'اختر تمريناً لإضافته لهذا اليوم:' : 'Select Exercise to Add:'}
                            </span>
                            <button
                              onClick={() => setSelectedDayIdxForAddEx(null)}
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          <input
                            type="text"
                            value={exerciseSearch}
                            onChange={(e) => setExerciseSearch(e.target.value)}
                            placeholder={isRtl ? 'ابحث باسم التمرين...' : 'Search exercise library...'}
                            className="w-full h-8 px-3 rounded-xl bg-white text-xs border border-[#e0e3e5] outline-none"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                            {exercises
                              .filter((e) => {
                                const q = exerciseSearch.toLowerCase();
                                return (
                                  (e.name && e.name.toLowerCase().includes(q)) ||
                                  (e.muscleGroup && e.muscleGroup.toLowerCase().includes(q))
                                );
                              })
                              .map((ex) => (
                                <div
                                  key={ex.id}
                                  onClick={() => handleQuickAddExercise(dIdx, ex.id)}
                                  className="p-2 rounded-xl bg-white border border-[#e0e3e5] hover:border-[#ccff00] flex items-center justify-between cursor-pointer text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-[#191c1e]">
                                      {ex.name}
                                    </span>
                                    <span className="text-[10px] text-[#565e74] block">
                                      {ex.muscleGroup}
                                    </span>
                                  </div>
                                  <Plus className="w-3.5 h-3.5 text-[#506600]" />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: NUTRITION (REAL NUTRITION PLAN MANAGEMENT) */}
          {/* ========================================================================= */}
          {activeTab === 'nutrition' && (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              {/* Plan Action Toolbar */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#0284c7] uppercase tracking-wider">
                    {isRtl ? 'الخطة الغذائية النشطة' : 'Current Active Nutrition Plan'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#191c1e]">
                    {assignedPlan
                      ? typeof assignedPlan.title === 'string'
                        ? assignedPlan.title
                        : isRtl
                        ? assignedPlan.title?.ar || assignedPlan.title?.en || 'الخطة الغذائية'
                        : assignedPlan.title?.en || assignedPlan.title?.ar || 'Nutrition Plan'
                      : 'No Plan'}
                  </h3>
                  <p className="text-xs text-[#565e74]">
                    {assignedPlan?.dailyCalories || 2200} kcal • P: {assignedPlan?.proteinGrams || 160}g • C: {assignedPlan?.carbsGrams || 250}g • F: {assignedPlan?.fatGrams || 70}g
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingNutrition(assignedPlan);
                      setShowNutritionBuilder(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] transition-colors shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'فتح محرر التغذية الشامل' : 'Full Nutrition Builder'}</span>
                  </button>

                  <button
                    onClick={() => setIsChangingPlan(!isChangingPlan)}
                    className="px-3.5 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold flex items-center gap-1.5 hover:bg-[#e0e3e5] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تغيير الخطة' : 'Switch Plan'}</span>
                  </button>
                </div>
              </div>

              {/* Switch Plan Dropdown */}
              {isChangingPlan && (
                <div className="bg-[#f0f9ff] rounded-2xl p-4 border border-[#bae6fd] flex flex-col gap-2">
                  <span className="text-xs font-bold text-[#0284c7] uppercase">
                    {isRtl ? 'اختر خطة غذائية لتعيينها فوراً للعميل:' : 'Assign a Different Nutrition Plan:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {nutritionPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => {
                          assignNutritionPlanToClient(client.id, plan.id);
                          setIsChangingPlan(false);
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          plan.id === assignedPlan?.id
                            ? 'bg-[#ccff00]/40 border-[#506600] font-black'
                            : 'bg-white border-[#e0e3e5] hover:border-[#0284c7]'
                        }`}
                      >
                        <div>
                          <h5 className="text-xs font-bold text-[#191c1e]">
                            {typeof plan.title === 'string'
                              ? plan.title
                              : isRtl
                              ? plan.title?.ar || plan.title?.en
                              : plan.title?.en || plan.title?.ar}
                          </h5>
                          <span className="text-[10px] text-[#565e74]">
                            {plan.dailyCalories} kcal • {plan.meals?.length || 0} meals
                          </span>
                        </div>
                        {plan.id === assignedPlan?.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#506600]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meals & Foods Inspector */}
              {assignedPlan && (
                <div className="flex flex-col gap-4">
                  {(assignedPlan.meals || []).map((meal, mIdx) => (
                    <div
                      key={meal.id || mIdx}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-xl bg-[#f0f9ff] text-xs font-black text-[#0284c7]">
                            {meal.timing || `Meal ${mIdx + 1}`}
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-[#191c1e]">
                              {typeof meal.name === 'string'
                                ? meal.name
                                : isRtl
                                ? meal.name?.ar || meal.name?.en || `الوجبة ${mIdx + 1}`
                                : meal.name?.en || meal.name?.ar || `Meal ${mIdx + 1}`}
                            </h4>
                            {meal.notes && (
                              <span className="text-[11px] text-[#565e74]">
                                {typeof meal.notes === 'string'
                                  ? meal.notes
                                  : isRtl
                                  ? (meal.notes as any)?.ar || (meal.notes as any)?.en
                                  : (meal.notes as any)?.en || (meal.notes as any)?.ar}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMealIdxForAddFood(mIdx)}
                          className="px-3 py-1.5 rounded-xl bg-[#191c1e] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#2c3135] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isRtl ? 'إضافة صنف' : 'Add Food'}</span>
                        </button>
                      </div>

                      {/* Foods in Meal */}
                      <div className="flex flex-col gap-2">
                        {(meal.foods || []).map((food, fIdx) => (
                          <div
                            key={food.id || fIdx}
                            className="bg-[#f7f9fb] rounded-2xl p-3 border border-[#e0e3e5] flex items-center justify-between gap-2"
                          >
                            <div>
                              <h5 className="text-xs font-black text-[#191c1e]">
                                {typeof food.foodName === 'string'
                                  ? food.foodName
                                  : isRtl
                                  ? food.foodName?.ar || food.foodName?.en || 'طعام'
                                  : food.foodName?.en || food.foodName?.ar || 'Food'}{' '}
                                ({food.amountGrams}g)
                              </h5>
                              <span className="text-[11px] text-[#565e74]">
                                {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                              </span>
                            </div>

                            <button
                              onClick={() => handleQuickRemoveFood(mIdx, fIdx)}
                              className="w-7 h-7 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center hover:bg-[#ba1a1a]/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Quick Food Picker for this Meal */}
                      {selectedMealIdxForAddFood === mIdx && (
                        <div className="p-3 bg-[#f7faf0] rounded-2xl border border-[#506600]/30 flex flex-col gap-2.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#506600]">
                              {isRtl ? 'اختر صنفاً من قاعدة المكونات:' : 'Select Food from Database:'}
                            </span>
                            <button
                              onClick={() => setSelectedMealIdxForAddFood(null)}
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={foodSearch}
                              onChange={(e) => setFoodSearch(e.target.value)}
                              placeholder={isRtl ? 'ابحث باسم الصنف...' : 'Search ingredient...'}
                              className="flex-1 h-8 px-3 rounded-xl bg-white text-xs border border-[#e0e3e5] outline-none"
                            />
                            <div className="flex items-center gap-1 bg-white px-2 rounded-xl border border-[#e0e3e5]">
                              <input
                                type="number"
                                value={foodGramsInput}
                                onChange={(e) => setFoodGramsInput(Number(e.target.value))}
                                className="w-12 h-8 text-xs font-bold text-center outline-none"
                              />
                              <span className="text-[10px] text-[#565e74]">g</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                            {ingredients
                              .filter((ing) => {
                                const q = foodSearch.toLowerCase();
                                const nameEn = typeof ing.name === 'string' ? ing.name.toLowerCase() : ing.name?.en?.toLowerCase() || '';
                                const nameAr = typeof ing.name === 'string' ? ing.name : ing.name?.ar || '';
                                return nameEn.includes(q) || nameAr.includes(foodSearch);
                              })
                              .map((ing) => {
                                const ratio = foodGramsInput / 100;
                                const cal = Math.round(ing.caloriesPer100g * ratio);
                                return (
                                  <div
                                    key={ing.id}
                                    onClick={() => handleQuickAddFood(mIdx, ing.id, foodGramsInput)}
                                    className="p-2 rounded-xl bg-white border border-[#e0e3e5] hover:border-[#ccff00] flex items-center justify-between cursor-pointer text-xs"
                                  >
                                    <div>
                                      <span className="font-bold text-[#191c1e]">
                                        {typeof ing.name === 'string'
                                          ? ing.name
                                          : isRtl
                                          ? ing.name?.ar || ing.name?.en
                                          : ing.name?.en || ing.name?.ar}
                                      </span>
                                      <span className="text-[10px] text-[#565e74] block">
                                        {foodGramsInput}g = {cal} kcal
                                      </span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-[#506600]" />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PROGRESS */}
          {/* ========================================================================= */}
          {activeTab === 'progress' && (
            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[10px] uppercase font-bold text-[#565e74] block">{isRtl ? 'وزن البداية' : 'Start Weight'}</span>
                  <span className="text-xl font-black text-[#191c1e]">86.0 kg</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[10px] uppercase font-bold text-[#565e74] block">{isRtl ? 'الوزن الحالي' : 'Current Weight'}</span>
                  <span className="text-xl font-black text-[#506600]">{client.weightKg} kg</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[10px] uppercase font-bold text-[#565e74] block">{isRtl ? 'الهدف المستهدف' : 'Target Goal'}</span>
                  <span className="text-xl font-black text-[#0284c7]">{client.targetWeightKg} kg</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[10px] uppercase font-bold text-[#565e74] block">{isRtl ? 'معدل الالتزام' : 'Compliance'}</span>
                  <span className="text-xl font-black text-[#191c1e]">{client.complianceScore}%</span>
                </div>
              </div>

              {/* Weight Log Timeline */}
              <div className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3">
                <h4 className="text-sm font-black text-[#191c1e]">
                  {isRtl ? 'سجل قياسات الوزن والأبعاد' : 'Weight & Measurement Trend'}
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { date: 'Oct 24, 2024', weight: '78.5 kg', waist: '82 cm', chest: '104 cm', status: '-0.6 kg' },
                    { date: 'Oct 17, 2024', weight: '79.1 kg', waist: '83 cm', chest: '104 cm', status: '-0.4 kg' },
                    { date: 'Oct 10, 2024', weight: '79.5 kg', waist: '84 cm', chest: '103.5 cm', status: '-0.5 kg' },
                    { date: 'Oct 03, 2024', weight: '80.0 kg', waist: '85 cm', chest: '103 cm', status: 'Baseline' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#191c1e]">{row.date}</span>
                        <span className="text-[#565e74]">Waist: {row.waist} • Chest: {row.chest}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#191c1e]">{row.weight}</span>
                        <span className="font-bold text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded">
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CHECK-INS */}
          {/* ========================================================================= */}
          {activeTab === 'checkins' && (
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              <h4 className="text-sm font-black text-[#191c1e]">
                {isRtl ? 'تقارير المتابعة الأسبوعية المقدمة من العميل' : 'Weekly Check-in Submissions'}
              </h4>

              {clientCheckIns.map((chk) => (
                <div
                  key={chk.id}
                  className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between border-b border-[#f2f4f6] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center font-bold text-xs">
                        <Clock className="w-4 h-4" />
                      </span>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-[#191c1e]">
                          {isRtl ? 'تقرير أسبوعي - ' : 'Weekly Check-in - '} {chk.date}
                        </h5>
                        <span className="text-[11px] text-[#565e74]">
                          {chk.weight} kg • Sleep: {chk.sleepHours}h • Energy: {chk.energyRating}/10
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                        chk.status === 'reviewed'
                          ? 'bg-[#f7faf0] text-[#506600] border border-[#506600]/30'
                          : 'bg-[#fff0f0] text-[#ba1a1a] border border-[#ffdad6]'
                      }`}
                    >
                      {chk.status === 'reviewed' ? (isRtl ? 'تمت المراجعة' : 'Reviewed') : (isRtl ? 'بانتظار المراجعة' : 'Pending Review')}
                    </span>
                  </div>

                  <p className="text-xs text-[#191c1e] bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5]">
                    "{chk.notes}"
                  </p>

                  {chk.coachFeedback && (
                    <div className="p-3 rounded-xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-[#506600] uppercase">
                        {isRtl ? 'ملاحظات الكوتش أليكس شوقي المرسلة:' : 'Coach Alex Feedback Sent:'}
                      </span>
                      <p className="text-xs font-bold text-[#191c1e]">{chk.coachFeedback}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setSelectedCheckInToReview(chk.id)}
                      className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600] transition-colors"
                    >
                      {chk.coachFeedback ? (isRtl ? 'تحديث التقييم' : 'Update Review') : (isRtl ? 'مراجعة وإرسال التقييم' : 'Review & Send Feedback')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: MESSAGES */}
          {/* ========================================================================= */}
          {activeTab === 'messages' && (
            <div className="flex flex-col h-full max-w-3xl mx-auto bg-white rounded-3xl border border-[#e0e3e5] shadow-xs overflow-hidden">
              {/* Message header */}
              <div className="p-3.5 bg-[#f7f9fb] border-b border-[#e0e3e5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#506600] animate-pulse" />
                  <span className="text-xs font-black text-[#191c1e]">
                    {isRtl ? 'محادثة مباشرة مع ' : 'Direct Chat with '} {client.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#565e74]">End-to-end encrypted</span>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[300px]">
                {clientMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-[#565e74] text-xs">
                    <MessageSquare className="w-8 h-8 text-[#85929e] mb-2 opacity-50" />
                    <span>{isRtl ? 'لا توجد رسائل سابقة. ابدأ المحادثة الآن.' : 'No previous messages. Start the conversation below.'}</span>
                  </div>
                ) : (
                  clientMessages.map((msg) => {
                    const isCoach = msg.senderRole === 'trainer' || msg.senderId === 'trainer_alex_1';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          isCoach ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl text-xs font-medium ${
                            isCoach
                              ? 'bg-[#191c1e] text-white rounded-tr-xs'
                              : 'bg-[#f2f4f6] text-[#191c1e] rounded-tl-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-[#565e74] mt-0.5 px-1">{msg.timestamp}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#e0e3e5] bg-white flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={isRtl ? 'اكتب رسالتك للعميل...' : 'Type message to athlete...'}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-medium outline-none text-[#191c1e]"
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: NOTES */}
          {/* ========================================================================= */}
          {activeTab === 'notes' && (
            <div className="flex flex-col gap-5 max-w-3xl mx-auto">
              {/* Add Note Card */}
              <form
                onSubmit={handleSaveNote}
                className="bg-white rounded-3xl p-5 border border-[#e0e3e5] shadow-xs flex flex-col gap-3"
              >
                <h4 className="text-xs font-black text-[#565e74] uppercase tracking-wider">
                  {isRtl ? 'تدوين ملاحظة ومتابعة جديدة' : 'Add Coach Observation / Private Note'}
                </h4>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={isRtl ? 'اكتب الملاحظات الفنية، التطورات الحركية أو توجيهات الإصابة...' : 'e.g. Advised 5min extra warm-up on rotator cuff before heavy press...'}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none resize-none"
                  required
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#191c1e] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newNoteIsPrivate}
                      onChange={(e) => setNewNoteIsPrivate(e.target.checked)}
                      className="w-4 h-4 accent-[#506600]"
                    />
                    <span>{isRtl ? 'ملاحظة سرية (خاصة بالمدرب)' : 'Private Coach Note (Hidden from athlete)'}</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600] transition-colors"
                  >
                    {isRtl ? 'حفظ الملاحظة' : 'Save Note'}
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="flex flex-col gap-3">
                {clientNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-2xl border flex flex-col gap-1.5 ${
                      note.isPrivate
                        ? 'bg-[#fffbeb] border-[#fbbf24]/40 text-[#191c1e]'
                        : 'bg-white border-[#e0e3e5] text-[#191c1e]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1.5">
                        {note.isPrivate ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-[#d97706]" />
                            <span className="text-[#d97706]">{isRtl ? 'ملاحظة سرية للكوتش' : 'Private Coach Note'}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-[#506600]" />
                            <span className="text-[#506600]">{isRtl ? 'مرئي للعميل' : 'Client Visible'}</span>
                          </>
                        )}
                      </span>
                      <span className="text-[#565e74]">{note.date}</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Program Builder Modal */}
      {showProgramBuilder && (
        <TrainerPlanBuilderModal
          isOpen={showProgramBuilder}
          onClose={() => {
            setShowProgramBuilder(false);
            setEditingProgram(null);
          }}
          programToEdit={editingProgram}
          targetClientId={client.id}
        />
      )}

      {/* Full Nutrition Builder Modal */}
      {showNutritionBuilder && (
        <TrainerNutritionBuilderModal
          isOpen={showNutritionBuilder}
          onClose={() => {
            setShowNutritionBuilder(false);
            setEditingNutrition(null);
          }}
          planToEdit={editingNutrition}
          targetClientId={client.id}
        />
      )}

      {/* Client Onboarding Modal for Intake Inspection & Update */}
      {showOnboardingModal && (
        <ClientOnboardingModal
          isOpen={showOnboardingModal}
          initialData={client.onboardingData}
          onClose={() => setShowOnboardingModal(false)}
          onComplete={(newData) => {
            updateClient(client.id, {
              onboardingData: newData,
              goal: newData.about.fitnessGoal,
              weightKg: newData.about.weightKg,
              targetWeightKg: newData.about.targetWeightKg,
              heightCm: newData.about.heightCm,
            });
            setShowOnboardingModal(false);
          }}
        />
      )}

      {/* Check-In Review Modal */}
      {selectedCheckInToReview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <h3 className="text-lg font-black text-[#191c1e]">
              {isRtl ? 'تقييم ومراجعة تقرير المتابعة' : 'Review & Send Check-in Feedback'}
            </h3>
            <textarea
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none resize-none"
              placeholder="Coach feedback..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSaveReview(selectedCheckInToReview)}
                className="flex-1 h-11 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs"
              >
                {isRtl ? 'إرسال التقييم للعميل' : 'Send Review'}
              </button>
              <button
                onClick={() => setSelectedCheckInToReview(null)}
                className="px-4 h-11 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
