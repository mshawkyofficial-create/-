import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LockedFeature } from './LockedFeature';
import { Recipe } from '../types';
import {
  calculateRecipeMacros,
  getIngredientById,
  scaleRecipeForTargets,
  ScaledRecipeResult,
  calculateMifflinStJeor,
} from '../utils/nutritionEngine';
import { RecipeBookDailyTracker } from './RecipeBookDailyTracker';
import { WhatShouldIEatModal } from './WhatShouldIEatModal';
import { TrainerEditRecipeModal } from './trainer/TrainerEditRecipeModal';
import { TrainerAddRecipeModal } from './trainer/TrainerAddRecipeModal';
import {
  Search,
  Clock,
  Flame,
  Bookmark,
  Play,
  X,
  Sparkles,
  Sliders,
  Check,
  ArrowRight,
  ArrowLeft,
  Utensils,
  ChevronRight,
  Share2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  CheckCircle2,
  Pencil,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

export const RecipeLibraryView: React.FC = () => {
  const {
    user,
    activeRole,
    recipes,
    toggleRecipeBookmark,
    consumedNutrition,
    recipeBookTargets,
    setRecipeBookTargets,
    recipeBookTodayTotals,
    addRecipeToTodayLog,
    language,
    setShowAuthModal,
    setAuthMode,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const getLocalizedText = (
    item: string | { en?: string; ar?: string } | undefined,
    fallback = ''
  ): string => {
    if (!item) return fallback;
    if (typeof item === 'string') return item;
    if (isRtl) return item.ar || item.en || fallback;
    return item.en || item.ar || fallback;
  };

  const getInstructions = (
    item: string[] | { en?: string[]; ar?: string[] } | undefined
  ): string[] => {
    if (!item) return ['Prepare according to recipe macros.'];
    if (Array.isArray(item)) return item;
    if (isRtl) return item.ar || item.en || ['اتبع خطوات التحضير'];
    return item.en || item.ar || ['Prepare according to recipe macros.'];
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showWhatShouldIEat, setShowWhatShouldIEat] = useState(false);
  const [addedCardRecipeId, setAddedCardRecipeId] = useState<string | null>(null);
  const [modalServings, setModalServings] = useState<number>(1);
  const [modalAddSuccess, setModalAddSuccess] = useState<boolean>(false);
  const [savedTargetSuccess, setSavedTargetSuccess] = useState<boolean>(false);

  // Trainer Recipe Management Modal States
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showEditRecipeModal, setShowEditRecipeModal] = useState(false);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);

  // Macro Calculator Accordion State (Mifflin-St Jeor)
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcAge, setCalcAge] = useState(28);
  const [calcHeight, setCalcHeight] = useState(178);
  const [calcWeight, setCalcWeight] = useState(user.weightKg || 82.5);
  const [calcActivity, setCalcActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [calcGoal, setCalcGoal] = useState<'fat_loss' | 'muscle_gain' | 'maintenance'>('fat_loss');
  const [calcResult, setCalcResult] = useState<any>(null);

  // AI Recipe Personalizer State
  const [showPersonalizer, setShowPersonalizer] = useState(false);
  const [targetCalories, setTargetCalories] = useState<number>(450);
  const [targetProtein, setTargetProtein] = useState<number>(35);
  const [personalizerResult, setPersonalizerResult] = useState<ScaledRecipeResult | null>(null);

  const hasRecipeBook = user.entitlements.hasRecipeBook;

  if (!hasRecipeBook) {
    return (
      <div className="pt-20 pb-28">
        <LockedFeature
          productName={t('recipeBookProduct')}
          productType="recipe_book"
          onOpenRedeem={() => {
            setAuthMode('activate');
            setShowAuthModal(true);
          }}
        />
      </div>
    );
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateMifflinStJeor({
      gender: calcGender,
      age: Number(calcAge),
      heightCm: Number(calcHeight),
      weightKg: Number(calcWeight),
      activityLevel: calcActivity,
      goal: calcGoal,
    });
    setCalcResult(result);
  };

  const handleSaveCalculatorTargets = () => {
    if (!calcResult) return;
    setRecipeBookTargets({
      calories: Number(calcResult.targetCalories) || 2000,
      protein: Number(calcResult.proteinGrams) || 150,
      carbs: Number(calcResult.carbsGrams) || 200,
      fat: Number(calcResult.fatGrams) || 60,
    });
    setSavedTargetSuccess(true);
    setTimeout(() => setSavedTargetSuccess(false), 3500);
  };

  const [videoUnavailableNotice, setVideoUnavailableNotice] = useState<string | null>(null);

  // Filter recipes for client view (hide unpublished or archived for clients)
  const availableRecipes = recipes.filter((r) => {
    if (activeRole === 'trainer') return true;
    return r.published !== false && r.archived !== true;
  });

  const filteredRecipes = availableRecipes.filter((r) => {
    const enName = typeof r.name === 'string' ? r.name.toLowerCase() : r.name?.en?.toLowerCase() || '';
    const arName = typeof r.name === 'string' ? r.name.toLowerCase() : r.name?.ar?.toLowerCase() || '';
    const q = (searchQuery || '').toLowerCase();
    const nameMatch = enName.includes(q) || arName.includes(q);
    
    if (!nameMatch) return false;

    if (selectedTag === 'All') return true;
    if (selectedTag === 'High Protein') return r.tags && r.tags.some(t => t.toLowerCase().includes('protein'));
    if (selectedTag === 'Low Calorie') return (r.calories || 0) <= 400 || (r.tags && r.tags.some(t => t.toLowerCase().includes('low calorie')));
    if (selectedTag === 'Under 15m') return (r.preparationTimeMin || r.prepTimeMinutes || 15) <= 15;
    if (selectedTag === 'Video') return Boolean(r.videoUrl && r.videoUrl.trim().length > 0);
    if (selectedTag === 'breakfast') return r.mealType === 'breakfast' || r.category === 'breakfast';
    if (selectedTag === 'main_meals') return r.category === 'main_meals' || r.mealType === 'lunch' || r.mealType === 'dinner';
    if (selectedTag === 'snacks_desserts') return r.category === 'snacks_desserts' || r.category === 'dessert' || r.mealType === 'snack';
    if (selectedTag === 'drinks') return r.category === 'drinks';
    if (selectedTag === 'salads') return r.category === 'salads';
    if (selectedTag === 'sandwiches') return r.category === 'sandwiches';

    return r.tags && r.tags.includes(selectedTag);
  });

  const handleWatchVideo = (recipe: Recipe, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (recipe.videoUrl && recipe.videoUrl.trim().length > 0) {
      window.open(recipe.videoUrl.trim(), '_blank', 'noopener,noreferrer');
    } else {
      const recipeTitle = getLocalizedText(recipe.name, isRtl ? 'هذه الوصفة' : 'This recipe');
      setVideoUnavailableNotice(recipeTitle);
    }
  };

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowPersonalizer(false);
    setPersonalizerResult(null);
    setModalServings(1);
    setModalAddSuccess(false);
    const macros = calculateRecipeMacros(recipe);
    setTargetCalories(macros.calories);
    setTargetProtein(macros.protein);
  };

  const handleOpenRecipeById = (recipeId: string) => {
    const r = recipes.find((item) => item.id === recipeId);
    if (r) {
      handleOpenRecipe(r);
    }
  };

  const handleQuickAddFromCard = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    addRecipeToTodayLog(recipe, 1);
    setAddedCardRecipeId(recipe.id);
    setTimeout(() => {
      setAddedCardRecipeId(null);
    }, 2000);
  };

  const handleAddModalRecipeToToday = () => {
    if (!selectedRecipe) return;
    addRecipeToTodayLog(selectedRecipe, modalServings);
    setModalAddSuccess(true);
    setTimeout(() => {
      setModalAddSuccess(false);
    }, 2500);
  };

  const handleRunPersonalizer = () => {
    if (!selectedRecipe) return;
    const res = scaleRecipeForTargets(
      selectedRecipe,
      Number(targetCalories),
      Number(targetProtein)
    );
    setPersonalizerResult(res);
  };

  const handleFillRemainingMacros = () => {
    const remCal = Math.max(250, recipeBookTargets.calories - recipeBookTodayTotals.calories);
    const remProt = Math.max(20, recipeBookTargets.protein - recipeBookTodayTotals.protein);
    setTargetCalories(remCal);
    setTargetProtein(remProt);
    if (selectedRecipe) {
      const res = scaleRecipeForTargets(selectedRecipe, remCal, remProt);
      setPersonalizerResult(res);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-5 animate-fade-in text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#191c1e]">
            {t('recipeLibrary')}
          </h1>
          <p className="text-xs sm:text-sm text-[#565e74]">
            {isRtl ? 'مكتبة الوصفات الذكية، المتتبع اليومي للسعرات، وحاسبة الماكروز' : 'Smart recipe library with daily macro tracker & Mifflin-St Jeor calculator'}
          </p>
        </div>

        {/* Trainer Quick Add Recipe Button */}
        {activeRole === 'trainer' && (
          <button
            onClick={() => setShowAddRecipeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#191c1e] text-[#ccff00] hover:bg-black font-black text-xs shadow-md transition-all active:scale-95 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isRtl ? 'إضافة وصفة جديدة' : 'Add New Recipe'}</span>
          </button>
        )}
      </div>

      {/* 1. Recipe Book Daily Nutrition Tracker */}
      <RecipeBookDailyTracker
        onOpenWhatShouldIEat={() => setShowWhatShouldIEat(true)}
        onOpenRecipe={handleOpenRecipeById}
      />

      {/* 2. Interactive Calorie & Macro Target Calculator Accordion */}
      <div className="w-full bg-white rounded-3xl border border-[#e0e3e5] overflow-hidden shadow-xs">
        <button
          onClick={() => setShowCalculator(!showCalculator)}
          className="w-full p-4 sm:p-5 flex items-center justify-between bg-white hover:bg-[#f7f9fb] transition-colors text-start"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#191c1e]">
                {t('macroCalculator')}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'حساب الاحتياج اليومي (ميفلين سانت جوير) واعتماده كهدف لمتتبع الوصفات' : 'Calculate daily calories and macro targets using Mifflin-St Jeor formula'}
              </p>
            </div>
          </div>
          {showCalculator ? <ChevronUp className="w-5 h-5 text-[#565e74]" /> : <ChevronDown className="w-5 h-5 text-[#565e74]" />}
        </button>

        {showCalculator && (
          <div className="p-5 pt-0 border-t border-[#eceef0] flex flex-col gap-4 animate-fade-in text-start">
            <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('gender')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcGender('male')}
                    className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all border ${
                      calcGender === 'male'
                        ? 'bg-[#191c1e] text-white border-[#191c1e]'
                        : 'bg-[#f2f4f6] text-[#565e74] border-transparent'
                    }`}
                  >
                    {t('male')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGender('female')}
                    className={`flex-1 h-10 rounded-xl text-xs font-bold transition-all border ${
                      calcGender === 'female'
                        ? 'bg-[#191c1e] text-white border-[#191c1e]'
                        : 'bg-[#f2f4f6] text-[#565e74] border-transparent'
                    }`}
                  >
                    {t('female')}
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('age')}
                </label>
                <input
                  type="number"
                  value={calcAge}
                  onChange={(e) => setCalcAge(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              {/* Height */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('height')}
                </label>
                <input
                  type="number"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              {/* Weight */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('weight')}
                </label>
                <input
                  type="number"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('activityLevel')}
                </label>
                <select
                  value={calcActivity}
                  onChange={(e: any) => setCalcActivity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                >
                  <option value="sedentary">{t('sedentary')}</option>
                  <option value="moderate">{t('moderate')}</option>
                  <option value="active">{t('active')}</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider block mb-1">
                  {t('goal')}
                </label>
                <select
                  value={calcGoal}
                  onChange={(e: any) => setCalcGoal(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                >
                  <option value="fat_loss">{t('fatLoss')}</option>
                  <option value="muscle_gain">{t('muscleGain')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#191c1e] hover:bg-black text-[#ccff00] font-black text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t('calculate')}</span>
                </button>
              </div>
            </form>

            {/* Calculator Results Card */}
            {calcResult && (
              <div className="mt-3 p-4 rounded-2xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#506600] uppercase">
                      {isRtl ? 'الهدف المحسوب الموصى به' : 'Calculated Daily Targets'}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-[#191c1e]">
                      {calcResult.targetCalories} {t('kcal')} / {t('today')}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-[#565e74]">
                    TDEE: {calcResult.tdee} kcal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-[#e0e3e5]">
                    <span className="text-[10px] font-bold text-[#506600] block">{t('protein')}</span>
                    <span className="text-sm font-black text-[#191c1e]">{calcResult.proteinGrams}g</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#e0e3e5]">
                    <span className="text-[10px] font-bold text-[#0284c7] block">{t('carbs')}</span>
                    <span className="text-sm font-black text-[#191c1e]">{calcResult.carbsGrams}g</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-[#e0e3e5]">
                    <span className="text-[10px] font-bold text-[#d97706] block">{t('fat')}</span>
                    <span className="text-sm font-black text-[#191c1e]">{calcResult.fatGrams}g</span>
                  </div>
                </div>

                {/* Save Target to Recipe Book Action */}
                <div className="pt-2 border-t border-[#506600]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <button
                    onClick={handleSaveCalculatorTargets}
                    className="w-full h-10 rounded-xl bg-[#506600] hover:bg-[#3d4e00] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('saveAsRecipeBookTarget')}</span>
                  </button>
                </div>

                {savedTargetSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('savedAsRecipeBookTargetSuccess')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchRecipes')}
          className="w-full h-11 px-9 rounded-2xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none shadow-xs"
        />
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'All', label: t('all') },
          { id: 'breakfast', label: isRtl ? 'فطور' : 'Breakfast' },
          { id: 'main_meals', label: isRtl ? 'وجبات أساسية' : 'Main Meals' },
          { id: 'snacks_desserts', label: isRtl ? 'حلا وسناك' : 'Snacks & Desserts' },
          { id: 'drinks', label: isRtl ? 'مشروبات' : 'Drinks' },
          { id: 'salads', label: isRtl ? 'سلطات' : 'Salads' },
          { id: 'sandwiches', label: isRtl ? 'سندوتشات' : 'Sandwiches' },
          { id: 'High Protein', label: t('highProtein') },
          { id: 'Low Calorie', label: t('lowCalorie') },
          { id: 'Under 15m', label: t('under15Min') },
          { id: 'Video', label: t('videoOnly') },
        ].map((tag) => {
          const isActive = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#191c1e] text-[#ccff00] border-[#191c1e] shadow-xs'
                  : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#506600]'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => {
          const macros = calculateRecipeMacros(recipe);
          const isCardAdded = addedCardRecipeId === recipe.id;
          const hasVideo = Boolean(recipe.videoUrl && recipe.videoUrl.trim().length > 0);

          return (
            <div
              key={recipe.id}
              onClick={() => handleOpenRecipe(recipe)}
              className="bg-white rounded-3xl overflow-hidden border border-[#e0e3e5] hover:border-[#506600] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group text-start"
            >
              {/* Image Banner */}
              <div className="relative w-full h-48 bg-[#f2f4f6] overflow-hidden">
                <img
                  src={recipe.image}
                  alt={getLocalizedText(recipe.name, 'Recipe')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top Tags, Bookmark & Trainer Edit Action */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                    {(recipe.tags || []).map((tg, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Trainer Edit Recipe Action Button */}
                    {activeRole === 'trainer' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRecipe(recipe);
                          setShowEditRecipeModal(true);
                        }}
                        title={isRtl ? 'تعديل صورة وبيانات الوصفة' : 'Edit Recipe Image & Details'}
                        className="w-8 h-8 rounded-full bg-[#191c1e] text-[#ccff00] hover:bg-black hover:scale-105 active:scale-95 flex items-center justify-center shadow-md transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRecipeBookmark(recipe.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#191c1e] hover:bg-white transition-colors shadow-xs"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          recipe.isBookmarked ? 'fill-[#506600] text-[#506600]' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Video Play Button Overlay - RENDERED ON EVERY RECIPE CARD (Requirement Section 3 & 11) */}
                <button
                  onClick={(e) => handleWatchVideo(recipe, e)}
                  title={hasVideo ? (isRtl ? 'مشاهدة فيديو طريقة التحضير' : 'Watch Recipe Video') : (isRtl ? 'الفيديو غير متاح حالياً' : 'Video currently unavailable')}
                  className={`absolute bottom-3 left-3 rtl:right-3 rtl:left-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer z-20 group/vid shadow-md ${
                    hasVideo
                      ? 'bg-[#ccff00] text-[#191c1e] hover:bg-white hover:scale-105 active:scale-95'
                      : 'bg-black/65 backdrop-blur-md text-slate-200 hover:bg-black/80 hover:text-white border border-white/20'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${hasVideo ? 'bg-[#191c1e] text-[#ccff00]' : 'bg-white/20 text-white'}`}>
                    <Play className={`w-2.5 h-2.5 translate-x-0.2 ${hasVideo ? 'fill-[#ccff00]' : 'fill-white'}`} />
                  </span>
                  <span className="text-[11px] font-black tracking-wide">
                    {isRtl ? 'فيديو' : 'Video'}
                  </span>
                </button>

                {/* Prep/Cook Time Badge */}
                {(recipe.preparationTimeMin || recipe.prepTimeMinutes || recipe.cookTimeMin) && (
                  <div className="absolute bottom-3 right-3 rtl:left-3 rtl:right-auto flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold z-10">
                    <Clock className="w-3 h-3 text-[#ccff00]" />
                    <span>
                      {(recipe.preparationTimeMin || recipe.prepTimeMinutes || 0) + (recipe.cookTimeMin || 0) || 15}m
                    </span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div>
                  <h3 className="text-base font-black text-[#191c1e] line-clamp-1">
                    {getLocalizedText(recipe.name, 'Recipe')}
                  </h3>
                  <p className="text-xs text-[#565e74] line-clamp-2 mt-1">
                    {getLocalizedText(recipe.description, '')}
                  </p>
                </div>

                {/* Macro Pills & Quick Add */}
                <div className="flex items-center justify-between pt-2 border-t border-[#eceef0] text-xs gap-2">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-[#191c1e]">
                      {macros.calories} {t('kcal')}
                    </span>
                    <div className="flex items-center gap-1.5 text-[#565e74] font-semibold text-[11px]">
                      <span>P: {macros.protein}g</span>
                      <span>•</span>
                      <span>C: {macros.carbs}g</span>
                      <span>•</span>
                      <span>F: {macros.fat}g</span>
                    </div>
                  </div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleQuickAddFromCard(recipe, e)}
                    title={t('addToTodayIntake')}
                    className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isCardAdded
                        ? 'bg-[#506600] text-white'
                        : 'bg-[#f2f4f6] hover:bg-[#191c1e] hover:text-[#ccff00] text-[#191c1e]'
                    }`}
                  >
                    {isCardAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span className="text-[11px]">{t('completed')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{isRtl ? 'أضف لليوم' : 'Add'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Detail & Scale Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
              <div>
                <h3 className="text-xl font-black text-[#191c1e]">
                  {getLocalizedText(selectedRecipe.name, 'Recipe')}
                </h3>
                <p className="text-xs text-[#565e74] mt-0.5">
                  {(selectedRecipe.prepTimeMinutes || selectedRecipe.preparationTimeMin || 15)} {t('minutes')}
                  {selectedRecipe.cookTimeMin ? ` • ${isRtl ? 'طهي' : 'Cook'}: ${selectedRecipe.cookTimeMin}m` : ''}
                  {selectedRecipe.servingSize ? ` • ${selectedRecipe.servingSize}` : ''}
                  {selectedRecipe.tags && selectedRecipe.tags.length > 0 ? ` • ${selectedRecipe.tags.join(' • ')}` : ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video or Image Preview */}
            <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#f2f4f6]">
              <img
                src={selectedRecipe.image}
                alt={getLocalizedText(selectedRecipe.name, 'Recipe')}
                className="w-full h-full object-cover"
              />
              
              {/* Prominent Video Watch Button Overlay */}
              <button
                type="button"
                onClick={() => handleWatchVideo(selectedRecipe)}
                className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center text-white group cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-[#191c1e] ml-0.5" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                    <ExternalLink className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>
                      {selectedRecipe.videoUrl
                        ? (isRtl ? 'مشاهدة فيديو طريقة التحضير' : 'Watch Preparation Video')
                        : (isRtl ? 'فيديو التحضير' : 'Preparation Video')}
                    </span>
                  </span>
                </div>
              </button>
            </div>

            {/* Nutrition Breakdown */}
            <div className="flex flex-col gap-3">
              {/* Default Macros */}
              <div className="grid grid-cols-4 gap-2 bg-[#f7f9fb] p-3 rounded-2xl border border-[#e0e3e5] text-center">
                <div>
                  <span className="text-[10px] font-bold text-[#565e74] uppercase block">
                    {t('calories')}
                  </span>
                  <span className="text-sm font-black text-[#191c1e]">
                    {personalizerResult
                      ? personalizerResult.actualCalories
                      : calculateRecipeMacros(selectedRecipe).calories * modalServings}{' '}
                    kcal
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#506600] uppercase block">
                    {t('protein')}
                  </span>
                  <span className="text-sm font-black text-[#191c1e]">
                    {personalizerResult
                      ? personalizerResult.actualProtein
                      : Math.round(calculateRecipeMacros(selectedRecipe).protein * modalServings)}
                    g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#0284c7] uppercase block">
                    {t('carbs')}
                  </span>
                  <span className="text-sm font-black text-[#191c1e]">
                    {personalizerResult
                      ? personalizerResult.actualCarbs
                      : Math.round(calculateRecipeMacros(selectedRecipe).carbs * modalServings)}
                    g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#d97706] uppercase block">
                    {t('fat')}
                  </span>
                  <span className="text-sm font-black text-[#191c1e]">
                    {personalizerResult
                      ? personalizerResult.actualFat
                      : Math.round(calculateRecipeMacros(selectedRecipe).fat * modalServings)}
                    g
                  </span>
                </div>
              </div>

              {/* Add to Today's Intake Section */}
              <div className="p-4 rounded-2xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#565e74]">
                    {isRtl ? 'عدد الحصص:' : 'Servings:'}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#e0e3e5]">
                    <button
                      onClick={() => setModalServings(Math.max(0.5, Number((modalServings - 0.5).toFixed(1))))}
                      disabled={modalServings <= 0.5}
                      className="w-6 h-6 rounded-lg bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black text-[#191c1e] min-w-8 text-center">
                      {modalServings}x
                    </span>
                    <button
                      onClick={() => setModalServings(Number((modalServings + 0.5).toFixed(1)))}
                      className="w-6 h-6 rounded-lg bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddModalRecipeToToday}
                  className={`h-11 px-5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                    modalAddSuccess
                      ? 'bg-[#506600] text-white'
                      : 'bg-[#191c1e] hover:bg-black text-[#ccff00]'
                  }`}
                >
                  {modalAddSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                      <span>{t('recipeAddedToToday')}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t('addToTodayIntake')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Recipe Personalizer Accordion */}
              <div className="bg-[#f7f9fb] rounded-2xl p-3.5 border border-[#e0e3e5] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#506600] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('personalizeRecipe')}
                  </span>
                  <button
                    onClick={handleFillRemainingMacros}
                    className="text-[11px] font-bold text-[#506600] underline hover:opacity-80"
                  >
                    {isRtl ? 'استخدام المتبقي من اليوم' : 'Use Remaining Today'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                      {t('targetCalories')}
                    </label>
                    <input
                      type="number"
                      value={targetCalories}
                      onChange={(e) => setTargetCalories(Number(e.target.value))}
                      className="w-full h-9 px-2 rounded-lg bg-white text-xs font-bold text-[#191c1e] border border-[#e0e3e5] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                      {t('targetProtein')}
                    </label>
                    <input
                      type="number"
                      value={targetProtein}
                      onChange={(e) => setTargetProtein(Number(e.target.value))}
                      className="w-full h-9 px-2 rounded-lg bg-white text-xs font-bold text-[#191c1e] border border-[#e0e3e5] outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunPersonalizer}
                  className="w-full h-10 rounded-xl bg-[#506600] hover:bg-[#3d4e00] text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{t('calculateScaledIngredients')}</span>
                </button>

                {/* Scaled Result Display */}
                {personalizerResult && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-[#506600]/30 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[#191c1e] leading-snug">
                      {getLocalizedText(personalizerResult.explanation, '')}
                    </p>
                    <div className="text-[11px] text-[#565e74] italic">
                      {t('exactMatchNotice')}
                    </div>
                  </div>
                )}
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="text-xs font-bold text-[#565e74] uppercase tracking-wider mb-2.5">
                  {personalizerResult ? t('adjustedRecipe') : t('ingredients')}
                </h4>
                <div className="flex flex-col gap-2">
                  {personalizerResult ? (
                    personalizerResult.scaledIngredients.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs font-semibold"
                      >
                        <span className="text-[#191c1e]">
                          {getLocalizedText(item.ingredient.name, 'Ingredient')}
                        </span>
                        <span className="font-extrabold text-[#506600]">
                          {item.adjustedGrams}g
                        </span>
                      </div>
                    ))
                  ) : (
                    (selectedRecipe.ingredients || []).map((item, idx) => {
                      const ing = getIngredientById(item.ingredientId);
                      const displayName = item.name
                        ? getLocalizedText(item.name)
                        : (ing ? getLocalizedText(ing.name) : item.ingredientId);
                      const displayAmount = item.amount
                        ? (modalServings !== 1 && item.amountGrams ? `${Math.round(item.amountGrams * modalServings)}g` : item.amount)
                        : (item.amountGrams ? `${Math.round(item.amountGrams * modalServings)}g` : '');

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs font-semibold"
                        >
                          <span className="text-[#191c1e]">{displayName}</span>
                          <span className="font-extrabold text-[#506600]">{displayAmount}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Preparation Steps */}
              <div>
                <h4 className="text-xs font-bold text-[#565e74] uppercase tracking-wider mb-2.5">
                  {t('preparationSteps')}
                </h4>
                <ol className="flex flex-col gap-2.5 list-decimal list-inside text-xs sm:text-sm text-[#191c1e] font-medium leading-relaxed">
                  {getInstructions(selectedRecipe.instructions).map((step, i) => (
                    <li key={i} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {activeRole === 'trainer' && (
                  <button
                    onClick={() => {
                      setEditingRecipe(selectedRecipe);
                      setShowEditRecipeModal(true);
                      setSelectedRecipe(null);
                    }}
                    className="flex-1 h-11 rounded-xl bg-[#191c1e] hover:bg-black text-[#ccff00] font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تعديل صورة وبيانات الوصفة' : 'Edit Recipe & Image'}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="flex-1 h-11 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-xs transition-colors"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "What Should I Eat?" Modal */}
      {showWhatShouldIEat && (
        <WhatShouldIEatModal
          onClose={() => setShowWhatShouldIEat(false)}
          onSelectRecipe={(recipe) => {
            handleOpenRecipe(recipe);
          }}
        />
      )}

      {/* Video Unavailable Dialog Modal (Requirement Section 3 & 11) */}
      {videoUnavailableNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#eceef0] flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Play className="w-7 h-7 fill-amber-700" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-black text-[#191c1e]">
                {isRtl ? 'الفيديو غير متاح حالياً' : 'Video is currently unavailable'}
              </h3>
              <p className="text-xs text-[#565e74] leading-relaxed">
                {isRtl
                  ? `لم يقم المدرب بإرفاق رابط فيديو توضيحي لوصفة "${videoUnavailableNotice}" حتى الآن. يمكنك مراجعة المكونات وخطوات التحضير المكتوبة بالأسفل.`
                  : `A video demonstration has not been linked for "${videoUnavailableNotice}" yet. You can view all preparation steps and ingredients directly below.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setVideoUnavailableNotice(null)}
              className="w-full h-11 rounded-2xl bg-[#191c1e] text-white hover:bg-black font-black text-xs transition-colors shadow-xs"
            >
              {isRtl ? 'حسناً، فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {/* Trainer Edit Recipe Modal */}
      <TrainerEditRecipeModal
        recipe={editingRecipe}
        isOpen={showEditRecipeModal}
        onClose={() => {
          setShowEditRecipeModal(false);
          setEditingRecipe(null);
        }}
      />

      {/* Trainer Add Recipe Modal */}
      <TrainerAddRecipeModal
        isOpen={showAddRecipeModal}
        onClose={() => setShowAddRecipeModal(false)}
      />
    </div>
  );
};
