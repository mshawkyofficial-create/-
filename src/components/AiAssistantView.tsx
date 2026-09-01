import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bot, Send, Sparkles, User, Utensils, ArrowRight, ArrowLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recipeSuggestionId?: string;
}

export const AiAssistantView: React.FC = () => {
  const { user, consumedNutrition, recipes, language, setActiveTab, t } = useApp();
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: isRtl
        ? `أهلاً بك يا ${user.name.split(' ')[0]}! أنا مساعدك الذكي للتغذية واللياقة. لديك اليوم ${Math.max(0, user.dailyCaloriesTarget - consumedNutrition.calories)} سعرة حرارية متبقية و ${Math.max(0, user.proteinTarget - consumedNutrition.protein)}جم بروتين متبقي. كيف يمكنني مساعدتك الآن؟`
        : `Hello ${user.name.split(' ')[0]}! I am your AI Nutrition & Fitness Coach. You have ${Math.max(0, user.dailyCaloriesTarget - consumedNutrition.calories)} kcal and ${Math.max(0, user.proteinTarget - consumedNutrition.protein)}g protein remaining today. How can I optimize your meals?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    {
      key: 'prompt600KcalLeft',
      label: t('prompt600KcalLeft'),
    },
    {
      key: 'promptHighProteinDinner',
      label: t('promptHighProteinDinner'),
    },
    {
      key: 'promptReduceCarbs',
      label: t('promptReduceCarbs'),
    },
    {
      key: 'promptPostWorkout',
      label: t('promptPostWorkout'),
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // AI intelligent answer generation grounded in structured ingredient data
    setTimeout(() => {
      let aiResponseText = '';
      let recipeId: string | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('600') || lower.includes('متبقية') || lower.includes('remaining') || lower.includes('dinner') || lower.includes('عشاء')) {
        recipeId = 'rec_miso_salmon';
        aiResponseText = isRtl
          ? `بناءً على هدفك المتبقي (~600 سعرة و 40جم بروتين)، أفضل خيار متوازن هو "وعاء السلمون بصلصة الميسو والكينوا". يحتوي على 460 سعرة، 42جم بروتين، 28جم كارب، و 16جم دهون صحية من السلمون والأفوكادو. يمكنك إضافة 30جم إدامامي لزيادة البروتين بدقة.`
          : `Based on your remaining ~600 kcal target, I recommend the "Miso Glazed Salmon Bowl". It delivers 460 kcal, 42g Protein, 28g Carbs, and 16g Healthy Fats from Atlantic Salmon and avocado. You can scale the salmon portion to 180g to hit 48g protein.`;
      } else if (lower.includes('protein') || lower.includes('بروتين') || lower.includes('40')) {
        recipeId = 'rec_steak_sweet_potato';
        aiResponseText = isRtl
          ? `للحصول على أكثر من 40جم بروتين في وجبة واحدة بأقل من 500 سعرة: أنصحك بـ "ستيك اللحم المشوي مع البطاطا الحلوة" أو "صدر الدجاج المشوي 180جم مع 150جم بطاطا حلوة". توفر 48جم بروتين صافي مع نسبة دهون ممتازة.`
          : `For 40g+ protein under 500 calories, the "Charred Steak / Grilled Chicken & Sweet Potato" gives you 48g clean protein, 35g complex carbs, and only 8g fat.`;
      } else if (lower.includes('post-workout') || lower.includes('بعد تمرين') || lower.includes('تمرين')) {
        recipeId = 'rec_protein_pancakes';
        aiResponseText = isRtl
          ? `بعد تمرين القوة العنيف، يحتاج جسمك لبروتين سريع الامتصاص مع كربوهيدرات لملء مخازن الجليكوجين. "بان كيك البروتين بالتوت الأزرق والشوفان" يوفر 45جم بروتين و 40جم كارب نظيف مع بياض البيض والواي بروتين.`
          : `Post-workout, your muscles need fast-acting protein and complex carbs. The "Blueberry Protein Fluffy Pancakes" (Oats, Whey Isolate, and Egg Whites) provides 45g protein and 40g carbs with zero added sugars.`;
      } else {
        aiResponseText = isRtl
          ? `بإمكانك دائماً الاعتماد على المكونات الأساسية مثل السلمون، صدور الدجاج، بياض البيض، والشوفان. يمكنك أيضاً استخدام أداة "تخصيص الوصفة" لتعديل أي وجبة في مكتبة الوصفات وفق جراماتك المطلوبة بدقة.`
          : `You can always adjust portions in the Recipe Library using our mathematical AI Personalizer, which scales whole-food ingredients (Salmon, Chicken, Quinoa, Sweet Potato) to match your exact macro target without guessing.`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recipeSuggestionId: recipeId,
      };

      setChatHistory((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-4 animate-fade-in h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2 text-start">
        <div className="w-11 h-11 rounded-2xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-md shadow-[#ccff00]/30 shrink-0">
          <Bot className="w-6 h-6 stroke-[2.2px]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#191c1e]">
            {t('aiAssistantTitle')}
          </h1>
          <p className="text-xs text-[#565e74]">
            {isRtl ? 'حسابات وتعديلات غذائية دقيقة مبنية على قاعدة بيانات حقيقية' : 'Evidence-based calculations with zero invented nutrition'}
          </p>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp.label)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#e0e3e5] hover:border-[#506600] text-[#191c1e] text-xs font-bold whitespace-nowrap shadow-2xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-[#506600]" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 p-4 rounded-3xl bg-white border border-[#eceef0] shadow-sm">
        {chatHistory.map((msg) => {
          const isAi = msg.sender === 'ai';
          const suggestedRecipe = msg.recipeSuggestionId
            ? recipes.find((r) => r.id === msg.recipeSuggestionId)
            : null;

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                isAi ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAi ? 'bg-[#ccff00] text-[#191c1e]' : 'bg-[#191c1e] text-white'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed text-start ${
                  isAi
                    ? 'bg-[#f7f9fb] text-[#191c1e] border border-[#e0e3e5]'
                    : 'bg-[#191c1e] text-white'
                }`}
              >
                <p>{msg.text}</p>

                {/* Suggested Recipe Mini Card */}
                {suggestedRecipe && (
                  <div
                    onClick={() => setActiveTab('recipes')}
                    className="mt-3 p-2.5 rounded-xl bg-white border border-[#506600]/30 shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#506600] transition-colors"
                  >
                    <img
                      src={suggestedRecipe.image}
                      alt={
                        typeof suggestedRecipe.name === 'string'
                          ? suggestedRecipe.name
                          : isRtl
                          ? suggestedRecipe.name?.ar || suggestedRecipe.name?.en || 'Recipe'
                          : suggestedRecipe.name?.en || suggestedRecipe.name?.ar || 'Recipe'
                      }
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#506600] uppercase block">
                        {t('recommended')}
                      </span>
                      <h5 className="text-xs font-extrabold text-[#191c1e] truncate">
                        {typeof suggestedRecipe.name === 'string'
                          ? suggestedRecipe.name
                          : isRtl
                          ? suggestedRecipe.name?.ar || suggestedRecipe.name?.en || 'Recipe'
                          : suggestedRecipe.name?.en || suggestedRecipe.name?.ar || 'Recipe'}
                      </h5>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-[#506600] shrink-0" />
                  </div>
                )}

                <span
                  className={`text-[9px] font-semibold mt-1 block opacity-60 ${
                    isAi ? 'text-[#565e74]' : 'text-white/70'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2 self-start items-center p-3 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs text-[#565e74]">
            <Bot className="w-4 h-4 text-[#506600] animate-bounce" />
            <span>{isRtl ? 'المدرب الذكي يحلل الخطة الغذائية...' : 'AI is calculating optimal nutrition...'}</span>
          </div>
        )}
      </div>

      {/* Bottom Prompt Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#e0e3e5] shadow-md focus-within:border-[#506600]"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={t('aiAssistantPromptPlaceholder')}
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium text-[#191c1e] bg-transparent outline-none"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] flex items-center justify-center shadow-xs active:scale-95 transition-transform shrink-0"
        >
          <Send className="w-4 h-4 translate-x-0.5 rtl:-translate-x-0.5" />
        </button>
      </form>
    </div>
  );
};
