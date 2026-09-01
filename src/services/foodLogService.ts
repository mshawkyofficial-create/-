import { FoodLogDraft, Ingredient, Language } from '../types';

type ParsedFood = {
  ingredientId: string;
  amountGrams: number | null;
  confidence?: number;
  needsPreparationClarification?: boolean;
};

const aliases: Record<string, string[]> = {
  ing_salmon: ['salmon', 'سلمون'],
  ing_chicken_breast: ['chicken breast', 'chicken', 'صدر دجاج', 'صدر فراخ', 'فراخ', 'دجاج'],
  ing_egg_whites: ['egg whites', 'بياض بيض', 'بياض البيض'],
  ing_eggs: ['whole eggs', 'eggs', 'egg', 'بيض كامل', 'بيض'],
  ing_quinoa: ['quinoa', 'كينوا'],
  ing_white_rice: ['jasmine rice', 'white rice', 'rice', 'أرز ياسمين', 'ارز ياسمين', 'أرز', 'ارز', 'رز'],
  ing_sweet_potato: ['sweet potato', 'بطاطا حلوة', 'بطاطا'],
  ing_oats: ['rolled oats', 'oats', 'oatmeal', 'شوفان'],
  ing_whey_protein: ['whey protein', 'whey', 'واي بروتين', 'واي'],
  ing_blueberries: ['blueberries', 'blueberry', 'توت أزرق', 'توت ازرق'],
  ing_avocado: ['avocado', 'أفوكادو', 'افوكادو'],
  ing_greek_yogurt: ['greek yogurt', 'yogurt', 'زبادي يوناني', 'زبادي'],
  ing_olive_oil: ['olive oil', 'زيت زيتون'],
  ing_edamame: ['edamame', 'إدامامي', 'ادامامي'],
  ing_honey: ['honey', 'عسل'],
};

const round1 = (value: number) => Number(value.toFixed(1));

export function draftFromIngredient(
  ingredient: Ingredient,
  amountGrams: number,
  confidence = 1
): FoodLogDraft {
  const grams = Math.max(0, amountGrams);
  const ratio = grams / 100;
  return {
    ingredientId: ingredient.id,
    name: ingredient.name,
    amountGrams: grams,
    calories: Math.round(ingredient.caloriesPer100g * ratio),
    protein: round1(ingredient.proteinPer100g * ratio),
    carbs: round1(ingredient.carbsPer100g * ratio),
    fat: round1(ingredient.fatPer100g * ratio),
    confidence,
    needsClarification: grams <= 0,
    clarificationMessage: grams <= 0
      ? { en: 'Enter the weight in grams.', ar: 'اكتب وزن الصنف بالجرام.' }
      : undefined,
  };
}

function normalizeDigits(value: string) {
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  return value
    .replace(/[٠-٩]/g, (digit) => String(arabic.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(persian.indexOf(digit)));
}

function parseLocally(text: string, ingredients: Ingredient[]): ParsedFood[] {
  const normalized = normalizeDigits(text.toLowerCase())
    .replace(/،/g, ',')
    .replace(/\s+/g, ' ');

  const candidates: { ingredientId: string; index: number; aliasLength: number; amountGrams: number | null }[] = [];
  Object.entries(aliases).forEach(([ingredientId, names]) => {
    const matchedAlias = [...names]
      .sort((a, b) => b.length - a.length)
      .find((alias) => normalized.includes(alias.toLowerCase()));
    if (!matchedAlias) return;
    const index = normalized.indexOf(matchedAlias.toLowerCase());
    const beforeText = normalized.slice(Math.max(0, index - 24), index);
    const afterText = normalized.slice(index + matchedAlias.length, index + matchedAlias.length + 24);
    const before = beforeText.match(/(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|جرام|جم)?\s*$/i);
    const after = afterText.match(/^\s*(?:[:=-]\s*)?(\d+(?:\.\d+)?)\s*(?:g|gm|gram|grams|جرام|جم)?/i);
    const explicit = before?.[1] || after?.[1];
    candidates.push({
      ingredientId,
      index,
      aliasLength: matchedAlias.length,
      amountGrams: explicit ? Number(explicit) : null,
    });
  });

  const preparationIsClear = /\b(cooked|raw|grilled|baked|boiled|steamed)\b|مطبوخ|مطبوخة|نيء|نيئ|نية|ناي|مشوي|مشوية|مسلوق|مسلوقة|على البخار/i.test(normalized);
  const stateSensitiveFoods = new Set([
    'ing_salmon', 'ing_chicken_breast', 'ing_quinoa', 'ing_white_rice', 'ing_sweet_potato',
  ]);

  return candidates
    .sort((a, b) => a.index - b.index || b.aliasLength - a.aliasLength)
    .filter((candidate, index, list) => !list.slice(0, index).some(
      (other) => other.index === candidate.index && other.aliasLength >= candidate.aliasLength
    ))
    .map(({ ingredientId, amountGrams }) => ({
      ingredientId,
      amountGrams,
      confidence: 0.9,
      needsPreparationClarification: stateSensitiveFoods.has(ingredientId) && !preparationIsClear,
    }));
}

async function parseWithAI(text: string, ingredients: Ingredient[]): Promise<ParsedFood[] | null> {
  try {
    const response = await fetch('/api/ai/parse-food-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        availableIngredients: ingredients.map((item) => ({ id: item.id, name: item.name })),
      }),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.success && Array.isArray(payload.data?.items) ? payload.data.items : null;
  } catch {
    return null;
  }
}

export async function analyzeFoodText(
  text: string,
  ingredients: Ingredient[],
  language: Language
): Promise<{ drafts: FoodLogDraft[]; message?: string }> {
  const parsed = (await parseWithAI(text, ingredients)) || parseLocally(text, ingredients);
  if (!parsed.length) {
    return {
      drafts: [],
      message: language === 'ar'
        ? 'لم أتعرف على الصنف. جرّب: 200 جرام فراخ + 150 جرام رز مطبوخ.'
        : 'Food not recognized. Try: 200g chicken + 150g cooked rice.',
    };
  }

  const drafts = parsed.slice(0, 10).flatMap((item) => {
    const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);
    if (!ingredient) return [];
    const draft = draftFromIngredient(ingredient, Number(item.amountGrams) || 0, item.confidence ?? 0.8);
    if (item.needsPreparationClarification) {
      draft.needsClarification = true;
      draft.clarificationMessage = {
        en: `Was ${ingredient.name.en} weighed cooked or raw? Edit the sentence and analyze again.`,
        ar: `وزن ${ingredient.name.ar} مطبوخ ولا نيّ؟ عدّل الجملة وحلّلها مرة ثانية.`,
      };
    } else if (!item.amountGrams) {
      draft.needsClarification = true;
      draft.clarificationMessage = {
        en: `How many grams of ${ingredient.name.en}?`,
        ar: `كام جرام من ${ingredient.name.ar}؟`,
      };
    }
    return [draft];
  });

  return { drafts };
}
