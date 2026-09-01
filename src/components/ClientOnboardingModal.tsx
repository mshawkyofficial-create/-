import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientOnboardingData, MeasurementLocation } from '../types';
import {
  User,
  Dumbbell,
  Apple,
  AlertTriangle,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Shield,
  Clock,
  Calendar,
  Ruler,
  Scale,
  UploadCloud,
  Info,
  Check,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';

interface ClientOnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialData?: ClientOnboardingData | null;
  onSave?: (data: ClientOnboardingData) => void;
  isTrainerEditing?: boolean;
  isMandatory?: boolean; // When rendered as first-time login screen
}

const DAYS_OF_WEEK = [
  { id: 'Monday', en: 'Mon', ar: 'الإثنين', fullEn: 'Monday', fullAr: 'الإثنين' },
  { id: 'Tuesday', en: 'Tue', ar: 'الثلاثاء', fullEn: 'Tuesday', fullAr: 'الثلاثاء' },
  { id: 'Wednesday', en: 'Wed', ar: 'الأربعاء', fullEn: 'Wednesday', fullAr: 'الأربعاء' },
  { id: 'Thursday', en: 'Thu', ar: 'الخميس', fullEn: 'Thursday', fullAr: 'الخميس' },
  { id: 'Friday', en: 'Fri', ar: 'الجمعة', fullEn: 'Friday', fullAr: 'الجمعة' },
  { id: 'Saturday', en: 'Sat', ar: 'السبت', fullEn: 'Saturday', fullAr: 'السبت' },
  { id: 'Sunday', en: 'Sun', ar: 'الأحد', fullEn: 'Sunday', fullAr: 'الأحد' },
];

const EQUIPMENT_OPTIONS = [
  { id: 'Full Gym', en: 'Full Gym', ar: 'جيم متكامل' },
  { id: 'Home Gym', en: 'Home Gym', ar: 'جيم منزلي' },
  { id: 'Dumbbells', en: 'Dumbbells', ar: 'دامبلز' },
  { id: 'Resistance Bands', en: 'Resistance Bands', ar: 'أحبال مقاومة' },
  { id: 'Bodyweight', en: 'Bodyweight', ar: 'وزن الجسم' },
  { id: 'Custom', en: 'Custom', ar: 'مخصص' },
];

const EATING_STYLES = [
  { id: 'Home Cooked', en: 'Home Cooked', ar: 'طبخ منزلي' },
  { id: 'Quick Meals', en: 'Quick Meals', ar: 'وجبات سريعة التحضير' },
  { id: 'Meal Prep', en: 'Meal Prep', ar: 'تجهيز وجبات مسبق' },
  { id: 'No Preference', en: 'No Preference', ar: 'بدون تفضيل محدد' },
];

const GOAL_OPTIONS = [
  { id: 'Fat Loss', en: 'Fat Loss', ar: 'خسارة الدهون' },
  { id: 'Muscle Gain', en: 'Muscle Gain', ar: 'بناء العضلات' },
  { id: 'Maintenance', en: 'Maintenance', ar: 'المحافظة على الوزن' },
  { id: 'Fitness Improvement', en: 'Fitness Improvement', ar: 'تحسين اللياقة والصحة' },
  { id: 'Custom Goal', en: 'Custom Goal', ar: 'هدف مخصص' },
];

export const ClientOnboardingModal: React.FC<ClientOnboardingModalProps> = ({
  isOpen = true,
  onClose,
  initialData,
  onSave,
  isTrainerEditing = false,
  isMandatory = false,
}) => {
  const {
    language,
    user,
    completeOnboarding,
    updateClient,
    activeClientId,
    measurementLocations,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowNext = isRtl ? ArrowLeft : ArrowRight;
  const ArrowPrev = isRtl ? ArrowRight : ArrowLeft;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Initial data setup
  const [formData, setFormData] = useState<ClientOnboardingData>(() => {
    const existing = initialData || user.onboardingData;
    return {
      age: existing?.age || 27,
      heightCm: existing?.heightCm || user.heightCm || 178,
      currentWeightKg: existing?.currentWeightKg || user.weightKg || 82.5,
      goal: (existing?.goal as any) || 'Muscle Gain',
      customGoalText: existing?.customGoalText || '',
      trainingLevel: existing?.trainingLevel || 'Intermediate',
      trainingExperience: existing?.trainingExperience || '',
      trainingDaysPerWeek: existing?.trainingDaysPerWeek || 4,
      restDaysPerWeek: existing?.restDaysPerWeek || 3,
      preferredTrainingDays: existing?.preferredTrainingDays || ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      preferredRestDays: existing?.preferredRestDays || ['Wednesday', 'Saturday', 'Sunday'],
      availableEquipment: existing?.availableEquipment || ['Full Gym'],
      customEquipmentText: existing?.customEquipmentText || '',
      workoutDurationMin: existing?.workoutDurationMin || 60,
      preferredWorkoutTime: existing?.preferredWorkoutTime || '',
      exercisesToAvoid: existing?.exercisesToAvoid || '',
      foodsToAvoid: existing?.foodsToAvoid || '',
      allergies: existing?.allergies || '',
      preferredFoods: existing?.preferredFoods || '',
      mealsPerDay: existing?.mealsPerDay || 3,
      eatingStyle: existing?.eatingStyle || 'Meal Prep',
      mealTimes: existing?.mealTimes || '',
      nutritionNotes: existing?.nutritionNotes || '',
      hasInjuries: existing?.hasInjuries ?? false,
      injuryDescription: existing?.injuryDescription || '',
      baselineWeightKg: existing?.baselineWeightKg || existing?.currentWeightKg || user.weightKg || 82.5,
      baselineMeasurements: existing?.baselineMeasurements || {
        waistCm: 84,
        abdomenCm: 86,
        chestCm: 106,
        hipsCm: 100,
        armCm: 39,
        thighCm: 61,
        calfCm: 38,
      },
      baselinePhotos: existing?.baselinePhotos || [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
      ],
      baselineNotes: existing?.baselineNotes || '',
    };
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);

  if (!isOpen && !isMandatory) return null;

  const updateField = <K extends keyof ClientOnboardingData>(
    field: K,
    val: ClientOnboardingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const updateMeasurement = (key: string, val: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      baselineMeasurements: {
        ...prev.baselineMeasurements,
        [key]: val,
      },
    }));
  };

  const toggleTrainingDay = (dayId: string) => {
    const current = formData.preferredTrainingDays || [];
    const isSelected = current.includes(dayId);
    let updatedTrainingDays: string[];
    if (isSelected) {
      updatedTrainingDays = current.filter((d) => d !== dayId);
    } else {
      updatedTrainingDays = [...current, dayId];
    }
    const updatedRestDays = DAYS_OF_WEEK.map((d) => d.id).filter(
      (id) => !updatedTrainingDays.includes(id)
    );
    setFormData((prev) => ({
      ...prev,
      preferredTrainingDays: updatedTrainingDays,
      preferredRestDays: updatedRestDays,
      trainingDaysPerWeek: updatedTrainingDays.length,
      restDaysPerWeek: updatedRestDays.length,
    }));
  };

  const toggleRestDay = (dayId: string) => {
    const current = formData.preferredRestDays || [];
    const isSelected = current.includes(dayId);
    let updatedRestDays: string[];
    if (isSelected) {
      updatedRestDays = current.filter((d) => d !== dayId);
    } else {
      updatedRestDays = [...current, dayId];
    }
    const updatedTrainingDays = DAYS_OF_WEEK.map((d) => d.id).filter(
      (id) => !updatedRestDays.includes(id)
    );
    setFormData((prev) => ({
      ...prev,
      preferredRestDays: updatedRestDays,
      preferredTrainingDays: updatedTrainingDays,
      restDaysPerWeek: updatedRestDays.length,
      trainingDaysPerWeek: updatedTrainingDays.length,
    }));
  };

  const toggleEquipment = (eqId: string) => {
    const current = formData.availableEquipment || [];
    if (current.includes(eqId)) {
      updateField(
        'availableEquipment',
        current.filter((item) => item !== eqId)
      );
    } else {
      updateField('availableEquipment', [...current, eqId]);
    }
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      const photos = [...(formData.baselinePhotos || []), newPhotoUrl.trim()];
      updateField('baselinePhotos', photos);
      setNewPhotoUrl('');
      setShowPhotoInput(false);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    const photos = (formData.baselinePhotos || []).filter((_, i) => i !== idx);
    updateField('baselinePhotos', photos);
  };

  const handleFinish = () => {
    const finalData: ClientOnboardingData = {
      ...formData,
      completedAt: new Date().toISOString(),
    };

    if (onSave) {
      onSave(finalData);
    } else {
      completeOnboarding(finalData);
      if (activeClientId && isTrainerEditing) {
        updateClient(activeClientId, {
          onboardingCompleted: true,
          onboardingData: finalData,
          weightKg: finalData.currentWeightKg || finalData.baselineWeightKg,
          heightCm: finalData.heightCm,
          goal:
            finalData.goal === 'Custom Goal' || finalData.goal === 'Custom'
              ? finalData.customGoalText || 'Custom Goal'
              : finalData.goal,
        });
      }
    }

    if (onClose) {
      onClose();
    }
  };

  const steps = [
    { num: 1, title: isRtl ? 'عنك وبياناتك' : 'About You', icon: User },
    { num: 2, title: isRtl ? 'تفضيلات التدريب' : 'Training Preferences', icon: Dumbbell },
    { num: 3, title: isRtl ? 'تفضيلات التغذية' : 'Nutrition Preferences', icon: Apple },
    { num: 4, title: isRtl ? 'الإصابات والمحددات' : 'Injuries / Limitations', icon: AlertTriangle },
    { num: 5, title: isRtl ? 'القياسات والبداية' : 'Baseline Progress', icon: Camera },
  ];

  const content = (
    <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-3xl shadow-2xl border border-[#eceef0] max-h-[92vh] overflow-y-auto flex flex-col gap-5 text-start">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#191c1e]">
                {isRtl ? 'استبيان وبروفايل المشترك الأولي' : 'Client Onboarding & Profile'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f4f6] text-[11px] font-extrabold text-[#565e74]">
                {isRtl ? `خطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#565e74] mt-0.5">
              {isRtl
                ? 'يرجى إكمال البيانات بدقة لمساعدة الكوتش في تصميم الخطة المثالية لك'
                : 'Please complete your onboarding data to help your coach design your custom program'}
            </p>
          </div>
        </div>
        {!isMandatory && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
                isCurrent
                  ? 'bg-[#191c1e] text-white shadow-xs'
                  : isDone
                  ? 'bg-[#f7faf0] text-[#506600] border border-[#506600]/20'
                  : 'bg-[#f2f4f6] text-[#565e74]'
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-black">
                {isDone ? <CheckCircle2 className="w-4 h-4 text-[#506600]" /> : <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.num}</span>
              </div>
              <span className="text-[10px] font-bold truncate max-w-[80px] hidden md:inline">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: ABOUT YOU */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-[#eceef0] pb-2">
            <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
              <User className="w-4 h-4 text-[#506600]" />
              {isRtl ? '1. البيانات الشخصية والهدف' : '1. About You & Your Goal'}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'العمر' : 'Age'} *
              </label>
              <input
                type="number"
                min={14}
                max={90}
                value={formData.age || ''}
                onChange={(e) => updateField('age', Number(e.target.value))}
                placeholder="27"
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs sm:text-sm font-bold text-[#191c1e] outline-none focus:bg-white focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الطول (سم)' : 'Height (cm)'} *
              </label>
              <input
                type="number"
                min={100}
                max={250}
                value={formData.heightCm || ''}
                onChange={(e) => updateField('heightCm', Number(e.target.value))}
                placeholder="178"
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs sm:text-sm font-bold text-[#191c1e] outline-none focus:bg-white focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الوزن الحالي (كجم)' : 'Current Weight (kg)'} *
              </label>
              <input
                type="number"
                step="0.1"
                min={30}
                max={300}
                value={formData.currentWeightKg || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateField('currentWeightKg', val);
                  if (!formData.baselineWeightKg) {
                    updateField('baselineWeightKg', val);
                  }
                }}
                placeholder="82.5"
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs sm:text-sm font-bold text-[#191c1e] outline-none focus:bg-white focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
              {isRtl ? 'الهدف الرئيسي' : 'Primary Fitness Goal'} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((g) => {
                const isSelected = formData.goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => updateField('goal', g.id as any)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#ccff00] text-[#191c1e] shadow-xs ring-1 ring-[#506600] font-black'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#506600]" />}
                    <span>{isRtl ? g.ar : g.en}</span>
                  </button>
                );
              })}
            </div>

            {formData.goal === 'Custom Goal' && (
              <div className="mt-2 animate-fade-in">
                <input
                  type="text"
                  value={formData.customGoalText || ''}
                  onChange={(e) => updateField('customGoalText', e.target.value)}
                  placeholder={isRtl ? 'اكتب هدفك المخصص بالتفصيل...' : 'Describe your custom goal...'}
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none border border-[#e0e3e5] focus:bg-white focus:border-[#506600]"
                />
              </div>
            )}

            {/* Note regarding Trainer goal review */}
            <div className="mt-2 p-2.5 rounded-xl bg-[#f7faf0] border border-[#506600]/20 flex items-center gap-2 text-[11px] text-[#506600] font-medium">
              <Info className="w-4 h-4 shrink-0" />
              <span>
                {isRtl
                  ? 'الهدف المختار هو معلومة مخصصة للكوتش ليقوم بتصميم خطتك يدوياً دون أي إنشاء آلي.'
                  : 'Your selected goal is for your Coach to tailor your program. No generic auto-plans are generated.'}
              </span>
            </div>
          </div>

          {/* Training Level */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
              {isRtl ? 'المستوى التدريبي' : 'Training Level'} *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'Beginner', en: 'Beginner', ar: 'مبتدئ' },
                  { id: 'Intermediate', en: 'Intermediate', ar: 'متوسط' },
                  { id: 'Advanced', en: 'Advanced', ar: 'متقدم' },
                ] as const
              ).map((lvl) => {
                const isSelected = formData.trainingLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => updateField('trainingLevel', lvl.id)}
                    className={`p-3 rounded-2xl text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-[#191c1e] text-white shadow-xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {isRtl ? lvl.ar : lvl.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Training Experience */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'الخبرة التدريبية والرياضية السابقة' : 'Training Experience'}
            </label>
            <textarea
              rows={2}
              value={formData.trainingExperience || ''}
              onChange={(e) => updateField('trainingExperience', e.target.value)}
              placeholder={
                isRtl
                  ? 'كم سنة تتدرب؟ ما الرياضات أو الأساليب التي مارستها سابقاً؟'
                  : 'How many years have you been training? Past sports, lifting history...'
              }
              className="w-full p-3.5 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none focus:bg-white focus:ring-2 focus:ring-[#ccff00]"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: TRAINING PREFERENCES */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-[#eceef0] pb-2">
            <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#506600]" />
              {isRtl ? '2. تفضيلات التدريب والجدول الأسبوعي' : '2. Training Schedule & Preferences'}
            </h4>
          </div>

          {/* Days Per Week & Rest Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'عدد أيام التدريب في الأسبوع' : 'Training Days per Week'}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      updateField('trainingDaysPerWeek', num);
                      updateField('restDaysPerWeek', 7 - num);
                    }}
                    className={`flex-1 h-11 rounded-2xl text-xs font-black transition-all ${
                      formData.trainingDaysPerWeek === num
                        ? 'bg-[#ccff00] text-[#191c1e] shadow-xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'عدد أيام الراحة في الأسبوع' : 'Rest Days per Week'}
              </label>
              <div className="h-11 px-4 rounded-2xl bg-[#fafbfc] border border-[#e0e3e5] flex items-center justify-between text-xs font-extrabold text-[#191c1e]">
                <span>{formData.restDaysPerWeek || 7 - (formData.trainingDaysPerWeek || 4)} {isRtl ? 'أيام راحة' : 'Rest Days'}</span>
                <span className="text-[11px] text-[#565e74] font-normal">{isRtl ? 'تلقائي (7 - التدريب)' : 'Calculated'}</span>
              </div>
            </div>
          </div>

          {/* Preferred Training Days Selector */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
              {isRtl ? 'أيام التدريب المفضلة تحديداً' : 'Preferred Training Days'}
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = (formData.preferredTrainingDays || []).includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleTrainingDay(d.id)}
                    className={`py-2.5 rounded-2xl text-xs font-black transition-all flex flex-col items-center gap-0.5 ${
                      isSelected
                        ? 'bg-[#191c1e] text-white shadow-xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    <span>{isRtl ? d.ar : d.en}</span>
                    <span className="text-[9px] font-normal opacity-70">
                      {isSelected ? (isRtl ? 'تدريب' : 'Train') : (isRtl ? 'راحة' : 'Rest')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Equipment */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
              {isRtl ? 'المعدات المتاحة لك' : 'Available Equipment'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => {
                const isSelected = (formData.availableEquipment || []).includes(eq.id);
                return (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => toggleEquipment(eq.id)}
                    className={`p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between px-3 ${
                      isSelected
                        ? 'bg-[#f7faf0] text-[#506600] border-2 border-[#506600]'
                        : 'bg-[#f2f4f6] text-[#565e74] border-2 border-transparent hover:bg-[#e0e3e5]'
                    }`}
                  >
                    <span>{isRtl ? eq.ar : eq.en}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#506600]" />}
                  </button>
                );
              })}
            </div>

            {(formData.availableEquipment || []).includes('Custom') && (
              <div className="mt-2 animate-fade-in">
                <input
                  type="text"
                  value={formData.customEquipmentText || ''}
                  onChange={(e) => updateField('customEquipmentText', e.target.value)}
                  placeholder={isRtl ? 'اكتب المعدات المتاحة لديك بالتفصيل...' : 'List your custom equipment...'}
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                />
              </div>
            )}
          </div>

          {/* Workout Duration & Preferred Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'مدة التمرين المفضلة' : 'Preferred Workout Duration'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {[30, 45, 60, 75, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => updateField('workoutDurationMin', dur)}
                    className={`py-2 rounded-xl text-[11px] font-black transition-all ${
                      formData.workoutDurationMin === dur
                        ? 'bg-[#ccff00] text-[#191c1e] shadow-xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'وقت التمرين المفضل (اختياري)' : 'Preferred Workout Time (Optional)'}
              </label>
              <input
                type="text"
                value={formData.preferredWorkoutTime || ''}
                onChange={(e) => updateField('preferredWorkoutTime', e.target.value)}
                placeholder={isRtl ? 'مثال: صباحاً 7:00 ص أو مساءً 6:00 م' : 'e.g., Morning 7:00 AM or Evening 6:00 PM'}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              />
            </div>
          </div>

          {/* Exercises to avoid */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'تمارين تفضل تجنبها أو لا ترتاح بها' : 'Exercises to Avoid / Disliked'}
            </label>
            <textarea
              rows={2}
              value={formData.exercisesToAvoid || ''}
              onChange={(e) => updateField('exercisesToAvoid', e.target.value)}
              placeholder={isRtl ? 'مثال: السكوات بالبار الحر، تمرين البنش المستوي، العقلة...' : 'e.g. Behind neck press, heavy flat barbell bench, deep dips...'}
              className="w-full p-3.5 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: NUTRITION PREFERENCES */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-[#eceef0] pb-2">
            <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
              <Apple className="w-4 h-4 text-[#506600]" />
              {isRtl ? '3. التفضيلات الغذائية ونمط الأكل' : '3. Nutrition Preferences & Eating Style'}
            </h4>
          </div>

          {/* Allergies - Clearly highlighted and separated */}
          <div className="p-4 rounded-3xl bg-[#fff0f0] border-2 border-[#ffdad6] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
              <label className="text-xs font-black text-[#ba1a1a] uppercase">
                {isRtl ? 'الحساسية الغذائية وعدم التحمل (مهم جداً)' : 'Food Allergies & Intolerances (Critical)'}
              </label>
            </div>
            <p className="text-[11px] text-[#565e74]">
              {isRtl
                ? 'الحساسية تفصل تماماً عن التفضيلات العادية لضمان سلامتك التامة في الخطة الغذائية'
                : 'Allergies are strictly separated from normal preferences to guarantee safety.'}
            </p>
            <input
              type="text"
              value={formData.allergies || ''}
              onChange={(e) => updateField('allergies', e.target.value)}
              placeholder={isRtl ? 'مثال: فول سوداني، حليب أبقار (لاكتوز)، جلوتين، مأكولات بحرية، بيض، لا يوجد...' : 'e.g., Peanuts, dairy lactose, gluten, shellfish, eggs, None...'}
              className="w-full h-11 px-3.5 rounded-2xl bg-white text-xs font-bold text-[#191c1e] border border-[#ffdad6] focus:border-[#ba1a1a] outline-none"
            />
          </div>

          {/* Foods to avoid vs Preferred foods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'أطعمة غير مفضلة ترغب بتجنبها' : 'Foods You Want to Avoid (Disliked)'}
              </label>
              <textarea
                rows={2}
                value={formData.foodsToAvoid || ''}
                onChange={(e) => updateField('foodsToAvoid', e.target.value)}
                placeholder={isRtl ? 'مثال: التونة المعلبة، الأكل الحار، الباذنجان...' : 'e.g., Canned tuna, mushrooms, very spicy foods...'}
                className="w-full p-3 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الأطعمة ومصادر البروتين والكارب المفضلة' : 'Preferred / Favorite Foods'}
              </label>
              <textarea
                rows={2}
                value={formData.preferredFoods || ''}
                onChange={(e) => updateField('preferredFoods', e.target.value)}
                placeholder={isRtl ? 'مثال: صدور دجاج، سلمون، بطاطا حلوة، شوفان، بيض، أرز بسمتي...' : 'e.g., Chicken breast, beef tenderloin, salmon, oats, sweet potato, eggs...'}
                className="w-full p-3 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none"
              />
            </div>
          </div>

          {/* Meals Per Day & Eating Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'عدد الوجبات اليومية المفضل' : 'Preferred Meals per Day'}
              </label>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5, 6].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateField('mealsPerDay', m)}
                    className={`flex-1 h-11 rounded-2xl text-xs font-black transition-all ${
                      formData.mealsPerDay === m
                        ? 'bg-[#ccff00] text-[#191c1e] shadow-xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {m} {isRtl ? 'وجبات' : 'meals'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'نمط وأسلوب الأكل المفضل' : 'Preferred Eating Style'}
              </label>
              <select
                value={formData.eatingStyle || 'Meal Prep'}
                onChange={(e) => updateField('eatingStyle', e.target.value as any)}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                {EATING_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {isRtl ? style.ar : style.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Meal Times & Additional Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'مواعيد الوجبات المعتادة (اختياري)' : 'Preferred Meal Times (Optional)'}
              </label>
              <input
                type="text"
                value={formData.mealTimes || ''}
                onChange={(e) => updateField('mealTimes', e.target.value)}
                placeholder={isRtl ? 'فطور: 8 ص، غداء: 2 م، عشاء: 8 م' : 'Breakfast: 8am, Lunch: 1pm, Dinner: 8pm'}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'ملاحظات إضافية للتغذية' : 'Additional Nutrition Notes'}
              </label>
              <input
                type="text"
                value={formData.nutritionNotes || ''}
                onChange={(e) => updateField('nutritionNotes', e.target.value)}
                placeholder={isRtl ? 'مثال: صيام متقطع 16/8، تفضيل القهوة الصباحية...' : 'e.g., Intermittent fasting, coffee preferences...'}
                className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: INJURIES / MOVEMENT LIMITATIONS */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-[#eceef0] pb-2">
            <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
              {isRtl ? '4. الإصابات والآلام والمحددات الحركية' : '4. Injuries & Movement Limitations'}
            </h4>
          </div>

          <div className="p-5 rounded-3xl bg-[#fafbfc] border border-[#e0e3e5] flex flex-col gap-4">
            <div>
              <h5 className="text-sm font-extrabold text-[#191c1e]">
                {isRtl
                  ? 'هل تعاني من أي إصابات، آلام، أو محددات حركية؟'
                  : 'Do you have any injuries, pain, or movement limitations?'}
              </h5>
              <p className="text-xs text-[#565e74] mt-1">
                {isRtl
                  ? 'مثل آلام أسفل الظهر، الكتف، الركبتين، أو عمليات جراحية سابقة'
                  : 'e.g., Lower back pain, shoulder impingement, knee discomfort, past surgeries'}
              </p>
            </div>

            {/* YES / NO Toggle */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => updateField('hasInjuries', true)}
                className={`py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  formData.hasInjuries
                    ? 'bg-[#ba1a1a] text-white shadow-md shadow-[#ba1a1a]/20 ring-2 ring-[#ba1a1a]'
                    : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                }`}
              >
                {formData.hasInjuries && <Check className="w-4 h-4" />}
                <span>{isRtl ? 'نعم (يوجد إصابة أو ألم)' : 'YES (I have injuries / pain)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateField('hasInjuries', false);
                  updateField('injuryDescription', '');
                }}
                className={`py-3.5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  !formData.hasInjuries
                    ? 'bg-[#506600] text-white shadow-md shadow-[#506600]/20 ring-2 ring-[#506600]'
                    : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                }`}
              >
                {!formData.hasInjuries && <Check className="w-4 h-4" />}
                <span>{isRtl ? 'لا (سليم تماماً)' : 'NO (Fully healthy)'}</span>
              </button>
            </div>

            {formData.hasInjuries && (
              <div className="animate-fade-in flex flex-col gap-2 pt-2 border-t border-[#e0e3e5]">
                <label className="text-xs font-bold text-[#ba1a1a] uppercase block">
                  {isRtl ? 'وصف وتفاصيل الإصابة أو المحدد الحركي' : 'Describe the injury or pain in detail'} *
                </label>
                <textarea
                  rows={4}
                  value={formData.injuryDescription || ''}
                  onChange={(e) => updateField('injuryDescription', e.target.value)}
                  placeholder={
                    isRtl
                      ? 'اشرح متى تحدث الآلام، الحركات التي تسبب عدم ارتياح، وتاريخ الإصابة والعلاج السابق...'
                      : 'Describe the movements that cause pain, when it occurred, past physical therapy, physician recommendations...'
                  }
                  className="w-full p-4 rounded-2xl bg-white text-xs text-[#191c1e] border-2 border-[#ffdad6] focus:border-[#ba1a1a] outline-none"
                />
              </div>
            )}

            {/* Medical safety disclaimer */}
            <div className="p-3 rounded-2xl bg-[#fff8f7] border border-[#ffdad6] flex items-start gap-2 text-[11px] text-[#ba1a1a]">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {isRtl
                  ? 'تنبيه أمان: هذه البيانات تُحفظ في ملفك لمراجعة الكوتش لتعديل التمارين. التطبيق لا يقدم تشخيصاً طبياً ولا يقوم الذكاء الاصطناعي بتشخيص أي حالة طبية.'
                  : 'Safety Notice: This information is shared with your certified coach to adjust exercises. No automated AI medical diagnoses are made.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: BASELINE PROGRESS */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="border-b border-[#eceef0] pb-2">
            <h4 className="text-sm sm:text-base font-black text-[#191c1e] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#506600]" />
              {isRtl ? '5. القياسات البدنية الأولية وصور البداية (Baseline)' : '5. Baseline Body Measurements & Photos'}
            </h4>
          </div>

          {/* Current / Baseline Weight */}
          <div className="p-4 rounded-3xl bg-[#f7faf0] border border-[#506600]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center font-black">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#565e74] uppercase block">
                  {isRtl ? 'وزن البداية المعتمد' : 'Baseline Starting Weight'}
                </span>
                <span className="text-xl font-black text-[#191c1e]">
                  {formData.baselineWeightKg || formData.currentWeightKg} kg
                </span>
              </div>
            </div>

            <div className="w-36">
              <input
                type="number"
                step="0.1"
                value={formData.baselineWeightKg || ''}
                onChange={(e) => updateField('baselineWeightKg', Number(e.target.value))}
                placeholder="82.5"
                className="w-full h-10 px-3 rounded-xl bg-white text-xs font-extrabold text-[#191c1e] border border-[#e0e3e5] text-center outline-none"
              />
            </div>
          </div>

          {/* Body Measurements defined by Trainer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#565e74] uppercase flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[#506600]" />
                <span>{isRtl ? 'قياسات الجسم بالمتر الشريطي (سم)' : 'Body Circumference Measurements (cm)'}</span>
              </label>
              <span className="text-[10px] text-[#565e74]">
                {isRtl ? 'محددة ومعتمدة من الكوتش' : 'Configured by Trainer'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {measurementLocations.map((loc) => {
                const label = isRtl ? loc.name.ar : loc.name.en;
                const val = (formData.baselineMeasurements as any)?.[loc.id] ?? '';
                return (
                  <div key={loc.id} className="p-3 rounded-2xl bg-[#fafbfc] border border-[#e0e3e5] flex flex-col gap-1 text-center">
                    <span className="text-[10px] font-extrabold text-[#565e74] uppercase truncate">
                      {label}
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={val}
                        onChange={(e) => updateMeasurement(loc.id, e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="--"
                        className="w-full h-9 rounded-xl bg-white text-xs font-black text-[#191c1e] text-center border border-[#e0e3e5] outline-none focus:border-[#506600]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Baseline Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#565e74] uppercase flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#506600]" />
                <span>{isRtl ? 'صور البداية والتقييم الأولي' : 'Baseline Progress Photos'}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPhotoInput(!showPhotoInput)}
                className="text-xs font-extrabold text-[#506600] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة صورة' : 'Add Photo'}</span>
              </button>
            </div>

            {showPhotoInput && (
              <div className="p-3 rounded-2xl bg-[#fafbfc] border border-[#e0e3e5] flex items-center gap-2 mb-3 animate-fade-in">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                  className="flex-1 h-10 px-3 rounded-xl bg-white text-xs font-medium text-[#191c1e] border border-[#e0e3e5] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-4 h-10 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600]"
                >
                  {isRtl ? 'إضافة' : 'Add'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(formData.baselinePhotos || []).map((photoUrl, pIdx) => (
                <div
                  key={pIdx}
                  className="relative aspect-3/4 rounded-2xl overflow-hidden border border-[#e0e3e5] bg-[#f2f4f6] group shadow-xs"
                >
                  <img src={photoUrl} alt={`Baseline ${pIdx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(pIdx)}
                      className="w-8 h-8 rounded-full bg-white/90 text-[#ba1a1a] flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white">
                    {pIdx === 0 ? (isRtl ? 'أمامي' : 'Front') : pIdx === 1 ? (isRtl ? 'جانبي' : 'Side') : (isRtl ? 'خلفي' : 'Back')}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setShowPhotoInput(true)}
                className="aspect-3/4 rounded-2xl border-2 border-dashed border-[#d0d3d5] hover:border-[#506600] flex flex-col items-center justify-center gap-1 text-[#565e74] hover:text-[#506600] transition-colors bg-[#fafbfc]"
              >
                <UploadCloud className="w-6 h-6" />
                <span className="text-[11px] font-bold">{isRtl ? 'رفع صورة' : 'Upload'}</span>
              </button>
            </div>
          </div>

          {/* Baseline Notes */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'ملاحظات وتطلعات البداية للكوتش (اختياري)' : 'Baseline Aspirations & Notes for Coach'}
            </label>
            <textarea
              rows={2}
              value={formData.baselineNotes || ''}
              onChange={(e) => updateField('baselineNotes', e.target.value)}
              placeholder={
                isRtl
                  ? 'اكتب أي تطلعات، دوافع، أو تفاصيل ترغب في إطلاع الكوتش عليها في بداية مشوارك...'
                  : 'Any personal notes, expectations, mindset, or specific milestones you want to achieve...'
              }
              className="w-full p-3.5 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none"
            />
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-3 border-t border-[#eceef0]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold hover:bg-[#e0e3e5] transition-colors"
          >
            <ArrowPrev className="w-4 h-4" />
            <span>{isRtl ? 'السابق' : 'Previous'}</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#191c1e] text-white text-xs font-black hover:bg-[#2c3135] transition-colors shadow-xs"
          >
            <span>{isRtl ? 'التالي' : 'Next Step'}</span>
            <ArrowNext className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#ccff00] text-[#191c1e] text-xs sm:text-sm font-black hover:bg-[#b8e600] active:scale-95 transition-all shadow-md shadow-[#ccff00]/30"
          >
            <CheckCircle2 className="w-4 h-4 text-[#506600]" />
            <span>{isRtl ? 'حفظ وتأكيد الملف وبدء البرنامج' : 'Save Profile & Enter Dashboard'}</span>
          </button>
        )}
      </div>
    </div>
  );

  if (isMandatory) {
    return (
      <div className="min-h-screen w-full bg-[#f2f4f6] flex items-center justify-center p-3 sm:p-6 animate-fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      {content}
    </div>
  );
};
