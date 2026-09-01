import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import { calculateRecipeMacros } from '../utils/nutritionEngine';
import {
  Sparkles,
  X,
  Flame,
  Check,
  Plus,
  Clock,
  ChevronRight,
  ChevronLeft,
  Utensils,
  Filter,
} from 'lucide-react';

interface WhatShouldIEatModalProps {
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const WhatShouldIEatModal: React.FC<WhatShouldIEatModalProps> = ({
  onClose,
  onSelectRecipe,
}) => {
  const {
    recipes,
    recipeBookTargets,
    recipeBookTodayTotals,
    addRecipeToTodayLog,
    language,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [addedRecipeId, setAddedRecipeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'best_fit' | 'high_protein' | 'snack'>('all');

  const targets = recipeBookTargets;
  const consumed = recipeBookTodayTotals;

  const remainingCalories = Math.max(0, targets.calories - consumed.calories);
  const remainingProtein = Math.max(0, targets.protein - consumed.protein);
  const remainingCarbs = Math.max(0, targets.carbs - consumed.carbs);
  const remainingFat = Math.max(0, targets.fat - consumed.fat);

  const getLocalizedName = (name: string | { en?: string; ar?: string }) => {
    if (typeof name === 'string') return name;
    if (isRtl) return name.ar || name.en || 'Recipe';
    return name.en || name.ar || 'Recipe';
  };

  const getLocalizedDesc = (desc: string | { en?: string; ar?: string } | undefined) => {
    if (!desc) return '';
    if (typeof desc === 'string') return desc;
    if (isRtl) return desc.ar || desc.en || '';
    return desc.en || desc.ar || '';
  };

  // Score & categorize recipes based on remaining macros
  const scoredRecipes = recipes.map((recipe) => {
    const macros = calculateRecipeMacros(recipe);
    const calDiff = Math.abs(macros.calories - (remainingCalories || 400));
    
    // Fit check
    const fitsCalories = remainingCalories > 0 ? macros.calories <= remainingCalories * 1.15 : macros.calories <= 300;
    const isHighProtein = macros.protein >= 25;
    const isSnack = macros.calories <= 300 || (recipe.prepTimeMinutes && recipe.prepTimeMinutes <= 15);
    const isBestFit = fitsCalories && Math.abs(macros.calories - remainingCalories) < 250;

    return {
      recipe,
      macros,
      calDiff,
      fitsCalories,
      isHighProtein,
      isSnack,
      isBestFit,
    };
  });

  // Sort by suitability (Best calorie fit first)
  scoredRecipes.sort((a, b) => {
    if (a.fitsCalories && !b.fitsCalories) return -1;
    if (!a.fitsCalories && b.fitsCalories) return 1;
    return a.calDiff - b.calDiff;
  });

  const filteredItems = scoredRecipes.filter((item) => {
    if (filterType === 'best_fit') return item.isBestFit;
    if (filterType === 'high_protein') return item.isHighProtein;
    if (filterType === 'snack') return item.isSnack;
    return true;
  });

  const handleQuickAdd = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    addRecipeToTodayLog(recipe, 1);
    setAddedRecipeId(recipe.id);
    setTimeout(() => {
      setAddedRecipeId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-4">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#191c1e] text-[#ccff00] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#191c1e]">
                {t('whatShouldIEat')}
              </h3>
              <p className="text-xs text-[#565e74] mt-0.5">
                {t('whatShouldIEatDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Remaining Banner */}
        <div className="p-4 rounded-2xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#506600] uppercase tracking-wider block">
              {isRtl ? 'المتبقي من أهداف اليوم' : "Today's Remaining Target"}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#191c1e]">
                {remainingCalories} {t('kcal')}
              </span>
              <span className="text-xs font-bold text-[#565e74]">
                {isRtl ? 'متبقية' : 'left'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-[#506600]/20 text-center">
              <span className="text-[10px] font-bold text-[#506600] block">{t('protein')}</span>
              <span className="font-black text-[#191c1e]">{remainingProtein}g</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-[#0284c7]/20 text-center">
              <span className="text-[10px] font-bold text-[#0284c7] block">{t('carbs')}</span>
              <span className="font-black text-[#191c1e]">{remainingCarbs}g</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-[#d97706]/20 text-center">
              <span className="text-[10px] font-bold text-[#d97706] block">{t('fat')}</span>
              <span className="font-black text-[#191c1e]">{remainingFat}g</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: t('all') },
            { id: 'best_fit', label: t('bestFit') },
            { id: 'high_protein', label: t('highProteinMatch') },
            { id: 'snack', label: t('snackFit') },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setFilterType(flt.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                filterType === flt.id
                  ? 'bg-[#191c1e] text-[#ccff00] border-[#191c1e]'
                  : 'bg-[#f7f9fb] text-[#565e74] border-[#e0e3e5] hover:border-[#506600]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="flex flex-col gap-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#f7f9fb] text-center text-xs text-[#565e74]">
              {isRtl
                ? 'لا توجد وصفات تطابق هذا الفلتر حالياً.'
                : 'No recipes match this filter.'}
            </div>
          ) : (
            filteredItems.map(({ recipe, macros, isBestFit, isHighProtein, fitsCalories }) => (
              <div
                key={recipe.id}
                onClick={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#e0e3e5] hover:border-[#506600] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start group"
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#f2f4f6] shrink-0">
                    <img
                      src={recipe.image}
                      alt={getLocalizedName(recipe.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {recipe.prepTimeMinutes && (
                      <span className="absolute bottom-1 left-1 rtl:right-1 rtl:left-auto px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold">
                        {recipe.prepTimeMinutes}m
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {isBestFit && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ccff00]/40 text-[#405200] text-[10px] font-black">
                          {t('bestFit')}
                        </span>
                      )}
                      {isHighProtein && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f0f7fc] text-[#0284c7] text-[10px] font-bold">
                          {t('highProtein')}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-[#191c1e] line-clamp-1 group-hover:text-[#506600] transition-colors">
                      {getLocalizedName(recipe.name)}
                    </h4>

                    <p className="text-xs text-[#565e74] line-clamp-1 mt-0.5">
                      {getLocalizedDesc(recipe.description)}
                    </p>

                    {/* Macros info */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#565e74] mt-2">
                      <span className="font-extrabold text-[#191c1e]">
                        {macros.calories} {t('kcal')}
                      </span>
                      <span>•</span>
                      <span className="text-[#506600] font-bold">P: {macros.protein}g</span>
                      <span>•</span>
                      <span>C: {macros.carbs}g</span>
                      <span>•</span>
                      <span>F: {macros.fat}g</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eceef0]">
                  <button
                    onClick={(e) => handleQuickAdd(recipe, e)}
                    className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      addedRecipeId === recipe.id
                        ? 'bg-[#506600] text-white'
                        : 'bg-[#f2f4f6] hover:bg-[#191c1e] hover:text-[#ccff00] text-[#191c1e]'
                    }`}
                  >
                    {addedRecipeId === recipe.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>{t('completed')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t('addToTodayIntake')}</span>
                      </>
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-xl bg-[#f7f9fb] flex items-center justify-center text-[#565e74] group-hover:text-[#191c1e] transition-colors">
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#eceef0] flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-xs font-bold text-[#191c1e]"
          >
            {isRtl ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
