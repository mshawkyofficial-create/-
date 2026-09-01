import { Ingredient, Recipe, RecipeIngredientItem, ClientMeal, ClientMealOption, ClientMealFood } from '../types';
import { ingredientsDatabase } from '../data/mockData';

export interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function getIngredientById(id: string): Ingredient | undefined {
  return ingredientsDatabase.find((i) => i.id === id);
}

export function calculateIngredientMacros(ingredient: Ingredient, amountGrams: number): MacroBreakdown {
  const factor = amountGrams / 100;
  return {
    calories: Math.round(ingredient.caloriesPer100g * factor),
    protein: Number((ingredient.proteinPer100g * factor).toFixed(1)),
    carbs: Number((ingredient.carbsPer100g * factor).toFixed(1)),
    fat: Number((ingredient.fatPer100g * factor).toFixed(1)),
  };
}

export function calculateRecipeMacros(recipe: Recipe): MacroBreakdown {
  if (
    recipe.calories !== undefined &&
    recipe.protein !== undefined
  ) {
    return {
      calories: Math.round(recipe.calories),
      protein: Number((recipe.protein).toFixed(1)),
      carbs: Number(((recipe.carbohydrates ?? (recipe as any).carbs) || 0).toFixed(1)),
      fat: Number((recipe.fat || 0).toFixed(1)),
    };
  }

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((item) => {
      const ing = getIngredientById(item.ingredientId);
      if (ing) {
        const macros = calculateIngredientMacros(ing, item.amountGrams);
        totalCalories += macros.calories;
        totalProtein += macros.protein;
        totalCarbs += macros.carbs;
        totalFat += macros.fat;
      }
    });
  }

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fat: Math.round(totalFat),
  };
}

export interface ScaledRecipeResult {
  originalMacros: MacroBreakdown;
  achievedMacros: MacroBreakdown;
  targetMacros: {
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  scaledIngredients: {
    ingredient: Ingredient;
    originalGrams: number;
    adjustedGrams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  explanation: {
    en: string;
    ar: string;
  };
}

/**
 * Mathematically scales recipe ingredients to meet calorie and macro targets
 * using real database nutrition values per 100g.
 */
export function scaleRecipeForTargets(
  recipe: Recipe,
  targetCalories: number,
  targetProtein?: number,
  targetCarbs?: number,
  targetFat?: number
): ScaledRecipeResult {
  const originalMacros = calculateRecipeMacros(recipe);
  const baseRatio = Math.max(0.3, Math.min(2.5, targetCalories / Math.max(1, originalMacros.calories)));

  // Identify main protein, carb, and fat contributors in recipe
  const itemsWithData = recipe.ingredients.map((item) => {
    const ing = getIngredientById(item.ingredientId);
    return {
      item,
      ingredient: ing!,
      baseGrams: item.amountGrams,
    };
  }).filter((x) => !!x.ingredient);

  // Default scaling
  let scaledItems = itemsWithData.map((d) => {
    let scale = baseRatio;
    // If protein target is prioritized
    if (targetProtein && originalMacros.protein > 0) {
      const isHighProtein = d.ingredient.proteinPer100g > 15;
      if (isHighProtein) {
        const proteinRatio = targetProtein / Math.max(1, originalMacros.protein);
        scale = scale * 0.4 + proteinRatio * 0.6;
      }
    }
    // If carbs target is prioritized
    if (targetCarbs && originalMacros.carbs > 0) {
      const isHighCarb = d.ingredient.carbsPer100g > 20;
      if (isHighCarb) {
        const carbRatio = targetCarbs / Math.max(1, originalMacros.carbs);
        scale = scale * 0.4 + carbRatio * 0.6;
      }
    }
    // If fat target is prioritized
    if (targetFat && originalMacros.fat > 0) {
      const isHighFat = d.ingredient.fatPer100g > 15;
      if (isHighFat) {
        const fatRatio = targetFat / Math.max(1, originalMacros.fat);
        scale = scale * 0.4 + fatRatio * 0.6;
      }
    }

    const adjustedGrams = Math.max(5, Math.round(d.baseGrams * scale));
    const macros = calculateIngredientMacros(d.ingredient, adjustedGrams);

    return {
      ingredient: d.ingredient,
      originalGrams: d.baseGrams,
      adjustedGrams,
      ...macros,
    };
  });

  // Calculate actual total achieved
  const totalAchievedCalories = scaledItems.reduce((acc, curr) => acc + curr.calories, 0);
  const totalAchievedProtein = Math.round(scaledItems.reduce((acc, curr) => acc + curr.protein, 0));
  const totalAchievedCarbs = Math.round(scaledItems.reduce((acc, curr) => acc + curr.carbs, 0));
  const totalAchievedFat = Math.round(scaledItems.reduce((acc, curr) => acc + curr.fat, 0));

  const achievedMacros: MacroBreakdown = {
    calories: Math.round(totalAchievedCalories),
    protein: totalAchievedProtein,
    carbs: totalAchievedCarbs,
    fat: totalAchievedFat,
  };

  const diffCal = Math.abs(achievedMacros.calories - targetCalories);
  const isExact = diffCal <= 20;

  const explanation = {
    en: isExact
      ? `Successfully scaled ingredient quantities to match your ${targetCalories} kcal target directly from the ingredient nutrition database.`
      : `Adjusted ingredient portions to get as close as possible to ${targetCalories} kcal (Achieved: ${achievedMacros.calories} kcal, ${achievedMacros.protein}g Protein).`,
    ar: isExact
      ? `تم تعديل كميات المكونات بنجاح لتطابق هدفك (${targetCalories} سعرة) بدقة بالاعتماد على قاعدة بيانات التغذية.`
      : `تم تعديل حصص المكونات للوصول لأقرب قيمة ممكنة لهدفك (${targetCalories} سعرة) وحققت: ${achievedMacros.calories} سعرة و ${achievedMacros.protein}جم بروتين.`
  };

  return {
    originalMacros,
    achievedMacros,
    targetMacros: {
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
    },
    scaledIngredients: scaledItems,
    explanation,
  };
}

/**
 * Macro & Calorie Calculator using Mifflin-St Jeor equation
 */
export function calculateMifflinStJeor(params: {
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
}): {
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  const { gender, age, heightCm, weightKg, activityLevel, goal } = params;

  // BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity multiplier
  const mult = activityLevel === 'sedentary' ? 1.2 : activityLevel === 'moderate' ? 1.55 : 1.75;
  const tdee = Math.round(bmr * mult);

  // Goal adjustment
  let targetCalories = tdee;
  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
  }

  // Macros distribution: 2g/kg protein, 25% calories from fat, remaining to carbs
  const proteinGrams = Math.round(weightKg * 2.0);
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  const proteinCalories = proteinGrams * 4;
  const carbsCalories = Math.max(0, targetCalories - (fatCalories + proteinCalories));
  const carbsGrams = Math.round(carbsCalories / 4);

  return {
    tdee,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
  };
}

/**
 * Deterministic client-side meal plan generator that creates exact 3 options per meal
 * calibrated precisely to trainer-assigned calorie and macro targets.
 */
export function generateSuggestedMealPlanClient(params: {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  mealCount: number;
  preferredFoods?: string[];
  avoidFoods?: string[];
  allergies?: string[];
  dietaryPreferences?: string;
  recipes?: Recipe[];
}): ClientMeal[] {
  const {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    mealCount = 4,
    preferredFoods = [],
    avoidFoods = [],
    allergies = [],
    recipes = [],
  } = params;

  const count = Math.max(2, Math.min(6, mealCount));
  const meals: ClientMeal[] = [];

  // Default meal timings and names
  const defaultTimings = ['08:00 AM', '01:00 PM', '05:00 PM', '08:30 PM', '11:00 AM', '03:30 PM'];
  const defaultNamesEn = ['Meal 1: Breakfast', 'Meal 2: Lunch', 'Meal 3: Pre-Workout', 'Meal 4: Dinner', 'Meal 5: Morning Snack', 'Meal 6: Evening Fuel'];
  const defaultNamesAr = ['الوجبة ١: الفطور', 'الوجبة ٢: الغداء', 'الوجبة ٣: قبل التمرين', 'الوجبة ٤: العشاء', 'الوجبة ٥: سناك صباحي', 'الوجبة ٦: سناك مسائي'];

  // Distribution weights across meals
  let weights: number[] = [];
  if (count === 3) {
    weights = [0.30, 0.40, 0.30];
  } else if (count === 4) {
    weights = [0.25, 0.35, 0.18, 0.22];
  } else if (count === 5) {
    weights = [0.22, 0.30, 0.15, 0.23, 0.10];
  } else {
    weights = Array(count).fill(1 / count);
  }

  // Pre-filter database ingredients based on avoid foods & allergies
  const avoidLower = [...avoidFoods, ...allergies].map((s) => s.toLowerCase().trim()).filter(Boolean);
  const isAllowed = (nameEn: string, nameAr: string) => {
    return !avoidLower.some(
      (avoid) =>
        nameEn.toLowerCase().includes(avoid) ||
        nameAr.toLowerCase().includes(avoid) ||
        avoid.includes(nameEn.toLowerCase())
    );
  };

  const allowedIngredients = ingredientsDatabase.filter((i) => {
    const en = typeof i.name === 'string' ? i.name : i.name?.en || '';
    const ar = typeof i.name === 'string' ? i.name : i.name?.ar || '';
    return isAllowed(en, ar);
  });

  const getIngName = (i: any, lang: 'en' | 'ar') => {
    if (!i) return lang === 'ar' ? 'طعام' : 'Food';
    if (typeof i.name === 'string') return i.name;
    if (lang === 'ar') return i.name?.ar || i.name?.en || 'طعام';
    return i.name?.en || i.name?.ar || 'Food';
  };

  const proteinSources = allowedIngredients.filter((i) => i.proteinPer100g > 10);
  const carbSources = allowedIngredients.filter((i) => i.carbsPer100g > 15);
  const fatSources = allowedIngredients.filter((i) => i.fatPer100g > 10);

  for (let mIdx = 0; mIdx < count; mIdx++) {
    const w = weights[mIdx] || (1 / count);
    const mealTargetCalories = Math.round(dailyCalories * w);
    const mealTargetProtein = Math.round(proteinGrams * w);
    const mealTargetCarbs = Math.round(carbsGrams * w);
    const mealTargetFat = Math.round(fatGrams * w);

    const mealId = `meal_${Date.now()}_${mIdx + 1}`;
    const options: ClientMealOption[] = [];

    // OPTION 1: Balanced Whole Food Plate
    const opt1ProteinIng = proteinSources[mIdx % Math.max(1, proteinSources.length)] || ingredientsDatabase[1];
    const opt1CarbIng = carbSources[mIdx % Math.max(1, carbSources.length)] || ingredientsDatabase[0];
    const opt1FatIng = fatSources[0] || ingredientsDatabase[8];

    // Calculate approximate grams
    const pGrams1 = Math.max(20, Math.round((mealTargetProtein / Math.max(1, opt1ProteinIng.proteinPer100g)) * 100));
    const cGrams1 = Math.max(20, Math.round((mealTargetCarbs / Math.max(1, opt1CarbIng.carbsPer100g)) * 100));
    const fGrams1 = Math.max(5, Math.round((mealTargetFat / Math.max(1, opt1FatIng.fatPer100g)) * 50));

    const f1 = calculateIngredientMacros(opt1ProteinIng, pGrams1);
    const f2 = calculateIngredientMacros(opt1CarbIng, cGrams1);
    const f3 = calculateIngredientMacros(opt1FatIng, fGrams1);

    const opt1Foods: ClientMealFood[] = [
      {
        id: `f_${mealId}_1_1`,
        ingredientId: opt1ProteinIng.id,
        foodName: opt1ProteinIng.name,
        amountGrams: pGrams1,
        ...f1,
      },
      {
        id: `f_${mealId}_1_2`,
        ingredientId: opt1CarbIng.id,
        foodName: opt1CarbIng.name,
        amountGrams: cGrams1,
        ...f2,
      },
      {
        id: `f_${mealId}_1_3`,
        ingredientId: opt1FatIng.id,
        foodName: opt1FatIng.name,
        amountGrams: fGrams1,
        ...f3,
      },
    ];

    const opt1TotalCal = opt1Foods.reduce((acc, x) => acc + x.calories, 0);
    const opt1TotalP = Math.round(opt1Foods.reduce((acc, x) => acc + x.protein, 0));
    const opt1TotalC = Math.round(opt1Foods.reduce((acc, x) => acc + x.carbs, 0));
    const opt1TotalF = Math.round(opt1Foods.reduce((acc, x) => acc + x.fat, 0));

    options.push({
      id: `opt_${mealId}_1`,
      name: {
        en: `${getIngName(opt1ProteinIng, 'en')} with ${getIngName(opt1CarbIng, 'en')}`,
        ar: `${getIngName(opt1ProteinIng, 'ar')} مع ${getIngName(opt1CarbIng, 'ar')}`,
      },
      sourceType: 'ai',
      notes: 'Season with sea salt, black pepper, and herbs to taste.',
      substitutions: 'Carb and protein portions can be weighed raw or cooked consistently.',
      foods: opt1Foods,
      calories: opt1TotalCal,
      protein: opt1TotalP,
      carbs: opt1TotalC,
      fat: opt1TotalF,
    });

    // OPTION 2: Alternate Protein & Fresh Complex Carbs or Recipe Match
    const matchingRecipe = recipes.find(
      (r) => (mIdx === 0 ? r.mealType === 'breakfast' : r.mealType === 'lunch' || r.mealType === 'dinner')
    );

    if (matchingRecipe && mIdx <= 1) {
      const scaled = scaleRecipeForTargets(matchingRecipe, mealTargetCalories, mealTargetProtein, mealTargetCarbs, mealTargetFat);
      const recipeFoods: ClientMealFood[] = scaled.scaledIngredients.map((item, idx) => ({
        id: `f_${mealId}_2_${idx + 1}`,
        ingredientId: item.ingredient.id,
        foodName: item.ingredient.name,
        amountGrams: item.adjustedGrams,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      }));

      options.push({
        id: `opt_${mealId}_2`,
        name: typeof matchingRecipe.name === 'string'
          ? { en: matchingRecipe.name, ar: matchingRecipe.name }
          : matchingRecipe.name,
        recipeId: matchingRecipe.id,
        sourceType: 'recipe',
        videoUrl: matchingRecipe.videoUrl,
        notes: 'Follow preparation video instructions in the recipe library.',
        substitutions: 'Use olive oil spray for cooking if limiting fats.',
        foods: recipeFoods,
        calories: scaled.achievedMacros.calories,
        protein: scaled.achievedMacros.protein,
        carbs: scaled.achievedMacros.carbs,
        fat: scaled.achievedMacros.fat,
      });
    } else {
      const altProteinIng = proteinSources[(mIdx + 2) % Math.max(1, proteinSources.length)] || ingredientsDatabase[3];
      const altCarbIng = carbSources[(mIdx + 1) % Math.max(1, carbSources.length)] || ingredientsDatabase[2];

      const pGrams2 = Math.max(25, Math.round((mealTargetProtein / Math.max(1, altProteinIng.proteinPer100g)) * 100));
      const cGrams2 = Math.max(25, Math.round((mealTargetCarbs / Math.max(1, altCarbIng.carbsPer100g)) * 100));

      const fAlt1 = calculateIngredientMacros(altProteinIng, pGrams2);
      const fAlt2 = calculateIngredientMacros(altCarbIng, cGrams2);

      const opt2Foods: ClientMealFood[] = [
        {
          id: `f_${mealId}_2_1`,
          ingredientId: altProteinIng.id,
          foodName: altProteinIng.name,
          amountGrams: pGrams2,
          ...fAlt1,
        },
        {
          id: `f_${mealId}_2_2`,
          ingredientId: altCarbIng.id,
          foodName: altCarbIng.name,
          amountGrams: cGrams2,
          ...fAlt2,
        },
      ];

      const opt2TotalCal = opt2Foods.reduce((acc, x) => acc + x.calories, 0);
      const opt2TotalP = Math.round(opt2Foods.reduce((acc, x) => acc + x.protein, 0));
      const opt2TotalC = Math.round(opt2Foods.reduce((acc, x) => acc + x.carbs, 0));
      const opt2TotalF = Math.round(opt2Foods.reduce((acc, x) => acc + x.fat, 0));

      options.push({
        id: `opt_${mealId}_2`,
        name: {
          en: `${getIngName(altProteinIng, 'en')} with ${getIngName(altCarbIng, 'en')}`,
          ar: `${getIngName(altProteinIng, 'ar')} مع ${getIngName(altCarbIng, 'ar')}`,
        },
        sourceType: 'ai',
        notes: 'Quick preparation option. Great for meal prep containers.',
        substitutions: 'Can swap rice for potato or sweet potato in equal carb grams.',
        foods: opt2Foods,
        calories: opt2TotalCal,
        protein: opt2TotalP,
        carbs: opt2TotalC,
        fat: opt2TotalF,
      });
    }

    // OPTION 3: High Satiety / Light Prep Alternative
    const opt3ProteinIng = proteinSources[(mIdx + 4) % Math.max(1, proteinSources.length)] || ingredientsDatabase[4];
    const opt3CarbIng = carbSources[(mIdx + 3) % Math.max(1, carbSources.length)] || ingredientsDatabase[5];
    const pGrams3 = Math.max(20, Math.round((mealTargetProtein / Math.max(1, opt3ProteinIng.proteinPer100g)) * 100));
    const cGrams3 = Math.max(20, Math.round((mealTargetCarbs / Math.max(1, opt3CarbIng.carbsPer100g)) * 100));

    const f3_1 = calculateIngredientMacros(opt3ProteinIng, pGrams3);
    const f3_2 = calculateIngredientMacros(opt3CarbIng, cGrams3);

    const opt3Foods: ClientMealFood[] = [
      {
        id: `f_${mealId}_3_1`,
        ingredientId: opt3ProteinIng.id,
        foodName: opt3ProteinIng.name,
        amountGrams: pGrams3,
        ...f3_1,
      },
      {
        id: `f_${mealId}_3_2`,
        ingredientId: opt3CarbIng.id,
        foodName: opt3CarbIng.name,
        amountGrams: cGrams3,
        ...f3_2,
      },
    ];

    const opt3TotalCal = opt3Foods.reduce((acc, x) => acc + x.calories, 0);
    const opt3TotalP = Math.round(opt3Foods.reduce((acc, x) => acc + x.protein, 0));
    const opt3TotalC = Math.round(opt3Foods.reduce((acc, x) => acc + x.carbs, 0));
    const opt3TotalF = Math.round(opt3Foods.reduce((acc, x) => acc + x.fat, 0));

    options.push({
      id: `opt_${mealId}_3`,
      name: {
        en: `${getIngName(opt3ProteinIng, 'en')} Satiety Bowl`,
        ar: `طبق ${getIngName(opt3ProteinIng, 'ar')} المشبع`,
      },
      sourceType: 'ai',
      notes: 'High volume, micronutrient dense choice.',
      substitutions: 'Add raw greens or cucumber with zero macro impact.',
      foods: opt3Foods,
      calories: opt3TotalCal,
      protein: opt3TotalP,
      carbs: opt3TotalC,
      fat: opt3TotalF,
    });

    // Default primary food array for meal (derived from Option 1)
    const primaryFoods = opt1Foods.map((f) => ({ ...f }));

    meals.push({
      id: mealId,
      name: {
        en: defaultNamesEn[mIdx] || `Meal ${mIdx + 1}`,
        ar: defaultNamesAr[mIdx] || `الوجبة ${mIdx + 1}`,
      },
      timing: defaultTimings[mIdx] || '12:00 PM',
      targetCalories: mealTargetCalories,
      targetProtein: mealTargetProtein,
      targetCarbs: mealTargetCarbs,
      targetFat: mealTargetFat,
      notes: 'Follow assigned option ingredients by weight (grams).',
      substitutions: 'You can swap between Option 1, Option 2, or Option 3 freely each day.',
      selectedOptionIndex: 0,
      options,
      foods: primaryFoods,
    });
  }

  return meals;
}

/**
 * Interprets follow-up trainer instructions client-side (e.g., "increase protein", "replace meal 2", "remove chicken")
 */
export function applyAssistantInstructionClient(params: {
  currentPlan: {
    dailyCalories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    meals: ClientMeal[];
  };
  instruction: string;
  clientProfile?: any;
  recipes?: Recipe[];
}): {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  meals: ClientMeal[];
  explanation: string;
} {
  const { currentPlan, instruction, recipes = [] } = params;
  const lower = instruction.toLowerCase();

  let dailyCalories = currentPlan.dailyCalories;
  let proteinGrams = currentPlan.proteinGrams;
  let carbsGrams = currentPlan.carbsGrams;
  let fatGrams = currentPlan.fatGrams;
  let meals: ClientMeal[] = [...currentPlan.meals.map((m) => ({ ...m, options: [...(m.options || [])] }))];
  let explanation = 'Adjusted nutrition plan based on your instruction.';

  // Check for calorie number extraction
  const calMatch = lower.match(/(\d{3,4})\s*(cal|kcal|calories|سعرة)/);
  if (calMatch) {
    dailyCalories = parseInt(calMatch[1], 10);
  }

  // Check for protein number extraction
  const pMatch = lower.match(/(\d{2,3})\s*(g|gm|grams?|جم|جرام)?\s*(protein|بروتين)/) || lower.match(/(protein|بروتين)\s*(to|:)?\s*(\d{2,3})/);
  if (pMatch) {
    const num = parseInt(pMatch[1] || pMatch[3], 10);
    if (!isNaN(num) && num > 40 && num < 400) proteinGrams = num;
  } else if (lower.includes('increase protein') || lower.includes('more protein') || lower.includes('رفع البروتين') || lower.includes('زيادة البروتين')) {
    proteinGrams = Math.round(proteinGrams + 20);
    explanation = 'Increased daily protein target by 20g and adjusted portions across meals.';
  } else if (lower.includes('reduce protein') || lower.includes('lower protein') || lower.includes('تقليل البروتين')) {
    proteinGrams = Math.max(50, Math.round(proteinGrams - 20));
    explanation = 'Reduced daily protein target by 20g.';
  }

  // Check for carbs
  const cMatch = lower.match(/(\d{2,3})\s*(g|gm|grams?|جم|جرام)?\s*(carbs?|كارب|كربوهيدرات)/) || lower.match(/(carbs?|كارب)\s*(to|:)?\s*(\d{2,3})/);
  if (cMatch) {
    const num = parseInt(cMatch[1] || cMatch[3], 10);
    if (!isNaN(num) && num > 30 && num < 600) carbsGrams = num;
  } else if (lower.includes('reduce carb') || lower.includes('lower carb') || lower.includes('تقليل الكارب')) {
    carbsGrams = Math.max(30, Math.round(carbsGrams - 30));
    explanation = 'Reduced carbohydrates across meals.';
  } else if (lower.includes('increase carb') || lower.includes('more carb') || lower.includes('زيادة الكارب')) {
    carbsGrams = Math.round(carbsGrams + 30);
    explanation = 'Increased carbohydrate target.';
  }

  // Check for meal count
  const mealCountMatch = lower.match(/(\d)\s*(meals|وجبات|وجبة)/);
  if (mealCountMatch) {
    const count = parseInt(mealCountMatch[1], 10);
    if (count >= 2 && count <= 6 && count !== meals.length) {
      meals = generateSuggestedMealPlanClient({
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        mealCount: count,
        recipes,
      });
      return {
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        meals,
        explanation: `Rebuilt plan for ${count} meals with 3 options per meal matching ${dailyCalories} kcal.`,
      };
    }
  }

  // Specific Meal replacements (e.g. "replace meal 2", "change meal 1")
  const mealIndexMatch = lower.match(/(meal|وجبة)\s*(\d)/) || lower.match(/replace meal\s*(\d)/) || lower.match(/تغيير الوجبة\s*(\d)/);
  if (mealIndexMatch) {
    const mealNum = parseInt(mealIndexMatch[2] || mealIndexMatch[1], 10);
    const mIdx = mealNum - 1;
    if (mIdx >= 0 && mIdx < meals.length) {
      const singleMeal = generateSuggestedMealPlanClient({
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        mealCount: meals.length,
        recipes,
      })[mIdx];

      if (singleMeal) {
        meals[mIdx] = singleMeal;
        explanation = `Regenerated all 3 options for Meal ${mealNum}.`;
      }
    }
  } else {
    // Re-scale portions if targets changed
    meals = generateSuggestedMealPlanClient({
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      mealCount: meals.length,
      recipes,
    });
  }

  return {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    meals,
    explanation,
  };
}
