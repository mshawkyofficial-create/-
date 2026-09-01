import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Parse a trainee's food sentence. The AI identifies foods and quantities only;
  // the client calculates macros from the coach-controlled ingredient database.
  app.post('/api/ai/parse-food-log', async (req, res) => {
    try {
      const text = typeof req.body?.text === 'string' ? req.body.text.trim().slice(0, 500) : '';
      const availableIngredients = Array.isArray(req.body?.availableIngredients)
        ? req.body.availableIngredients.slice(0, 100)
        : [];
      if (!text || !availableIngredients.length) {
        return res.status(400).json({ success: false, message: 'Text and ingredient database are required.' });
      }

      const ai = getGeminiClient();
      if (!ai) return res.json({ success: false, message: 'AI client not initialized' });

      const allowedIds = new Set(availableIngredients.map((item: any) => item.id));
      const prompt = `Extract foods and gram weights from this trainee entry: "${text}".
Match ONLY to this ingredient list: ${JSON.stringify(availableIngredients)}.
Do not calculate calories or macros. Do not guess a quantity when it is absent.
If cooked/raw state changes the food and is unclear, set amountGrams to null.
Return JSON only: {"items":[{"ingredientId":"allowed_id","amountGrams":number|null,"confidence":number,"needsPreparationClarification":boolean}]}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text || '{}');
      const items = Array.isArray(parsed.items)
        ? parsed.items
            .filter((item: any) => allowedIds.has(item.ingredientId))
            .slice(0, 10)
            .map((item: any) => ({
              ingredientId: item.ingredientId,
              amountGrams: Number.isFinite(Number(item.amountGrams)) && Number(item.amountGrams) > 0
                ? Number(item.amountGrams)
                : null,
              confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0.7)),
              needsPreparationClarification: Boolean(item.needsPreparationClarification),
            }))
        : [];
      return res.json({ success: true, data: { items } });
    } catch (error: any) {
      console.error('Error parsing food log:', error);
      return res.status(500).json({ success: false, error: error.message || 'Failed to parse food log' });
    }
  });

  // Generate complete Meal Plan (N meals, exactly 3 options each)
  app.post('/api/ai/generate-meal-plan', async (req, res) => {
    try {
      const {
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        mealCount = 4,
        preferredFoods = [],
        avoidFoods = [],
        allergies = [],
        dietaryPreferences = 'Balanced',
        mealTimings = [],
        availableRecipes = [],
        availableIngredients = [],
      } = req.body;

      const ai = getGeminiClient();

      const prompt = `You are a world-class sports dietitian and fitness nutrition expert assisting a professional Coach/Trainer in building a structured nutrition plan.
Target Daily Macros:
- Calories: ${dailyCalories} kcal
- Protein: ${proteinGrams} g
- Carbohydrates: ${carbsGrams} g
- Fat: ${fatGrams} g
- Number of Meals: ${mealCount}
- Dietary Preferences: ${dietaryPreferences}
- Preferred Foods: ${preferredFoods.join(', ') || 'Any healthy whole foods'}
- Foods to Avoid: ${avoidFoods.join(', ') || 'None'}
- Allergies / Restrictions: ${allergies.join(', ') || 'None'}
- Meal Timings: ${mealTimings.join(', ') || 'Standard spacing throughout the day'}

Available Recipe Library from the App (incorporate relevant recipes when fitting):
${JSON.stringify(
  availableRecipes.slice(0, 15).map((r: any) => ({
    id: r.id,
    name: r.name,
    mealType: r.mealType,
    videoUrl: r.videoUrl,
    calories: r.calories,
  }))
)}

Available Common Ingredients in Database:
${JSON.stringify(
  availableIngredients.slice(0, 25).map((i: any) => ({
    id: i.id,
    name: i.name,
    caloriesPer100g: i.caloriesPer100g,
    proteinPer100g: i.proteinPer100g,
    carbsPer100g: i.carbsPer100g,
    fatPer100g: i.fatPer100g,
  }))
)}

MANDATORY RULES:
1. Generate exactly ${mealCount} meals.
2. For EVERY meal, you MUST generate EXACTLY 3 distinct, high-quality meal options (Option 1, Option 2, Option 3).
3. The sum of target calories across the ${mealCount} meals MUST match ${dailyCalories} kcal, and the macros for each option inside a meal must match that meal's allocated portion of Protein (${proteinGrams}g total), Carbs (${carbsGrams}g total), and Fat (${fatGrams}g total).
4. If an option matches an existing recipe from the App's Recipe Library, set "recipeId" to the recipe ID, "sourceType" to "recipe", and include "videoUrl". Otherwise, set "sourceType" to "ai".
5. Every option must have precise ingredient items with realistic gram amounts ("amountGrams"), and calculated calories, protein, carbs, fat based on those grams.
6. Provide names in both English and Arabic.

Respond ONLY with valid JSON adhering to this structure:
{
  "meals": [
    {
      "id": "meal_1",
      "name": { "en": "Meal 1: Breakfast", "ar": "الوجبة ١: الفطور" },
      "timing": "08:00 AM",
      "targetCalories": 550,
      "targetProtein": 40,
      "targetCarbs": 60,
      "targetFat": 18,
      "notes": "Hydrate with 500ml water upon waking.",
      "substitutions": "Can swap carb source for cream of rice.",
      "options": [
        {
          "id": "opt_1_1",
          "name": { "en": "Rolled Oats with Whey & Berries", "ar": "شوفان مع واي بروتين وتوت" },
          "recipeId": null,
          "sourceType": "ai",
          "videoUrl": null,
          "notes": "Mix whey after cooking oats to preserve protein texture.",
          "substitutions": "Can swap berries for banana.",
          "foods": [
            {
              "id": "f_1",
              "ingredientId": "ing_oats",
              "foodName": { "en": "Rolled Oats", "ar": "شوفان كامل" },
              "amountGrams": 80,
              "calories": 310,
              "protein": 13.5,
              "carbs": 53,
              "fat": 5.5
            },
            {
              "id": "f_2",
              "ingredientId": "ing_whey_protein",
              "foodName": { "en": "Whey Protein Isolate", "ar": "واي بروتين معزول" },
              "amountGrams": 30,
              "calories": 112,
              "protein": 26.4,
              "carbs": 0.8,
              "fat": 0.4
            }
          ],
          "calories": 550,
          "protein": 40,
          "carbs": 60,
          "fat": 18
        },
        { ... Option 2 ... },
        { ... Option 3 ... }
      ]
    }
  ]
}`;

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed });
        } catch (jsonErr) {
          console.warn('JSON parse error from Gemini, trying fallback parsing:', jsonErr);
        }
      }

      // If AI key is not configured or parsing failed, return structured fallback
      return res.json({
        success: false,
        message: 'Gemini API key not configured or response could not be parsed; using client-side generator.',
      });
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to generate meal plan' });
    }
  });

  // Regenerate a single meal (all 3 options for that specific meal)
  app.post('/api/ai/regenerate-meal', async (req, res) => {
    try {
      const {
        mealIndex,
        mealName,
        timing,
        mealTargetCalories,
        mealTargetProtein,
        mealTargetCarbs,
        mealTargetFat,
        preferredFoods = [],
        avoidFoods = [],
        allergies = [],
        dietaryPreferences = 'Balanced',
        availableRecipes = [],
        availableIngredients = [],
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ success: false, message: 'AI client not initialized' });
      }

      const prompt = `Regenerate ONLY 1 meal (Meal #${mealIndex + 1}: ${mealName?.en || 'Meal'}) containing EXACTLY 3 distinct options.
Target Meal Macros:
- Calories: ${mealTargetCalories} kcal
- Protein: ${mealTargetProtein} g
- Carbs: ${mealTargetCarbs} g
- Fat: ${mealTargetFat} g
- Preferences: ${dietaryPreferences}, Preferred: ${preferredFoods.join(', ')}, Avoid: ${avoidFoods.join(', ')}, Allergies: ${allergies.join(', ')}

Output JSON:
{
  "meal": {
    "name": { "en": "${mealName?.en || 'Meal ' + (mealIndex + 1)}", "ar": "${mealName?.ar || 'الوجبة ' + (mealIndex + 1)}" },
    "timing": "${timing || '12:00 PM'}",
    "targetCalories": ${mealTargetCalories},
    "targetProtein": ${mealTargetProtein},
    "targetCarbs": ${mealTargetCarbs},
    "targetFat": ${mealTargetFat},
    "options": [
      {
        "id": "opt_${Date.now()}_1",
        "name": { "en": "Option 1 English", "ar": "الخيار 1 عربي" },
        "sourceType": "ai",
        "foods": [ ... ],
        "calories": ${mealTargetCalories},
        "protein": ${mealTargetProtein},
        "carbs": ${mealTargetCarbs},
        "fat": ${mealTargetFat}
      },
      { "id": "opt_${Date.now()}_2", ... Option 2 ... },
      { "id": "opt_${Date.now()}_3", ... Option 3 ... }
    ]
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error regenerating meal:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Regenerate a single option in a meal
  app.post('/api/ai/regenerate-option', async (req, res) => {
    try {
      const {
        optionIndex,
        mealTargetCalories,
        mealTargetProtein,
        mealTargetCarbs,
        mealTargetFat,
        preferredFoods = [],
        avoidFoods = [],
        dietaryPreferences = 'Balanced',
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ success: false, message: 'AI client not initialized' });
      }

      const prompt = `Generate a single fresh, delicious meal option (Option #${optionIndex + 1}) matching these target macros:
- Calories: ${mealTargetCalories} kcal
- Protein: ${mealTargetProtein} g
- Carbs: ${mealTargetCarbs} g
- Fat: ${mealTargetFat} g
- Dietary Style: ${dietaryPreferences}
- Preferred: ${preferredFoods.join(', ')}
- Avoid: ${avoidFoods.join(', ')}

Output JSON:
{
  "option": {
    "id": "opt_${Date.now()}",
    "name": { "en": "English Name", "ar": "الاسم بالعربي" },
    "sourceType": "ai",
    "notes": "Cooking tips...",
    "substitutions": "Swap tips...",
    "foods": [
      {
        "id": "f_${Date.now()}_1",
        "foodName": { "en": "Food 1", "ar": "الصنف 1" },
        "amountGrams": 150,
        "calories": 200,
        "protein": 30,
        "carbs": 0,
        "fat": 5
      }
    ],
    "calories": ${mealTargetCalories},
    "protein": ${mealTargetProtein},
    "carbs": ${mealTargetCarbs},
    "fat": ${mealTargetFat}
  }
}
DO NOT invent marketing names, cutting/bulking protocols, or goal names.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error regenerating option:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI Trainer Nutrition Assistant Natural Language Instruction Handler
  app.post('/api/ai/nutrition-assistant-instruction', async (req, res) => {
    try {
      const {
        instruction,
        currentPlan,
        clientProfile,
        availableRecipes = [],
        availableIngredients = [],
      } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({ success: false, message: 'AI client not initialized' });
      }

      const prompt = `You are a precision sports nutrition AI assistant working exclusively under the direction of a fitness coach/trainer.
The Trainer has given you this natural language instruction:
"${instruction}"

Client Profile & Constraints:
- Client Name: ${clientProfile?.name || 'Client'}
- Weight: ${clientProfile?.weightKg || 80} kg
- Allergies: ${(clientProfile?.allergies || []).join(', ') || 'None'}
- Food Dislikes: ${(clientProfile?.foodDislikes || []).join(', ') || 'None'}
- Dietary Style: ${clientProfile?.dietaryPreference || 'Flexible / Whole Foods'}

Current Plan State (if exists):
- Daily Calories: ${currentPlan?.dailyCalories || 2200}
- Protein: ${currentPlan?.proteinGrams || 160}g
- Carbs: ${currentPlan?.carbsGrams || 250}g
- Fat: ${currentPlan?.fatGrams || 70}g
- Meal Count: ${currentPlan?.meals?.length || 4}
- Current Meals: ${JSON.stringify(
        (currentPlan?.meals || []).map((m: any, idx: number) => ({
          mealNumber: idx + 1,
          name: m.name,
          timing: m.timing,
          targetCalories: m.targetCalories,
          optionsCount: m.options?.length || 0,
          optionsSummary: (m.options || []).map((o: any) => o.name?.en || o.name),
        }))
      )}

MANDATORY RULES:
1. Follow the Trainer's instruction EXACTLY.
2. If the Trainer instructs changes to calories, protein, carbs, fats, or number of meals, update those targets accordingly.
3. If the Trainer instructs follow-up adjustments (e.g. "Increase protein", "Reduce carbohydrates", "Remove chicken", "Replace meal 2", "Change option 3", "Make breakfast higher in protein"), modify ONLY the requested part while keeping the rest consistent.
4. EVERY meal must contain EXACTLY 3 distinct options (Option 1, Option 2, Option 3) with real ingredient items, gram amounts ("amountGrams"), and exact calculated calories, protein, carbs, and fats.
5. NEVER invent marketing slogans or protocol names like "Fat Loss Plan", "Cutting Plan", "Bulking Protocol", "Lean Muscle Plan".
6. Respond with valid JSON matching:
{
  "dailyCalories": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatGrams": number,
  "notes": "Trainer notes...",
  "explanation": "Brief 1-sentence note of what was adjusted for the trainer",
  "meals": [
    {
      "id": "meal_1",
      "name": { "en": "Meal 1", "ar": "الوجبة ١" },
      "timing": "08:00 AM",
      "targetCalories": 550,
      "targetProtein": 40,
      "targetCarbs": 60,
      "targetFat": 18,
      "notes": "...",
      "substitutions": "...",
      "options": [
        {
          "id": "opt_1_1",
          "name": { "en": "Option 1 English", "ar": "الخيار 1 عربي" },
          "sourceType": "ai",
          "notes": "...",
          "substitutions": "...",
          "foods": [
            {
              "id": "f_1",
              "foodName": { "en": "Rolled Oats", "ar": "شوفان كامل" },
              "amountGrams": 80,
              "calories": 304,
              "protein": 10.4,
              "carbs": 54.4,
              "fat": 5.6
            }
          ],
          "calories": 550,
          "protein": 40,
          "carbs": 60,
          "fat": 18
        },
        { "id": "opt_1_2", ... },
        { "id": "opt_1_3", ... }
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error in AI nutrition assistant instruction:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
