import React from 'react';
import { useApp, SUBSCRIPTION_PAGE_URL } from '../context/AppContext';
import { Lock, ArrowRight, ArrowLeft, Key, Sparkles, CheckCircle2 } from 'lucide-react';

interface LockedFeatureProps {
  productName: string;
  productType: 'training' | 'nutrition' | 'recipe_book' | 'full_access';
  onOpenRedeem?: () => void;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({
  productName,
  productType,
  onOpenRedeem,
}) => {
  const { t, language, setActiveTab } = useApp();
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const getBenefits = () => {
    if (productType === 'training') {
      return [
        { en: 'Custom Workout Routines & Periodization', ar: 'خطط تمارين دورية مخصصة لمستواك' },
        { en: 'Exercise Video Library with Technique Analysis', ar: 'مكتبة تمارين مصورة بالفيديو مع تحليل التكنيك' },
        { en: 'Direct Form Critique & Coach Feedback', ar: 'تقييم فوري لتكنيك التمارين من الكابتن شوقي' },
        { en: 'Progress Tracking & Personal Records', ar: 'سجل الأوزان والتحطيم المستمر للأرقام القياسية' },
      ];
    }
    if (productType === 'nutrition') {
      return [
        { en: 'Personalized Daily Calorie & Macro Target Plan', ar: 'خطة سعرات وماكروز يومية محسوبة بدقة' },
        { en: 'Tailored Meal Guides & Custom Substitutions', ar: 'دليل وجبات وبدائل غذائية مرنة تناسب يومك' },
        { en: 'Interactive Macro Tracking & AI Optimization', ar: 'تتبع ذكي للمغذيات وتعديل تلقائي للوجبات' },
        { en: 'Weekly Body Composition & Weight Adjustments', ar: 'تعديل أسبوعي للكميات حسب استجابة الجسم' },
      ];
    }
    return [
      { en: 'Exclusive High-Protein Chef Recipes', ar: 'وصفات شيف بروتينية حصرية ولذيذة' },
      { en: 'AI Recipe Personalizer with Ingredient Database', ar: 'محرك ذكي لتعديل كميات المكونات حسب سعراتك' },
      { en: 'Step-by-Step Video Cooking Instructions', ar: 'فيديوهات شرح خطوات الطهي خطوة بخطوة' },
      { en: 'Automated Macro & Calorie Calculation', ar: 'حساب تلقائي دقيق للمغذيات لكل 100 جرام' },
    ];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 max-w-lg mx-auto text-center animate-fade-in">
      {/* Lock Icon Badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-[#f2f4f6] flex items-center justify-center text-[#506600] shadow-inner ring-8 ring-[#eceef0]/50">
          <Lock className="w-9 h-9 stroke-[2.2px]" />
        </div>
        <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#ccff00] text-[#191c1e] shadow-sm">
          <Sparkles className="w-4 h-4 fill-current" />
        </span>
      </div>

      {/* Main Titles */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191c1e] mb-2 leading-tight">
        {productName} {t('inactive')}
      </h2>
      <p className="text-sm sm:text-base text-[#565e74] mb-6 max-w-sm leading-relaxed">
        {t('featureLockedDesc')}
      </p>

      {/* Benefits Card */}
      <div className="w-full bg-white rounded-2xl p-5 border border-[#e0e3e5] shadow-sm mb-6 text-start">
        <span className="text-[11px] font-bold text-[#506600] uppercase tracking-wider block mb-3">
          {isRtl ? 'ما ستحصل عليه عند التفعيل:' : 'What is included in this tier:'}
        </span>
        <div className="flex flex-col gap-3">
          {getBenefits().map((b, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#506600] shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-[#191c1e] leading-snug">
                {typeof b === 'string'
                  ? b
                  : isRtl
                  ? b?.ar || b?.en || ''
                  : b?.en || b?.ar || ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Activation Actions */}
      <div className="w-full flex flex-col gap-3">
        <a
          href={SUBSCRIPTION_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-13 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-[#191c1e] font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-[#ccff00]/30 transition-all"
        >
          <span>{isRtl ? `تفعيل ${productName}` : `Activate ${productName}`}</span>
          <ArrowIcon className="w-5 h-5" />
        </a>

        {onOpenRedeem && (
          <button
            onClick={onOpenRedeem}
            className="w-full h-12 rounded-xl bg-white hover:bg-[#f7f9fb] active:scale-[0.98] text-[#506600] border border-[#506600]/30 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Key className="w-4 h-4" />
            <span>{t('redeemAccessCode')}</span>
          </button>
        )}
      </div>

      <p className="text-[11px] font-medium text-[#565e74] mt-4 opacity-80">
        {t('cancelAnytime')}
      </p>
    </div>
  );
};
