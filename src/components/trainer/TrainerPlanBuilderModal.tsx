import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, TrainingProgram, WorkoutDay, WorkoutExerciseItem } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Dumbbell,
  Clock,
  Flame,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Video,
  Save,
  Search,
  Copy,
  Layers,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface TrainerPlanBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  programToEdit?: TrainingProgram | null;
  targetClientId?: string;
}

export const TrainerPlanBuilderModal: React.FC<TrainerPlanBuilderModalProps> = ({
  isOpen,
  onClose,
  programToEdit,
  targetClientId,
}) => {
  const {
    trainingPrograms,
    createTrainingProgram,
    updateTrainingProgram,
    exercises,
    addCustomExercise,
    clients,
    language,
  } = useApp();

  const isRtl = language === 'ar';

  // Core Program Details - NO forced default names or classifications
  const [titleEn, setTitleEn] = useState<string>(() => {
    if (!programToEdit) return '';
    return typeof programToEdit.title === 'string'
      ? programToEdit.title
      : programToEdit.title?.en || '';
  });

  const [titleAr, setTitleAr] = useState<string>(() => {
    if (!programToEdit) return '';
    return typeof programToEdit.title === 'string'
      ? programToEdit.title
      : programToEdit.title?.ar || '';
  });

  const [descriptionEn, setDescriptionEn] = useState<string>(() => {
    if (!programToEdit) return '';
    return typeof programToEdit.description === 'string'
      ? programToEdit.description
      : programToEdit.description?.en || '';
  });

  const [descriptionAr, setDescriptionAr] = useState<string>(() => {
    if (!programToEdit) return '';
    return typeof programToEdit.description === 'string'
      ? programToEdit.description
      : programToEdit.description?.ar || '';
  });

  const [durationWeeks, setDurationWeeks] = useState<number>(programToEdit?.durationWeeks || 8);
  const [selectedClientForAssign, setSelectedClientForAssign] = useState<string>(
    targetClientId || programToEdit?.clientId || ''
  );
  const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(
    !targetClientId && (!programToEdit || !!programToEdit.isTemplate || !programToEdit.clientId)
  );

  // Days list - starts clean with 1 empty day if creating from scratch
  const [days, setDays] = useState<WorkoutDay[]>(() => {
    if (programToEdit && programToEdit.days && programToEdit.days.length > 0) {
      return JSON.parse(JSON.stringify(programToEdit.days));
    }
    return [
      {
        id: `day_${Date.now()}_1`,
        dayOfWeek: 1,
        dayNumber: 1,
        dayName: { en: 'Day 1', ar: 'اليوم ١' },
        title: { en: 'Workout 1', ar: 'تمرين ١' },
        durationMin: 60,
        caloriesBurn: 450,
        completed: false,
        exercises: [],
      },
    ];
  });

  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [showExercisePicker, setShowExercisePicker] = useState<boolean>(false);
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('All');

  // Fast custom exercise creation modal inside builder
  const [showCreateCustomExerciseModal, setShowCreateCustomExerciseModal] = useState<boolean>(false);
  const [customExNameEn, setCustomExNameEn] = useState<string>('');
  const [customExNameAr, setCustomExNameAr] = useState<string>('');
  const [customExMuscle, setCustomExMuscle] = useState<string>('Chest');
  const [customExEquipment, setCustomExEquipment] = useState<string>('Dumbbells');
  const [customExVideoUrl, setCustomExVideoUrl] = useState<string>('');
  const [customExCues, setCustomExCues] = useState<string>('');

  // Template loader modal
  const [showTemplatePicker, setShowTemplatePicker] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const currentDay = days[activeDayIndex] || days[0];
  const templatesList = trainingPrograms.filter((p) => p.isTemplate || !p.clientId);

  // ----------------------------------------------------
  // DAY HANDLERS
  // ----------------------------------------------------
  const handleAddDay = () => {
    const newDayNum = days.length + 1;
    const newDay: WorkoutDay = {
      id: `day_${Date.now()}_${newDayNum}_${Math.random().toString(36).substring(2, 5)}`,
      dayOfWeek: newDayNum,
      dayNumber: newDayNum,
      dayName: { en: `Day ${newDayNum}`, ar: `اليوم ${newDayNum}` },
      title: { en: `Workout ${newDayNum}`, ar: `تمرين ${newDayNum}` },
      durationMin: 60,
      caloriesBurn: 400,
      completed: false,
      exercises: [],
    };
    setDays((prev) => [...prev, newDay]);
    setActiveDayIndex(days.length);
  };

  const handleDuplicateCurrentDay = () => {
    if (!currentDay) return;
    const newDayNum = days.length + 1;
    const duplicatedDay: WorkoutDay = {
      ...JSON.parse(JSON.stringify(currentDay)),
      id: `day_${Date.now()}_${newDayNum}_${Math.random().toString(36).substring(2, 5)}`,
      dayNumber: newDayNum,
      dayName: {
        en: `${typeof currentDay.dayName === 'string' ? currentDay.dayName : currentDay.dayName?.en || 'Day'} (Copy)`,
        ar: `${typeof currentDay.dayName === 'string' ? currentDay.dayName : currentDay.dayName?.ar || 'اليوم'} (نسخة)`,
      },
      completed: false,
    };
    setDays((prev) => [...prev, duplicatedDay]);
    setActiveDayIndex(days.length);
  };

  const handleDeleteDay = (index: number) => {
    if (days.length <= 1) return;
    const updated = days.filter((_, i) => i !== index);
    setDays(updated);
    setActiveDayIndex(Math.max(0, index - 1));
  };

  const handleMoveDay = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= days.length) return;
    const list = [...days];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    setDays(list);
    setActiveDayIndex(targetIdx);
  };

  const handleUpdateCurrentDayMeta = (field: string, val: any) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        if (field === 'dayNameEn') {
          return { ...d, dayName: { ...(typeof d.dayName === 'object' ? d.dayName : {}), en: val } };
        }
        if (field === 'dayNameAr') {
          return { ...d, dayName: { ...(typeof d.dayName === 'object' ? d.dayName : {}), ar: val } };
        }
        if (field === 'titleEn') {
          return { ...d, title: { ...(typeof d.title === 'object' ? d.title : {}), en: val } };
        }
        if (field === 'titleAr') {
          return { ...d, title: { ...(typeof d.title === 'object' ? d.title : {}), ar: val } };
        }
        if (field === 'durationMin') {
          return { ...d, durationMin: Math.max(10, Number(val) || 60) };
        }
        if (field === 'caloriesBurn') {
          return { ...d, caloriesBurn: Math.max(0, Number(val) || 0) };
        }
        return d;
      })
    );
  };

  const handleClearExercisesInDay = () => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        return { ...d, exercises: [] };
      })
    );
  };

  // ----------------------------------------------------
  // EXERCISE HANDLERS
  // ----------------------------------------------------
  const handleAddExerciseToCurrentDay = (ex: Exercise) => {
    const newItem: WorkoutExerciseItem = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: ex.defaultSets || 3,
      reps: ex.defaultReps || '10-12',
      targetWeight: undefined,
      restSec: ex.defaultRestSec || 60,
      tempo: '3-0-1-0',
      trainerNote: (isRtl ? ex.instructions?.ar?.[0] : ex.instructions?.en?.[0]) || '',
      customVideoUrl: ex.videoUrl || '',
      isCompleted: false,
    };

    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        return { ...d, exercises: [...d.exercises, newItem] };
      })
    );
    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (exIndex: number) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        return { ...d, exercises: d.exercises.filter((_, idx) => idx !== exIndex) };
      })
    );
  };

  const handleDuplicateExercise = (exIndex: number) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        const list = [...d.exercises];
        const itemToClone = list[exIndex];
        if (!itemToClone) return d;
        const cloned: WorkoutExerciseItem = {
          ...JSON.parse(JSON.stringify(itemToClone)),
          isCompleted: false,
        };
        list.splice(exIndex + 1, 0, cloned);
        return { ...d, exercises: list };
      })
    );
  };

  const handleMoveExercise = (exIndex: number, direction: 'up' | 'down') => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        const list = [...d.exercises];
        const targetIdx = direction === 'up' ? exIndex - 1 : exIndex + 1;
        if (targetIdx < 0 || targetIdx >= list.length) return d;
        const [moved] = list.splice(exIndex, 1);
        list.splice(targetIdx, 0, moved);
        return { ...d, exercises: list };
      })
    );
  };

  const handleUpdateExerciseField = (
    exIndex: number,
    field: keyof WorkoutExerciseItem,
    value: any
  ) => {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== activeDayIndex) return d;
        const updatedExercises = d.exercises.map((item, idx) => {
          if (idx !== exIndex) return item;
          return { ...item, [field]: value };
        });
        return { ...d, exercises: updatedExercises };
      })
    );
  };

  // ----------------------------------------------------
  // LOAD STRUCTURE FROM EXISTING TEMPLATE
  // ----------------------------------------------------
  const handleLoadTemplateStructure = (templateProg: TrainingProgram) => {
    if (!templateProg.days || templateProg.days.length === 0) return;
    const clonedDays: WorkoutDay[] = JSON.parse(JSON.stringify(templateProg.days)).map(
      (d: WorkoutDay, dIdx: number) => ({
        ...d,
        id: `day_${Date.now()}_${dIdx + 1}_${Math.random().toString(36).substring(2, 5)}`,
        completed: false,
        exercises: (d.exercises || []).map((ex) => ({
          ...ex,
          isCompleted: false,
          loggedSets: [],
        })),
      })
    );
    setDays(clonedDays);
    setActiveDayIndex(0);
    if (!titleEn && !titleAr) {
      const en = typeof templateProg.title === 'string' ? templateProg.title : templateProg.title?.en || '';
      const ar = typeof templateProg.title === 'string' ? templateProg.title : templateProg.title?.ar || '';
      setTitleEn(en ? `${en} (Customized)` : '');
      setTitleAr(ar ? `${ar} (مخصص)` : '');
    }
    setShowTemplatePicker(false);
  };

  // ----------------------------------------------------
  // CREATE CUSTOM EXERCISE ON THE FLY
  // ----------------------------------------------------
  const handleCreateAndAddCustomExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customExNameEn.trim() && !customExNameAr.trim()) return;

    const finalName = customExNameEn.trim() || customExNameAr.trim();
    const newEx: Exercise = {
      id: 'ex_custom_' + Date.now(),
      name: finalName,
      muscleGroup: customExMuscle,
      category: 'Strength',
      equipment: customExEquipment,
      difficulty: 'Intermediate',
      instructions: {
        en: [customExCues.trim() || 'Focus on controlled form and full range of motion.'],
        ar: [customExCues.trim() || 'التركيز على الأداء السليم والمدى الحركي الكامل.'],
      },
      defaultSets: 3,
      defaultReps: '10-12',
      defaultRestSec: 60,
      videoUrl: customExVideoUrl.trim() || undefined,
      thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
    };

    addCustomExercise(newEx);
    handleAddExerciseToCurrentDay(newEx);

    // Reset form
    setCustomExNameEn('');
    setCustomExNameAr('');
    setCustomExCues('');
    setCustomExVideoUrl('');
    setShowCreateCustomExerciseModal(false);
  };

  // ----------------------------------------------------
  // SAVE & PERSIST PROGRAM
  // ----------------------------------------------------
  const handleSave = () => {
    const finalTitleEn = titleEn.trim();
    const finalTitleAr = titleAr.trim();

    if (!finalTitleEn && !finalTitleAr) {
      setValidationError(
        isRtl
          ? 'يرجى إدخال اسم البرنامج التدريبي أولاً.'
          : 'Please provide a Program Title before saving.'
      );
      return;
    }

    setValidationError('');

    const targetClient = saveAsTemplate ? undefined : selectedClientForAssign || undefined;
    const isTempl = saveAsTemplate || !targetClient;

    const progData: Partial<TrainingProgram> = {
      title: {
        en: finalTitleEn || finalTitleAr,
        ar: finalTitleAr || finalTitleEn,
      },
      description: {
        en: descriptionEn.trim(),
        ar: descriptionAr.trim(),
      },
      durationWeeks: Number(durationWeeks) || 8,
      days,
      clientId: targetClient,
      isTemplate: isTempl,
      status: 'active',
    };

    if (programToEdit && programToEdit.id) {
      // If editing an existing program
      if (programToEdit.isTemplate && targetClient) {
        // If trainer was viewing a template and decided to save it assigned to a client,
        // create a new independent program for that client without mutating master template!
        createTrainingProgram(progData, targetClient);
      } else {
        updateTrainingProgram(programToEdit.id, progData);
      }
    } else {
      createTrainingProgram(progData, targetClient);
    }

    onClose();
  };

  const filteredExercises = exercises.filter((ex) => {
    const query = exerciseSearch.toLowerCase();
    const matchSearch =
      (ex.name && ex.name.toLowerCase().includes(query)) ||
      (ex.muscleGroup && ex.muscleGroup.toLowerCase().includes(query)) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(query));
    const matchMuscle =
      selectedMuscleFilter === 'All' ||
      ex.muscleGroup.toLowerCase() === selectedMuscleFilter.toLowerCase();
    return matchSearch && matchMuscle;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-5xl shadow-2xl border border-[#eceef0] max-h-[94vh] overflow-y-auto flex flex-col gap-4">
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center shadow-xs">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-[#191c1e]">
                  {programToEdit
                    ? isRtl
                      ? 'محرر البرنامج التدريبي'
                      : 'Trainer Program Editor'
                    : isRtl
                    ? 'منشئ البرنامج التدريبي'
                    : 'Training Program Builder'}
                </h3>
                <span className="text-[10px] font-black uppercase text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded border border-[#506600]/20">
                  {isRtl ? 'تحكم كامل للكوتش' : 'Full Trainer Authority'}
                </span>
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                {isRtl
                  ? 'التحكم التام في أسماء التمارين، التكرارات، المجموعات، الراحة، والتعليمات الفنية'
                  : 'Design every exercise parameter, sets, reps, rest periods, tempo, and coaching cues'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {templatesList.length > 0 && (
              <button
                type="button"
                onClick={() => setShowTemplatePicker(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] text-xs font-bold hover:bg-[#e0e3e5] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#506600]" />
                <span>{isRtl ? 'استيراد من قالب' : 'Load from Template'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-[#fff0f0] border border-[#ffdad6] text-[#ba1a1a] flex items-center gap-2.5 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Core Metadata Form */}
        <div className="bg-[#fafbfc] rounded-2xl p-4 border border-[#eceef0] flex flex-col gap-3.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Title English */}
            <div>
              <label className="text-[11px] font-extrabold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اسم البرنامج (إنجليزي)' : 'Program Title (English)'} *
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. 4-Day Push / Pull / Legs Hypertrophy"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] outline-none focus:border-[#506600]"
              />
            </div>

            {/* Title Arabic */}
            <div>
              <label className="text-[11px] font-extrabold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اسم البرنامج (عربي)' : 'Program Title (Arabic)'}
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: جدول دفع وسحب وأرجل ٤ أيام"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] outline-none focus:border-[#506600]"
              />
            </div>

            {/* Duration Weeks */}
            <div>
              <label className="text-[11px] font-extrabold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'مدة البرنامج (أسابيع)' : 'Duration (Weeks)'}
              </label>
              <input
                type="number"
                min={1}
                max={52}
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value) || 8)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e] outline-none focus:border-[#506600]"
              />
            </div>
          </div>

          {/* Program Description / Protocol Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'وصف أو ملاحظات البرنامج (إنجليزي)' : 'Coach Protocol & Notes (English)'}
              </label>
              <input
                type="text"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="e.g. Progressive overload block focusing on chest & back hypertrophy."
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e0e3e5] text-xs text-[#191c1e] outline-none focus:border-[#506600]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'وصف أو ملاحظات البرنامج (عربي)' : 'Coach Protocol & Notes (Arabic)'}
              </label>
              <input
                type="text"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="مثال: بروتوكول زيادة أحمال تدريجية مع التركيز على البناء العضلي."
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e0e3e5] text-xs text-[#191c1e] outline-none focus:border-[#506600]"
              />
            </div>
          </div>

          {/* Assignment Destination */}
          <div className="pt-2 border-t border-[#e0e3e5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#191c1e]">
                <input
                  type="radio"
                  name="programScope"
                  checked={saveAsTemplate}
                  onChange={() => {
                    setSaveAsTemplate(true);
                    setSelectedClientForAssign('');
                  }}
                  className="accent-[#506600] w-4 h-4"
                />
                <span>{isRtl ? 'قالب تدريبي رئيسي (Master Template)' : 'Save as Master Template (Reusable)'}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#191c1e]">
                <input
                  type="radio"
                  name="programScope"
                  checked={!saveAsTemplate}
                  onChange={() => setSaveAsTemplate(false)}
                  className="accent-[#506600] w-4 h-4"
                />
                <span>{isRtl ? 'تعيين لعميل محدد' : 'Assign to Specific Client'}</span>
              </label>
            </div>

            {!saveAsTemplate && (
              <div className="w-full sm:w-72">
                <select
                  value={selectedClientForAssign}
                  onChange={(e) => setSelectedClientForAssign(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e] outline-none focus:border-[#506600]"
                >
                  <option value="">{isRtl ? '-- اختر العميل --' : '-- Select Client --'}</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Days Navigation & Management Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {days.map((day, idx) => {
              const isSelected = activeDayIndex === idx;
              return (
                <button
                  key={day.id || idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#191c1e] text-white shadow-xs'
                      : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                  }`}
                >
                  <span>
                    {typeof day.dayName === 'string'
                      ? day.dayName
                      : isRtl
                      ? day.dayName?.ar || `اليوم ${idx + 1}`
                      : day.dayName?.en || `Day ${idx + 1}`}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      isSelected ? 'bg-[#ccff00] text-[#191c1e]' : 'bg-white text-[#565e74]'
                    }`}
                  >
                    {day.exercises?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleAddDay}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black hover:bg-[#b8e600] transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة يوم' : 'Add Day'}</span>
            </button>
          </div>
        </div>

        {/* Active Day Workstation */}
        {currentDay && (
          <div className="bg-[#f7faf0] rounded-3xl p-4 sm:p-5 border border-[#506600]/20 flex flex-col gap-4">
            {/* Day Header Controls */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#e0e3e5]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full lg:flex-1">
                {/* Day Label */}
                <div>
                  <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-0.5">
                    {isRtl ? 'اسم اليوم' : 'Day Label'}
                  </label>
                  <input
                    type="text"
                    value={
                      typeof currentDay.dayName === 'string'
                        ? currentDay.dayName
                        : isRtl
                        ? currentDay.dayName?.ar || ''
                        : currentDay.dayName?.en || ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentDayMeta(isRtl ? 'dayNameAr' : 'dayNameEn', e.target.value)
                    }
                    placeholder="e.g. Day 1 (Mon)"
                    className="w-full h-9 px-2.5 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] outline-none"
                  />
                </div>

                {/* Day Focus Title */}
                <div>
                  <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-0.5">
                    {isRtl ? 'تركيز الحصة' : 'Day Focus / Title'}
                  </label>
                  <input
                    type="text"
                    value={
                      typeof currentDay.title === 'string'
                        ? currentDay.title
                        : isRtl
                        ? currentDay.title?.ar || ''
                        : currentDay.title?.en || ''
                    }
                    onChange={(e) =>
                      handleUpdateCurrentDayMeta(isRtl ? 'titleAr' : 'titleEn', e.target.value)
                    }
                    placeholder="e.g. Chest & Triceps Power"
                    className="w-full h-9 px-2.5 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] outline-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-0.5">
                    {isRtl ? 'المدة التقديرية (دقيقة)' : 'Duration (min)'}
                  </label>
                  <div className="flex items-center gap-1 bg-[#f2f4f6] px-2 rounded-lg h-9">
                    <Clock className="w-3.5 h-3.5 text-[#565e74]" />
                    <input
                      type="number"
                      value={currentDay.durationMin || 60}
                      onChange={(e) => handleUpdateCurrentDayMeta('durationMin', e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#191c1e] outline-none"
                    />
                  </div>
                </div>

                {/* Calories */}
                <div>
                  <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-0.5">
                    {isRtl ? 'السعرات المستهدفة' : 'Target Calories (kcal)'}
                  </label>
                  <div className="flex items-center gap-1 bg-[#f2f4f6] px-2 rounded-lg h-9">
                    <Flame className="w-3.5 h-3.5 text-[#565e74]" />
                    <input
                      type="number"
                      value={currentDay.caloriesBurn || 450}
                      onChange={(e) => handleUpdateCurrentDayMeta('caloriesBurn', e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-[#191c1e] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Day Actions Toolbar */}
              <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
                <button
                  type="button"
                  title="Move Day Left"
                  disabled={activeDayIndex === 0}
                  onClick={() => handleMoveDay(activeDayIndex, 'left')}
                  className="w-8 h-8 rounded-lg bg-[#f2f4f6] text-[#565e74] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move Day Right"
                  disabled={activeDayIndex === days.length - 1}
                  onClick={() => handleMoveDay(activeDayIndex, 'right')}
                  className="w-8 h-8 rounded-lg bg-[#f2f4f6] text-[#565e74] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Duplicate Day"
                  onClick={handleDuplicateCurrentDay}
                  className="px-2.5 h-8 rounded-lg bg-[#f2f4f6] text-[#191c1e] text-[11px] font-bold flex items-center gap-1 hover:bg-[#e0e3e5]"
                >
                  <Copy className="w-3 h-3" />
                  <span>{isRtl ? 'استنساخ' : 'Clone'}</span>
                </button>
                {days.length > 1 && (
                  <button
                    type="button"
                    title="Delete Day"
                    onClick={() => handleDeleteDay(activeDayIndex)}
                    className="w-8 h-8 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center hover:bg-[#ba1a1a]/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Exercises List Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-[#191c1e] uppercase tracking-wider">
                  {isRtl ? 'تمارين اليوم المحددة' : 'Exercises Configured in this Day'} (
                  {currentDay.exercises?.length || 0})
                </h4>
                {currentDay.exercises?.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearExercisesInDay}
                    className="text-[10px] font-bold text-[#ba1a1a] hover:underline"
                  >
                    {isRtl ? 'تفريغ اليوم' : 'Clear All'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowExercisePicker(true)}
                className="px-3.5 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black flex items-center gap-1.5 hover:bg-[#b8e600] transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة تمرين من المكتبة' : 'Add Exercise from Library'}</span>
              </button>
            </div>

            {/* Exercises Container */}
            {currentDay.exercises?.length === 0 ? (
              <div className="py-10 bg-white rounded-2xl border border-dashed border-[#e0e3e5] text-center flex flex-col items-center justify-center gap-2">
                <Dumbbell className="w-8 h-8 text-[#565e74] opacity-40" />
                <p className="text-xs font-bold text-[#191c1e]">
                  {isRtl
                    ? 'لم يتم إضافة تمارين بعد لهذا اليوم.'
                    : 'No exercises added yet for this workout day.'}
                </p>
                <p className="text-[11px] text-[#565e74]">
                  {isRtl
                    ? 'اضغط على زر "إضافة تمرين من المكتبة" لاختيار التمارين وتحديد التكرارات والتوجيهات.'
                    : 'Click "Add Exercise from Library" to choose exercises and specify sets, reps, and cues.'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowExercisePicker(true)}
                  className="mt-1 px-4 py-2 rounded-xl bg-[#191c1e] text-white text-xs font-bold hover:bg-[#2c3135]"
                >
                  {isRtl ? 'فتح مكتبة التمارين' : 'Open Exercise Library'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {currentDay.exercises.map((exItem, exIdx) => (
                  <div
                    key={exItem.exerciseId + '_' + exIdx}
                    className="bg-white rounded-2xl p-4 border border-[#e0e3e5] shadow-2xs flex flex-col gap-3 hover:border-[#506600]/40 transition-all"
                  >
                    {/* Exercise Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#f2f4f6] text-xs font-black text-[#191c1e] flex items-center justify-center border border-[#e0e3e5]">
                          {exIdx + 1}
                        </span>
                        <div>
                          <h5 className="text-xs sm:text-sm font-black text-[#191c1e]">
                            {exItem.exerciseName}
                          </h5>
                          <span className="text-[10px] font-bold text-[#506600] bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20">
                            {exItem.muscleGroup}
                          </span>
                        </div>
                      </div>

                      {/* Reordering and Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={exIdx === 0}
                          onClick={() => handleMoveExercise(exIdx, 'up')}
                          className="w-7 h-7 rounded-lg bg-[#f2f4f6] text-[#565e74] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={exIdx === currentDay.exercises.length - 1}
                          onClick={() => handleMoveExercise(exIdx, 'down')}
                          className="w-7 h-7 rounded-lg bg-[#f2f4f6] text-[#565e74] flex items-center justify-center hover:bg-[#e0e3e5] disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateExercise(exIdx)}
                          className="w-7 h-7 rounded-lg bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
                          title="Duplicate Exercise"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx)}
                          className="w-7 h-7 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center hover:bg-[#ba1a1a]/20 ml-1"
                          title="Remove Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Prescribed Training Variables (100% Trainer Prescribed) */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 border-t border-[#f2f4f6]">
                      {/* Sets */}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#565e74] block mb-1">
                          {isRtl ? 'المجموعات (Sets)' : 'Sets'}
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={15}
                          value={exItem.sets || 3}
                          onChange={(e) =>
                            handleUpdateExerciseField(exIdx, 'sets', Number(e.target.value) || 1)
                          }
                          className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>

                      {/* Reps */}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#565e74] block mb-1">
                          {isRtl ? 'التكرار (Reps)' : 'Reps (Target)'}
                        </span>
                        <input
                          type="text"
                          value={exItem.reps || '10'}
                          onChange={(e) => handleUpdateExerciseField(exIdx, 'reps', e.target.value)}
                          placeholder="e.g. 8-10, AMRAP"
                          className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>

                      {/* Rest */}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#565e74] block mb-1">
                          {isRtl ? 'الراحة (Rest Sec)' : 'Rest (sec)'}
                        </span>
                        <input
                          type="number"
                          value={exItem.restSec || 60}
                          onChange={(e) =>
                            handleUpdateExerciseField(exIdx, 'restSec', Number(e.target.value) || 0)
                          }
                          className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>

                      {/* Tempo */}
                      <div>
                        <span className="text-[10px] font-extrabold text-[#565e74] block mb-1">
                          {isRtl ? 'الإيقاع (Tempo)' : 'Tempo'}
                        </span>
                        <input
                          type="text"
                          value={exItem.tempo || '3-0-1-0'}
                          onChange={(e) => handleUpdateExerciseField(exIdx, 'tempo', e.target.value)}
                          placeholder="3-0-1-0"
                          className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>

                      {/* Target Weight / RPE */}
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-extrabold text-[#565e74] block mb-1">
                          {isRtl ? 'الوزن / RPE' : 'Weight / RPE'}
                        </span>
                        <input
                          type="text"
                          value={exItem.targetWeight !== undefined ? exItem.targetWeight : ''}
                          onChange={(e) =>
                            handleUpdateExerciseField(exIdx, 'targetWeight', e.target.value)
                          }
                          placeholder="e.g. 70kg / RPE 8"
                          className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>
                    </div>

                    {/* Coach Instructions & Video Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#f2f4f6]">
                      <div>
                        <input
                          type="text"
                          value={exItem.trainerNote || ''}
                          onChange={(e) =>
                            handleUpdateExerciseField(exIdx, 'trainerNote', e.target.value)
                          }
                          placeholder={
                            isRtl
                              ? 'توجيهات فنية وملاحظات الكوتش للأداء السليم...'
                              : 'Coach cues (e.g. Pause 1s at chest, brace core)...'
                          }
                          className="w-full h-8 px-2.5 rounded-lg bg-[#f7f9fb] text-[11px] font-medium text-[#191c1e] outline-none focus:bg-white focus:ring-1 focus:ring-[#506600]"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#f7f9fb] px-2.5 rounded-lg h-8">
                        <Video className="w-3.5 h-3.5 text-[#565e74] shrink-0" />
                        <input
                          type="text"
                          value={exItem.customVideoUrl || ''}
                          onChange={(e) =>
                            handleUpdateExerciseField(exIdx, 'customVideoUrl', e.target.value)
                          }
                          placeholder="Video URL (YouTube/Vimeo)"
                          className="w-full text-[11px] bg-transparent outline-none text-[#191c1e]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#eceef0]">
          <div className="text-xs text-[#565e74]">
            {saveAsTemplate ? (
              <span className="font-bold text-[#506600]">
                {isRtl
                  ? '✓ سيتم حفظ هذا البرنامج كقالب رئيسي متاح للاستخدام.'
                  : '✓ Will be saved as a Reusable Master Template in your library.'}
              </span>
            ) : (
              <span className="font-bold text-[#0284c7]">
                {isRtl
                  ? '✓ سيتم تعيين نسخة مستقلة ومخصصة لهذا العميل مباشرة.'
                  : '✓ Will be saved as an independent client program (master template remains untouched).'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 h-11 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5] transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-6 h-11 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>
                {programToEdit
                  ? isRtl
                    ? 'حفظ التعديلات'
                    : 'Save Changes'
                  : isRtl
                  ? 'حفظ واعتماد البرنامج'
                  : 'Save & Deploy Program'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXERCISE PICKER MODAL */}
      {/* ========================================================================= */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl border border-[#eceef0] max-h-[88vh] flex flex-col gap-3.5">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#506600]" />
                <h4 className="text-base font-black text-[#191c1e]">
                  {isRtl ? 'مكتبة التمارين' : 'Exercise Library'}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowExercisePicker(false);
                    setShowCreateCustomExerciseModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#191c1e] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#2c3135]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>{isRtl ? 'إنشاء تمرين جديد' : 'New Custom Exercise'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowExercisePicker(false)}
                  className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#e0e3e5]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2 bg-[#f2f4f6] px-3.5 rounded-xl">
              <Search className="w-4 h-4 text-[#565e74]" />
              <input
                type="text"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                placeholder={
                  isRtl ? 'ابحث باسم التمرين أو العضلة المستهدفة...' : 'Search exercises by name, muscle, equipment...'
                }
                className="w-full h-10 bg-transparent text-xs font-medium outline-none text-[#191c1e]"
              />
              {exerciseSearch && (
                <button onClick={() => setExerciseSearch('')} className="text-xs text-[#565e74]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Muscle Filter Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'].map(
                (m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMuscleFilter(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedMuscleFilter === m
                        ? 'bg-[#191c1e] text-white shadow-2xs'
                        : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {m}
                  </button>
                )
              )}
            </div>

            {/* Exercise Results Grid */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 max-h-96 pr-1">
              {filteredExercises.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#565e74] flex flex-col items-center gap-2">
                  <p>{isRtl ? 'لا توجد تمارين تطابق البحث.' : 'No exercises found matching your search.'}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExercisePicker(false);
                      setShowCreateCustomExerciseModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black"
                  >
                    {isRtl ? 'إضافة هذا التمرين كـ تمرين جديد' : 'Create This as a Custom Exercise'}
                  </button>
                </div>
              ) : (
                filteredExercises.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExerciseToCurrentDay(ex)}
                    className="p-3 rounded-2xl border border-[#e0e3e5] hover:border-[#506600] hover:bg-[#f7faf0] flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f2f4f6] text-[#506600] font-black text-xs flex items-center justify-center border border-[#e0e3e5]">
                        {ex.muscleGroup.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="text-xs sm:text-sm font-black text-[#191c1e]">{ex.name}</h6>
                        <div className="flex items-center gap-2 text-[10px] text-[#565e74] mt-0.5">
                          <span className="font-bold text-[#506600]">{ex.muscleGroup}</span>
                          <span>•</span>
                          <span>{ex.equipment}</span>
                          <span>•</span>
                          <span>{ex.defaultSets || 3} sets × {ex.defaultReps || '10-12'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-8 h-8 rounded-xl bg-[#ccff00] text-[#191c1e] flex items-center justify-center font-bold hover:bg-[#b8e600]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK CUSTOM EXERCISE CREATION MODAL */}
      {/* ========================================================================= */}
      {showCreateCustomExerciseModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl border border-[#eceef0] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#506600]" />
                <h4 className="text-base font-black text-[#191c1e]">
                  {isRtl ? 'تسجيل تمرين جديد في المكتبة' : 'Create New Custom Exercise'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCustomExerciseModal(false)}
                className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAndAddCustomExercise} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                    {isRtl ? 'اسم التمرين (إنجليزي)' : 'Exercise Name (English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customExNameEn}
                    onChange={(e) => setCustomExNameEn(e.target.value)}
                    placeholder="e.g. Incline Cable Flyes"
                    className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                    {isRtl ? 'اسم التمرين (عربي)' : 'Exercise Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={customExNameAr}
                    onChange={(e) => setCustomExNameAr(e.target.value)}
                    placeholder="مثال: تجميع كابل مائل للصدر"
                    className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                    {isRtl ? 'العضلة المستهدفة' : 'Muscle Group'}
                  </label>
                  <select
                    value={customExMuscle}
                    onChange={(e) => setCustomExMuscle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  >
                    {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                    {isRtl ? 'المعدات' : 'Equipment'}
                  </label>
                  <select
                    value={customExEquipment}
                    onChange={(e) => setCustomExEquipment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                  >
                    {['Barbell', 'Dumbbells', 'Cables', 'Machine', 'Bodyweight', 'Kettlebell', 'Band'].map(
                      (eq) => (
                        <option key={eq} value={eq}>
                          {eq}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  {isRtl ? 'توجيهات الأداء والتكنيك' : 'Technique & Coaching Cues'}
                </label>
                <input
                  type="text"
                  value={customExCues}
                  onChange={(e) => setCustomExCues(e.target.value)}
                  placeholder="Focus on stretch at bottom, avoid flaring elbows..."
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs font-medium text-[#191c1e] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#565e74] uppercase block mb-1">
                  {isRtl ? 'رابط الفيديو التوضيحي' : 'Video Tutorial URL'}
                </label>
                <input
                  type="text"
                  value={customExVideoUrl}
                  onChange={(e) => setCustomExVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#eceef0]">
                <button
                  type="button"
                  onClick={() => setShowCreateCustomExerciseModal(false)}
                  className="flex-1 h-10 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs hover:bg-[#b8e600]"
                >
                  {isRtl ? 'إضافة واستخدام فوراً' : 'Create & Add to Day'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOAD FROM MASTER TEMPLATE MODAL */}
      {/* ========================================================================= */}
      {showTemplatePicker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-start">
          <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-xl shadow-2xl border border-[#eceef0] max-h-[85vh] flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#506600]" />
                <div>
                  <h4 className="text-base font-black text-[#191c1e]">
                    {isRtl ? 'استيراد هيكل الأيام من قالب' : 'Load Days & Exercises from Template'}
                  </h4>
                  <p className="text-[11px] text-[#565e74]">
                    {isRtl
                      ? 'سيتم نسخ أيام وتمارين القالب كمسودة يمكنك تعديلها بالكامل.'
                      : 'Copies the template days & exercises as an independent starting draft.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplatePicker(false)}
                className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 max-h-80">
              {templatesList.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleLoadTemplateStructure(tmpl)}
                  className="p-3.5 rounded-2xl border border-[#e0e3e5] hover:border-[#506600] hover:bg-[#f7faf0] flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                >
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-[#191c1e]">
                      {typeof tmpl.title === 'string'
                        ? tmpl.title
                        : isRtl
                        ? tmpl.title?.ar || tmpl.title?.en
                        : tmpl.title?.en || tmpl.title?.ar}
                    </h5>
                    <p className="text-[11px] text-[#565e74] mt-0.5">
                      {tmpl.days?.length || 0} {isRtl ? 'أيام تدريب' : 'workout days'} • {tmpl.durationWeeks || 8}{' '}
                      {isRtl ? 'أسابيع' : 'weeks'}
                    </p>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-[#191c1e] text-white text-[11px] font-bold">
                    {isRtl ? 'استيراد' : 'Import'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
