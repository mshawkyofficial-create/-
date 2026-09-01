import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise } from '../../types';
import { X, Dumbbell, Sparkles, Video } from 'lucide-react';

interface TrainerAddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainerAddExerciseModal: React.FC<TrainerAddExerciseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomExercise, language } = useApp();
  const isRtl = language === 'ar';

  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('Chest');
  const [equipment, setEquipment] = useState('Dumbbells');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [instructionsEn, setInstructionsEn] = useState('Focus on controlled eccentric phase and full contraction.');
  const [instructionsAr, setInstructionsAr] = useState('التركيز على النزول البطئ والتحكم الكامل في الوزن.');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=rT7DgCr-3pg');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEx: Exercise = {
      id: 'ex_custom_' + Date.now(),
      name: name.trim(),
      muscleGroup,
      category: 'Strength',
      equipment,
      difficulty,
      instructions: {
        en: [instructionsEn.trim() || 'Focus on controlled eccentric phase and full contraction.'],
        ar: [instructionsAr.trim() || 'التركيز على النزول البطئ والتحكم الكامل في الوزن.'],
      },
      defaultSets: 3,
      defaultReps: '10-12',
      defaultRestSec: 90,
      videoUrl: videoUrl.trim() || 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
      thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
    };

    addCustomExercise(newEx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#191c1e]">
                {isRtl ? 'إضافة تمرين جديد للمكتبة' : 'Add Exercise to Library'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'تسجيل تمرين جديد مع التوجيهات والفيديو' : 'Register a new exercise with cues & video link'}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اسم التمرين (إنجليزي)' : 'Exercise Name (English)'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Incline Smith Press"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اسم التمرين (عربي)' : 'Exercise Name (Arabic)'}
              </label>
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: دفع علوي سميث"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'العضلة المستهدفة' : 'Muscle Group'}
              </label>
              <select
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                <option value="Chest">{isRtl ? 'الصدر (Chest)' : 'Chest'}</option>
                <option value="Back">{isRtl ? 'الظهر (Back)' : 'Back'}</option>
                <option value="Legs">{isRtl ? 'الأرجل (Legs)' : 'Legs'}</option>
                <option value="Shoulders">{isRtl ? 'الأكتاف (Shoulders)' : 'Shoulders'}</option>
                <option value="Arms">{isRtl ? 'الذراعين (Arms)' : 'Arms'}</option>
                <option value="Core">{isRtl ? 'البطن والكور (Core)' : 'Core'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الأداة' : 'Equipment'}
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="Barbell, Dumbbells, Cables"
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'المستوى' : 'Difficulty'}
              </label>
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                <option value="beginner">{isRtl ? 'مبتدئ' : 'Beginner'}</option>
                <option value="intermediate">{isRtl ? 'متوسط' : 'Intermediate'}</option>
                <option value="advanced">{isRtl ? 'متقدم' : 'Advanced'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'رابط الفيديو التوضيحي (YouTube / Vimeo)' : 'Video Tutorial Link'}
            </label>
            <div className="flex items-center gap-2 bg-[#f2f4f6] px-3 rounded-xl">
              <Video className="w-4 h-4 text-[#565e74]" />
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-11 bg-transparent text-xs font-medium text-[#191c1e] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
              {isRtl ? 'توجيهات الأداء الصحيح (عربي)' : 'Form Instructions (Arabic)'}
            </label>
            <textarea
              value={instructionsAr}
              onChange={(e) => setInstructionsAr(e.target.value)}
              placeholder="مثال: ضبط الكوع بزاوية ٤٥ درجة، ثبات القدمين على الأرض والتركيز على العضلة..."
              rows={2}
              className="w-full p-3 rounded-xl bg-[#f2f4f6] text-xs font-medium text-[#191c1e] outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-black text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'حفظ التمرين في المكتبة' : 'Save to Exercise Library'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-12 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5] transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
