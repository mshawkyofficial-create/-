import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Scale,
  Ruler,
  Camera,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  UploadCloud,
  Award,
  Sparkles,
  Info,
  Calendar,
  X,
} from 'lucide-react';

export const ProgressCheckInView: React.FC = () => {
  const { user, checkIns, submitCheckIn, language, measurementLocations, t } = useApp();
  const isRtl = language === 'ar';

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [inputWeight, setInputWeight] = useState<number>(user.weightKg || 82.5);
  const [dynamicMeasurements, setDynamicMeasurements] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    measurementLocations.forEach((loc) => {
      const baselineVal = (user.onboardingData?.baselineMeasurements as any)?.[loc.id];
      if (baselineVal) {
        initial[loc.id] = baselineVal;
      }
    });
    return initial;
  });
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
  ]);

  const handleMeasurementChange = (locId: string, val: number) => {
    setDynamicMeasurements((prev) => ({
      ...prev,
      [locId]: val,
    }));
  };

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setUploadedPhotos((prev) => [...prev, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCheckIn({
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      weightKg: Number(inputWeight),
      measurements: dynamicMeasurements,
      notes,
      photoUrls: uploadedPhotos,
    });
    setShowSubmitModal(false);
    setNotes('');
  };

  const baselineWeight = user.onboardingData?.baselineWeightKg || user.weightKg || 82.5;
  const latestCheckIn = checkIns[0];
  const currentWeight = latestCheckIn ? latestCheckIn.weightKg : user.weightKg;
  const weightChange = Number((currentWeight - baselineWeight).toFixed(1));

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-6 animate-fade-in text-start">
      {/* Top Banner */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#191c1e]">
            {t('progressHub')}
          </h1>
          <p className="text-xs sm:text-sm text-[#565e74]">
            {isRtl
              ? 'متابعة تغير الوزن والقياسات البدنية وتقارير المتابعة الأسبوعية'
              : 'Body composition tracking, measurements, & weekly check-in logs'}
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#ccff00] text-[#191c1e] text-xs sm:text-sm font-black shadow-md shadow-[#ccff00]/25 hover:bg-[#b8e600] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('submitCheckin')}</span>
        </button>
      </div>

      {/* Weight Stats & Baseline Comparison Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#565e74] uppercase">
                {t('currentWeight')}
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-[#191c1e]">
                  {currentWeight} {t('kg')}
                </h3>
                {weightChange !== 0 && (
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      weightChange < 0
                        ? 'bg-[#f7faf0] text-[#506600]'
                        : 'bg-[#fff0f0] text-[#ba1a1a]'
                    }`}
                  >
                    {weightChange > 0 ? `+${weightChange}` : weightChange} kg vs {isRtl ? 'البداية' : 'start'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center sm:text-end">
              <span className="text-xs font-bold text-[#565e74] uppercase block">
                {isRtl ? 'وزن البداية (Baseline)' : 'Starting Weight'}
              </span>
              <h4 className="text-lg font-black text-[#191c1e]">
                {baselineWeight} {t('kg')}
              </h4>
            </div>

            <div className="text-center sm:text-end">
              <span className="text-xs font-bold text-[#565e74] uppercase block">
                {t('targetGoal')}
              </span>
              <h4 className="text-lg font-extrabold text-[#506600]">
                {user.targetWeightKg || 78.0} {t('kg')}
              </h4>
            </div>
          </div>
        </div>

        {/* Dynamic Measurement Locations Grid */}
        <div className="pt-3 border-t border-[#eceef0]">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-black text-[#191c1e] flex items-center gap-1.5 uppercase">
              <Ruler className="w-4 h-4 text-[#506600]" />
              <span>{isRtl ? 'قياسات المحيطات البدنية (محددة من الكوتش)' : 'Circumference Measurements (Trainer Defined)'}</span>
            </h4>
            <span className="text-[11px] text-[#565e74] font-medium">
              {isRtl ? 'آخر تحديث' : 'Current active values'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {measurementLocations.map((loc) => {
              const label = isRtl ? loc.name.ar : loc.name.en;
              const val =
                latestCheckIn?.measurements?.[loc.id] ??
                (user.onboardingData?.baselineMeasurements as any)?.[loc.id] ??
                '--';

              return (
                <div key={loc.id} className="bg-[#fafbfc] p-2.5 rounded-2xl border border-[#e0e3e5] text-center">
                  <span className="text-[10px] font-extrabold text-[#565e74] uppercase block truncate">
                    {label}
                  </span>
                  <span className="text-sm font-black text-[#191c1e]">
                    {val !== '--' ? `${val} cm` : '--'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check-ins & Coach Feedback Timeline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#191c1e]">
            {isRtl ? 'سجل التقارير وملاحظات المدرب' : 'Weekly Check-ins & Coach Feedback'}
          </h3>
          <span className="text-xs text-[#565e74] font-bold">
            {checkIns.length} {isRtl ? 'تقارير مسجلة' : 'Reports'}
          </span>
        </div>

        {checkIns.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#e0e3e5] text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] text-[#565e74] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#191c1e]">
              {isRtl ? 'لا توجد تقارير أسبوعية بعد' : 'No weekly check-ins submitted yet'}
            </p>
            <p className="text-xs text-[#565e74] max-w-sm">
              {isRtl
                ? 'اضغط على زر تقديم تقرير أسبوعي لتسجيل وزنك وقياساتك الحالية وإرسالها للمدرب'
                : 'Click Submit Weekly Check-in above to log your current weight, measurements and reflection.'}
            </p>
          </div>
        ) : (
          checkIns.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e0e3e5] shadow-xs flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#191c1e]">
                      {item.date}
                    </h4>
                    <span className="text-xs text-[#565e74]">
                      {item.weightKg} kg • {Object.keys(item.measurements || {}).length} {isRtl ? 'قياسات مسجلة' : 'measurements'}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                    item.status === 'reviewed'
                      ? 'bg-[#f7faf0] text-[#506600] border border-[#506600]/30'
                      : 'bg-[#f2f4f6] text-[#565e74]'
                  }`}
                >
                  {item.status === 'reviewed' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#506600]" />
                      {isRtl ? 'تمت المراجعة من الكوتش' : 'Reviewed by Coach'}
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      {isRtl ? 'قيد المراجعة' : 'Pending Review'}
                    </>
                  )}
                </span>
              </div>

              {/* Photos if any */}
              {item.photoUrls && item.photoUrls.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {item.photoUrls.map((p, pIdx) => (
                    <img
                      key={pIdx}
                      src={p}
                      alt={`Check-in ${pIdx + 1}`}
                      className="w-20 h-24 rounded-2xl object-cover border border-[#e0e3e5] shrink-0"
                    />
                  ))}
                </div>
              )}

              {/* Client Notes */}
              {item.notes && (
                <div className="text-xs text-[#191c1e] bg-[#fafbfc] p-3.5 rounded-2xl border border-[#e0e3e5] leading-relaxed">
                  <strong className="text-[#565e74] block mb-1">
                    {isRtl ? 'تقرير وملاحظات المشترك:' : 'Your weekly reflection:'}
                  </strong>
                  {item.notes}
                </div>
              )}

              {/* Coach Feedback Box */}
              {item.trainerFeedback && (
                <div className="p-4 rounded-2xl bg-[#f7faf0] border border-[#506600]/30 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#506600] text-white flex items-center justify-center text-[10px] font-black">
                      S
                    </div>
                    <span className="text-xs font-black text-[#506600]">
                      Coach Shawky ({item.trainerFeedbackDate || 'Review'})
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#191c1e] leading-relaxed">
                    "{item.trainerFeedback}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Check-In Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-4 text-start">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <h3 className="text-lg sm:text-xl font-black text-[#191c1e]">
                {t('submitCheckin')}
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {t('weight')} (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-2xl bg-[#f2f4f6] text-xs sm:text-sm font-bold text-[#191c1e] outline-none"
                  required
                />
              </div>

              {/* Dynamic Circumference measurements defined by trainer */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
                  {isRtl ? 'القياسات البدنية (سم)' : 'Circumference Measurements (cm)'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {measurementLocations.map((loc) => {
                    const label = isRtl ? loc.name.ar : loc.name.en;
                    return (
                      <div key={loc.id} className="bg-[#f2f4f6] p-2.5 rounded-2xl">
                        <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1 truncate">
                          {label}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={dynamicMeasurements[loc.id] || ''}
                          onChange={(e) => handleMeasurementChange(loc.id, Number(e.target.value))}
                          placeholder="--"
                          className="w-full h-8 px-2 rounded-xl bg-white text-xs font-bold text-[#191c1e] outline-none text-center"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
                  {isRtl ? 'صور التقدم الأسبوعي' : 'Weekly Progress Photos'}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Photo URL (e.g. https://...)"
                    className="flex-1 h-10 px-3 rounded-xl bg-[#f2f4f6] text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="px-3 h-10 rounded-xl bg-[#ccff00] text-[#191c1e] text-xs font-black"
                  >
                    {isRtl ? 'إضافة' : 'Add'}
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {uploadedPhotos.map((p, idx) => (
                    <div key={idx} className="relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-[#e0e3e5]">
                      <img src={p} alt="Progress" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                  {isRtl ? 'كيف كان التزامك وطاقتك ونومك هذا الأسبوع؟' : 'Weekly notes & reflection'} *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={
                    isRtl
                      ? 'مثال: التزمت بالوجبات بنسبة 90%، النوم 7 ساعات، الطاقة في التمرين ممتازة...'
                      : 'e.g. Energy was high, hit all protein targets, slept 7.5h nightly, had great pumps in back workout...'
                  }
                  className="w-full p-3.5 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-2xl bg-[#ccff00] text-[#191c1e] font-black text-sm hover:bg-[#b8e600] active:scale-95 transition-all shadow-md shadow-[#ccff00]/25"
                >
                  {isRtl ? 'إرسال التقرير للمدرب' : 'Submit Check-in'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 h-12 rounded-2xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs hover:bg-[#e0e3e5]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
