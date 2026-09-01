import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Utensils,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Edit3,
  X,
  Check,
} from 'lucide-react';

interface RecipeBookDailyTrackerProps {
  onOpenWhatShouldIEat: () => void;
  onOpenRecipe: (recipeId: string) => void;
}

export const RecipeBookDailyTracker: React.FC<RecipeBookDailyTrackerProps> = ({
  onOpenWhatShouldIEat,
  onOpenRecipe,
}) => {
  const {
    language,
    t,
    recipeBookTargets,
    setRecipeBookTargets,
    recipeBookTodayItems,
    recipeBookTodayTotals,
    removeRecipeFromTodayLog,
    updateRecipeLogServings,
    clearTodayRecipeLog,
    getTodayDateKey,
  } = useApp();

  const isRtl = language === 'ar';
  const [isLogExpanded, setIsLogExpanded] = useState(false);
  const [showEditTargetsModal, setShowEditTargetsModal] = useState(false);
  const [editCalories, setEditCalories] = useState(recipeBookTargets.calories);
  const [editProtein, setEditProtein] = useState(recipeBookTargets.protein);
  const [editCarbs, setEditCarbs] = useState(recipeBookTargets.carbs);
  const [editFat, setEditFat] = useState(recipeBookTargets.fat);

  const todayKey = getTodayDateKey();

  // Calculations
  const targets = recipeBookTargets;
  const consumed = recipeBookTodayTotals;

  const remainingCalories = targets.calories - consumed.calories;
  const remainingProtein = targets.protein - consumed.protein;
  const remainingCarbs = targets.carbs - consumed.carbs;
  const remainingFat = targets.fat - consumed.fat;

  const calProgress = Math.min(100, Math.round((consumed.calories / (targets.calories || 1)) * 100));
  const protProgress = Math.min(100, Math.round((consumed.protein / (targets.protein || 1)) * 100));
  const carbsProgress = Math.min(100, Math.round((consumed.carbs / (targets.carbs || 1)) * 100));
  const fatProgress = Math.min(100, Math.round((consumed.fat / (targets.fat || 1)) * 100));

  const handleSaveEditedTargets = (e: React.FormEvent) => {
    e.preventDefault();
    setRecipeBookTargets({
      calories: Number(editCalories) || 2000,
      protein: Number(editProtein) || 150,
      carbs: Number(editCarbs) || 200,
      fat: Number(editFat) || 60,
    });
    setShowEditTargetsModal(false);
  };

  const getLocalizedName = (name: string | { en?: string; ar?: string }) => {
    if (typeof name === 'string') return name;
    if (isRtl) return name.ar || name.en || 'Recipe';
    return name.en || name.ar || 'Recipe';
  };

  // Formatted date string
  const todayFormatted = new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="w-full bg-white rounded-3xl border border-[#e0e3e5] overflow-hidden shadow-xs text-start">
      {/* Header & Date Badge */}
      <div className="p-4 sm:p-5 border-b border-[#eceef0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#f8faf2] to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#506600] text-white flex items-center justify-center shadow-xs">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#191c1e]">
                {t('dailyNutritionTracker')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/40 text-[#405200] text-[10px] font-black uppercase tracking-wider">
                {isRtl ? 'خاص بالوصفات' : 'Recipe Book'}
              </span>
            </div>
            <p className="text-xs text-[#565e74] flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#506600]" />
              <span className="font-semibold">{todayFormatted}</span>
              <span>•</span>
              <span className="text-[11px] text-[#565e74]">
                {t('recipeBookTrackerNotice')}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWhatShouldIEat}
            className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl bg-[#191c1e] hover:bg-black text-[#ccff00] text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('whatShouldIEat')}</span>
          </button>
          <button
            onClick={() => {
              setEditCalories(recipeBookTargets.calories);
              setEditProtein(recipeBookTargets.protein);
              setEditCarbs(recipeBookTargets.carbs);
              setEditFat(recipeBookTargets.fat);
              setShowEditTargetsModal(true);
            }}
            title={isRtl ? 'تعديل الأهداف' : 'Edit Targets'}
            className="w-9 h-9 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#565e74] flex items-center justify-center transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Macro Breakdown Cards Grid */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Main Calories Banner */}
        <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#191c1e] uppercase tracking-wide">
                  {t('calories')}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-[#191c1e]">
                    {consumed.calories}
                  </span>
                  <span className="text-xs font-bold text-[#565e74]">
                    / {targets.calories} {t('kcal')}
                  </span>
                </div>
              </div>
            </div>

            {/* Remaining / Over status */}
            <div className="text-end">
              {remainingCalories >= 0 ? (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-[#506600] uppercase tracking-wider">
                    {t('remaining')}
                  </span>
                  <span className="text-lg font-black text-[#506600]">
                    {remainingCalories} {t('kcal')}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-700" />
                    {Math.abs(remainingCalories)} {t('kcal')} {t('overTarget')}
                  </span>
                  <span className="text-xs font-bold text-amber-800 mt-0.5">
                    {isRtl ? 'تجاوزت الهدف' : 'Exceeded target'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calorie Progress Bar */}
          <div className="w-full bg-[#e0e3e5] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                remainingCalories < 0
                  ? 'bg-amber-500'
                  : 'bg-[#506600]'
              }`}
              style={{ width: `${Math.min(100, calProgress)}%` }}
            />
          </div>
        </div>

        {/* 3 Macro Cards (Protein, Carbs, Fat) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Protein Card */}
          <div className="p-3.5 rounded-2xl bg-[#f7faf0] border border-[#506600]/20 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#506600] uppercase tracking-wide">
                {t('protein')}
              </span>
              {remainingProtein >= 0 ? (
                <span className="text-[11px] font-extrabold text-[#506600]">
                  {remainingProtein}g {t('remaining')}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  +{Math.abs(remainingProtein)}g {t('overTarget')}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#191c1e]">
                  {consumed.protein}g
                </span>
                <span className="text-[11px] font-bold text-[#565e74]">
                  / {targets.protein}g
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#565e74]">
                {protProgress}%
              </span>
            </div>

            <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remainingProtein < 0 ? 'bg-amber-500' : 'bg-[#506600]'
                }`}
                style={{ width: `${protProgress}%` }}
              />
            </div>
          </div>

          {/* Carbs Card */}
          <div className="p-3.5 rounded-2xl bg-[#f0f7fc] border border-[#0284c7]/20 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0284c7] uppercase tracking-wide">
                {t('carbohydrates')}
              </span>
              {remainingCarbs >= 0 ? (
                <span className="text-[11px] font-extrabold text-[#0284c7]">
                  {remainingCarbs}g {t('remaining')}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  +{Math.abs(remainingCarbs)}g {t('overTarget')}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#191c1e]">
                  {consumed.carbs}g
                </span>
                <span className="text-[11px] font-bold text-[#565e74]">
                  / {targets.carbs}g
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#565e74]">
                {carbsProgress}%
              </span>
            </div>

            <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remainingCarbs < 0 ? 'bg-amber-500' : 'bg-[#0284c7]'
                }`}
                style={{ width: `${carbsProgress}%` }}
              />
            </div>
          </div>

          {/* Fat Card */}
          <div className="p-3.5 rounded-2xl bg-[#fffbeb] border border-[#d97706]/20 flex flex-col justify-between gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#d97706] uppercase tracking-wide">
                {t('fat')}
              </span>
              {remainingFat >= 0 ? (
                <span className="text-[11px] font-extrabold text-[#d97706]">
                  {remainingFat}g {t('remaining')}
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  +{Math.abs(remainingFat)}g {t('overTarget')}
                </span>
              )}
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-[#191c1e]">
                  {consumed.fat}g
                </span>
                <span className="text-[11px] font-bold text-[#565e74]">
                  / {targets.fat}g
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#565e74]">
                {fatProgress}%
              </span>
            </div>

            <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remainingFat < 0 ? 'bg-amber-500' : 'bg-[#d97706]'
                }`}
                style={{ width: `${fatProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Today's Logged Items Toggle Accordion */}
        <div className="border-t border-[#eceef0] pt-3">
          <button
            onClick={() => setIsLogExpanded(!isLogExpanded)}
            className="w-full py-2 flex items-center justify-between text-start hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#191c1e] uppercase tracking-wide">
                {t('todaysIntake')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#565e74] text-[11px] font-bold">
                {recipeBookTodayItems.length} {isRtl ? 'وصفات' : 'items'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#565e74] font-bold">
              <span>{isLogExpanded ? (isRtl ? 'إخفاء' : 'Hide') : (isRtl ? 'عرض الوجبات' : 'View Log')}</span>
              {isLogExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isLogExpanded && (
            <div className="pt-3 flex flex-col gap-2.5 animate-fade-in">
              {recipeBookTodayItems.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#f7f9fb] border border-dashed border-[#e0e3e5] text-center text-xs text-[#565e74] font-medium">
                  {t('noRecipesLoggedToday')}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recipeBookTodayItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div
                        onClick={() => onOpenRecipe(item.recipeId)}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-90 flex-1"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={getLocalizedName(item.recipeName)}
                            className="w-12 h-12 rounded-xl object-cover border border-[#e0e3e5]"
                          />
                        )}
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-[#191c1e] line-clamp-1">
                            {getLocalizedName(item.recipeName)}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[#565e74] font-semibold mt-0.5">
                            <span className="font-bold text-[#191c1e]">
                              {item.calories} {t('kcal')}
                            </span>
                            <span>•</span>
                            <span>P: {item.protein}g</span>
                            <span>•</span>
                            <span>C: {item.carbs}g</span>
                            <span>•</span>
                            <span>F: {item.fat}g</span>
                          </div>
                        </div>
                      </div>

                      {/* Serving Adjuster & Delete */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e0e3e5]">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#e0e3e5]">
                          <button
                            onClick={() => updateRecipeLogServings(item.id, Number((item.servings - 0.5).toFixed(1)))}
                            disabled={item.servings <= 0.5}
                            title={t('removeServing')}
                            className="w-6 h-6 rounded-lg bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black text-[#191c1e] min-w-8 text-center">
                            {item.servings}x
                          </span>
                          <button
                            onClick={() => updateRecipeLogServings(item.id, Number((item.servings + 0.5).toFixed(1)))}
                            title={t('addServing')}
                            className="w-6 h-6 rounded-lg bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeRecipeFromTodayLog(item.id)}
                          title={isRtl ? 'حذف من سجل اليوم' : 'Remove from log'}
                          className="w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Clear Log Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={clearTodayRecipeLog}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      {t('clearTodayLog')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Targets Modal */}
      {showEditTargetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#506600]" />
                <h3 className="text-base font-black text-[#191c1e]">
                  {isRtl ? 'تعديل الأهداف اليومية للوصفات' : 'Edit Recipe Book Daily Targets'}
                </h3>
              </div>
              <button
                onClick={() => setShowEditTargetsModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#565e74]">
              {isRtl
                ? 'حدد أهدافك الشخصية لمتتبع الوصفات. لن تؤثر هذه القيم على خطة المدرب.'
                : 'Set your personal targets for Recipe Book tracking. This will not modify the Trainer Plan.'}
            </p>

            <form onSubmit={handleSaveEditedTargets} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {t('targetCalories')} ({t('kcal')})
                </label>
                <input
                  type="number"
                  value={editCalories}
                  onChange={(e) => setEditCalories(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#506600] uppercase block mb-1">
                    {t('protein')} (g)
                  </label>
                  <input
                    type="number"
                    value={editProtein}
                    onChange={(e) => setEditProtein(Number(e.target.value))}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#0284c7] uppercase block mb-1">
                    {t('carbs')} (g)
                  </label>
                  <input
                    type="number"
                    value={editCarbs}
                    onChange={(e) => setEditCarbs(Number(e.target.value))}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#d97706] uppercase block mb-1">
                    {t('fat')} (g)
                  </label>
                  <input
                    type="number"
                    value={editFat}
                    onChange={(e) => setEditFat(Number(e.target.value))}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditTargetsModal(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-xs font-bold text-[#191c1e]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#506600] hover:bg-[#3d4e00] text-xs font-black text-white flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حفظ الأهداف' : 'Save Targets'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
