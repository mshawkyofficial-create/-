import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Clock,
  Dumbbell,
  Flame,
  ArrowRight,
  ArrowLeft,
  Plus,
  Utensils,
  BookOpen,
  TrendingUp,
  Bot,
  Heart,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';

export const ClientHome: React.FC = () => {
  const {
    user,
    workoutProgram,
    consumedNutrition,
    language,
    setActiveTab,
    setSelectedDayId,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const hasTraining = user.entitlements.hasTraining;
  const hasNutrition = user.entitlements.hasNutrition;

  // Active workout for today (Day 14 Wed / default)
  const todayWorkout = workoutProgram.find((d) => d.id === 'day_wed_14') || workoutProgram[0];

  // Calorie calculations
  const totalCaloriesTarget = user.dailyCaloriesTarget || 2000;
  const currentCalories = consumedNutrition.calories || 0;
  const remainingCalories = Math.max(0, totalCaloriesTarget - currentCalories);
  const caloriePercent = Math.min(100, Math.round((currentCalories / totalCaloriesTarget) * 100));

  // Circumference for 100px radius or SVG ring
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  // Macros calculations
  const proteinPercent = Math.min(100, Math.round((consumedNutrition.protein / (user.proteinTarget || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedNutrition.carbs / (user.carbsTarget || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumedNutrition.fat / (user.fatTarget || 1)) * 100));

  const getWorkoutTitle = () => {
    if (!todayWorkout) return isRtl ? 'تمرين اليوم' : "Today's Workout";
    if (typeof todayWorkout.title === 'string') return todayWorkout.title;
    if (isRtl) return todayWorkout.title?.ar || todayWorkout.title?.en || 'تمرين اليوم';
    return todayWorkout.title?.en || todayWorkout.title?.ar || "Today's Workout";
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-6 animate-fade-in">
      {/* Welcome Greeting Header */}
      <section className="flex items-center justify-between pt-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#191c1e] leading-tight">
            {t('welcomeBack')}<br />
            {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#565e74]">
            {t('readyForTasks')}
          </p>
        </div>
        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-[#ccff00] shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Today Header */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="text-xl font-bold text-[#191c1e]">{t('today')}</h2>
        <span className="text-xs font-bold text-[#506600] uppercase tracking-wider bg-[#ccff00]/30 px-3 py-1 rounded-full border border-[#ccff00]">
          {isRtl ? 'الخميس، ٢٦ أكتوبر' : 'Thursday, Oct 26'}
        </span>
      </div>

      {/* Workout Hero Card */}
      {hasTraining ? (
        <div
          className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-[#0f172a] text-white min-h-[220px] sm:min-h-[240px] flex flex-col justify-end p-5 sm:p-6 group cursor-pointer transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.45) 60%, rgba(15,23,42,0.2) 100%), url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1000&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onClick={() => {
            setSelectedDayId(todayWorkout.id);
            setActiveTab('workouts');
          }}
        >
          {/* Active Badge & Heart */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00] text-[#191c1e] text-xs font-extrabold shadow-md">
              <Zap className="w-3.5 h-3.5 fill-[#191c1e]" />
              {t('activeBadge')}
            </span>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <Heart className="w-4 h-4 fill-white/80" />
            </div>
          </div>

          {/* Workout Info */}
          <div className="mt-14 mb-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              {getWorkoutTitle()}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-white/85 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ccff00]" />
                {todayWorkout?.durationMin || 45} {t('minutes')}
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#ccff00]" />
                {todayWorkout?.exercises?.length || 0} {t('exercises')}
              </span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDayId(todayWorkout.id);
              setActiveTab('workouts');
            }}
            className="w-full h-13 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-[#191c1e] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/30 transition-transform"
          >
            <span>{t('startWorkout')}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => setActiveTab('workouts')}
          className="relative w-full rounded-3xl bg-white border border-[#e0e3e5] p-5 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#506600]/40 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-[#506600]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#191c1e]">
                {t('trainingProduct')}
              </h4>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'افتح تمارين القوة والمتابعة الفردية' : 'Unlock pro training programs'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#506600] flex items-center gap-1">
            {t('activateTraining')}
            <ArrowIcon className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* Nutrition Summary Card */}
      {hasNutrition ? (
        <div
          onClick={() => setActiveTab('nutrition')}
          className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#eceef0] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ccff00]/30 flex items-center justify-center text-[#506600]">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#191c1e]">
                {t('navNutrition')}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('nutrition');
              }}
              className="text-[#506600] hover:text-[#191c1e] text-xs font-bold flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* SVG Circular Calorie Progress Ring */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  className="text-[#eceef0]"
                  strokeWidth="9"
                  stroke="currentColor"
                  fill="transparent"
                  r={circleRadius}
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-[#506600] transition-all duration-1000 ease-out"
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={circleRadius}
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-[#191c1e] leading-none">
                  {currentCalories.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[#565e74] mt-0.5">
                  / {totalCaloriesTarget.toLocaleString()} {t('calories')}
                </span>
                <span className="text-[9px] font-semibold text-[#506600] mt-0.5">
                  {remainingCalories} {t('remaining')}
                </span>
              </div>
            </div>

            {/* Macros Breakdown Meters */}
            <div className="flex-1 w-full flex flex-col gap-3">
              {/* Protein */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-[#191c1e]">
                  <span className="text-[#565e74]">{t('protein')}</span>
                  <span>{consumedNutrition.protein} / {user.proteinTarget}{t('grams')}</span>
                </div>
                <div className="w-full h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#506600] rounded-full transition-all duration-700"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-[#191c1e]">
                  <span className="text-[#565e74]">{t('carbohydrates')}</span>
                  <span>{consumedNutrition.carbs} / {user.carbsTarget}{t('grams')}</span>
                </div>
                <div className="w-full h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#38bdf8] rounded-full transition-all duration-700"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-[#191c1e]">
                  <span className="text-[#565e74]">{t('fat')}</span>
                  <span>{consumedNutrition.fat} / {user.fatTarget}{t('grams')}</span>
                </div>
                <div className="w-full h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#fbbf24] rounded-full transition-all duration-700"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setActiveTab('nutrition')}
          className="relative w-full rounded-3xl bg-white border border-[#e0e3e5] p-5 shadow-sm flex items-center justify-between cursor-pointer hover:border-[#506600]/40 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] flex items-center justify-center text-[#506600]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#191c1e]">
                {t('nutritionProduct')}
              </h4>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'تتبع السعرات والماكروز اليومية' : 'Custom daily calorie & macro targets'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#506600] flex items-center gap-1">
            {t('activateNutrition')}
            <ArrowIcon className="w-4 h-4" />
          </span>
        </div>
      )}

      {/* Quick Actions 4-Grid */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-[#191c1e]">{t('quickActions')}</h3>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('workouts')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e0e3e5] hover:border-[#506600] shadow-xs active:scale-95 transition-all gap-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/25 flex items-center justify-center text-[#506600]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#191c1e] truncate w-full text-center">
              {t('navWorkouts')}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e0e3e5] hover:border-[#506600] shadow-xs active:scale-95 transition-all gap-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/25 flex items-center justify-center text-[#506600]">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#191c1e] truncate w-full text-center">
              {t('navNutrition')}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('recipes')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e0e3e5] hover:border-[#506600] shadow-xs active:scale-95 transition-all gap-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/25 flex items-center justify-center text-[#506600]">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#191c1e] truncate w-full text-center">
              {t('navRecipes')}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#e0e3e5] hover:border-[#506600] shadow-xs active:scale-95 transition-all gap-1.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/25 flex items-center justify-center text-[#506600]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-[#191c1e] truncate w-full text-center">
              {t('navProgress')}
            </span>
          </button>
        </div>

        {/* Ask AI Coach Banner */}
        <button
          onClick={() => setActiveTab('ai-coach')}
          className="w-full mt-1 bg-white hover:bg-[#f7f9fb] border-2 border-[#eceef0] hover:border-[#506600]/40 rounded-2xl p-4 flex items-center justify-between shadow-sm active:scale-[0.99] transition-all text-start"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-md shadow-[#ccff00]/30 shrink-0">
              <Bot className="w-6 h-6 stroke-[2.2px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#191c1e]">
                {t('askAiCoach')}
              </span>
              <span className="text-xs text-[#565e74]">
                {t('getFitnessAdvice')}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#191c1e] shrink-0">
            <ArrowIcon className="w-4 h-4" />
          </div>
        </button>
      </section>
    </div>
  );
};
