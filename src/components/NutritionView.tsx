import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { LockedFeature } from './LockedFeature';
import { analyzeFoodText, draftFromIngredient } from '../services/foodLogService';
import { FoodLogDraft, NutritionMealSlot } from '../types';
import { AlertCircle, Bot, BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Plus, ShieldCheck, Sparkles, Trash2, Utensils } from 'lucide-react';

const slots: NutritionMealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const NutritionView: React.FC = () => {
  const app = useApp();
  const { user, nutritionPlans, ingredients, consumedNutrition, nutritionLogDate, setNutritionLogDate,
    dailyFoodLogItems, logNutritionQuickAdd, removeDailyFoodLogItem, clearDailyFoodLog,
    selectClientMealOption, language, setShowAuthModal, setAuthMode, setActiveTab, t } = app;
  const ar = language === 'ar';
  const today = dateKey(new Date());
  const plan = nutritionPlans.find((item) => item.clientId === user.id && item.status === 'active');
  const [showAdd, setShowAdd] = useState(false);
  const [mode, setMode] = useState<'smart' | 'manual'>('smart');
  const [slot, setSlot] = useState<NutritionMealSlot>('other');
  const [smartText, setSmartText] = useState('');
  const [drafts, setDrafts] = useState<FoodLogDraft[]>([]);
  const [message, setMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [manual, setManual] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (!user.entitlements.hasNutrition) return <div className="pt-20 pb-28"><LockedFeature productName={t('nutritionProduct')} productType="nutrition" onOpenRedeem={() => { setAuthMode('activate'); setShowAuthModal(true); }} /></div>;

  const targets = {
    calories: plan?.dailyCalories ?? user.dailyCaloriesTarget ?? 2200,
    protein: plan?.proteinGrams ?? user.proteinTarget ?? 160,
    carbs: plan?.carbsGrams ?? user.carbsTarget ?? 250,
    fat: plan?.fatGrams ?? user.fatTarget ?? 70,
  };
  const left = {
    calories: targets.calories - consumedNutrition.calories,
    protein: Number((targets.protein - consumedNutrition.protein).toFixed(1)),
    carbs: Number((targets.carbs - consumedNutrition.carbs).toFixed(1)),
    fat: Number((targets.fat - consumedNutrition.fat).toFixed(1)),
  };
  const advice = useMemo(() => {
    if (left.calories < 0) return ar ? `تجاوزت هدف السعرات بـ ${Math.abs(left.calories)} سعر. خلّي باقي اليوم خفيف وعالي الشبع.` : `You are ${Math.abs(left.calories)} kcal over target. Keep the rest of today light and filling.`;
    if (left.protein > 30) return ar ? `متبقي ${left.protein} جم بروتين. اختار مصدر بروتين قليل الدهون في الوجبة القادمة.` : `${left.protein}g protein remaining. Choose a lean protein source next.`;
    if (left.fat < 0) return ar ? 'الدهون أعلى من الهدف؛ قلّل الزيوت والمكسرات في باقي اليوم.' : 'Fat is over target; limit oils and nuts for the rest of today.';
    return ar ? 'أنت قريب من أهدافك. وزّع المتبقي على الوجبات بدون إجبار نفسك على أرقام دقيقة جدًا.' : 'You are close to target. Spread the remainder across your meals without forcing exact numbers.';
  }, [ar, left.calories, left.fat, left.protein]);
  const slotName = (value: NutritionMealSlot) => ({
    breakfast: ar ? 'فطار' : 'Breakfast', lunch: ar ? 'غداء' : 'Lunch', dinner: ar ? 'عشاء' : 'Dinner',
    snack: ar ? 'سناك' : 'Snack', other: ar ? 'أخرى' : 'Other',
  })[value];
  const changeDay = (amount: number) => { const day = new Date(`${nutritionLogDate}T12:00:00`); day.setDate(day.getDate() + amount); setNutritionLogDate(dateKey(day)); };
  const close = () => { setShowAdd(false); setSmartText(''); setDrafts([]); setMessage(''); };
  const analyze = async () => {
    if (!smartText.trim()) return;
    setAnalyzing(true); setMessage('');
    const result = await analyzeFoodText(smartText, ingredients, language);
    setDrafts(result.drafts); setMessage(result.message || ''); setAnalyzing(false);
  };
  const changeGrams = (index: number, grams: number) => setDrafts((current) => current.map((draft, i) => {
    const ingredient = ingredients.find((item) => item.id === draft.ingredientId);
    return i === index && ingredient ? draftFromIngredient(ingredient, grams, draft.confidence) : draft;
  }));
  const saveSmart = () => {
    if (!drafts.length || drafts.some((item) => item.needsClarification)) return;
    drafts.forEach((item) => logNutritionQuickAdd(item.calories, item.protein, item.carbs, item.fat, item.name, slot, 'ai', item.amountGrams, smartText));
    close();
  };
  const saveManual = (event: React.FormEvent) => {
    event.preventDefault();
    logNutritionQuickAdd(manual.calories, manual.protein, manual.carbs, manual.fat, manual.name, slot, 'manual');
    setManual({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 }); close();
  };
  const macroCards = [
    { key: 'protein', label: t('protein'), current: consumedNutrition.protein, target: targets.protein, color: '#506600', bg: '#f7faf0' },
    { key: 'carbs', label: t('carbs'), current: consumedNutrition.carbs, target: targets.carbs, color: '#0284c7', bg: '#f0f9ff' },
    { key: 'fat', label: t('fat'), current: consumedNutrition.fat, target: targets.fat, color: '#d97706', bg: '#fffbeb' },
  ];

  return <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-6 animate-fade-in text-start">
    <div className="flex items-center justify-between gap-3 pt-2"><div><h1 className="text-2xl sm:text-3xl font-black">{t('nutritionTracking')}</h1><p className="text-xs sm:text-sm text-[#565e74]">{ar ? 'سجل أكلك، راجع الكمية، وتابع المتبقي من هدف الكوتش' : 'Log food, confirm quantities, and track your coach-prescribed target'}</p></div><button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#ccff00] text-xs font-black shadow-md"><Plus className="w-4 h-4" />{t('addFood')}</button></div>

    <div className="flex items-center justify-between bg-white border border-[#e0e3e5] rounded-2xl p-2">
      <button onClick={() => changeDay(-1)} className="p-2 rounded-xl hover:bg-[#f2f4f6]"><ChevronRight className="w-4 h-4 rtl:rotate-180" /></button>
      <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#506600]" /><input type="date" max={today} value={nutritionLogDate} onChange={(e) => setNutritionLogDate(e.target.value)} className="text-sm font-black bg-transparent outline-none" />{nutritionLogDate === today && <span className="text-[10px] bg-[#ccff00]/30 px-2 py-1 rounded-full font-black">{ar ? 'اليوم' : 'Today'}</span>}</div>
      <button onClick={() => changeDay(1)} disabled={nutritionLogDate >= today} className="p-2 rounded-xl hover:bg-[#f2f4f6] disabled:opacity-30"><ChevronLeft className="w-4 h-4 rtl:rotate-180" /></button>
    </div>

    <section className="bg-white rounded-3xl p-6 border border-[#e0e3e5] flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6"><div className="text-center sm:text-start"><span className="text-xs font-bold text-[#506600] uppercase flex items-center justify-center sm:justify-start gap-1"><ShieldCheck className="w-3.5 h-3.5" />{ar ? 'هدف الكوتش اليومي' : 'Coach daily target'}</span><div className="flex items-baseline gap-2 mt-1"><span className="text-5xl font-black">{consumedNutrition.calories}</span><span className="text-sm font-bold text-[#565e74]">/ {targets.calories} {t('kcal')}</span></div><p className={`text-xs font-bold mt-1 ${left.calories < 0 ? 'text-red-600' : 'text-[#506600]'}`}>{left.calories >= 0 ? `${left.calories} ${t('kcal')} ${t('remaining')}` : `${Math.abs(left.calories)} ${ar ? 'سعر فوق الهدف' : 'kcal over target'}`}</p></div><div className="w-full sm:w-64"><div className="flex justify-between text-xs font-bold text-[#565e74] mb-2"><span>{t('completed')}</span><span>{Math.min(100, Math.round(consumedNutrition.calories / Math.max(1, targets.calories) * 100))}%</span></div><div className="h-4 bg-[#f2f4f6] rounded-full overflow-hidden"><div className="h-full bg-[#506600] rounded-full" style={{ width: `${Math.min(100, consumedNutrition.calories / Math.max(1, targets.calories) * 100)}%` }} /></div></div></div>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">{macroCards.map((macro) => { const remaining = Number((macro.target - macro.current).toFixed(1)); return <div key={macro.key} className="rounded-2xl p-3.5 border" style={{ backgroundColor: macro.bg, borderColor: `${macro.color}33` }}><span className="text-[11px] font-extrabold uppercase" style={{ color: macro.color }}>{macro.label}</span><div className="text-lg font-black mt-1">{macro.current}g <span className="text-[10px] text-[#565e74]">/ {macro.target}g</span></div><div className="h-1.5 bg-black/10 rounded-full mt-2 overflow-hidden"><div className="h-full rounded-full" style={{ backgroundColor: macro.color, width: `${Math.min(100, macro.current / Math.max(1, macro.target) * 100)}%` }} /></div><p className={`text-[10px] font-bold mt-2 ${remaining < 0 ? 'text-red-600' : 'text-[#565e74]'}`}>{remaining >= 0 ? `${ar ? 'متبقي' : 'Left'} ${remaining}g` : `${Math.abs(remaining)}g ${ar ? 'فوق الهدف' : 'over'}`}</p></div>; })}</div>
      <div className="rounded-2xl bg-[#f7faf0] border border-[#506600]/20 p-4 flex gap-3"><Sparkles className="w-5 h-5 text-[#506600] shrink-0" /><div><p className="text-xs font-black text-[#506600]">{ar ? 'نصيحة اليوم' : "Today's advice"}</p><p className="text-xs text-[#565e74] mt-1 leading-relaxed">{advice}</p></div></div>
    </section>

    <section className="bg-white rounded-3xl p-5 border border-[#e0e3e5]"><div className="flex items-center justify-between mb-4"><div><h2 className="text-base font-black">{ar ? 'سجل أكل اليوم' : 'Daily food log'}</h2><p className="text-xs text-[#565e74]">{dailyFoodLogItems.length} {ar ? 'صنف مسجل' : 'items logged'}</p></div>{!!dailyFoodLogItems.length && <button onClick={() => window.confirm(ar ? 'مسح سجل اليوم بالكامل؟' : 'Clear the full day?') && clearDailyFoodLog()} className="text-[11px] font-bold text-red-600">{ar ? 'مسح اليوم' : 'Clear day'}</button>}</div>
      {!dailyFoodLogItems.length ? <div className="text-center py-8 bg-[#f7f9fb] rounded-2xl"><Utensils className="w-7 h-7 mx-auto text-[#9aa1ad] mb-2" /><p className="text-sm font-bold text-[#565e74]">{ar ? 'لسه مفيش أكل مسجل في اليوم ده' : 'No food logged for this day yet'}</p></div> : <div className="flex flex-col gap-2">{dailyFoodLogItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5]"><div className="min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-black truncate">{ar ? item.name.ar : item.name.en}</p><span className="text-[9px] font-bold bg-white border px-1.5 py-0.5 rounded">{slotName(item.mealSlot)}</span>{item.source === 'ai' && <Bot className="w-3 h-3 text-[#506600]" />}</div><p className="text-[10px] text-[#565e74] mt-1">{item.amountGrams ? `${item.amountGrams}g • ` : ''}{item.calories} kcal • P {item.protein}g • C {item.carbs}g • F {item.fat}g</p></div><button onClick={() => removeDailyFoodLogItem(item.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div>)}</div>}
    </section>

    {plan ? <section className="bg-white rounded-3xl p-5 border border-[#e0e3e5]"><div className="flex items-center justify-between mb-4"><div><h2 className="text-base font-black">{ar ? 'برنامجك الغذائي' : 'Your nutrition plan'}</h2><p className="text-xs text-[#565e74]">{ar ? plan.title.ar : plan.title.en}</p></div><button onClick={() => setActiveTab('recipes')} className="text-xs font-black text-[#506600] flex items-center gap-1"><BookOpen className="w-4 h-4" />{ar ? 'الوصفات' : 'Recipes'}</button></div><div className="flex flex-col gap-3">{plan.meals.map((meal) => { const selected = meal.selectedOptionIndex ?? 0; const option = meal.options?.[selected]; const name = option?.name ?? meal.name; const cals = option?.calories ?? meal.calories; const protein = option?.protein ?? meal.protein; const carbs = option?.carbs ?? meal.carbs; const fat = option?.fat ?? meal.fat; return <div key={meal.id} className="p-4 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5]"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-black">{typeof meal.name === 'string' ? meal.name : (ar ? meal.name.ar : meal.name.en)}</p>{option && <p className="text-xs text-[#565e74] mt-1">{typeof option.name === 'string' ? option.name : (ar ? option.name.ar : option.name.en)}</p>}</div><span className="text-xs font-black">{cals} kcal</span></div>{!!meal.options?.length && <div className="flex gap-1.5 my-3">{meal.options.map((_, i) => <button key={i} onClick={() => selectClientMealOption(plan.id, meal.id, i)} className={`flex-1 h-8 rounded-lg text-[10px] font-black ${i === selected ? 'bg-[#191c1e] text-[#ccff00]' : 'bg-white border'}`}>{ar ? `خيار ${i + 1}` : `Option ${i + 1}`}</button>)}</div>}<div className="flex items-center justify-between mt-3"><p className="text-[10px] font-bold text-[#565e74]">P {protein}g • C {carbs}g • F {fat}g</p><button onClick={() => logNutritionQuickAdd(cals, protein, carbs, fat, name, 'other', 'plan')} className="px-3 py-2 rounded-xl bg-[#ccff00] text-xs font-black flex items-center gap-1"><Plus className="w-3.5 h-3.5" />{ar ? 'تسجيل' : 'Log'}</button></div></div>; })}</div></section> : <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{ar ? 'لم يتم تعيين برنامج غذائي نشط لك بعد. تقدر تسجل أكلك يدويًا لحين تعيينه.' : 'No active nutrition plan is assigned yet. You can still log food manually.'}</div>}

    {showAdd && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"><div className="bg-white rounded-3xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl text-start"><div className="flex items-center justify-between mb-4"><div><h3 className="text-lg font-black">{ar ? 'إضافة أكل' : 'Add food'}</h3><p className="text-xs text-[#565e74]">{ar ? 'راجع الكمية قبل الحفظ' : 'Confirm quantities before saving'}</p></div><button onClick={close} className="w-9 h-9 rounded-full bg-[#f2f4f6] font-black">×</button></div>
      <div className="grid grid-cols-2 gap-2 bg-[#f2f4f6] p-1.5 rounded-xl mb-4"><button onClick={() => setMode('smart')} className={`h-9 rounded-lg text-xs font-black ${mode === 'smart' ? 'bg-white shadow-sm' : ''}`}><Bot className="w-4 h-4 inline me-1" />{ar ? 'إدخال ذكي' : 'Smart entry'}</button><button onClick={() => setMode('manual')} className={`h-9 rounded-lg text-xs font-black ${mode === 'manual' ? 'bg-white shadow-sm' : ''}`}>{ar ? 'إدخال يدوي' : 'Manual entry'}</button></div>
      <label className="text-[11px] font-black text-[#565e74] block mb-1">{ar ? 'نوع الوجبة' : 'Meal'}</label><select value={slot} onChange={(e) => setSlot(e.target.value as NutritionMealSlot)} className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold mb-4">{slots.map((item) => <option key={item} value={item}>{slotName(item)}</option>)}</select>
      {mode === 'smart' ? <div className="flex flex-col gap-3"><textarea value={smartText} onChange={(e) => { setSmartText(e.target.value); setDrafts([]); }} rows={3} placeholder={ar ? 'مثال: 200 جرام صدر فراخ و150 جرام رز مطبوخ' : 'Example: 200g chicken breast and 150g cooked rice'} className="w-full p-3 rounded-xl bg-[#f2f4f6] text-sm outline-none resize-none" /><button onClick={analyze} disabled={analyzing || !smartText.trim()} className="h-11 rounded-xl bg-[#191c1e] text-white text-xs font-black disabled:opacity-40"><Sparkles className="w-4 h-4 inline me-1" />{analyzing ? (ar ? 'جاري التحليل...' : 'Analyzing...') : (ar ? 'تحليل ومراجعة' : 'Analyze & review')}</button>{message && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl">{message}</p>}
        {!!drafts.length && <><p className="text-xs font-black">{ar ? 'راجع الأوزان المحسوبة' : 'Review calculated weights'}</p>{drafts.map((draft, index) => <div key={`${draft.ingredientId}_${index}`} className={`p-3 rounded-xl border ${draft.needsClarification ? 'border-amber-300 bg-amber-50' : 'border-[#e0e3e5] bg-[#f7f9fb]'}`}><div className="flex items-center justify-between gap-3"><p className="text-xs font-black">{ar ? draft.name.ar : draft.name.en}</p><div className="flex items-center gap-1"><input type="number" min="1" value={draft.amountGrams || ''} onChange={(e) => changeGrams(index, Number(e.target.value))} className="w-20 h-9 px-2 rounded-lg bg-white border text-center text-xs font-black" /><span className="text-xs">g</span></div></div>{draft.needsClarification ? <p className="text-[10px] text-amber-700 mt-2">{ar ? draft.clarificationMessage?.ar : draft.clarificationMessage?.en}</p> : <p className="text-[10px] text-[#565e74] mt-2">{draft.calories} kcal • P {draft.protein}g • C {draft.carbs}g • F {draft.fat}g</p>}</div>)}<button onClick={saveSmart} disabled={drafts.some((item) => item.needsClarification)} className="h-11 rounded-xl bg-[#ccff00] text-xs font-black disabled:opacity-40"><Check className="w-4 h-4 inline me-1" />{ar ? 'تأكيد وإضافة للعداد' : 'Confirm and add to counter'}</button></>}
        <p className="text-[10px] text-[#767e94] leading-relaxed">{ar ? 'الحساب يتم من قاعدة الأغذية بعد تأكيد الوزن. النتائج تقديرية وقد تختلف حسب المنتج وطريقة الطهي.' : 'Macros are calculated from the food database after weight confirmation. Values vary by product and cooking method.'}</p></div> : <form onSubmit={saveManual} className="flex flex-col gap-3"><input required value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} placeholder={ar ? 'اسم الصنف أو الوجبة' : 'Food or meal name'} className="h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs" /><label className="text-[11px] font-black text-[#565e74]">{t('calories')} (kcal)</label><input required type="number" min="0" value={manual.calories} onChange={(e) => setManual({ ...manual, calories: Number(e.target.value) })} className="h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-black" /><div className="grid grid-cols-3 gap-2">{(['protein', 'carbs', 'fat'] as const).map((key) => <label key={key} className="text-[10px] font-black text-[#565e74]">{t(key)} (g)<input required type="number" min="0" step="0.1" value={manual[key]} onChange={(e) => setManual({ ...manual, [key]: Number(e.target.value) })} className="w-full h-9 mt-1 px-2 rounded-lg bg-[#f2f4f6] text-center text-xs" /></label>)}</div><button type="submit" className="h-11 rounded-xl bg-[#ccff00] text-xs font-black mt-2">{ar ? 'إضافة للعداد' : 'Add to counter'}</button></form>}
    </div></div>}
  </div>;
};
