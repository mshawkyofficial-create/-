import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientMeal, ClientMealOption, ClientMealFood, Ingredient, NutritionPlan } from '../../types';
import {
  generateSuggestedMealPlanClient,
  applyAssistantInstructionClient,
  calculateIngredientMacros,
} from '../../utils/nutritionEngine';
import {
  X,
  Plus,
  Trash2,
  Apple,
  Clock,
  Save,
  Search,
  Sparkles,
  Layers,
  Edit2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Video,
  ChevronRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface TrainerNutritionBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  planToEdit?: NutritionPlan | null;
  targetClientId?: string;
}

export const TrainerNutritionBuilderModal: React.FC<TrainerNutritionBuilderModalProps> = ({
  isOpen,
  onClose,
  planToEdit,
  targetClientId,
}) => {
  const {
    createNutritionPlan,
    updateNutritionPlan,
    ingredients,
    recipes,
    clients,
    language,
  } = useApp();

  const isRtl = language === 'ar';

  // Selected Client
  const [selectedClientId, setSelectedClientId] = useState<string>(
    targetClientId || planToEdit?.clientId || clients[0]?.id || ''
  );

  // Core Trainer-Controlled Targets (No plan names!)
  const [dailyCalories, setDailyCalories] = useState<number>(planToEdit?.dailyCalories || 2200);
  const [proteinGrams, setProteinGrams] = useState<number>(planToEdit?.proteinGrams || 160);
  const [carbsGrams, setCarbsGrams] = useState<number>(planToEdit?.carbsGrams || 250);
  const [fatGrams, setFatGrams] = useState<number>(planToEdit?.fatGrams || 70);
  const [mealCount, setMealCount] = useState<number>(planToEdit?.meals?.length || 4);

  // Inclusions, Exclusions, Preferences & Trainer Notes
  const [foodsToInclude, setFoodsToInclude] = useState<string>('Eggs, Chicken Breast, White/Jasmine Rice, Oats');
  const [foodsToExclude, setFoodsToExclude] = useState<string>('');
  const [mealPreference, setMealPreference] = useState<string>('Balanced');
  const [trainerNotes, setTrainerNotes] = useState<string>(
    planToEdit?.notes || 'Drink 3.5L to 4L of water daily. Follow assigned gram weights raw or cooked consistently.'
  );

  // AI Nutrition Assistant prompt & state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiAssistantMessage, setAiAssistantMessage] = useState<string | null>(null);

  // Meals List (each meal with exactly 3 options)
  const [meals, setMeals] = useState<ClientMeal[]>(() => {
    if (planToEdit && planToEdit.meals && planToEdit.meals.length > 0) {
      return JSON.parse(JSON.stringify(planToEdit.meals));
    }
    // Generate initial structured 3-option draft
    return generateSuggestedMealPlanClient({
      dailyCalories: 2200,
      proteinGrams: 160,
      carbsGrams: 250,
      fatGrams: 70,
      mealCount: 4,
      preferredFoods: ['Eggs', 'Chicken Breast', 'Rice', 'Oats'],
      recipes,
    });
  });

  // Active expanded meal for editing
  const [expandedMealIndex, setExpandedMealIndex] = useState<number>(0);
  const [editingOptionCoords, setEditingOptionCoords] = useState<{ mealIdx: number; optIdx: number } | null>(null);

  // Food Picker dialog
  const [showFoodPicker, setShowFoodPicker] = useState<boolean>(false);
  const [pickerTargetCoords, setPickerTargetCoords] = useState<{ mealIdx: number; optIdx: number } | null>(null);
  const [foodSearch, setFoodSearch] = useState<string>('');
  const [foodGramsInput, setFoodGramsInput] = useState<number>(100);

  // Recipe Picker dialog for swapping an option
  const [showRecipePicker, setShowRecipePicker] = useState<boolean>(false);
  const [recipeTargetCoords, setRecipeTargetCoords] = useState<{ mealIdx: number; optIdx: number } | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Sync client targets if client changes and we're starting a new plan
  useEffect(() => {
    if (selectedClient && !planToEdit) {
      if (selectedClient.dailyCaloriesTarget) setDailyCalories(selectedClient.dailyCaloriesTarget);
      if (selectedClient.proteinTarget) setProteinGrams(selectedClient.proteinTarget);
      if (selectedClient.carbsTarget) setCarbsGrams(selectedClient.carbsTarget);
      if (selectedClient.fatTarget) setFatGrams(selectedClient.fatTarget);
    }
  }, [selectedClientId, selectedClient, planToEdit]);

  if (!isOpen) return null;

  // Calculate average calories & macros of options in current plan
  const totalAverageCalories = Math.round(
    meals.reduce((acc, m) => {
      const opts = m.options && m.options.length > 0 ? m.options : [{ calories: m.calories || 0 }];
      const avg = opts.reduce((s, o) => s + (o.calories || 0), 0) / opts.length;
      return acc + avg;
    }, 0)
  );

  const totalAverageProtein = Math.round(
    meals.reduce((acc, m) => {
      const opts = m.options && m.options.length > 0 ? m.options : [{ protein: m.protein || 0 }];
      const avg = opts.reduce((s, o) => s + (o.protein || 0), 0) / opts.length;
      return acc + avg;
    }, 0)
  );

  const totalAverageCarbs = Math.round(
    meals.reduce((acc, m) => {
      const opts = m.options && m.options.length > 0 ? m.options : [{ carbs: m.carbs || 0 }];
      const avg = opts.reduce((s, o) => s + (o.carbs || 0), 0) / opts.length;
      return acc + avg;
    }, 0)
  );

  const totalAverageFat = Math.round(
    meals.reduce((acc, m) => {
      const opts = m.options && m.options.length > 0 ? m.options : [{ fat: m.fat || 0 }];
      const avg = opts.reduce((s, o) => s + (o.fat || 0), 0) / opts.length;
      return acc + avg;
    }, 0)
  );

  // AI Assistant Action: Generate / Modify Draft
  const handleExecuteAiInstruction = async (customInstruction?: string) => {
    const instruction = (customInstruction || aiPrompt).trim();
    if (!instruction) return;

    setIsAiLoading(true);
    setAiAssistantMessage(null);

    const clientProfile = {
      name: selectedClient?.name || 'Client',
      weightKg: selectedClient?.weightKg || 80,
      allergies: foodsToExclude.split(',').map((s) => s.trim()).filter(Boolean),
      foodDislikes: [],
      dietaryPreference: mealPreference,
    };

    const currentPlanPayload = {
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      mealCount: meals.length,
      meals,
    };

    try {
      const response = await fetch('/api/ai/nutrition-assistant-instruction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          currentPlan: currentPlanPayload,
          clientProfile,
          availableRecipes: recipes,
          availableIngredients: ingredients,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const data = json.data;
          if (data.dailyCalories) setDailyCalories(Number(data.dailyCalories));
          if (data.proteinGrams) setProteinGrams(Number(data.proteinGrams));
          if (data.carbsGrams) setCarbsGrams(Number(data.carbsGrams));
          if (data.fatGrams) setFatGrams(Number(data.fatGrams));
          if (data.meals && Array.isArray(data.meals) && data.meals.length > 0) {
            setMeals(data.meals);
            setMealCount(data.meals.length);
          }
          setAiAssistantMessage(
            data.explanation || (isRtl ? 'تم تحديث مسودة الخطة الغذائية بناءً على توجيهاتك بنجاح.' : 'Updated draft plan according to your instructions.')
          );
          setAiPrompt('');
          setIsAiLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend assistant request failed, executing client engine:', err);
    }

    // Client-side fallback
    const result = applyAssistantInstructionClient({
      currentPlan: currentPlanPayload,
      instruction,
      clientProfile,
      recipes,
    });

    setDailyCalories(result.dailyCalories);
    setProteinGrams(result.proteinGrams);
    setCarbsGrams(result.carbsGrams);
    setFatGrams(result.fatGrams);
    setMeals(result.meals);
    setMealCount(result.meals.length);
    setAiAssistantMessage(
      isRtl
        ? `تم تحديث الخطة بنجاح (مسودة): ${result.explanation}`
        : `Draft plan updated: ${result.explanation}`
    );
    setAiPrompt('');
    setIsAiLoading(false);
  };

  // Quick prompt presets for Trainer
  const handleQuickPrompt = (promptText: string) => {
    setAiPrompt(promptText);
    handleExecuteAiInstruction(promptText);
  };

  // Regenerate entire plan based on current target numbers
  const handleGenerateFreshPlan = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      const generated = generateSuggestedMealPlanClient({
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        mealCount,
        preferredFoods: foodsToInclude.split(',').map((s) => s.trim()).filter(Boolean),
        avoidFoods: foodsToExclude.split(',').map((s) => s.trim()).filter(Boolean),
        dietaryPreferences: mealPreference,
        recipes,
      });
      setMeals(generated);
      setIsAiLoading(false);
      setAiAssistantMessage(
        isRtl
          ? `تم إنشاء مسودة جديدة لـ ${mealCount} وجبات مع ٣ خيارات لكل وجبة.`
          : `Generated new draft for ${mealCount} meals with 3 options each.`
      );
    }, 200);
  };

  // Add custom meal
  const handleAddCustomMeal = () => {
    const nextNum = meals.length + 1;
    const newMeal = generateSuggestedMealPlanClient({
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      mealCount: nextNum,
      recipes,
    })[nextNum - 1] || {
      id: `meal_${Date.now()}_${nextNum}`,
      name: { en: `Meal ${nextNum}`, ar: `الوجبة ${nextNum}` },
      timing: '06:00 PM',
      targetCalories: Math.round(dailyCalories / nextNum),
      targetProtein: Math.round(proteinGrams / nextNum),
      targetCarbs: Math.round(carbsGrams / nextNum),
      targetFat: Math.round(fatGrams / nextNum),
      selectedOptionIndex: 0,
      options: [],
      foods: [],
    };

    setMeals([...meals, newMeal]);
    setMealCount(nextNum);
    setExpandedMealIndex(meals.length);
  };

  // Delete a meal
  const handleDeleteMeal = (mIdx: number) => {
    if (meals.length <= 1) return;
    const updated = meals.filter((_, i) => i !== mIdx);
    setMeals(updated);
    setMealCount(updated.length);
    setExpandedMealIndex(Math.max(0, mIdx - 1));
  };

  // Option Operations: Add Option, Delete Option, Edit Option
  const handleAddOptionToMeal = (mIdx: number) => {
    const targetMeal = meals[mIdx];
    if (!targetMeal) return;

    const optNum = (targetMeal.options?.length || 0) + 1;
    const newOpt: ClientMealOption = {
      id: `opt_${Date.now()}_${optNum}`,
      name: {
        en: `Custom Option ${optNum}`,
        ar: `خيار مخصص ${optNum}`,
      },
      sourceType: 'ai',
      notes: 'Balanced whole-food choice.',
      substitutions: 'Weigh raw ingredients on digital scale.',
      foods: [
        {
          id: `f_${Date.now()}_1`,
          ingredientId: 'ing_chicken_breast',
          foodName: { en: 'Grilled Chicken Breast', ar: 'صدر دجاج مشوي' },
          amountGrams: 180,
          calories: 297,
          protein: 55.8,
          carbs: 0.0,
          fat: 6.5,
        },
        {
          id: `f_${Date.now()}_2`,
          ingredientId: 'ing_rice',
          foodName: { en: 'Steamed White Rice', ar: 'أرز أبيض مطبوخ' },
          amountGrams: 200,
          calories: 260,
          protein: 5.0,
          carbs: 58.0,
          fat: 0.5,
        },
      ],
      calories: 557,
      protein: 60.8,
      carbs: 58.0,
      fat: 7.0,
    };

    setMeals((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        return {
          ...m,
          options: [...(m.options || []), newOpt],
        };
      })
    );
  };

  const handleDeleteOptionFromMeal = (mIdx: number, optIdx: number) => {
    setMeals((prev) =>
      prev.map((m, i) => {
        if (i !== mIdx) return m;
        const remainingOpts = (m.options || []).filter((_, idx) => idx !== optIdx);
        return {
          ...m,
          options: remainingOpts,
          selectedOptionIndex: Math.min(m.selectedOptionIndex || 0, Math.max(0, remainingOpts.length - 1)),
        };
      })
    );
  };

  // Add Food from database to a specific option
  const handleAddFoodToOption = (ing: Ingredient, grams: number) => {
    if (!pickerTargetCoords) return;
    const { mealIdx, optIdx } = pickerTargetCoords;
    const ratio = grams / 100;
    const newFood: ClientMealFood = {
      id: `food_${Date.now()}`,
      ingredientId: ing.id,
      foodName: { en: ing.name.en, ar: ing.name.ar },
      amountGrams: grams,
      calories: Math.round(ing.caloriesPer100g * ratio),
      protein: Number((ing.proteinPer100g * ratio).toFixed(1)),
      carbs: Number((ing.carbsPer100g * ratio).toFixed(1)),
      fat: Number((ing.fatPer100g * ratio).toFixed(1)),
    };

    setMeals((prev) =>
      prev.map((m, i) => {
        if (i !== mealIdx) return m;
        const updatedOpts = (m.options || []).map((opt, oIdx) => {
          if (oIdx !== optIdx) return opt;
          const updatedFoods = [...opt.foods, newFood];
          const c = updatedFoods.reduce((acc, f) => acc + f.calories, 0);
          const p = Math.round(updatedFoods.reduce((acc, f) => acc + f.protein, 0));
          const cb = Math.round(updatedFoods.reduce((acc, f) => acc + f.carbs, 0));
          const ft = Math.round(updatedFoods.reduce((acc, f) => acc + f.fat, 0));
          return {
            ...opt,
            foods: updatedFoods,
            calories: c,
            protein: p,
            carbs: cb,
            fat: ft,
          };
        });
        return { ...m, options: updatedOpts };
      })
    );

    setShowFoodPicker(false);
  };

  // Update grams of a food inside an option
  const handleUpdateOptionFoodGrams = (mealIdx: number, optIdx: number, foodIdx: number, newGrams: number) => {
    setMeals((prev) =>
      prev.map((m, i) => {
        if (i !== mealIdx) return m;
        const updatedOpts = (m.options || []).map((opt, oIdx) => {
          if (oIdx !== optIdx) return opt;
          const updatedFoods = opt.foods.map((f, fIdx) => {
            if (fIdx !== foodIdx) return f;
            const ing = ingredients.find((item) => item.id === f.ingredientId);
            const ratio = (newGrams || 0) / 100;
            return {
              ...f,
              amountGrams: newGrams,
              calories: ing ? Math.round(ing.caloriesPer100g * ratio) : f.calories,
              protein: ing ? Number((ing.proteinPer100g * ratio).toFixed(1)) : f.protein,
              carbs: ing ? Number((ing.carbsPer100g * ratio).toFixed(1)) : f.carbs,
              fat: ing ? Number((ing.fatPer100g * ratio).toFixed(1)) : f.fat,
            };
          });
          const c = updatedFoods.reduce((acc, f) => acc + f.calories, 0);
          const p = Math.round(updatedFoods.reduce((acc, f) => acc + f.protein, 0));
          const cb = Math.round(updatedFoods.reduce((acc, f) => acc + f.carbs, 0));
          const ft = Math.round(updatedFoods.reduce((acc, f) => acc + f.fat, 0));
          return {
            ...opt,
            foods: updatedFoods,
            calories: c,
            protein: p,
            carbs: cb,
            fat: ft,
          };
        });
        return { ...m, options: updatedOpts };
      })
    );
  };

  // Remove food from an option
  const handleRemoveOptionFood = (mealIdx: number, optIdx: number, foodIdx: number) => {
    setMeals((prev) =>
      prev.map((m, i) => {
        if (i !== mealIdx) return m;
        const updatedOpts = (m.options || []).map((opt, oIdx) => {
          if (oIdx !== optIdx) return opt;
          const updatedFoods = opt.foods.filter((_, fIdx) => fIdx !== foodIdx);
          const c = updatedFoods.reduce((acc, f) => acc + f.calories, 0);
          const p = Math.round(updatedFoods.reduce((acc, f) => acc + f.protein, 0));
          const cb = Math.round(updatedFoods.reduce((acc, f) => acc + f.carbs, 0));
          const ft = Math.round(updatedFoods.reduce((acc, f) => acc + f.fat, 0));
          return {
            ...opt,
            foods: updatedFoods,
            calories: c,
            protein: p,
            carbs: cb,
            fat: ft,
          };
        });
        return { ...m, options: updatedOpts };
      })
    );
  };

  // Final Approve & Assign Action
  const handleApproveAndAssign = () => {
    const clientName = selectedClient?.name || 'Client';

    // Standardized non-marketing name strictly tied to the client
    const planTitle = {
      en: `${clientName}'s Nutrition Plan`,
      ar: `الخطة الغذائية لـ ${clientName}`,
    };

    const finalPlan: Partial<NutritionPlan> = {
      title: planTitle,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      notes: trainerNotes,
      meals,
      clientId: selectedClientId || undefined,
      isTemplate: !selectedClientId,
      status: 'active',
    };

    if (planToEdit) {
      updateNutritionPlan(planToEdit.id, finalPlan);
    } else {
      createNutritionPlan(finalPlan, selectedClientId || undefined);
    }

    onClose();
  };

  const filteredIngredients = ingredients.filter((ing) => {
    const query = foodSearch.toLowerCase();
    const nameEn = ing.name?.en?.toLowerCase() || '';
    const nameAr = ing.name?.ar || '';
    return nameEn.includes(query) || nameAr.includes(foodSearch);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-5xl shadow-2xl border border-[#eceef0] max-h-[94vh] overflow-y-auto flex flex-col gap-5">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-[#191c1e]">
                  {isRtl ? 'منشئ خطط التغذية (إشراف الكوتش)' : 'Trainer Nutrition Builder'}
                </h3>
                <span className="text-[10px] font-black text-[#506600] bg-[#ccff00]/25 px-2 py-0.5 rounded-md">
                  {isRtl ? '٣ خيارات لكل وجبة' : '3 Options Per Meal'}
                </span>
              </div>
              <p className="text-xs text-[#565e74]">
                {isRtl
                  ? 'تحديد السعرات والماكروز المستهدفة وإعداد خيارات الوجبات بدقة'
                  : 'Set coach-controlled calories, macros, and structured meal options'}
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

        {/* SECTION 1: CLIENT SELECTION */}
        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <label className="text-[11px] font-extrabold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'اختر العميل المخصص له الخطة' : 'Assigned Client'}
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e] outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email}) - {c.weightKg || 80} kg
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="text-xs text-[#565e74] flex flex-wrap gap-2 items-center">
              <span className="font-bold text-[#191c1e]">
                {isRtl ? 'الوزن الحالي:' : 'Current Weight:'}{' '}
                <span className="text-[#506600] font-black">{selectedClient.weightKg || 80} kg</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-bold text-[#191c1e]">
                {isRtl ? 'الوزن المستهدف:' : 'Target Weight:'}{' '}
                <span className="text-[#0284c7] font-black">{selectedClient.targetWeightKg || 75} kg</span>
              </span>
            </div>
          )}
        </div>

        {/* SECTION 2: TRAINER-CONTROLLED TARGETS (NO PLAN NAME INPUTS) */}
        <div className="bg-white rounded-2xl p-4 border border-[#e0e3e5] shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#191c1e] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#506600]" />
              {isRtl ? 'أهداف السعرات والماكروز (تحكم الكوتش)' : 'Trainer-Assigned Target Macros & Meals'}
            </span>
            <span className="text-[11px] font-bold text-[#565e74]">
              {isRtl ? 'يتم تطبيقها مباشرة على العميل' : 'Client will view these exact targets'}
            </span>
          </div>

          {/* 5 Input Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Calories */}
            <div className="bg-[#f7faf0] p-3 rounded-xl border border-[#506600]/30 flex flex-col">
              <label className="text-[10px] font-bold text-[#506600] uppercase block">
                {isRtl ? 'السعرات اليومية' : 'Daily Calories'}
              </label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(Number(e.target.value))}
                  className="w-full h-8 text-base font-black text-[#191c1e] bg-transparent outline-none"
                />
                <span className="text-[11px] font-bold text-[#565e74]">kcal</span>
              </div>
            </div>

            {/* Protein */}
            <div className="bg-[#f7faf0] p-3 rounded-xl border border-[#506600]/30 flex flex-col">
              <label className="text-[10px] font-bold text-[#506600] uppercase block">
                {isRtl ? 'البروتين' : 'Protein'}
              </label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  className="w-full h-8 text-base font-black text-[#191c1e] bg-transparent outline-none"
                />
                <span className="text-[11px] font-bold text-[#565e74]">g</span>
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-[#f0f9ff] p-3 rounded-xl border border-[#0284c7]/30 flex flex-col">
              <label className="text-[10px] font-bold text-[#0284c7] uppercase block">
                {isRtl ? 'الكربوهيدرات' : 'Carbohydrates'}
              </label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  className="w-full h-8 text-base font-black text-[#191c1e] bg-transparent outline-none"
                />
                <span className="text-[11px] font-bold text-[#565e74]">g</span>
              </div>
            </div>

            {/* Fats */}
            <div className="bg-[#fffbeb] p-3 rounded-xl border border-[#d97706]/30 flex flex-col">
              <label className="text-[10px] font-bold text-[#d97706] uppercase block">
                {isRtl ? 'الدهون الصحية' : 'Fats'}
              </label>
              <div className="flex items-baseline gap-1 mt-1">
                <input
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  className="w-full h-8 text-base font-black text-[#191c1e] bg-transparent outline-none"
                />
                <span className="text-[11px] font-bold text-[#565e74]">g</span>
              </div>
            </div>

            {/* Number of Meals */}
            <div className="bg-[#f2f4f6] p-3 rounded-xl border border-[#e0e3e5] col-span-2 sm:col-span-1 flex flex-col">
              <label className="text-[10px] font-bold text-[#565e74] uppercase block">
                {isRtl ? 'عدد الوجبات' : 'Number of Meals'}
              </label>
              <div className="flex items-center gap-1 mt-1">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setMealCount(num);
                      const regenerated = generateSuggestedMealPlanClient({
                        dailyCalories,
                        proteinGrams,
                        carbsGrams,
                        fatGrams,
                        mealCount: num,
                        recipes,
                      });
                      setMeals(regenerated);
                    }}
                    className={`flex-1 h-8 rounded-lg text-xs font-black transition-all ${
                      mealCount === num
                        ? 'bg-[#191c1e] text-[#ccff00] shadow-xs'
                        : 'bg-white text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Foods to Include / Exclude & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'أطعمة ومكونات مفضلة للدمج' : 'Foods to Include'}
              </label>
              <input
                type="text"
                value={foodsToInclude}
                onChange={(e) => setFoodsToInclude(e.target.value)}
                placeholder="e.g. Eggs, Chicken, Rice, Oats, Salmon"
                className="w-full h-9 px-3 rounded-xl bg-[#f2f4f6] text-xs font-semibold text-[#191c1e] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'أطعمة أو حساسيات مستبعدة' : 'Foods to Exclude / Allergies'}
              </label>
              <input
                type="text"
                value={foodsToExclude}
                onChange={(e) => setFoodsToExclude(e.target.value)}
                placeholder="e.g. Dairy, Tuna, Seafood, Peanuts"
                className="w-full h-9 px-3 rounded-xl bg-[#f2f4f6] text-xs font-semibold text-[#191c1e] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'نمط وتفضيل الوجبات' : 'Meal Style Preference'}
              </label>
              <select
                value={mealPreference}
                onChange={(e) => setMealPreference(e.target.value)}
                className="w-full h-9 px-2.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                <option value="Balanced">{isRtl ? 'متوازن (Balanced Whole Foods)' : 'Balanced Whole Foods'}</option>
                <option value="High Protein">{isRtl ? 'عالي البروتين (High Protein Focus)' : 'High Protein Focus'}</option>
                <option value="Pre/Post Workout">{isRtl ? 'توقيت حول التمرين (Pre/Post Workout Split)' : 'Pre/Post Workout Split'}</option>
                <option value="Mediterranean">{isRtl ? 'حمية البحر المتوسط (Mediterranean)' : 'Mediterranean Style'}</option>
                <option value="Low Carb">{isRtl ? 'قليل الكاربوهيدرات (Low Carb / Keto)' : 'Low Carb / Keto'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: AI TRAINER NUTRITION ASSISTANT */}
        <div className="bg-[#191c1e] text-white rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ccff00]/20 text-[#ccff00] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{isRtl ? 'المساعد الذكي لإعداد الخطة الغذائية' : 'AI Trainer Nutrition Assistant'}</span>
                  <span className="text-[10px] font-bold bg-[#ccff00]/20 text-[#ccff00] px-2 py-0.5 rounded-md">
                    {isRtl ? 'مسودة خاصة بالكوتش' : 'Trainer Draft'}
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400">
                  {isRtl
                    ? 'اكتب توجيهاتك للمساعد لتوليد الخطة أو تعديل وجبة معينة (لا يُنشر شيء للعميل إلا بعد اعتمادك)'
                    : 'Tell AI what you want or request targeted adjustments. Nothing is published until approved.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateFreshPlan}
              disabled={isAiLoading}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isRtl ? 'توليد مسودة جديدة' : 'Generate Fresh Draft'}</span>
            </button>
          </div>

          {/* Natural Language Prompt Input */}
          <div className="flex gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleExecuteAiInstruction();
                }
              }}
              placeholder={
                isRtl
                  ? 'اكتب توجيهك (مثال: أنشئ ٤ وجبات بـ ٢٢٠٠ سعرة، مع صدر دجاج وبيض وشوفان، واستبعد التونة...)'
                  : "Tell AI assistant what you need (e.g. '4 meals, 2200 kcal, 160g protein. Include eggs, chicken, rice. No dairy. 3 options per meal')..."
              }
              className="flex-1 px-3 bg-transparent text-xs text-white placeholder:text-gray-400 outline-none"
            />
            <button
              type="button"
              onClick={() => handleExecuteAiInstruction()}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="px-4 h-9 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-50 text-[#191c1e] text-xs font-black flex items-center gap-1.5 transition-all"
            >
              {isAiLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isRtl ? 'تطبيق' : 'Apply'}</span>
            </button>
          </div>

          {/* Quick Follow-Up Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
            <span className="text-gray-400 font-bold shrink-0">
              {isRtl ? 'تعديلات سريعة:' : 'Quick Actions:'}
            </span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Increase protein by 20g and adjust meals')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-medium shrink-0"
            >
              ⚡ {isRtl ? 'زيادة البروتين (+20g)' : '+20g Protein'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Reduce carbohydrates and increase healthy fats')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-medium shrink-0"
            >
              ⚡ {isRtl ? 'تقليل الكارب وزيادة الدهون' : 'Lower Carbs'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Replace Meal 2 with higher protein options')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-medium shrink-0"
            >
              ⚡ {isRtl ? 'تغيير خيارات الوجبة ٢' : 'Replace Meal 2'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Make breakfast higher in protein with whole eggs and oats')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-medium shrink-0"
            >
              ⚡ {isRtl ? 'فطور عالي البروتين' : 'High Protein Breakfast'}
            </button>
          </div>

          {/* Assistant feedback message */}
          {aiAssistantMessage && (
            <div className="p-2.5 rounded-xl bg-[#ccff00]/15 border border-[#ccff00]/30 text-xs font-semibold text-[#ccff00] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{aiAssistantMessage}</span>
            </div>
          )}
        </div>

        {/* SECTION 4: MEALS WITH 3 OPTIONS PER MEAL */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
                <span>{isRtl ? 'جدول الوجبات والخيارات الثلاثة' : 'Meal Schedule & 3 Options Per Meal'}</span>
                <span className="text-xs font-bold text-[#565e74]">
                  ({meals.length} {isRtl ? 'وجبات' : 'Meals'})
                </span>
              </h4>
              <p className="text-xs text-[#565e74]">
                {isRtl
                  ? 'يحتوي كل موعد وجبة على ٣ خيارات متكافئة يختار العميل أحدها يومياً'
                  : 'Each meal includes 3 balanced options. The client selects one option per meal.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddCustomMeal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#191c1e] text-white text-xs font-bold hover:bg-[#2c3135] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة وجبة إضافية' : 'Add Meal'}</span>
            </button>
          </div>

          {/* Meals Accordion List */}
          <div className="flex flex-col gap-4">
            {meals.map((meal, mIdx) => {
              const isExpanded = expandedMealIndex === mIdx;
              const options = meal.options && meal.options.length > 0 ? meal.options : [];

              return (
                <div
                  key={meal.id || mIdx}
                  className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden shadow-2xs transition-all"
                >
                  {/* Meal Header Row */}
                  <div
                    onClick={() => setExpandedMealIndex(isExpanded ? -1 : mIdx)}
                    className="p-4 bg-[#f7f9fb] hover:bg-[#f2f4f6] cursor-pointer flex flex-wrap items-center justify-between gap-3 border-b border-[#e0e3e5]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs flex items-center justify-center">
                        M{mIdx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#191c1e]">
                            {typeof meal.name === 'string'
                              ? meal.name
                              : isRtl
                              ? meal.name?.ar || meal.name?.en || `الوجبة ${mIdx + 1}`
                              : meal.name?.en || meal.name?.ar || `Meal ${mIdx + 1}`}
                          </span>
                          <span className="text-[11px] font-bold text-[#565e74] bg-white px-2 py-0.5 rounded-md border border-[#e0e3e5]">
                            {meal.timing || '12:00 PM'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#506600]">
                          {meal.targetCalories || 500} kcal • P: {meal.targetProtein || 40}g • C: {meal.targetCarbs || 60}g • F: {meal.targetFat || 15}g
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-bold text-[#565e74] bg-white px-2.5 py-1 rounded-lg border border-[#e0e3e5]">
                        {options.length} {isRtl ? 'خيارات' : 'Options'}
                      </span>

                      {meals.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMeal(mIdx)}
                          className="w-8 h-8 rounded-xl bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] flex items-center justify-center"
                          title="Delete Meal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedMealIndex(isExpanded ? -1 : mIdx)}
                        className="w-8 h-8 rounded-xl bg-white border border-[#e0e3e5] text-[#565e74] flex items-center justify-center"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content: Meal Metadata + 3 Options */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 flex flex-col gap-4 animate-fade-in">
                      {/* Meal timing & quick notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-center gap-2 bg-[#f7f9fb] px-3 rounded-xl border border-[#e0e3e5]">
                          <Clock className="w-3.5 h-3.5 text-[#565e74]" />
                          <input
                            type="text"
                            value={meal.timing || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMeals((prev) =>
                                prev.map((m, i) => (i === mIdx ? { ...m, timing: val } : m))
                              );
                            }}
                            placeholder="Meal Timing (e.g. 08:30 AM)"
                            className="w-full h-9 text-xs font-bold text-[#191c1e] bg-transparent outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 bg-[#f7f9fb] px-3 rounded-xl border border-[#e0e3e5]">
                          <input
                            type="text"
                            value={meal.notes || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMeals((prev) =>
                                prev.map((m, i) => (i === mIdx ? { ...m, notes: val } : m))
                              );
                            }}
                            placeholder={isRtl ? 'توجيهات وإرشادات الوجبة...' : 'Meal instructions / notes...'}
                            className="w-full h-9 text-xs text-[#191c1e] bg-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* 3 Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {options.map((opt, optIdx) => {
                          return (
                            <div
                              key={opt.id || optIdx}
                              className="bg-[#f7f9fb] rounded-2xl p-3.5 border border-[#e0e3e5] flex flex-col justify-between gap-3 hover:border-[#506600]/40 transition-all"
                            >
                              {/* Option Header */}
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-black text-[#506600] uppercase bg-[#ccff00]/25 px-2 py-0.5 rounded-md">
                                    {isRtl ? `الخيار ${optIdx + 1}` : `Option ${optIdx + 1}`}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    {opt.videoUrl && (
                                      <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 flex items-center justify-center" title="Video Recipe">
                                        <Video className="w-3 h-3" />
                                      </span>
                                    )}
                                    {options.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOptionFromMeal(mIdx, optIdx)}
                                        className="w-6 h-6 rounded-md hover:bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center"
                                        title="Delete Option"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <input
                                  type="text"
                                  value={
                                    typeof opt.name === 'string'
                                      ? opt.name
                                      : isRtl
                                      ? opt.name?.ar || opt.name?.en || ''
                                      : opt.name?.en || opt.name?.ar || ''
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setMeals((prev) =>
                                      prev.map((m, i) => {
                                        if (i !== mIdx) return m;
                                        const updatedOpts = (m.options || []).map((o, idx) =>
                                          idx === optIdx
                                            ? { ...o, name: isRtl ? { ar: val, en: typeof o.name === 'object' ? o.name.en : val } : { en: val, ar: typeof o.name === 'object' ? o.name.ar : val } }
                                            : o
                                        );
                                        return { ...m, options: updatedOpts };
                                      })
                                    );
                                  }}
                                  className="w-full text-xs font-black text-[#191c1e] bg-white px-2 py-1.5 rounded-lg border border-[#e0e3e5] outline-none"
                                />

                                {/* Macros badge */}
                                <div className="flex items-center justify-between text-[11px] font-bold text-[#191c1e] bg-white p-2 rounded-xl border border-[#e0e3e5]">
                                  <span className="font-black text-[#506600]">{opt.calories} kcal</span>
                                  <span className="text-[10px] text-[#565e74]">
                                    P: {opt.protein}g | C: {opt.carbs}g | F: {opt.fat}g
                                  </span>
                                </div>
                              </div>

                              {/* Food Ingredients with Grams */}
                              <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-bold text-[#565e74] uppercase">
                                  {isRtl ? 'المكونات والجرامات:' : 'Ingredients (g):'}
                                </span>

                                <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-0.5">
                                  {(opt.foods || []).map((food, fIdx) => (
                                    <div
                                      key={food.id || fIdx}
                                      className="flex items-center justify-between gap-1.5 bg-white p-1.5 px-2 rounded-lg border border-[#e0e3e5] text-xs"
                                    >
                                      <div className="flex-1 truncate">
                                        <span className="font-bold text-[#191c1e] block truncate text-[11px]">
                                          {typeof food.foodName === 'string'
                                            ? food.foodName
                                            : isRtl
                                            ? food.foodName?.ar || food.foodName?.en || 'طعام'
                                            : food.foodName?.en || food.foodName?.ar || 'Food'}
                                        </span>
                                        <span className="text-[9px] text-[#565e74]">
                                          {food.calories} kcal • P:{food.protein}g
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          value={food.amountGrams}
                                          onChange={(e) =>
                                            handleUpdateOptionFoodGrams(mIdx, optIdx, fIdx, Number(e.target.value))
                                          }
                                          className="w-12 h-6 bg-[#f2f4f6] rounded text-center text-xs font-black outline-none text-[#191c1e]"
                                        />
                                        <span className="text-[10px] text-[#565e74]">g</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveOptionFood(mIdx, optIdx, fIdx)}
                                          className="w-5 h-5 rounded hover:bg-red-50 text-red-500 flex items-center justify-center"
                                        >
                                          <Trash2 className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickerTargetCoords({ mealIdx: mIdx, optIdx });
                                    setShowFoodPicker(true);
                                  }}
                                  className="w-full py-1.5 rounded-lg bg-white hover:bg-[#f2f4f6] text-[11px] font-extrabold text-[#506600] border border-dashed border-[#506600]/40 flex items-center justify-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{isRtl ? 'إضافة مكون' : 'Add Food'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Option Actions: Add 4th Option / Balance */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddOptionToMeal(mIdx)}
                          className="px-3 py-1.5 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-xs font-bold text-[#191c1e] flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#506600]" />
                          <span>{isRtl ? 'إضافة خيار إضافي لهذه الوجبة' : 'Add Option to this Meal'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: TRAINER NOTES & GUIDELINES */}
        <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] flex flex-col gap-1.5">
          <label className="text-xs font-black text-[#565e74] uppercase block">
            {isRtl ? 'إرشادات وملاحظات الكوتش العامة' : 'Trainer General Guidelines & Instructions'}
          </label>
          <textarea
            value={trainerNotes}
            onChange={(e) => setTrainerNotes(e.target.value)}
            rows={2}
            className="w-full p-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] outline-none resize-none"
            placeholder="Hydration, supplement timing, meal prep advice..."
          />
        </div>

        {/* SUMMARY & APPROVAL FOOTER */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="text-xs">
              <span className="text-[#565e74] font-bold block">{isRtl ? 'متوسط السعرات المحققة:' : 'Achieved Options Average:'}</span>
              <span className="text-sm font-black text-[#191c1e]">
                {totalAverageCalories} kcal • P: {totalAverageProtein}g • C: {totalAverageCarbs}g • F: {totalAverageFat}g
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-12 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5] transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleApproveAndAssign}
              className="px-6 h-12 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-[#191c1e] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#ccff00]/25 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isRtl ? 'اعتماد الخطة وتعيينها للعميل' : 'Approve & Assign to Client'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Food Picker Modal */}
      {showFoodPicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-[#eceef0] max-h-[85vh] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#191c1e]">
                {isRtl ? 'اختر صنفاً من قاعدة المكونات' : 'Select Food Ingredient'}
              </h4>
              <button
                type="button"
                onClick={() => setShowFoodPicker(false)}
                className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 rounded-xl">
              <Search className="w-4 h-4 text-[#565e74]" />
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder={isRtl ? 'ابحث عن صنف...' : 'Search ingredient name...'}
                className="w-full h-10 bg-transparent text-xs font-medium outline-none text-[#191c1e]"
              />
            </div>

            <div className="flex items-center justify-between bg-[#f7faf0] p-2.5 rounded-xl border border-[#506600]/20">
              <span className="text-xs font-bold text-[#506600]">
                {isRtl ? 'الوزن بالجرام:' : 'Portion (grams):'}
              </span>
              <div className="flex items-center gap-1 bg-white px-2 rounded-lg border border-[#e0e3e5]">
                <input
                  type="number"
                  value={foodGramsInput}
                  onChange={(e) => setFoodGramsInput(Number(e.target.value))}
                  className="w-14 h-8 text-xs font-black text-[#191c1e] text-center outline-none"
                />
                <span className="text-xs font-bold text-[#565e74]">g</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 max-h-72 pr-1">
              {filteredIngredients.map((ing) => {
                const ratio = foodGramsInput / 100;
                const cal = Math.round(ing.caloriesPer100g * ratio);
                const p = (ing.proteinPer100g * ratio).toFixed(1);
                const c = (ing.carbsPer100g * ratio).toFixed(1);
                const f = (ing.fatPer100g * ratio).toFixed(1);

                return (
                  <div
                    key={ing.id}
                    onClick={() => handleAddFoodToOption(ing, foodGramsInput)}
                    className="p-2.5 rounded-xl border border-[#e0e3e5] hover:border-[#ccff00] hover:bg-[#f7faf0] flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <h6 className="text-xs font-black text-[#191c1e]">
                        {typeof ing.name === 'string'
                          ? ing.name
                          : isRtl
                          ? ing.name?.ar || ing.name?.en
                          : ing.name?.en || ing.name?.ar}
                      </h6>
                      <span className="text-[10px] text-[#565e74]">
                        {foodGramsInput}g = {cal} kcal • P: {p}g • C: {c}g • F: {f}g
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-[#506600]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
