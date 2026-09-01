import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LockedFeature } from './LockedFeature';
import { Exercise, ExercisePerformanceLog, SetLog } from '../types';
import {
  Calendar,
  Clock,
  Dumbbell,
  Flame,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Info,
  Edit3,
  Search,
  ChevronRight,
  ChevronLeft,
  Video,
  X,
  Sparkles,
  Trophy,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  History,
  TrendingUp,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const WorkoutView: React.FC = () => {
  const {
    user,
    workoutProgram,
    selectedDayId,
    setSelectedDayId,
    exercises,
    logExerciseSet,
    toggleSetCompletion,
    saveExerciseNote,
    toggleExerciseCompletion,
    finishWorkout,
    performanceHistory,
    getExerciseHistory,
    getPreviousExercisePerformance,
    language,
    setShowAuthModal,
    setAuthMode,
    t,
  } = useApp();

  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeTabMode, setActiveTabMode] = useState<'today' | 'library'>('today');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // Active Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeTimerExercise, setActiveTimerExercise] = useState<string | null>(null);

  // Exercise note edit dialog
  const [editingNoteExerciseId, setEditingNoteExerciseId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  // Performance history modal for a specific exercise
  const [viewHistoryExercise, setViewHistoryExercise] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Overall session note & completion modal
  const [sessionNote, setSessionNote] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const hasTraining = user.entitlements.hasTraining;

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number, exerciseName: string) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
    setActiveTimerExercise(exerciseName);
  };

  if (!hasTraining) {
    return (
      <div className="pt-20 pb-28">
        <LockedFeature
          productName={t('trainingProduct')}
          productType="training"
          onOpenRedeem={() => {
            setAuthMode('activate');
            setShowAuthModal(true);
          }}
        />
      </div>
    );
  }

  const currentDay = workoutProgram.find((d) => d.id === selectedDayId) || workoutProgram[0];

  const filteredLibraryExercises = exercises.filter((ex) => {
    const muscle = (ex.muscleGroup || '').toLowerCase();
    const selMuscle = (selectedMuscle || '').toLowerCase();
    const q = (searchQuery || '').toLowerCase();
    const matchesMuscle = selectedMuscle === 'All' || muscle === selMuscle;
    const matchesSearch =
      (ex.name || '').toLowerCase().includes(q) ||
      muscle.includes(q);
    return matchesMuscle && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-28 gap-5 animate-fade-in text-start">
      {/* Top Segmented Controls: Today's Routine vs Exercise Library */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex p-1 bg-[#f2f4f6] rounded-2xl border border-[#e0e3e5] w-full max-w-xs">
          <button
            onClick={() => setActiveTabMode('today')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTabMode === 'today'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#565e74] hover:text-[#191c1e]'
            }`}
          >
            {isRtl ? 'برنامج اليوم' : "Today's Routine"}
          </button>
          <button
            onClick={() => setActiveTabMode('library')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTabMode === 'library'
                ? 'bg-white text-[#191c1e] shadow-xs'
                : 'text-[#565e74] hover:text-[#191c1e]'
            }`}
          >
            {t('exerciseLibrary')}
          </button>
        </div>

        {/* Global Live Rest Timer Pill (if active) */}
        {timerSeconds > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#191c1e] text-[#ccff00] text-xs font-black shadow-md animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>{timerSeconds}s</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-white hover:text-[#ccff00]"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {activeTabMode === 'today' ? (
        <>
          {/* Weekly Day Selector Strip */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            {workoutProgram.map((day) => {
              const isSelected = day.id === selectedDayId;
              const allDone = day.completed;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayId(day.id)}
                  className={`flex flex-col items-center justify-center min-w-[46px] sm:min-w-[54px] py-2.5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-[#191c1e] text-white border-[#191c1e] shadow-md shadow-[#191c1e]/20 scale-105'
                      : allDone
                      ? 'bg-[#ccff00]/20 text-[#506600] border-[#ccff00]'
                      : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#506600]/40'
                  }`}
                >
                  <span className="text-[11px] font-bold">
                    {typeof day.dayName === 'string'
                      ? day.dayName
                      : isRtl
                      ? day.dayName?.ar || day.dayName?.en || `اليوم ${day.dayNumber}`
                      : day.dayName?.en || day.dayName?.ar || `Day ${day.dayNumber}`}
                  </span>
                  <span
                    className={`text-base font-black leading-tight ${
                      isSelected ? 'text-[#ccff00]' : ''
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {allDone && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#506600] mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Day Header Card — Exact Trainer Entered Workout Title without auto-generated classification */}
          <div
            className="relative w-full rounded-3xl overflow-hidden shadow-lg bg-[#0f172a] text-white p-5 sm:p-6"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 100%), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[#ccff00] text-[#191c1e] text-xs font-black">
                {typeof currentDay.dayName === 'string'
                  ? currentDay.dayName
                  : isRtl
                  ? currentDay.dayName?.ar || currentDay.dayName?.en || `اليوم ${currentDay.dayNumber}`
                  : currentDay.dayName?.en || currentDay.dayName?.ar || `Day ${currentDay.dayNumber}`}
              </span>
              {currentDay.completed && (
                <span className="flex items-center gap-1 text-xs font-extrabold text-[#ccff00] bg-black/40 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('completed')}
                </span>
              )}
            </div>

            {/* Exactly the Trainer Entered Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
              {typeof currentDay.title === 'string'
                ? currentDay.title
                : isRtl
                ? currentDay.title?.ar || currentDay.title?.en || 'تمرين اليوم'
                : currentDay.title?.en || currentDay.title?.ar || "Today's Workout"}
            </h2>

            <div className="flex items-center gap-4 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#ccff00]" />
                {currentDay.durationMin} {t('minutes')}
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-[#ccff00]" />
                {currentDay.exercises.length} {t('exercises')}
              </span>
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-[#191c1e]">
                {t('exercises')} ({currentDay.exercises.length})
              </h3>
              <span className="text-xs font-medium text-[#565e74]">
                {currentDay.exercises.filter((e) => e.isCompleted).length} / {currentDay.exercises.length} {t('completed')}
              </span>
            </div>

            {currentDay.exercises.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-[#e0e3e5] text-center">
                <Calendar className="w-10 h-10 text-[#565e74] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold text-[#191c1e]">
                  {isRtl ? 'يوم راحة مخصص للاستشفاء.' : 'Active rest day for recovery.'}
                </p>
              </div>
            ) : (
              currentDay.exercises.map((item, index) => {
                const exerciseData = exercises.find((e) => e.id === item.exerciseId);
                if (!exerciseData) return null;

                // Ensure loggedSets array exists for each set
                const setsCount = item.sets || 3;
                const existingSets = item.loggedSets || [];
                const fullSets: SetLog[] = Array.from({ length: setsCount }, (_, i) => {
                  const setNum = i + 1;
                  const found = existingSets.find((s) => s.setNumber === setNum);
                  return (
                    found || {
                      setNumber: setNum,
                      weightKg: undefined,
                      repsCompleted: undefined,
                      isCompleted: false,
                    }
                  );
                });

                // Get previous performance
                const prevPerf = getPreviousExercisePerformance(item.exerciseId);

                return (
                  <div
                    key={item.exerciseId}
                    className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col gap-4 ${
                      item.isCompleted
                        ? 'border-[#506600]/40 bg-[#fafcf7]'
                        : 'border-[#e0e3e5] hover:border-[#506600]/30'
                    }`}
                  >
                    {/* Header: Exercise Info, Video, Rest Timer, Complete Toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div
                          onClick={() => setPreviewExercise(exerciseData)}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#f2f4f6] shrink-0 cursor-pointer group shadow-2xs"
                        >
                          <img
                            src={exerciseData.thumbnail}
                            alt={exerciseData.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                          {/* Exercise name ALWAYS in English as per constraint */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base sm:text-lg font-black text-[#191c1e] tracking-tight">
                              {exerciseData.name}
                            </h4>
                            <button
                              onClick={() => setPreviewExercise(exerciseData)}
                              className="text-[#565e74] hover:text-[#506600]"
                              title="Exercise Details & Video"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Prescribed sets, reps, rest & tempo */}
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#565e74] mt-1">
                            <span className="bg-[#f2f4f6] px-2 py-0.5 rounded-md text-[#191c1e] font-bold">
                              {item.sets} {t('sets')} × {item.reps} {t('reps')}
                            </span>
                            <button
                              onClick={() => startRestTimer(item.restSec, exerciseData.name)}
                              className="flex items-center gap-1 text-[#506600] font-bold hover:underline bg-[#f7faf0] px-2 py-0.5 rounded-md border border-[#506600]/20"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {item.restSec}s {t('rest')}
                            </button>
                            {item.tempo && (
                              <span className="text-[11px] text-[#565e74]">
                                Tempo: {item.tempo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Complete Exercise Button */}
                      <button
                        onClick={() => toggleExerciseCompletion(currentDay.id, item.exerciseId)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          item.isCompleted
                            ? 'bg-[#506600] text-white shadow-md shadow-[#506600]/30'
                            : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                        }`}
                        title={item.isCompleted ? t('completed') : t('startWorkout')}
                      >
                        {item.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Trainer Notes (Distinct coach banner) */}
                    {item.trainerNote && (
                      <div className="p-2.5 rounded-2xl bg-[#f7faf0] border border-[#506600]/20 flex items-start gap-2 text-xs text-[#191c1e]">
                        <span className="px-2 py-0.5 rounded-md bg-[#ccff00] text-[#191c1e] font-black text-[10px] uppercase shrink-0 mt-0.5">
                          {t('trainerNote')}
                        </span>
                        <p className="font-medium text-[#191c1e]">{item.trainerNote}</p>
                      </div>
                    )}

                    {/* Performance History Modal Trigger */}
                    <div className="flex items-center justify-end px-1 text-xs">
                      <button
                        onClick={() =>
                          setViewHistoryExercise({
                            id: exerciseData.id,
                            name: exerciseData.name,
                          })
                        }
                        className="flex items-center gap-1.5 text-xs font-bold text-[#506600] hover:underline bg-[#f7faf0] px-3 py-1.5 rounded-xl border border-[#506600]/20"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>{t('performanceHistory')}</span>
                      </button>
                    </div>

                    {/* Set-by-Set Logging Table (Client inputs actual weight in kg & reps) */}
                    <div className="bg-[#f7f9fb] rounded-2xl p-3 border border-[#e0e3e5] flex flex-col gap-2">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-2 text-[10px] font-black text-[#565e74] uppercase px-1 text-center items-center">
                        <span className="col-span-2 text-start">{t('sets')}</span>
                        <span className="col-span-5">{t('actualWeight')} (kg)</span>
                        <span className="col-span-3">{t('actualReps')}</span>
                        <span className="col-span-2">{t('completed')}</span>
                      </div>

                      {/* Set Rows */}
                      {fullSets.map((s) => {
                        return (
                          <div
                            key={s.setNumber}
                            className={`grid grid-cols-12 gap-2 p-2 rounded-xl border items-center transition-all ${
                              s.isCompleted
                                ? 'bg-[#f7faf0] border-[#506600]/30'
                                : 'bg-white border-[#e0e3e5]'
                            }`}
                          >
                            {/* Set Number */}
                            <div className="col-span-2 flex items-center gap-1">
                              <span className="w-6 h-6 rounded-lg bg-[#f2f4f6] text-[11px] font-black text-[#191c1e] flex items-center justify-center">
                                {s.setNumber}
                              </span>
                            </div>

                            {/* Actual Weight in KG (Empty initially, user inputs) */}
                            <div className="col-span-5">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="—"
                                value={s.weightKg !== undefined ? s.weightKg : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                                  logExerciseSet(
                                    currentDay.id,
                                    item.exerciseId,
                                    s.setNumber,
                                    val,
                                    s.repsCompleted
                                  );
                                }}
                                className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center border border-transparent focus:border-[#506600] focus:bg-white outline-none"
                              />
                            </div>

                            {/* Actual Reps Completed */}
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                placeholder={item.reps}
                                value={s.repsCompleted !== undefined ? s.repsCompleted : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                                  logExerciseSet(
                                    currentDay.id,
                                    item.exerciseId,
                                    s.setNumber,
                                    s.weightKg,
                                    val
                                  );
                                }}
                                className="w-full h-8 px-2 rounded-lg bg-[#f2f4f6] text-xs font-black text-[#191c1e] text-center border border-transparent focus:border-[#506600] focus:bg-white outline-none"
                              />
                            </div>

                            {/* Checkmark Button for Set Completion */}
                            <div className="col-span-2 flex justify-center">
                              <button
                                onClick={() =>
                                  toggleSetCompletion(
                                    currentDay.id,
                                    item.exerciseId,
                                    s.setNumber
                                  )
                                }
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                  s.isCompleted
                                    ? 'bg-[#ccff00] text-[#191c1e] shadow-2xs font-bold'
                                    : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                                }`}
                              >
                                {s.isCompleted ? (
                                  <Check className="w-4 h-4 stroke-[3px]" />
                                ) : (
                                  <span className="text-[11px] font-bold">✓</span>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Client Notes & Action Bar */}
                    <div className="pt-2 border-t border-[#f2f4f6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        {item.clientNote ? (
                          <div className="flex items-center gap-1.5 text-xs text-[#565e74] bg-[#f7f9fb] p-2 rounded-xl border border-[#e0e3e5]">
                            <MessageSquare className="w-3.5 h-3.5 text-[#506600] shrink-0" />
                            <span className="font-medium text-[#191c1e]">
                              {t('clientNote')}: "{item.clientNote}"
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <button
                        onClick={() => {
                          setEditingNoteExerciseId(item.exerciseId);
                          setNoteInput(item.clientNote || '');
                        }}
                        className="flex items-center justify-center gap-1 text-xs font-bold text-[#506600] hover:text-[#191c1e] px-3 py-1.5 rounded-xl bg-[#ccff00]/20 hover:bg-[#ccff00]/40 transition-colors shrink-0"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{item.clientNote ? t('saveNote') : t('addNote')}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Session Note & Finish Workout Button */}
          {currentDay.exercises.length > 0 && (
            <div className="mt-4 bg-white rounded-3xl p-5 border border-[#e0e3e5] flex flex-col gap-3 shadow-xs">
              <label className="text-xs font-bold text-[#565e74] uppercase tracking-wider text-start">
                {t('workoutSessionNote')}
              </label>
              <textarea
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                placeholder={t('sessionNotePlaceholder')}
                rows={2}
                className="w-full p-3 rounded-2xl bg-[#f2f4f6] text-xs text-[#191c1e] border border-transparent focus:border-[#506600] focus:bg-white outline-none transition-all resize-none"
              />
              <button
                onClick={() => {
                  finishWorkout(currentDay.id, sessionNote);
                  setShowCompletionModal(true);
                }}
                className="w-full h-13 rounded-2xl bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.98] text-[#191c1e] font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/25 transition-all"
              >
                <Trophy className="w-5 h-5 text-[#191c1e]" />
                <span>{t('finishWorkout')}</span>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Exercise Library Tab */
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchExercises')}
              className="w-full h-11 px-9 rounded-2xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none shadow-xs"
            />
          </div>

          {/* Muscle Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core'].map((muscle) => {
              const isActive = selectedMuscle === muscle;
              return (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#191c1e] text-[#ccff00] border-[#191c1e]'
                      : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#506600]'
                  }`}
                >
                  {muscle === 'All'
                    ? t('allMuscleGroups')
                    : isRtl
                    ? (t as any)(muscle.toLowerCase()) || muscle
                    : muscle}
                </button>
              );
            })}
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredLibraryExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setPreviewExercise(ex)}
                className="bg-white rounded-2xl p-3.5 border border-[#e0e3e5] hover:border-[#506600] shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f2f4f6] shrink-0 relative">
                  <img
                    src={ex.thumbnail}
                    alt={ex.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#506600] uppercase tracking-wider">
                    {ex.muscleGroup}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#191c1e] truncate">
                    {ex.name}
                  </h4>
                  <span className="text-[11px] text-[#565e74]">
                    {ex.equipment} • {ex.difficulty}
                  </span>
                </div>
                <ArrowIcon className="w-4 h-4 text-[#565e74] shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Video & Form Instructions Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#eceef0] my-6 max-h-[90vh] flex flex-col">
            {/* Modal Video Header */}
            <div className="relative w-full h-52 bg-black flex items-center justify-center">
              <img
                src={previewExercise.thumbnail}
                alt={previewExercise.name}
                className="w-full h-full object-cover opacity-80"
              />
              <a
                href={previewExercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute w-14 h-14 rounded-full bg-[#ccff00] text-[#191c1e] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
              >
                <Play className="w-6 h-6 fill-[#191c1e] translate-x-0.5 rtl:-translate-x-0.5" />
              </a>
              <button
                onClick={() => setPreviewExercise(null)}
                className="absolute top-3 right-3 rtl:left-3 rtl:right-auto w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-start">
              <div>
                <span className="text-xs font-bold text-[#506600] uppercase tracking-wider">
                  {previewExercise.muscleGroup} • {previewExercise.equipment}
                </span>
                <h3 className="text-2xl font-black text-[#191c1e]">
                  {previewExercise.name}
                </h3>
              </div>

              {/* Instructions */}
              <div>
                <h5 className="text-xs font-bold text-[#565e74] uppercase tracking-wider mb-2">
                  {t('instructions')}
                </h5>
                <ol className="flex flex-col gap-2 list-decimal list-inside text-xs sm:text-sm text-[#191c1e] font-medium leading-relaxed">
                  {((isRtl
                    ? previewExercise.instructions?.ar || previewExercise.instructions?.en
                    : previewExercise.instructions?.en || previewExercise.instructions?.ar) || [
                    'Perform repetitions with controlled tempo and full range of motion.'
                  ]).map(
                    (step, i) => (
                      <li key={i} className="pl-1">
                        {step}
                      </li>
                    )
                  )}
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setPreviewExercise(null)}
                  className="w-full h-11 rounded-xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] font-bold text-xs"
                >
                  {isRtl ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Performance History Modal */}
      {viewHistoryExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-[#eceef0] max-h-[85vh] flex flex-col gap-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#eceef0]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#191c1e]">
                    {viewHistoryExercise.name}
                  </h4>
                  <span className="text-xs text-[#565e74]">
                    {t('performanceHistory')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewHistoryExercise(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* History timeline list */}
            <div className="overflow-y-auto flex flex-col gap-3 max-h-[60vh]">
              {getExerciseHistory(viewHistoryExercise.id).length === 0 ? (
                <div className="py-8 text-center text-xs text-[#565e74]">
                  {isRtl
                    ? 'لا توجد جلسات مسجلة بعد لهذا التمرين.'
                    : 'No previous sessions recorded yet for this exercise.'}
                </div>
              ) : (
                getExerciseHistory(viewHistoryExercise.id).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#191c1e]">
                        {log.workoutTitle || log.workoutDate}
                      </span>
                      <span className="text-[11px] font-semibold text-[#565e74]">
                        {log.workoutDate}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(log.sets || []).map((s) => (
                        <span
                          key={s.setNumber}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e]"
                        >
                          S{s.setNumber}: {s.weightKg ?? '-'} kg × {s.repsCompleted ?? '-'}
                        </span>
                      ))}
                    </div>

                    {log.clientNote && (
                      <p className="text-[11px] italic text-[#565e74] bg-white p-2 rounded-xl border border-[#e0e3e5]">
                        💬 "{log.clientNote}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setViewHistoryExercise(null)}
              className="w-full h-11 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-bold text-xs hover:bg-[#e0e3e5]"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Note Editing Dialog */}
      {editingNoteExerciseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#eceef0] flex flex-col gap-3">
            <h4 className="text-base font-extrabold text-[#191c1e]">
              {t('clientNote')}
            </h4>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Last set was difficult. Shoulder felt tight."
              rows={3}
              className="w-full p-3 rounded-xl bg-[#f2f4f6] text-xs font-medium text-[#191c1e] border border-transparent focus:border-[#506600] outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  saveExerciseNote(currentDay.id, editingNoteExerciseId, noteInput);
                  setEditingNoteExerciseId(null);
                }}
                className="flex-1 h-11 rounded-xl bg-[#ccff00] text-[#191c1e] font-bold text-xs"
              >
                {t('saveNote')}
              </button>
              <button
                onClick={() => setEditingNoteExerciseId(null)}
                className="px-4 h-11 rounded-xl bg-[#f2f4f6] text-[#565e74] font-bold text-xs"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Celebration Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-[#eceef0] flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#ccff00] flex items-center justify-center text-[#191c1e] mb-4 shadow-lg shadow-[#ccff00]/40">
              <Trophy className="w-8 h-8 stroke-[2.2px]" />
            </div>
            <h3 className="text-2xl font-black text-[#191c1e] mb-1">
              {isRtl ? 'عاش يا بطل! تمرين مكتمل' : 'Workout Crushed!'}
            </h3>
            <p className="text-xs sm:text-sm text-[#565e74] mb-6">
              {isRtl
                ? 'تم تسجيل نتائجك بنجاح وحفظها في سجل الأداء والتقدم للمدرب أليكس شوقي.'
                : 'Session logged successfully. Sets and progression saved to Coach Alex’s log.'}
            </p>
            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full h-12 rounded-2xl bg-[#191c1e] text-[#ccff00] font-black text-sm"
            >
              {isRtl ? 'العودة للرئيسية' : 'Awesome'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
