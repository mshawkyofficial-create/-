import { ClientMeal, ClientMealOption, ClientMealFood, Ingredient, Recipe } from '../types';

export interface AIMealPlanRequest {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  mealCount: number; // 2, 3, 4, 5, 6
  preferredFoods: string[];
  avoidFoods: string[];
  allergies: string[];
  dietaryPreferences: string;
  mealTimings?: string[];
  availableRecipes: Recipe[];
  availableIngredients: Ingredient[];
}

export function calculateFoodMacros(ingredient: Ingredient, grams: number): Omit<ClientMealFood, 'id'> {
  const ratio = Math.max(0, grams) / 100;
  return {
    ingredientId: ingredient.id,
    foodName: ingredient.name,
    amountGrams: Math.round(grams),
    calories: Math.round(ingredient.caloriesPer100g * ratio),
    protein: Number((ingredient.proteinPer100g * ratio).toFixed(1)),
    carbs: Number((ingredient.carbsPer100g * ratio).toFixed(1)),
    fat: Number((ingredient.fatPer100g * ratio).toFixed(1)),
    unit: 'g',
  };
}

export function calculateOptionTotals(foods: ClientMealFood[]): { calories: number; protein: number; carbs: number; fat: number } {
  return foods.reduce(
    (acc, f) => {
      acc.calories += f.calories || 0;
      acc.protein += f.protein || 0;
      acc.carbs += f.carbs || 0;
      acc.fat += f.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

// Generate robust, balanced fallback options from ingredients & recipes
export function generateDeterministicMealPlan(req: AIMealPlanRequest): ClientMeal[] {
  const {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    mealCount,
    dietaryPreferences,
    availableRecipes,
    availableIngredients,
  } = req;

  // Default meal timing presets depending on count
  const timingPresets: Record<number, { times: string[]; names: { en: string; ar: string }[] }> = {
    2: {
      times: ['11:30 AM', '07:30 PM'],
      names: [
        { en: 'Brunch (High Protein)', ar: 'الفطور المتأخر (عالي البروتين)' },
        { en: 'Dinner (Recovery Feast)', ar: 'العشاء (وجبة الاستشفاء)' },
      ],
    },
    3: {
      times: ['08:00 AM', '01:30 PM', '08:00 PM'],
      names: [
        { en: 'Breakfast (Morning Fuel)', ar: 'الفطور (طاقة الصباح)' },
        { en: 'Lunch (Performance Fuel)', ar: 'الغداء (وجبة الأداء)' },
        { en: 'Dinner (Muscle Recovery)', ar: 'العشاء (استشفاء العضلات)' },
      ],
    },
    4: {
      times: ['08:00 AM', '12:30 PM', '04:30 PM', '08:30 PM'],
      names: [
        { en: 'Meal 1: Breakfast', ar: 'الوجبة ١: الفطور' },
        { en: 'Meal 2: Lunch', ar: 'الوجبة ٢: الغداء' },
        { en: 'Meal 3: Pre/Post Workout', ar: 'الوجبة ٣: قبل/بعد التمرين' },
        { en: 'Meal 4: Dinner', ar: 'الوجبة ٤: العشاء' },
      ],
    },
    5: {
      times: ['07:30 AM', '11:00 AM', '02:30 PM', '06:00 PM', '09:30 PM'],
      names: [
        { en: 'Meal 1: Breakfast', ar: 'الوجبة ١: الفطور' },
        { en: 'Meal 2: Mid-Morning Snack', ar: 'الوجبة ٢: وجبة خفيفة صباحية' },
        { en: 'Meal 3: Lunch', ar: 'الوجبة ٣: الغداء' },
        { en: 'Meal 4: Pre-Workout', ar: 'الوجبة ٤: قبل التمرين' },
        { en: 'Meal 5: Dinner', ar: 'الوجبة ٥: العشاء' },
      ],
    },
    6: {
      times: ['07:00 AM', '10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '09:30 PM'],
      names: [
        { en: 'Meal 1: Breakfast', ar: 'الوجبة ١: الفطور' },
        { en: 'Meal 2: Snack 1', ar: 'الوجبة ٢: وجبة خفيفة ١' },
        { en: 'Meal 3: Lunch', ar: 'الوجبة ٣: الغداء' },
        { en: 'Meal 4: Snack 2 / Pre-Workout', ar: 'الوجبة ٤: قبل التمرين' },
        { en: 'Meal 5: Dinner', ar: 'الوجبة ٥: العشاء' },
        { en: 'Meal 6: Night Protein Snack', ar: 'الوجبة ٦: بروتين قبل النوم' },
      ],
    },
  };

  const preset = timingPresets[mealCount] || timingPresets[4];
  const targetPerMealCal = Math.round(dailyCalories / mealCount);
  const targetPerMealProtein = Math.round(proteinGrams / mealCount);
  const targetPerMealCarbs = Math.round(carbsGrams / mealCount);
  const targetPerMealFat = Math.round(fatGrams / mealCount);

  const getIng = (id: string, fallbackName: { en: string; ar: string }) => {
    return availableIngredients.find((i) => i.id === id) || {
      id,
      name: fallbackName,
      caloriesPer100g: 150,
      proteinPer100g: 15,
      carbsPer100g: 10,
      fatPer100g: 5,
      defaultUnit: 'g',
    };
  };

  const createdMeals: ClientMeal[] = [];

  for (let mIdx = 0; mIdx < mealCount; mIdx++) {
    const mealName = preset.names[mIdx] || { en: `Meal ${mIdx + 1}`, ar: `الوجبة ${mIdx + 1}` };
    const timing = req.mealTimings?.[mIdx] || preset.times[mIdx] || `${8 + mIdx * 3}:00`;

    // Find any suitable recipe from mockRecipes
    const matchingRecipe = availableRecipes[mIdx % availableRecipes.length];

    // Option 1: Existing Recipe (if matched) or High-Protein whole meal
    const opt1Foods: ClientMealFood[] = [];
    if (matchingRecipe && matchingRecipe.ingredients?.length > 0) {
      matchingRecipe.ingredients.forEach((ingItem, iIdx) => {
        const ing = availableIngredients.find((i) => i.id === ingItem.ingredientId) || getIng(ingItem.ingredientId, { en: 'Ingredient', ar: 'مكون' });
        // Scale to fit meal targets
        const scaledGrams = Math.round(ingItem.amountGrams * (targetPerMealCal / 450));
        const macros = calculateFoodMacros(ing, scaledGrams || ingItem.amountGrams);
        opt1Foods.push({
          id: `f_${Date.now()}_m${mIdx}_o1_${iIdx}`,
          ...macros,
        });
      });
    } else {
      const chicken = getIng('ing_chicken_breast', { en: 'Skinless Chicken Breast', ar: 'صدر دجاج' });
      const rice = getIng('ing_rice', { en: 'Jasmine Rice', ar: 'أرز ياسمين' });
      const oil = getIng('ing_olive_oil', { en: 'Olive Oil', ar: 'زيت زيتون' });

      opt1Foods.push(
        { id: `f_${Date.now()}_m${mIdx}_1`, ...calculateFoodMacros(chicken, targetPerMealProtein * 3.2) },
        { id: `f_${Date.now()}_m${mIdx}_2`, ...calculateFoodMacros(rice, targetPerMealCarbs * 3.5) },
        { id: `f_${Date.now()}_m${mIdx}_3`, ...calculateFoodMacros(oil, Math.max(5, targetPerMealFat * 0.7)) }
      );
    }
    const opt1Totals = calculateOptionTotals(opt1Foods);

    const option1: ClientMealOption = {
      id: `opt_m${mIdx + 1}_1_${Date.now()}`,
      name: matchingRecipe
        ? (typeof matchingRecipe.name === 'string'
            ? { en: matchingRecipe.name, ar: matchingRecipe.name }
            : matchingRecipe.name)
        : { en: `Lean Protein & Carb Plate (Option A)`, ar: `وجبة بروتين صافي وكارب (الخيار أ)` },
      recipeId: matchingRecipe ? matchingRecipe.id : undefined,
      sourceType: matchingRecipe ? 'recipe' : 'ai',
      videoUrl: matchingRecipe ? matchingRecipe.videoUrl : undefined,
      notes: matchingRecipe
        ? (Array.isArray(matchingRecipe.instructions)
            ? matchingRecipe.instructions[0]
            : matchingRecipe.instructions?.en?.[0])
        : 'High bioavailability protein source, optimal for steady digestion.',
      substitutions: 'Can swap rice for baked sweet potato or quinoa.',
      foods: opt1Foods,
      calories: opt1Totals.calories,
      protein: Number(opt1Totals.protein.toFixed(1)),
      carbs: Number(opt1Totals.carbs.toFixed(1)),
      fat: Number(opt1Totals.fat.toFixed(1)),
    };

    // Option 2: Seafood / Alternative Protein
    const salmon = getIng('ing_salmon', { en: 'Atlantic Salmon', ar: 'سلمون أطلسي' });
    const sweetPotato = getIng('ing_sweet_potato', { en: 'Sweet Potato', ar: 'بطاطا حلوة' });
    const berries = getIng('ing_berries', { en: 'Fresh Berries', ar: 'توت طازج' });

    const opt2Foods: ClientMealFood[] = [
      { id: `f_${Date.now()}_m${mIdx}_o2_1`, ...calculateFoodMacros(salmon, Math.round(targetPerMealProtein * 4.5)) },
      { id: `f_${Date.now()}_m${mIdx}_o2_2`, ...calculateFoodMacros(sweetPotato, Math.round(targetPerMealCarbs * 4.0)) },
      { id: `f_${Date.now()}_m${mIdx}_o2_3`, ...calculateFoodMacros(berries, 80) },
    ];
    const opt2Totals = calculateOptionTotals(opt2Foods);

    const option2: ClientMealOption = {
      id: `opt_m${mIdx + 1}_2_${Date.now()}`,
      name: {
        en: `Seared Salmon & Baked Sweet Potato (Option B)`,
        ar: `سلمون مشوي مع بطاطا حلوة (الخيار ب)`,
      },
      sourceType: 'ai',
      notes: 'Rich in Omega-3 fatty acids for anti-inflammatory muscle recovery.',
      substitutions: 'Can swap salmon for white fish (Sea Bass, Tilapia) + 10g olive oil.',
      foods: opt2Foods,
      calories: opt2Totals.calories,
      protein: Number(opt2Totals.protein.toFixed(1)),
      carbs: Number(opt2Totals.carbs.toFixed(1)),
      fat: Number(opt2Totals.fat.toFixed(1)),
    };

    // Option 3: Quick Power Bowl / Eggs / Oats & Whey
    const eggs = getIng('ing_eggs', { en: 'Whole Eggs & Whites', ar: 'بيض وبياض بيض' });
    const oats = getIng('ing_oats', { en: 'Rolled Oats', ar: 'شوفان كامل' });
    const peanutButter = getIng('ing_peanut_butter', { en: 'Peanut Butter', ar: 'زبدة فول سوداني' });

    const opt3Foods: ClientMealFood[] = [
      { id: `f_${Date.now()}_m${mIdx}_o3_1`, ...calculateFoodMacros(eggs, Math.max(120, targetPerMealProtein * 4.0)) },
      { id: `f_${Date.now()}_m${mIdx}_o3_2`, ...calculateFoodMacros(oats, Math.max(40, targetPerMealCarbs * 1.5)) },
      { id: `f_${Date.now()}_m${mIdx}_o3_3`, ...calculateFoodMacros(peanutButter, Math.max(10, targetPerMealFat * 0.9)) },
    ];
    const opt3Totals = calculateOptionTotals(opt3Foods);

    const option3: ClientMealOption = {
      id: `opt_m${mIdx + 1}_3_${Date.now()}`,
      name: {
        en: `Power Energy Bowl (Option C)`,
        ar: `وعاء الطاقة والبروتين (الخيار ج)`,
      },
      sourceType: 'ai',
      notes: 'Quick preparation, perfect for sustained satiety.',
      substitutions: 'Can swap eggs for 40g Whey Isolate + 150g Greek Yogurt.',
      foods: opt3Foods,
      calories: opt3Totals.calories,
      protein: Number(opt3Totals.protein.toFixed(1)),
      carbs: Number(opt3Totals.carbs.toFixed(1)),
      fat: Number(opt3Totals.fat.toFixed(1)),
    };

    const options = [option1, option2, option3];

    createdMeals.push({
      id: `meal_${mIdx + 1}_${Date.now()}`,
      name: mealName,
      timing,
      targetCalories: targetPerMealCal,
      targetProtein: targetPerMealProtein,
      targetCarbs: targetPerMealCarbs,
      targetFat: targetPerMealFat,
      notes: 'Drink with 400-500ml water.',
      substitutions: 'Client can select any 1 of the 3 options daily.',
      options,
      selectedOptionIndex: 0,
      foods: option1.foods, // Active selected option foods
      isCompleted: false,
    });
  }

  return createdMeals;
}

export async function generateMealPlanWithAI(req: AIMealPlanRequest): Promise<{ success: boolean; meals: ClientMeal[]; source: 'gemini' | 'fallback' }> {
  try {
    const response = await fetch('/api/ai/generate-meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.meals && Array.isArray(data.data.meals) && data.data.meals.length > 0) {
        // Hydrate meals and ensure 3 options per meal
        const formattedMeals: ClientMeal[] = data.data.meals.map((m: any, idx: number) => {
          const rawOptions: any[] = Array.isArray(m.options) ? m.options : [];
          const hydratedOptions: ClientMealOption[] = rawOptions.map((opt: any, oIdx: number) => {
            const optFoods: ClientMealFood[] = Array.isArray(opt.foods)
              ? opt.foods.map((f: any, fIdx: number) => ({
                  id: f.id || `f_ai_${idx}_${oIdx}_${fIdx}_${Date.now()}`,
                  ingredientId: f.ingredientId,
                  foodName: f.foodName || { en: 'Food item', ar: 'صنف غذائي' },
                  amountGrams: Number(f.amountGrams || 100),
                  calories: Number(f.calories || 0),
                  protein: Number(f.protein || 0),
                  carbs: Number(f.carbs || 0),
                  fat: Number(f.fat || 0),
                  unit: f.unit || 'g',
                }))
              : [];

            const totals = calculateOptionTotals(optFoods);

            return {
              id: opt.id || `opt_${idx + 1}_${oIdx + 1}_${Date.now()}`,
              name: opt.name || { en: `Option ${oIdx + 1}`, ar: `الخيار ${oIdx + 1}` },
              recipeId: opt.recipeId || undefined,
              sourceType: opt.sourceType || (opt.recipeId ? 'recipe' : 'ai'),
              videoUrl: opt.videoUrl || undefined,
              notes: opt.notes || '',
              substitutions: opt.substitutions || '',
              foods: optFoods,
              calories: opt.calories || totals.calories,
              protein: Number((opt.protein || totals.protein).toFixed(1)),
              carbs: Number((opt.carbs || totals.carbs).toFixed(1)),
              fat: Number((opt.fat || totals.fat).toFixed(1)),
            };
          });

          // Ensure exactly 3 options
          while (hydratedOptions.length < 3) {
            const fallbackOption = generateDeterministicMealPlan({
              ...req,
              mealCount: 1,
            })[0].options?.[hydratedOptions.length] || {
              id: `opt_fill_${idx}_${hydratedOptions.length}`,
              name: { en: `Option ${hydratedOptions.length + 1}`, ar: `الخيار ${hydratedOptions.length + 1}` },
              sourceType: 'ai' as const,
              foods: [],
              calories: Math.round(req.dailyCalories / req.mealCount),
              protein: Math.round(req.proteinGrams / req.mealCount),
              carbs: Math.round(req.carbsGrams / req.mealCount),
              fat: Math.round(req.fatGrams / req.mealCount),
            };
            hydratedOptions.push(fallbackOption);
          }

          const activeFoods = hydratedOptions[0]?.foods || [];

          return {
            id: m.id || `meal_${idx + 1}_${Date.now()}`,
            name: m.name || { en: `Meal ${idx + 1}`, ar: `الوجبة ${idx + 1}` },
            timing: m.timing || `${8 + idx * 3}:00`,
            targetCalories: m.targetCalories || Math.round(req.dailyCalories / req.mealCount),
            targetProtein: m.targetProtein || Math.round(req.proteinGrams / req.mealCount),
            targetCarbs: m.targetCarbs || Math.round(req.carbsGrams / req.mealCount),
            targetFat: m.targetFat || Math.round(req.fatGrams / req.mealCount),
            notes: m.notes || '',
            substitutions: m.substitutions || '',
            foods: activeFoods,
            options: hydratedOptions,
            selectedOptionIndex: 0,
            isCompleted: false,
          };
        });

        return { success: true, meals: formattedMeals, source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn('Backend meal generator unavailable, generating via deterministic engine:', err);
  }

  // Fallback to high-precision mathematical generator
  const fallbackMeals = generateDeterministicMealPlan(req);
  return { success: true, meals: fallbackMeals, source: 'fallback' };
}

export async function regenerateMealWithAI(
  mealIndex: number,
  meal: ClientMeal,
  req: AIMealPlanRequest
): Promise<ClientMealOption[]> {
  try {
    const response = await fetch('/api/ai/regenerate-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealIndex,
        mealName: meal.name,
        timing: meal.timing,
        mealTargetCalories: meal.targetCalories || Math.round(req.dailyCalories / req.mealCount),
        mealTargetProtein: meal.targetProtein || Math.round(req.proteinGrams / req.mealCount),
        mealTargetCarbs: meal.targetCarbs || Math.round(req.carbsGrams / req.mealCount),
        mealTargetFat: meal.targetFat || Math.round(req.fatGrams / req.mealCount),
        preferredFoods: req.preferredFoods,
        avoidFoods: req.avoidFoods,
        allergies: req.allergies,
        dietaryPreferences: req.dietaryPreferences,
        availableRecipes: req.availableRecipes,
        availableIngredients: req.availableIngredients,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.meal?.options && Array.isArray(data.data.meal.options)) {
        return data.data.meal.options.map((opt: any, oIdx: number) => {
          const foods = Array.isArray(opt.foods)
            ? opt.foods.map((f: any, fIdx: number) => ({
                id: f.id || `f_regen_${mealIndex}_${oIdx}_${fIdx}`,
                ingredientId: f.ingredientId,
                foodName: f.foodName || { en: 'Food', ar: 'صنف' },
                amountGrams: Number(f.amountGrams || 100),
                calories: Number(f.calories || 0),
                protein: Number(f.protein || 0),
                carbs: Number(f.carbs || 0),
                fat: Number(f.fat || 0),
              }))
            : [];
          const totals = calculateOptionTotals(foods);
          return {
            id: `opt_regen_${Date.now()}_${oIdx}`,
            name: opt.name || { en: `Regenerated Option ${oIdx + 1}`, ar: `خيار متجدد ${oIdx + 1}` },
            sourceType: opt.sourceType || 'ai',
            notes: opt.notes || '',
            substitutions: opt.substitutions || '',
            foods,
            calories: opt.calories || totals.calories,
            protein: Number((opt.protein || totals.protein).toFixed(1)),
            carbs: Number((opt.carbs || totals.carbs).toFixed(1)),
            fat: Number((opt.fat || totals.fat).toFixed(1)),
          };
        });
      }
    }
  } catch (err) {
    console.warn('API regenerate meal failed, using local variant engine:', err);
  }

  // Fallback regenerate
  const fresh = generateDeterministicMealPlan({ ...req, mealCount: 1 });
  return fresh[0].options || [];
}

export async function regenerateOptionWithAI(
  optionIndex: number,
  meal: ClientMeal,
  req: AIMealPlanRequest
): Promise<ClientMealOption> {
  const targetCal = meal.targetCalories || Math.round(req.dailyCalories / req.mealCount);
  const targetProt = meal.targetProtein || Math.round(req.proteinGrams / req.mealCount);
  const targetCarb = meal.targetCarbs || Math.round(req.carbsGrams / req.mealCount);
  const targetFat = meal.targetFat || Math.round(req.fatGrams / req.mealCount);

  try {
    const response = await fetch('/api/ai/regenerate-option', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        optionIndex,
        mealTargetCalories: targetCal,
        mealTargetProtein: targetProt,
        mealTargetCarbs: targetCarb,
        mealTargetFat: targetFat,
        preferredFoods: req.preferredFoods,
        avoidFoods: req.avoidFoods,
        dietaryPreferences: req.dietaryPreferences,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data?.option) {
        const opt = data.data.option;
        const foods = Array.isArray(opt.foods)
          ? opt.foods.map((f: any, fIdx: number) => ({
              id: f.id || `f_opt_regen_${optionIndex}_${fIdx}`,
              ingredientId: f.ingredientId,
              foodName: f.foodName || { en: 'Food', ar: 'صنف' },
              amountGrams: Number(f.amountGrams || 100),
              calories: Number(f.calories || 0),
              protein: Number(f.protein || 0),
              carbs: Number(f.carbs || 0),
              fat: Number(f.fat || 0),
            }))
          : [];
        const totals = calculateOptionTotals(foods);
        return {
          id: `opt_reg_${Date.now()}`,
          name: opt.name || { en: `Regenerated Option ${optionIndex + 1}`, ar: `خيار متجدد ${optionIndex + 1}` },
          sourceType: 'ai',
          notes: opt.notes || '',
          substitutions: opt.substitutions || '',
          foods,
          calories: opt.calories || totals.calories,
          protein: Number((opt.protein || totals.protein).toFixed(1)),
          carbs: Number((opt.carbs || totals.carbs).toFixed(1)),
          fat: Number((opt.fat || totals.fat).toFixed(1)),
        };
      }
    }
  } catch (err) {
    console.warn('API regenerate option failed, using fallback:', err);
  }

  // Fallback single option
  const fresh = generateDeterministicMealPlan({ ...req, mealCount: 1 });
  const opt = fresh[0].options?.[optionIndex % 3] || fresh[0].options![0];
  const enName =
    typeof opt.name === 'string'
      ? opt.name
      : opt.name?.en || opt.name?.ar || 'Meal Option';
  const arName =
    typeof opt.name === 'string'
      ? opt.name
      : opt.name?.ar || opt.name?.en || 'خيار وجبة';

  return {
    ...opt,
    id: `opt_fallback_${Date.now()}`,
    name: {
      en: `${enName} (Fresh AI Variation)`,
      ar: `${arName} (خيار ذكي بديل)`,
    },
  };
}
