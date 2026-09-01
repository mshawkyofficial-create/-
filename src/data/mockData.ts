import {
  AccessCode,
  ActivityFeedItem,
  CheckIn,
  ClientOverview,
  Exercise,
  Ingredient,
  MeasurementLocation,
  Message,
  NutritionPlan,
  Recipe,
  TrainerNote,
  TrainingProgram,
  User,
  WorkoutDay,
} from '../types';

export const defaultMeasurementLocations: MeasurementLocation[] = [
  { id: 'waistCm', name: { en: 'Waist', ar: 'الخصر' }, defaultUnit: 'cm' },
  { id: 'abdomenCm', name: { en: 'Abdomen', ar: 'البطن' }, defaultUnit: 'cm' },
  { id: 'chestCm', name: { en: 'Chest', ar: 'الصدر' }, defaultUnit: 'cm' },
  { id: 'hipsCm', name: { en: 'Hips', ar: 'الأرداف' }, defaultUnit: 'cm' },
  { id: 'armCm', name: { en: 'Arm', ar: 'الذراع' }, defaultUnit: 'cm' },
  { id: 'thighCm', name: { en: 'Thigh', ar: 'الفخذ' }, defaultUnit: 'cm' },
  { id: 'calfCm', name: { en: 'Calf', ar: 'السمانة' }, defaultUnit: 'cm' },
];

export const initialAccessCodes: AccessCode[] = [
  {
    code: 'SHAWKY-VIP',
    product: 'full_access',
    status: 'active',
    expirationDate: '2026-12-31',
  },
  {
    code: 'SHAWKY-TRAIN',
    product: 'training',
    status: 'active',
    expirationDate: '2026-12-31',
  },
  {
    code: 'SHAWKY-NUTRITION',
    product: 'nutrition',
    status: 'active',
    expirationDate: '2026-12-31',
  },
  {
    code: 'SHAWKY-RECIPES',
    product: 'recipe_book',
    status: 'active',
    expirationDate: '2026-12-31',
  },
  {
    code: 'COACH2026',
    product: 'training_nutrition',
    status: 'active',
    expirationDate: '2026-12-31',
  }
];

export const defaultUser: User = {
  id: 'user_mahmoud_1',
  name: 'Mahmoud Shawky',
  email: 'm.shawkyofficial@gmail.com',
  phone: '+971 50 123 4567',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  entitlements: {
    hasRecipeBook: true,
    hasTraining: true,
    hasNutrition: true,
    recipeBookExpires: '2026-12-31',
    trainingExpires: '2026-12-31',
    nutritionExpires: '2026-12-31',
  },
  activeProduct: 'full_access',
  currentStreak: 14,
  weightKg: 82.5,
  targetWeightKg: 78.0,
  dailyCaloriesTarget: 2200,
  proteinTarget: 160,
  carbsTarget: 250,
  fatTarget: 70,
  onboardingCompleted: true,
  onboardingData: {
    age: 27,
    heightCm: 178,
    currentWeightKg: 82.5,
    goal: 'Muscle Gain',
    customGoalText: '',
    trainingLevel: 'Intermediate',
    trainingExperience: '3 years intermittent lifting and strength conditioning',
    trainingDaysPerWeek: 4,
    restDaysPerWeek: 3,
    preferredTrainingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    preferredRestDays: ['Wednesday', 'Saturday', 'Sunday'],
    availableEquipment: ['Full Gym'],
    customEquipmentText: '',
    workoutDurationMin: 60,
    preferredWorkoutTime: 'Evening (6:00 PM - 8:00 PM)',
    exercisesToAvoid: 'Behind the neck press, deep upright barbell rows',
    foodsToAvoid: 'Excessively spicy foods',
    allergies: 'Mild lactose sensitivity (avoids raw unpasteurized milk)',
    preferredFoods: 'Chicken breast, beef tenderloin, jasmine rice, sweet potatoes, whole eggs, oats, berries',
    mealsPerDay: 4,
    eatingStyle: 'Meal Prep',
    mealTimes: 'Breakfast: 8:30 AM, Lunch: 1:30 PM, Pre-workout: 5:30 PM, Dinner: 9:00 PM',
    nutritionNotes: 'Prefers high protein breakfast with whole eggs and oats.',
    hasInjuries: true,
    injuryDescription: 'Previous left rotator cuff strain (fully rehabbed, avoid painful overhead angles)',
    baselineWeightKg: 82.5,
    baselineMeasurements: {
      waistCm: 84,
      abdomenCm: 86,
      chestCm: 106,
      hipsCm: 100,
      armCm: 39,
      thighCm: 61,
      calfCm: 38,
    },
    baselinePhotos: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    ],
    baselineNotes: 'Focused on building lean muscle with Coach Alex while improving posture and bench form.',
    completedAt: '2026-08-01T10:00:00.000Z',
  },
};

export const ingredientsDatabase: Ingredient[] = [
  {
    id: 'ing_salmon',
    name: { en: 'Fresh Atlantic Salmon', ar: 'سلمون أطلسي طازج' },
    caloriesPer100g: 208,
    proteinPer100g: 20.4,
    carbsPer100g: 0,
    fatPer100g: 13.4,
    defaultUnit: 'g'
  },
  {
    id: 'ing_chicken_breast',
    name: { en: 'Skinless Chicken Breast', ar: 'صدر دجاج منزوع الجلد' },
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    defaultUnit: 'g'
  },
  {
    id: 'ing_eggs',
    name: { en: 'Whole Eggs', ar: 'بيض كامل' },
    caloriesPer100g: 143,
    proteinPer100g: 12.6,
    carbsPer100g: 0.7,
    fatPer100g: 9.5,
    defaultUnit: 'g'
  },
  {
    id: 'ing_egg_whites',
    name: { en: 'Liquid Egg Whites', ar: 'بياض بيض سائل' },
    caloriesPer100g: 52,
    proteinPer100g: 11.0,
    carbsPer100g: 0.7,
    fatPer100g: 0.2,
    defaultUnit: 'g'
  },
  {
    id: 'ing_quinoa',
    name: { en: 'Cooked Quinoa', ar: 'كينوا مطبوخة' },
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21.3,
    fatPer100g: 1.9,
    defaultUnit: 'g'
  },
  {
    id: 'ing_white_rice',
    name: { en: 'Cooked Jasmine Rice', ar: 'أرز ياسمين مطبوخ' },
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatPer100g: 0.3,
    defaultUnit: 'g'
  },
  {
    id: 'ing_sweet_potato',
    name: { en: 'Baked Sweet Potato', ar: 'بطاطا حلوة مشوية' },
    caloriesPer100g: 90,
    proteinPer100g: 2.0,
    carbsPer100g: 20.7,
    fatPer100g: 0.2,
    defaultUnit: 'g'
  },
  {
    id: 'ing_oats',
    name: { en: 'Rolled Oats', ar: 'شوفان كامل الحبة' },
    caloriesPer100g: 389,
    proteinPer100g: 16.9,
    carbsPer100g: 66.3,
    fatPer100g: 6.9,
    defaultUnit: 'g'
  },
  {
    id: 'ing_whey_protein',
    name: { en: 'Whey Protein Isolate', ar: 'بروتين واي معزول' },
    caloriesPer100g: 375,
    proteinPer100g: 88.0,
    carbsPer100g: 2.5,
    fatPer100g: 1.2,
    defaultUnit: 'g'
  },
  {
    id: 'ing_blueberries',
    name: { en: 'Fresh Blueberries', ar: 'توت أزرق طازج' },
    caloriesPer100g: 57,
    proteinPer100g: 0.7,
    carbsPer100g: 14.5,
    fatPer100g: 0.3,
    defaultUnit: 'g'
  },
  {
    id: 'ing_avocado',
    name: { en: 'Fresh Avocado', ar: 'أفوكادو طازج' },
    caloriesPer100g: 160,
    proteinPer100g: 2.0,
    carbsPer100g: 8.5,
    fatPer100g: 14.7,
    defaultUnit: 'g'
  },
  {
    id: 'ing_greek_yogurt',
    name: { en: '0% Non-Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' },
    caloriesPer100g: 59,
    proteinPer100g: 10.3,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    defaultUnit: 'g'
  },
  {
    id: 'ing_olive_oil',
    name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' },
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100.0,
    defaultUnit: 'g'
  },
  {
    id: 'ing_edamame',
    name: { en: 'Steamed Edamame', ar: 'فول إدامامي مسلوق' },
    caloriesPer100g: 122,
    proteinPer100g: 11.0,
    carbsPer100g: 8.9,
    fatPer100g: 5.2,
    defaultUnit: 'g'
  },
  {
    id: 'ing_honey',
    name: { en: 'Raw Organic Honey', ar: 'عسل نحل طبيعي' },
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82.4,
    fatPer100g: 0,
    defaultUnit: 'g'
  }
];

import { shawkyRecipeBookDatabase } from './recipeBookDatabase';

export const mockRecipes: Recipe[] = shawkyRecipeBookDatabase;

export const exercisesDatabase: Exercise[] = [
  {
    id: 'ex_bench_press',
    name: 'Bench Press', // MUST ALWAYS remain English
    muscleGroup: 'Chest',
    category: 'Strength',
    equipment: 'Barbell & Bench',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 90,
    targetWeightLbs: 135,
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    instructions: {
      en: [
        'Lie flat on bench with eyes directly under the bar.',
        'Grip bar with hands slightly wider than shoulder width.',
        'Plant feet firmly into the floor, engage core, and retract scapulae.',
        'Lower bar with control to mid-chest, keeping elbows at 45-75 degrees.',
        'Press upwards explosively while driving through your feet.'
      ],
      ar: [
        'استلقِ على المقعد بحيث تكون العينان تحت البار مباشرة.',
        'امسك البار بقبضة أوسع قليلاً من عرض الكتفين.',
        'ثبت القدمين بإحكام على الأرض وشد عضلات البطن واللوحين.',
        'انزل بالبار بتحكم حتى منتصف الصدر مع الحفاظ على زاوية الكوعين.',
        'ادفع للأعلى بقوة وثبات مع الدفع بالقدمين.'
      ]
    }
  },
  {
    id: 'ex_lat_pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    category: 'Hypertrophy',
    equipment: 'Cable Machine',
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 75,
    targetWeightLbs: 120,
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    instructions: {
      en: [
        'Adjust thigh pads so your legs are locked securely.',
        'Grasp bar with an overhand grip wider than shoulders.',
        'Lean back slightly (10-15 degrees) and pull bar down to upper chest.',
        'Squeeze lats hard at bottom, pause for 1 second.',
        'Control the bar on the way back up to full stretch.'
      ],
      ar: [
        'اضبط مسند الفخذين لتثبيت الرجلين بإحكام.',
        'امسك المقبض بقبضة أوسع من الكتفين.',
        'مل للخلف قليلاً (10-15 درجة) واسحب البار لأسفل حتى أعلى الصدر.',
        'اضغط عضلات الظهر الجانبية بقوة لمدة ثانية في الأسفل.',
        'اصعد ببطء مع التحكم الكامل حتى التمدد الكامل.'
      ]
    }
  },
  {
    id: 'ex_shoulder_press',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    category: 'Strength',
    equipment: 'Dumbbells & Bench',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    defaultSets: 3,
    defaultReps: '8-10',
    defaultRestSec: 90,
    targetWeightLbs: 50,
    thumbnail: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
    instructions: {
      en: [
        'Sit on an upright bench with dumbbells at shoulder height, palms facing forward.',
        'Keep core braced and spine neutral against backrest.',
        'Press weights overhead smoothly until arms are extended without locking elbows.',
        'Lower weights back to ear level with a 2-second tempo.'
      ],
      ar: [
        'اجلس على المقعد المستوي مع حمل الدامبلز عند مستوى الكتفين.',
        'حافظ على استقامة العمود الفقري وشد البطن.',
        'ادفع الأوزان لأعلى بسلاسة دون قفل مفصل الكوع.',
        'انزل بالأوزان بتحكم حتى مستوى الأذنين خلال ثانيتين.'
      ]
    }
  },
  {
    id: 'ex_barbell_squat',
    name: 'Barbell Squat',
    muscleGroup: 'Legs',
    category: 'Strength',
    equipment: 'Squat Rack & Barbell',
    difficulty: 'Advanced',
    videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    defaultSets: 4,
    defaultReps: '6-8',
    defaultRestSec: 120,
    targetWeightLbs: 185,
    thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop&q=80',
    instructions: {
      en: [
        'Rest bar across upper traps and unrack with feet shoulder-width apart.',
        'Take deep diaphragmatic breath, brace core 360 degrees.',
        'Descend by breaking at hips and knees until thighs are parallel to ground.',
        'Drive through midfoot to stand back up powerfully.'
      ],
      ar: [
        'ضع البار على عضلات الترابيس العلوية وقف بعرض الكتفين.',
        'خذ نفساً عميقاً وشد عضلات الجذع بالكامل.',
        'انزل بثني الورك والركبتين حتى يوازي الفخذ الأرض.',
        'ادفع بمنتصف القدم للوقوف بقوة واستقامة.'
      ]
    }
  },
  {
    id: 'ex_romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    muscleGroup: 'Legs',
    category: 'Strength',
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    defaultSets: 3,
    defaultReps: '10-12',
    defaultRestSec: 90,
    targetWeightLbs: 155,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    instructions: {
      en: [
        'Stand holding barbell with overhand grip at hip level.',
        'Slightly bend knees and hinge backward at hips with flat back.',
        'Lower bar along shins until you feel deep hamstring stretch.',
        'Drive hips forward and squeeze glutes to return to start.'
      ],
      ar: [
        'قف حاملاً البار بقبضة يد علوية عند مستوى الحوض.',
        'اثنِ الركبتين قليلاً وادفع الورك للخلف مع ظهر مستقيم تماماً.',
        'انزل بالبار بمحاذاة الساق حتى تشعر بتمدد عضلات الفخذ الخلفية.',
        'ادفع الحوض للأمام واضغط عضلات المؤخرة للعودة للبداية.'
      ]
    }
  }
];

export const mockExercisePerformanceHistory: import('../types').ExercisePerformanceLog[] = [
  {
    id: 'perf_bench_1',
    clientId: 'user_mahmoud_1',
    workoutDate: '2026-10-24',
    workoutTitle: 'Workout A',
    exerciseId: 'ex_bench_press',
    exerciseName: 'Barbell Flat Bench Press',
    sets: [
      { setNumber: 1, weightKg: 80, repsCompleted: 10, isCompleted: true },
      { setNumber: 2, weightKg: 80, repsCompleted: 9, isCompleted: true },
      { setNumber: 3, weightKg: 77.5, repsCompleted: 8, isCompleted: true }
    ],
    clientNote: 'Last set was very difficult on the final 2 reps.',
    trainerNote: 'Control the descent and pause 1 sec on the chest.',
    previousPerformance: {
      date: '2026-10-18',
      sets: [
        { setNumber: 1, weightKg: 75, repsCompleted: 10 },
        { setNumber: 2, weightKg: 75, repsCompleted: 10 },
        { setNumber: 3, weightKg: 72.5, repsCompleted: 9 }
      ]
    }
  },
  {
    id: 'perf_lat_1',
    clientId: 'user_mahmoud_1',
    workoutDate: '2026-10-24',
    workoutTitle: 'Workout B',
    exerciseId: 'ex_lat_pulldown',
    exerciseName: 'Wide-Grip Lat Pulldown',
    sets: [
      { setNumber: 1, weightKg: 55, repsCompleted: 12, isCompleted: true },
      { setNumber: 2, weightKg: 55, repsCompleted: 11, isCompleted: true },
      { setNumber: 3, weightKg: 50, repsCompleted: 10, isCompleted: true }
    ],
    clientNote: 'Felt great mind-muscle connection in upper lats.',
    trainerNote: 'Lead with elbows and avoid leaning back excessively.',
    previousPerformance: {
      date: '2026-10-17',
      sets: [
        { setNumber: 1, weightKg: 50, repsCompleted: 12 },
        { setNumber: 2, weightKg: 50, repsCompleted: 12 },
        { setNumber: 3, weightKg: 45, repsCompleted: 11 }
      ]
    }
  },
  {
    id: 'perf_squat_1',
    clientId: 'user_mahmoud_1',
    workoutDate: '2026-10-22',
    workoutTitle: 'Workout C',
    exerciseId: 'ex_barbell_squat',
    exerciseName: 'Barbell Back Squat',
    sets: [
      { setNumber: 1, weightKg: 95, repsCompleted: 8, isCompleted: true },
      { setNumber: 2, weightKg: 95, repsCompleted: 8, isCompleted: true },
      { setNumber: 3, weightKg: 92.5, repsCompleted: 7, isCompleted: true },
      { setNumber: 4, weightKg: 90, repsCompleted: 7, isCompleted: true }
    ],
    clientNote: 'Depth was solid on all reps.',
    trainerNote: 'Drive through mid-foot and brace tight.',
    previousPerformance: {
      date: '2026-10-15',
      sets: [
        { setNumber: 1, weightKg: 90, repsCompleted: 8 },
        { setNumber: 2, weightKg: 90, repsCompleted: 8 },
        { setNumber: 3, weightKg: 85, repsCompleted: 8 },
        { setNumber: 4, weightKg: 85, repsCompleted: 8 }
      ]
    }
  }
];

export const weeklyWorkoutProgram: WorkoutDay[] = [
  {
    id: 'day_mon_12',
    dayOfWeek: 1,
    dayName: { en: 'Mon', ar: 'الإثنين' },
    dayNumber: 12,
    title: { en: 'Workout A', ar: 'Workout A' },
    durationMin: 55,
    caloriesBurn: 420,
    completed: true,
    exercises: [
      {
        exerciseId: 'ex_bench_press',
        exerciseName: 'Barbell Flat Bench Press',
        muscleGroup: 'Chest',
        sets: 3,
        reps: '8-10',
        restSec: 90,
        tempo: '2-0-1-0',
        trainerNote: 'Keep elbows tucked at 45 degrees, full extension at the top.',
        clientNote: 'Felt strong on all sets.',
        isCompleted: true,
        loggedSets: [
          { setNumber: 1, weightKg: 80, repsCompleted: 10, isCompleted: true },
          { setNumber: 2, weightKg: 80, repsCompleted: 9, isCompleted: true },
          { setNumber: 3, weightKg: 77.5, repsCompleted: 8, isCompleted: true }
        ]
      }
    ]
  },
  {
    id: 'day_tue_13',
    dayOfWeek: 2,
    dayName: { en: 'Tue', ar: 'الثلاثاء' },
    dayNumber: 13,
    title: { en: 'Workout B', ar: 'Workout B' },
    durationMin: 50,
    caloriesBurn: 400,
    completed: true,
    exercises: [
      {
        exerciseId: 'ex_lat_pulldown',
        exerciseName: 'Wide-Grip Lat Pulldown',
        muscleGroup: 'Back',
        sets: 3,
        reps: '10-12',
        restSec: 75,
        tempo: '2-1-1-0',
        trainerNote: 'Pull to clavicle level, squeeze scapula.',
        isCompleted: true,
        loggedSets: [
          { setNumber: 1, weightKg: 55, repsCompleted: 12, isCompleted: true },
          { setNumber: 2, weightKg: 55, repsCompleted: 11, isCompleted: true },
          { setNumber: 3, weightKg: 50, repsCompleted: 10, isCompleted: true }
        ]
      }
    ]
  },
  {
    id: 'day_wed_14',
    dayOfWeek: 3,
    dayName: { en: 'Wed', ar: 'الأربعاء' },
    dayNumber: 14,
    title: { en: 'Wednesday Workout', ar: 'Wednesday Workout' },
    durationMin: 60,
    caloriesBurn: 450,
    completed: false,
    exercises: [
      {
        exerciseId: 'ex_bench_press',
        exerciseName: 'Barbell Flat Bench Press',
        muscleGroup: 'Chest',
        sets: 3,
        reps: '8-10',
        restSec: 90,
        tempo: '2-0-1-0',
        trainerNote: 'Pause 1 sec at the chest before pressing.',
        clientNote: '',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      },
      {
        exerciseId: 'ex_lat_pulldown',
        exerciseName: 'Wide-Grip Lat Pulldown',
        muscleGroup: 'Back',
        sets: 3,
        reps: '10-12',
        restSec: 75,
        tempo: '2-1-1-0',
        trainerNote: 'Strict form, no excessive body momentum.',
        clientNote: '',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      },
      {
        exerciseId: 'ex_shoulder_press',
        exerciseName: 'Dumbbell Seated Shoulder Press',
        muscleGroup: 'Shoulders',
        sets: 3,
        reps: '8-10',
        restSec: 90,
        tempo: '2-0-1-0',
        trainerNote: 'Elbows slightly forward in the scapular plane.',
        clientNote: '',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'day_thu_15',
    dayOfWeek: 4,
    dayName: { en: 'Thu', ar: 'الخميس' },
    dayNumber: 15,
    title: { en: 'Workout C', ar: 'Workout C' },
    durationMin: 60,
    caloriesBurn: 480,
    completed: false,
    exercises: [
      {
        exerciseId: 'ex_barbell_squat',
        exerciseName: 'Barbell Back Squat',
        muscleGroup: 'Legs',
        sets: 4,
        reps: '6-8',
        restSec: 120,
        tempo: '3-0-1-0',
        trainerNote: 'Hit parallel depth, knees tracking over toes.',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 4, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      },
      {
        exerciseId: 'ex_romanian_deadlift',
        exerciseName: 'Romanian Deadlift (RDL)',
        muscleGroup: 'Legs',
        sets: 3,
        reps: '10-12',
        restSec: 90,
        tempo: '3-1-1-0',
        trainerNote: 'Hinge back deeply, feel stretch in hamstrings.',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'day_fri_16',
    dayOfWeek: 5,
    dayName: { en: 'Fri', ar: 'الجمعة' },
    dayNumber: 16,
    title: { en: 'Workout D', ar: 'Workout D' },
    durationMin: 45,
    caloriesBurn: 380,
    completed: false,
    exercises: [
      {
        exerciseId: 'ex_bench_press',
        exerciseName: 'Barbell Flat Bench Press',
        muscleGroup: 'Chest',
        sets: 3,
        reps: '10-12',
        restSec: 60,
        tempo: '2-0-1-0',
        trainerNote: 'Slightly lighter load, focus on rapid contraction.',
        isCompleted: false,
        loggedSets: [
          { setNumber: 1, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 2, weightKg: undefined, repsCompleted: undefined, isCompleted: false },
          { setNumber: 3, weightKg: undefined, repsCompleted: undefined, isCompleted: false }
        ]
      }
    ]
  },
  {
    id: 'day_sat_17',
    dayOfWeek: 6,
    dayName: { en: 'Sat', ar: 'السبت' },
    dayNumber: 17,
    title: { en: 'Active Recovery', ar: 'Active Recovery' },
    durationMin: 30,
    caloriesBurn: 150,
    completed: false,
    exercises: []
  },
  {
    id: 'day_sun_18',
    dayOfWeek: 0,
    dayName: { en: 'Sun', ar: 'الأحد' },
    dayNumber: 18,
    title: { en: 'Rest Day', ar: 'Rest Day' },
    durationMin: 0,
    caloriesBurn: 0,
    completed: false,
    exercises: []
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    senderId: 'trainer_alex_1',
    senderName: 'Coach Alex Shawky',
    senderRole: 'trainer',
    recipientId: 'user_mahmoud_1',
    text: "Morning! How are the hamstrings feeling today after yesterday's RDLs?",
    timestamp: '08:15 AM',
    isRead: true
  },
  {
    id: 'msg_2',
    senderId: 'user_mahmoud_1',
    senderName: 'Mahmoud Shawky',
    senderRole: 'client',
    recipientId: 'trainer_alex_1',
    text: 'A bit sore, but manageable. Ready for upper body today.',
    timestamp: '08:22 AM',
    isRead: true
  },
  {
    id: 'msg_3',
    senderId: 'trainer_alex_1',
    senderName: 'Coach Alex Shawky',
    senderRole: 'trainer',
    recipientId: 'user_mahmoud_1',
    text: "Perfect. Let's keep the rest periods strict. Can you send over a quick form video of your first working set of bench?",
    timestamp: '08:25 AM',
    isRead: true
  },
  {
    id: 'msg_4',
    senderId: 'user_mahmoud_1',
    senderName: 'Mahmoud Shawky',
    senderRole: 'client',
    recipientId: 'trainer_alex_1',
    text: 'Form looks solid! Here is the video clip of set 1.',
    timestamp: '10:45 AM',
    isRead: true,
    mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    mediaType: 'video'
  },
  {
    id: 'msg_5',
    senderId: 'trainer_alex_1',
    senderName: 'Coach Alex Shawky',
    senderRole: 'trainer',
    recipientId: 'user_mahmoud_1',
    text: 'Form looks solid! Just focus on driving your heels into the floor and keeping wrist stacked over elbows.',
    timestamp: '10:48 AM',
    isRead: false,
    mediaUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    mediaType: 'image'
  }
];

export const mockTrainerClients: ClientOverview[] = [
  {
    id: 'user_mahmoud_1',
    name: 'Mahmoud Shawky',
    email: 'm.shawkyofficial@gmail.com',
    phone: '+971 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    activeProducts: ['full_access'],
    heightCm: 178,
    weightKg: 82.5,
    targetWeightKg: 78.0,
    goal: 'Muscle Gain',
    dailyCaloriesTarget: 2200,
    proteinTarget: 160,
    carbsTarget: 250,
    fatTarget: 70,
    currentTrainingProgramId: 'prog_ppl_mahmoud',
    currentNutritionPlanId: 'nutr_fatloss_mahmoud',
    onboardingCompleted: true,
    onboardingData: {
      age: 27,
      heightCm: 178,
      currentWeightKg: 82.5,
      goal: 'Muscle Gain',
      customGoalText: '',
      trainingLevel: 'Intermediate',
      trainingExperience: '3 years intermittent lifting and strength conditioning',
      trainingDaysPerWeek: 4,
      restDaysPerWeek: 3,
      preferredTrainingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      preferredRestDays: ['Wednesday', 'Saturday', 'Sunday'],
      availableEquipment: ['Full Gym'],
      customEquipmentText: '',
      workoutDurationMin: 60,
      preferredWorkoutTime: 'Evening (6:00 PM - 8:00 PM)',
      exercisesToAvoid: 'Behind the neck press, deep upright barbell rows',
      foodsToAvoid: 'Excessively spicy foods',
      allergies: 'Mild lactose sensitivity (avoids raw unpasteurized milk)',
      preferredFoods: 'Chicken breast, beef tenderloin, jasmine rice, sweet potatoes, whole eggs, oats, berries',
      mealsPerDay: 4,
      eatingStyle: 'Meal Prep',
      mealTimes: 'Breakfast: 8:30 AM, Lunch: 1:30 PM, Pre-workout: 5:30 PM, Dinner: 9:00 PM',
      nutritionNotes: 'Prefers high protein breakfast with whole eggs and oats.',
      hasInjuries: true,
      injuryDescription: 'Previous left rotator cuff strain (fully rehabbed, avoid painful overhead angles)',
      baselineWeightKg: 82.5,
      baselineMeasurements: {
        waistCm: 84,
        abdomenCm: 86,
        chestCm: 106,
        hipsCm: 100,
        armCm: 39,
        thighCm: 61,
        calfCm: 38,
      },
      baselinePhotos: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
      ],
      baselineNotes: 'Focused on building lean muscle with Coach Alex while improving posture and bench form.',
      completedAt: '2026-08-01T10:00:00.000Z',
    },
    statusAlert: {
      type: 'new_checkin',
      text: {
        en: 'Latest check-in reviewed • Strong consistency',
        ar: 'تمت مراجعة آخر تقرير • التزام ممتاز'
      }
    },
    lastActive: 'Just now',
    complianceScore: 98
  },
  {
    id: 'client_ahmed',
    name: 'Ahmed Hassan',
    email: 'ahmed.h@example.com',
    phone: '+971 55 987 6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    activeProducts: ['training_nutrition'],
    heightCm: 182,
    weightKg: 89.0,
    targetWeightKg: 82.0,
    goal: 'Fat Loss',
    dailyCaloriesTarget: 2400,
    proteinTarget: 180,
    carbsTarget: 260,
    fatTarget: 75,
    currentTrainingProgramId: 'prog_tmpl_upper_lower',
    currentNutritionPlanId: 'nutr_tmpl_leanbulk_2800',
    onboardingCompleted: true,
    onboardingData: {
      age: 31,
      heightCm: 182,
      currentWeightKg: 89.0,
      goal: 'Fat Loss',
      customGoalText: '',
      trainingLevel: 'Intermediate',
      trainingExperience: '2 years general fitness',
      trainingDaysPerWeek: 4,
      restDaysPerWeek: 3,
      preferredTrainingDays: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
      preferredRestDays: ['Monday', 'Wednesday', 'Saturday'],
      availableEquipment: ['Full Gym'],
      workoutDurationMin: 60,
      preferredWorkoutTime: 'Morning (7:00 AM)',
      exercisesToAvoid: 'Heavy back squats due to lower back tightness',
      foodsToAvoid: 'Fried foods, refined sugar',
      allergies: 'Tree nuts (almonds, walnuts)',
      preferredFoods: 'Salmon, white rice, greek yogurt, apples',
      mealsPerDay: 3,
      eatingStyle: 'Quick Meals',
      hasInjuries: true,
      injuryDescription: 'L4/L5 lumbar discomfort after prolonged heavy sitting/squats',
      baselineWeightKg: 91.5,
      baselineMeasurements: {
        waistCm: 94,
        abdomenCm: 97,
        chestCm: 108,
        hipsCm: 104,
        armCm: 40,
        thighCm: 64,
        calfCm: 41,
      },
      baselinePhotos: [],
      completedAt: '2026-07-15T10:00:00.000Z',
    },
    statusAlert: {
      type: 'weight_plateau',
      text: {
        en: 'Weight Plateau (3 wks)',
        ar: 'ثبات الوزن (3 أسابيع)'
      }
    },
    lastActive: '10m ago',
    complianceScore: 92
  },
  {
    id: 'client_sara',
    name: 'Sara Al-Mansouri',
    email: 'sara.m@example.com',
    phone: '+971 52 444 1122',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    activeProducts: ['training'],
    heightCm: 165,
    weightKg: 63.5,
    targetWeightKg: 58.0,
    goal: 'Fitness Improvement',
    dailyCaloriesTarget: 1750,
    proteinTarget: 130,
    carbsTarget: 180,
    fatTarget: 55,
    currentTrainingProgramId: 'prog_tmpl_fullbody',
    onboardingCompleted: true,
    onboardingData: {
      age: 26,
      heightCm: 165,
      currentWeightKg: 63.5,
      goal: 'Fitness Improvement',
      customGoalText: '',
      trainingLevel: 'Beginner',
      trainingExperience: 'Pilates and home workouts for 1 year',
      trainingDaysPerWeek: 3,
      restDaysPerWeek: 4,
      preferredTrainingDays: ['Monday', 'Wednesday', 'Saturday'],
      preferredRestDays: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
      availableEquipment: ['Dumbbells', 'Resistance Bands', 'Home Gym'],
      workoutDurationMin: 45,
      preferredWorkoutTime: 'Morning (8:30 AM)',
      exercisesToAvoid: 'None',
      foodsToAvoid: 'Shellfish',
      allergies: 'Shellfish allergy (severe)',
      preferredFoods: 'Chicken, avocado, quinoa, berries',
      mealsPerDay: 3,
      eatingStyle: 'Home Cooked',
      hasInjuries: false,
      injuryDescription: '',
      baselineWeightKg: 64.0,
      baselineMeasurements: {
        waistCm: 72,
        abdomenCm: 75,
        chestCm: 88,
        hipsCm: 96,
        armCm: 28,
        thighCm: 54,
        calfCm: 34,
      },
      baselinePhotos: [],
      completedAt: '2026-07-20T10:00:00.000Z',
    },
    statusAlert: {
      type: 'missed_workout',
      text: {
        en: 'Missed 2 workouts',
        ar: 'فوتت تمرينين'
      }
    },
    lastActive: '2h ago',
    complianceScore: 78
  },
  {
    id: 'client_mohamed',
    name: 'Mohamed Tarek',
    email: 'mohamed.t@example.com',
    phone: '+971 50 777 8899',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    activeProducts: ['full_access'],
    heightCm: 180,
    weightKg: 79.2,
    targetWeightKg: 85.0,
    goal: 'Muscle Gain',
    dailyCaloriesTarget: 2900,
    proteinTarget: 195,
    carbsTarget: 360,
    fatTarget: 75,
    currentTrainingProgramId: 'prog_tmpl_upper_lower',
    currentNutritionPlanId: 'nutr_tmpl_leanbulk_2800',
    onboardingCompleted: true,
    onboardingData: {
      age: 29,
      heightCm: 180,
      currentWeightKg: 79.2,
      goal: 'Muscle Gain',
      customGoalText: '',
      trainingLevel: 'Advanced',
      trainingExperience: '5 years bodybuilding style training',
      trainingDaysPerWeek: 5,
      restDaysPerWeek: 2,
      preferredTrainingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      preferredRestDays: ['Thursday', 'Sunday'],
      availableEquipment: ['Full Gym'],
      workoutDurationMin: 75,
      preferredWorkoutTime: 'Afternoon (4:00 PM)',
      exercisesToAvoid: 'None',
      foodsToAvoid: 'None',
      allergies: 'None',
      preferredFoods: 'Steak, eggs, white rice, pasta, bananas, whey isolate',
      mealsPerDay: 5,
      eatingStyle: 'Meal Prep',
      hasInjuries: false,
      injuryDescription: '',
      baselineWeightKg: 78.0,
      baselineMeasurements: {
        waistCm: 81,
        abdomenCm: 83,
        chestCm: 112,
        hipsCm: 99,
        armCm: 42,
        thighCm: 63,
        calfCm: 40,
      },
      baselinePhotos: [],
      completedAt: '2026-08-05T10:00:00.000Z',
    },
    statusAlert: {
      type: 'new_checkin',
      text: {
        en: 'New check-in submitted',
        ar: 'تم تقديم تسجيل دخول جديد'
      }
    },
    lastActive: 'Just now',
    complianceScore: 96
  }
];

export const initialTrainingPrograms: TrainingProgram[] = [
  {
    id: 'prog_ppl_mahmoud',
    clientId: 'user_mahmoud_1',
    title: { en: 'Push Pull Legs Hypertrophy', ar: 'برنامج دفع سحب أرجل للتضخيم' },
    description: {
      en: 'High frequency progressive overload protocol with targeted volume for chest, back and legs.',
      ar: 'نظام تدريبي عالي الكثافة مع زيادة تدريجية للأحمال لجميع عضلات الجسم.'
    },
    durationWeeks: 8,
    startDate: '2026-08-01',
    status: 'active',
    isTemplate: false,
    createdAt: '2026-08-01',
    days: weeklyWorkoutProgram
  },
  {
    id: 'prog_tmpl_upper_lower',
    clientId: undefined,
    isTemplate: true,
    title: { en: 'Upper / Lower Strength 12-Week', ar: 'برنامج قوة علوي / سفلي ١٢ أسبوع' },
    description: {
      en: 'Heavy compound movements focusing on bench, squat, deadlift, and overhead press.',
      ar: 'تمارين مركبة ثقيلة تركز على البنش، السكوات، الديدلفت والأكتاف.'
    },
    durationWeeks: 12,
    startDate: '2026-08-01',
    status: 'active',
    createdAt: '2026-07-15',
    days: weeklyWorkoutProgram
  },
  {
    id: 'prog_tmpl_fullbody',
    clientId: undefined,
    isTemplate: true,
    title: { en: 'Full Body 3-Day Functional', ar: 'برنامج كامل الجسم ٣ أيام وظيفي' },
    description: {
      en: 'Ideal for busy schedules with high efficiency metabolic resistance sessions.',
      ar: 'مثالي للجدول المزدحم مع تمارين وظيفية لرفع معدل الحرق واللياقة.'
    },
    durationWeeks: 6,
    startDate: '2026-08-01',
    status: 'active',
    createdAt: '2026-07-20',
    days: weeklyWorkoutProgram
  }
];

export const initialNutritionPlans: NutritionPlan[] = [
  {
    id: 'nutr_fatloss_mahmoud',
    clientId: 'user_mahmoud_1',
    title: { en: 'Nutrition Plan', ar: 'النظام الغذائي' },
    dailyCalories: 2200,
    proteinGrams: 160,
    carbsGrams: 250,
    fatGrams: 70,
    status: 'active',
    isTemplate: false,
    notes: 'Hydrate with at least 3.5L of water daily. Consume carb sources primarily around training window.',
    createdAt: '2026-08-01',
    meals: [
      {
        id: 'meal_1',
        name: { en: 'Meal 1: Breakfast', ar: 'الوجبة ١: الفطور' },
        timing: '08:00 AM',
        targetCalories: 550,
        targetProtein: 38,
        targetCarbs: 68,
        targetFat: 15,
        notes: 'Consume with 500ml water and multivitamin.',
        substitutions: 'Can swap oats for cream of rice (80g) or sourdough toast.',
        selectedOptionIndex: 0,
        options: [
          {
            id: 'opt_m1_1',
            name: { en: 'Power Rolled Oats & Scrambled Eggs (Option 1)', ar: 'شوفان كامل وبيض مقلي صحي (الخيار ١)' },
            sourceType: 'ai',
            notes: 'Whisk eggs with a pinch of sea salt and pepper.',
            substitutions: 'Can swap berries for 1 medium sliced banana.',
            foods: [
              {
                id: 'f_1',
                ingredientId: 'ing_oats',
                foodName: { en: 'Rolled Whole Oats', ar: 'شوفان كامل الحبة' },
                amountGrams: 80,
                calories: 304,
                protein: 10.4,
                carbs: 54.4,
                fat: 5.6
              },
              {
                id: 'f_2',
                ingredientId: 'ing_eggs',
                foodName: { en: 'Whole Eggs & Egg Whites', ar: 'بيض كامل وبياض بيض' },
                amountGrams: 150,
                calories: 160,
                protein: 20.0,
                carbs: 1.0,
                fat: 8.5
              },
              {
                id: 'f_3',
                ingredientId: 'ing_berries',
                foodName: { en: 'Blueberries & Strawberries', ar: 'توت أزرق وفراولة' },
                amountGrams: 100,
                calories: 57,
                protein: 0.7,
                carbs: 14.5,
                fat: 0.3
              }
            ],
            calories: 521,
            protein: 31.1,
            carbs: 69.9,
            fat: 14.4
          },
          {
            id: 'opt_m1_2',
            name: { en: 'Blueberry Protein Fluffy Pancakes (Option 2)', ar: 'بان كيك البروتين بالتوت الأزرق (الخيار ٢)' },
            recipeId: 'rec_protein_pancakes',
            sourceType: 'recipe',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            notes: 'High protein recipe from Shawky Recipe Book with video demonstration.',
            substitutions: 'Serve with calorie-free maple syrup.',
            foods: [
              {
                id: 'f_m1_o2_1',
                ingredientId: 'ing_oats',
                foodName: { en: 'Rolled Oats (Blended)', ar: 'شوفان مطحون' },
                amountGrams: 60,
                calories: 228,
                protein: 7.8,
                carbs: 40.8,
                fat: 4.2
              },
              {
                id: 'f_m1_o2_2',
                ingredientId: 'ing_whey_protein',
                foodName: { en: 'Whey Protein Isolate', ar: 'واي بروتين آيزوليت' },
                amountGrams: 30,
                calories: 112,
                protein: 26.4,
                carbs: 0.8,
                fat: 0.4
              },
              {
                id: 'f_m1_o2_3',
                ingredientId: 'ing_egg_whites',
                foodName: { en: 'Liquid Egg Whites', ar: 'بياض بيض سائل' },
                amountGrams: 120,
                calories: 62,
                protein: 13.1,
                carbs: 0.9,
                fat: 0.2
              },
              {
                id: 'f_m1_o2_4',
                ingredientId: 'ing_blueberries',
                foodName: { en: 'Fresh Blueberries', ar: 'توت أزرق طازج' },
                amountGrams: 80,
                calories: 46,
                protein: 0.6,
                carbs: 11.6,
                fat: 0.2
              }
            ],
            calories: 448,
            protein: 47.9,
            carbs: 54.1,
            fat: 5.0
          },
          {
            id: 'opt_m1_3',
            name: { en: 'Creamy Avocado & Poached Egg Bowl (Option 3)', ar: 'وعاء الأفوكادو والبيض المسلوق (الخيار ٣)' },
            recipeId: 'rec_avocado_egg_bowl',
            sourceType: 'recipe',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            notes: 'Healthy fats and sustained morning satiety.',
            substitutions: 'Add 1 slice sourdough toast for extra carbs if preferred.',
            foods: [
              {
                id: 'f_m1_o3_1',
                ingredientId: 'ing_eggs',
                foodName: { en: 'Poached Farm Eggs', ar: 'بيض مسلوق' },
                amountGrams: 120,
                calories: 172,
                protein: 15.1,
                carbs: 0.8,
                fat: 11.4
              },
              {
                id: 'f_m1_o3_2',
                ingredientId: 'ing_avocado',
                foodName: { en: 'Fresh Sliced Avocado', ar: 'أفوكادو طازج' },
                amountGrams: 70,
                calories: 112,
                protein: 1.4,
                carbs: 6.0,
                fat: 10.2
              },
              {
                id: 'f_m1_o3_3',
                ingredientId: 'ing_oats',
                foodName: { en: 'Side Warm Cinnamon Oats', ar: 'شوفان دافئ بالقرفة جانبي' },
                amountGrams: 50,
                calories: 190,
                protein: 6.5,
                carbs: 34.0,
                fat: 3.5
              }
            ],
            calories: 474,
            protein: 23.0,
            carbs: 40.8,
            fat: 25.1
          }
        ],
        foods: [
          {
            id: 'f_1',
            ingredientId: 'ing_oats',
            foodName: { en: 'Rolled Whole Oats', ar: 'شوفان كامل الحبة' },
            amountGrams: 80,
            calories: 304,
            protein: 10.4,
            carbs: 54.4,
            fat: 5.6
          },
          {
            id: 'f_2',
            ingredientId: 'ing_eggs',
            foodName: { en: 'Whole Eggs & Egg Whites', ar: 'بيض كامل وبياض بيض' },
            amountGrams: 150,
            calories: 160,
            protein: 20.0,
            carbs: 1.0,
            fat: 8.5
          },
          {
            id: 'f_3',
            ingredientId: 'ing_berries',
            foodName: { en: 'Blueberries & Strawberries', ar: 'توت أزرق وفراولة' },
            amountGrams: 100,
            calories: 57,
            protein: 0.7,
            carbs: 14.5,
            fat: 0.3
          }
        ]
      },
      {
        id: 'meal_2',
        name: { en: 'Meal 2: Lunch', ar: 'الوجبة ٢: الغداء' },
        timing: '01:30 PM',
        targetCalories: 650,
        targetProtein: 55,
        targetCarbs: 65,
        targetFat: 18,
        notes: 'Grill chicken with paprika, garlic powder, and Himalayan pink salt.',
        substitutions: 'Can substitute chicken breast with 95% extra-lean ground beef (200g).',
        selectedOptionIndex: 0,
        options: [
          {
            id: 'opt_m2_1',
            name: { en: 'Grilled Chicken & Steamed Jasmine Rice (Option 1)', ar: 'صدر دجاج مشوي وأرز ياسمين (الخيار ١)' },
            sourceType: 'ai',
            notes: 'Season with oregano, paprika, and light salt.',
            substitutions: 'Can swap rice for baked potato or quinoa.',
            foods: [
              {
                id: 'f_4',
                ingredientId: 'ing_chicken_breast',
                foodName: { en: 'Skinless Chicken Breast', ar: 'صدر دجاج منزوع الجلد' },
                amountGrams: 200,
                calories: 330,
                protein: 62.0,
                carbs: 0.0,
                fat: 7.2
              },
              {
                id: 'f_5',
                ingredientId: 'ing_rice',
                foodName: { en: 'Steamed Jasmine Rice', ar: 'أرز ياسمين مطبوخ' },
                amountGrams: 220,
                calories: 286,
                protein: 5.5,
                carbs: 63.8,
                fat: 0.6
              },
              {
                id: 'f_6',
                ingredientId: 'ing_olive_oil',
                foodName: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' },
                amountGrams: 10,
                calories: 88,
                protein: 0.0,
                carbs: 0.0,
                fat: 10.0
              }
            ],
            calories: 704,
            protein: 67.5,
            carbs: 63.8,
            fat: 17.8
          },
          {
            id: 'opt_m2_2',
            name: { en: 'Miso Glazed Salmon Bowl (Option 2)', ar: 'وعاء السلمون بصلصة الميسو (الخيار ٢)' },
            recipeId: 'rec_miso_salmon',
            sourceType: 'recipe',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            notes: 'Rich in anti-inflammatory Omega-3 fatty acids.',
            substitutions: 'Swap quinoa for jasmine rice if preferred.',
            foods: [
              {
                id: 'f_m2_o2_1',
                ingredientId: 'ing_salmon',
                foodName: { en: 'Fresh Atlantic Salmon', ar: 'سلمون أطلسي طازج' },
                amountGrams: 180,
                calories: 374,
                protein: 36.7,
                carbs: 0.0,
                fat: 24.1
              },
              {
                id: 'f_m2_o2_2',
                ingredientId: 'ing_quinoa',
                foodName: { en: 'Cooked Quinoa', ar: 'كينوا مطبوخة' },
                amountGrams: 160,
                calories: 192,
                protein: 7.0,
                carbs: 34.1,
                fat: 3.0
              },
              {
                id: 'f_m2_o2_3',
                ingredientId: 'ing_edamame',
                foodName: { en: 'Steamed Edamame', ar: 'إدامامي مسلوق' },
                amountGrams: 60,
                calories: 73,
                protein: 7.1,
                carbs: 5.3,
                fat: 3.1
              }
            ],
            calories: 639,
            protein: 50.8,
            carbs: 39.4,
            fat: 30.2
          },
          {
            id: 'opt_m2_3',
            name: { en: 'Lean Flank Steak & Baked Potato (Option 3)', ar: 'ستيك اللحم قليل الدهن وبطاطا مشوية (الخيار ٣)' },
            sourceType: 'ai',
            notes: 'Iron and zinc rich for testosterone and strength maintenance.',
            substitutions: 'Can swap flank steak for 95% lean ground beef.',
            foods: [
              {
                id: 'f_m2_o3_1',
                ingredientId: 'ing_chicken_breast',
                foodName: { en: 'Extra Lean Beef / Flank', ar: 'لحم بقري صافي مشوي' },
                amountGrams: 190,
                calories: 320,
                protein: 52.0,
                carbs: 0.0,
                fat: 11.0
              },
              {
                id: 'f_m2_o3_2',
                ingredientId: 'ing_sweet_potato',
                foodName: { en: 'Baked Russet Potato', ar: 'بطاطا مشوية بالفرن' },
                amountGrams: 240,
                calories: 216,
                protein: 4.8,
                carbs: 49.0,
                fat: 0.2
              },
              {
                id: 'f_m2_o3_3',
                ingredientId: 'ing_green_salad',
                foodName: { en: 'Arugula & Lemon Salad', ar: 'سلطة جرجير وليمون' },
                amountGrams: 100,
                calories: 25,
                protein: 2.0,
                carbs: 3.5,
                fat: 0.4
              }
            ],
            calories: 561,
            protein: 58.8,
            carbs: 52.5,
            fat: 11.6
          }
        ],
        foods: [
          {
            id: 'f_4',
            ingredientId: 'ing_chicken_breast',
            foodName: { en: 'Skinless Chicken Breast', ar: 'صدر دجاج منزوع الجلد' },
            amountGrams: 200,
            calories: 330,
            protein: 62.0,
            carbs: 0.0,
            fat: 7.2
          },
          {
            id: 'f_5',
            ingredientId: 'ing_rice',
            foodName: { en: 'Steamed Jasmine Rice', ar: 'أرز ياسمين مطبوخ' },
            amountGrams: 220,
            calories: 286,
            protein: 5.5,
            carbs: 63.8,
            fat: 0.6
          },
          {
            id: 'f_6',
            ingredientId: 'ing_olive_oil',
            foodName: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' },
            amountGrams: 10,
            calories: 88,
            protein: 0.0,
            carbs: 0.0,
            fat: 10.0
          }
        ]
      },
      {
        id: 'meal_3',
        name: { en: 'Meal 3: Pre-Workout Fuel', ar: 'الوجبة ٣: وجبة قبل التمرين' },
        timing: '05:00 PM',
        targetCalories: 380,
        targetProtein: 32,
        targetCarbs: 38,
        targetFat: 12,
        notes: 'Take 60 to 90 minutes before your workout session.',
        substitutions: 'Can swap rice cakes for 1 medium banana + 1 slice sourdough toast.',
        selectedOptionIndex: 0,
        options: [
          {
            id: 'opt_m3_1',
            name: { en: 'Brown Rice Cakes, Peanut Butter & Whey Shake (Option 1)', ar: 'كعك أرز أسمر مع زبدة الفول وشيك واي (الخيار ١)' },
            sourceType: 'ai',
            notes: 'Fast digesting carbs paired with pure isolate protein.',
            substitutions: 'Swap peanut butter for almond butter.',
            foods: [
              {
                id: 'f_7',
                ingredientId: 'ing_rice_cakes',
                foodName: { en: 'Brown Rice Cakes', ar: 'كعك أرز أسمر' },
                amountGrams: 30,
                calories: 116,
                protein: 2.4,
                carbs: 25.0,
                fat: 0.8
              },
              {
                id: 'f_8',
                ingredientId: 'ing_peanut_butter',
                foodName: { en: 'Natural Peanut Butter', ar: 'زبدة فول سوداني طبيعية' },
                amountGrams: 20,
                calories: 118,
                protein: 5.0,
                carbs: 4.0,
                fat: 10.0
              },
              {
                id: 'f_9',
                ingredientId: 'ing_whey',
                foodName: { en: '100% Whey Isolate Shake', ar: 'مخفوق واي بروتين آيزوليت' },
                amountGrams: 30,
                calories: 120,
                protein: 25.0,
                carbs: 2.0,
                fat: 1.0
              }
            ],
            calories: 354,
            protein: 32.4,
            carbs: 31.0,
            fat: 11.8
          },
          {
            id: 'opt_m3_2',
            name: { en: 'Greek Yogurt, Honey & Sliced Banana Bowl (Option 2)', ar: 'زبادي يوناني بالعسل وشرائح الموز (الخيار ٢)' },
            sourceType: 'ai',
            notes: 'Instant glycogen boost from fruit and honey.',
            substitutions: 'Add 1 scoop protein powder for +25g protein.',
            foods: [
              {
                id: 'f_m3_o2_1',
                ingredientId: 'ing_greek_yogurt',
                foodName: { en: '0% Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' },
                amountGrams: 200,
                calories: 118,
                protein: 20.6,
                carbs: 7.2,
                fat: 0.8
              },
              {
                id: 'f_m3_o2_2',
                ingredientId: 'ing_honey',
                foodName: { en: 'Raw Organic Honey', ar: 'عسل نحل طبيعي' },
                amountGrams: 15,
                calories: 46,
                protein: 0.1,
                carbs: 12.4,
                fat: 0.0
              },
              {
                id: 'f_m3_o2_3',
                ingredientId: 'ing_rice_cakes',
                foodName: { en: 'Rice Cakes (Crispy)', ar: 'كعك أرز مقرمش' },
                amountGrams: 25,
                calories: 97,
                protein: 2.0,
                carbs: 20.8,
                fat: 0.7
              },
              {
                id: 'f_m3_o2_4',
                ingredientId: 'ing_whey_protein',
                foodName: { en: 'Vanilla Whey Boost', ar: 'واي بروتين فانيليا' },
                amountGrams: 15,
                calories: 56,
                protein: 13.2,
                carbs: 0.4,
                fat: 0.2
              }
            ],
            calories: 317,
            protein: 35.9,
            carbs: 40.8,
            fat: 1.7
          },
          {
            id: 'opt_m3_3',
            name: { en: 'Sourdough Toast with Turkey Breast & Jam (Option 3)', ar: 'توست الحبوب الكاملة مع صدر الحبش ومربى (الخيار ٣)' },
            sourceType: 'ai',
            notes: 'Low fat pre-workout fuel for immediate energy.',
            substitutions: 'Can use 1 whole bagel instead of 2 toast slices.',
            foods: [
              {
                id: 'f_m3_o3_1',
                ingredientId: 'ing_chicken_breast',
                foodName: { en: 'Smoked Turkey Breast Slices', ar: 'شرائح صدر حبش مدخن' },
                amountGrams: 120,
                calories: 132,
                protein: 26.0,
                carbs: 1.5,
                fat: 2.0
              },
              {
                id: 'f_m3_o3_2',
                ingredientId: 'ing_rice_cakes',
                foodName: { en: 'Whole Grain Sourdough / Cakes', ar: 'توست حبوب كاملة' },
                amountGrams: 60,
                calories: 160,
                protein: 6.0,
                carbs: 32.0,
                fat: 1.2
              },
              {
                id: 'f_m3_o3_3',
                ingredientId: 'ing_berries',
                foodName: { en: 'Strawberry Puree Spread', ar: 'مربى فراولة طبيعي' },
                amountGrams: 20,
                calories: 38,
                protein: 0.2,
                carbs: 9.2,
                fat: 0.1
              }
            ],
            calories: 330,
            protein: 32.2,
            carbs: 42.7,
            fat: 3.3
          }
        ],
        foods: [
          {
            id: 'f_7',
            ingredientId: 'ing_rice_cakes',
            foodName: { en: 'Brown Rice Cakes', ar: 'كعك أرز أسمر' },
            amountGrams: 30,
            calories: 116,
            protein: 2.4,
            carbs: 25.0,
            fat: 0.8
          },
          {
            id: 'f_8',
            ingredientId: 'ing_peanut_butter',
            foodName: { en: 'Natural Peanut Butter', ar: 'زبدة فول سوداني طبيعية' },
            amountGrams: 20,
            calories: 118,
            protein: 5.0,
            carbs: 4.0,
            fat: 10.0
          },
          {
            id: 'f_9',
            ingredientId: 'ing_whey',
            foodName: { en: '100% Whey Isolate Shake', ar: 'مخفوق واي بروتين آيزوليت' },
            amountGrams: 30,
            calories: 120,
            protein: 25.0,
            carbs: 2.0,
            fat: 1.0
          }
        ]
      },
      {
        id: 'meal_4',
        name: { en: 'Meal 4: Dinner (Recovery)', ar: 'الوجبة ٤: العشاء (الاستشفاء)' },
        timing: '08:30 PM',
        targetCalories: 600,
        targetProtein: 42,
        targetCarbs: 50,
        targetFat: 25,
        notes: 'Rich in essential Omega-3 fatty acids for reduced inflammation and optimal recovery.',
        substitutions: 'Can substitute salmon with Sea Bass (220g) + 15g raw almonds.',
        selectedOptionIndex: 0,
        options: [
          {
            id: 'opt_m4_1',
            name: { en: 'Atlantic Salmon & Baked Sweet Potato (Option 1)', ar: 'سلمون أطلسي وبطاطا حلوة مشوية (الخيار ١)' },
            sourceType: 'ai',
            notes: 'High in Omega-3 fatty acids and slow-digesting complex carbohydrates.',
            substitutions: 'Can swap sweet potato for steamed white rice or roasted baby potatoes.',
            foods: [
              {
                id: 'f_10',
                ingredientId: 'ing_salmon',
                foodName: { en: 'Fresh Atlantic Salmon', ar: 'سلمون أطلسي طازج' },
                amountGrams: 180,
                calories: 374,
                protein: 36.7,
                carbs: 0.0,
                fat: 24.1
              },
              {
                id: 'f_11',
                ingredientId: 'ing_sweet_potato',
                foodName: { en: 'Baked Sweet Potato', ar: 'بطاطا حلوة مشوية' },
                amountGrams: 200,
                calories: 172,
                protein: 3.2,
                carbs: 40.2,
                fat: 0.2
              },
              {
                id: 'f_12',
                ingredientId: 'ing_green_salad',
                foodName: { en: 'Mixed Green Salad & Lemon', ar: 'سلطة خضراء مشكلة مع ليمون' },
                amountGrams: 150,
                calories: 45,
                protein: 1.8,
                carbs: 7.0,
                fat: 0.5
              }
            ],
            calories: 591,
            protein: 41.7,
            carbs: 47.2,
            fat: 24.8
          },
          {
            id: 'opt_m4_2',
            name: { en: 'Charred Flank Steak & Roasted Sweet Potato (Option 2)', ar: 'ستيك اللحم المشوي مع البطاطا الحلوة (الخيار ٢)' },
            recipeId: 'rec_steak_sweet_potato',
            sourceType: 'recipe',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            notes: 'From Shawky Recipe Library with full video guide.',
            substitutions: 'Cook with extra virgin olive oil.',
            foods: [
              {
                id: 'f_m4_o2_1',
                ingredientId: 'ing_chicken_breast',
                foodName: { en: 'Charred Flank Steak', ar: 'ستيك لحم مشوي' },
                amountGrams: 180,
                calories: 310,
                protein: 48.0,
                carbs: 0.0,
                fat: 12.0
              },
              {
                id: 'f_m4_o2_2',
                ingredientId: 'ing_sweet_potato',
                foodName: { en: 'Roasted Sweet Potato Cubes', ar: 'مكعبات بطاطا حلوة مشوية' },
                amountGrams: 180,
                calories: 155,
                protein: 2.9,
                carbs: 36.2,
                fat: 0.2
              },
              {
                id: 'f_m4_o2_3',
                ingredientId: 'ing_olive_oil',
                foodName: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر' },
                amountGrams: 8,
                calories: 70,
                protein: 0.0,
                carbs: 0.0,
                fat: 8.0
              }
            ],
            calories: 535,
            protein: 50.9,
            carbs: 36.2,
            fat: 20.2
          },
          {
            id: 'opt_m4_3',
            name: { en: 'White Fish (Sea Bass) with Quinoa & Olive Oil (Option 3)', ar: 'سمك القاروص المشوي مع الكينوا وزيت الزيتون (الخيار ٣)' },
            sourceType: 'ai',
            notes: 'Ultra lean protein option with light digestion for deep sleep.',
            substitutions: 'Can substitute sea bass for cod or sea bream.',
            foods: [
              {
                id: 'f_m4_o3_1',
                ingredientId: 'ing_salmon',
                foodName: { en: 'Wild Sea Bass / White Fish', ar: 'فيليه سمك قاروص أبيض' },
                amountGrams: 220,
                calories: 264,
                protein: 46.0,
                carbs: 0.0,
                fat: 6.0
              },
              {
                id: 'f_m4_o3_2',
                ingredientId: 'ing_quinoa',
                foodName: { en: 'Fluffy Steamed Quinoa', ar: 'كينوا مطبوخة' },
                amountGrams: 180,
                calories: 216,
                protein: 7.9,
                carbs: 38.3,
                fat: 3.4
              },
              {
                id: 'f_m4_o3_3',
                ingredientId: 'ing_olive_oil',
                foodName: { en: 'Garlic Herb Olive Oil Drizzle', ar: 'زيت زيتون بالثوم والأعشاب' },
                amountGrams: 12,
                calories: 105,
                protein: 0.0,
                carbs: 0.0,
                fat: 12.0
              }
            ],
            calories: 585,
            protein: 53.9,
            carbs: 38.3,
            fat: 21.4
          }
        ],
        foods: [
          {
            id: 'f_10',
            ingredientId: 'ing_salmon',
            foodName: { en: 'Fresh Atlantic Salmon', ar: 'سلمون أطلسي طازج' },
            amountGrams: 180,
            calories: 374,
            protein: 36.7,
            carbs: 0.0,
            fat: 24.1
          },
          {
            id: 'f_11',
            ingredientId: 'ing_sweet_potato',
            foodName: { en: 'Baked Sweet Potato', ar: 'بطاطا حلوة مشوية' },
            amountGrams: 200,
            calories: 172,
            protein: 3.2,
            carbs: 40.2,
            fat: 0.2
          },
          {
            id: 'f_12',
            ingredientId: 'ing_green_salad',
            foodName: { en: 'Mixed Green Salad & Lemon', ar: 'سلطة خضراء مشكلة مع ليمون' },
            amountGrams: 150,
            calories: 45,
            protein: 1.8,
            carbs: 7.0,
            fat: 0.5
          }
        ]
      }
    ]
  },
  {
    id: 'nutr_tmpl_leanbulk_2800',
    clientId: undefined,
    isTemplate: true,
    title: { en: 'Lean Bulking Protocol (2800 kcal)', ar: 'بروتوكول التضخيم النظيف (٢٨٠٠ سعرة)' },
    dailyCalories: 2800,
    proteinGrams: 190,
    carbsGrams: 350,
    fatGrams: 75,
    status: 'active',
    notes: 'Focus on calorie surplus without excess body fat gain. 4 meals with 3 options per meal.',
    createdAt: '2026-07-25',
    meals: []
  },
  {
    id: 'nutr_tmpl_aggressive_cut',
    clientId: undefined,
    isTemplate: true,
    title: { en: 'Aggressive Cut 1900 kcal', ar: 'تنشيف سريع ١٩٠٠ سعرة' },
    dailyCalories: 1900,
    proteinGrams: 175,
    carbsGrams: 180,
    fatGrams: 50,
    status: 'active',
    notes: 'Deficit plan with high protein retention. 4 meals with 3 options per meal.',
    createdAt: '2026-07-28',
    meals: []
  }
];


export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: 'act_1',
    clientId: 'client_karim',
    clientName: 'Karim',
    type: 'workout_completed',
    title: {
      en: 'Karim finished Upper Body Power',
      ar: 'كريم أنهى تمرين قوة الجزء العلوي'
    },
    detail: {
      en: '6 exercises completed • 450 kcal burned',
      ar: 'أكمل ٦ تمارين • أحرق ٤٥٠ سعرة'
    },
    timeAgo: {
      en: '2 hours ago',
      ar: 'منذ ساعتين'
    },
    icon: 'fitness_center',
    colorType: 'primary'
  },
  {
    id: 'act_2',
    clientId: 'client_layla',
    clientName: 'Layla',
    type: 'message_sent',
    title: {
      en: 'Layla sent a new message',
      ar: 'ليلى أرسلت رسالة جديدة'
    },
    detail: {
      en: 'Question about pre-workout snack timing',
      ar: 'استفسار عن موعد وجبة ما قبل التمرين'
    },
    timeAgo: {
      en: '4 hours ago',
      ar: 'منذ 4 ساعات'
    },
    icon: 'chat_bubble',
    colorType: 'secondary'
  },
  {
    id: 'act_3',
    clientId: 'client_tarek',
    clientName: 'Tarek',
    type: 'pr_achieved',
    title: {
      en: 'Tarek achieved a new PR: Deadlift 140kg',
      ar: 'طارق حقق رقماً قياسياً جديداً: الرفعة المميتة 140 كجم'
    },
    detail: {
      en: '+10kg increase over last cycle',
      ar: 'زيادة ١٠ كجم عن الأسبوع الماضي'
    },
    timeAgo: {
      en: 'Yesterday',
      ar: 'أمس'
    },
    icon: 'emoji_events',
    colorType: 'tertiary'
  }
];

export const mockTrainerNotes: TrainerNote[] = [
  {
    id: 'tn_1',
    clientId: 'user_mahmoud_1',
    exerciseId: 'ex_bench_press',
    date: 'Yesterday',
    content: 'Client reported minor shoulder pinch on set 3. Advised keeping elbows tucked at 60 degrees.',
    isPrivate: false,
    authorName: 'Coach Alex'
  },
  {
    id: 'tn_2',
    clientId: 'user_mahmoud_1',
    date: 'Oct 24',
    content: 'Monitor left shoulder mobility closely. Might need to swap barbell bench press for dumbbell neutral-grip press next block if pain persists.',
    isPrivate: true, // PRIVATE TRAINER NOTE
    authorName: 'Coach Alex'
  },
  {
    id: 'tn_3',
    clientId: 'user_mahmoud_1',
    date: 'Oct 23',
    content: 'Low energy noted due to lack of sleep. Recommended increasing carbohydrates around training window.',
    isPrivate: false,
    authorName: 'Coach Alex'
  }
];

export const mockCheckIns: CheckIn[] = [
  {
    id: 'chk_1',
    clientId: 'user_mahmoud_1',
    clientName: 'Mahmoud Shawky',
    date: 'Oct 25, 2026',
    weightKg: 82.5,
    measurements: {
      waistCm: 84,
      chestCm: 106,
      hipsCm: 98,
      armsCm: 39
    },
    notes: 'Energy was high throughout the week. Hit all protein targets consistently. Sleep averaged 7.5 hours.',
    photoUrls: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'reviewed',
    trainerFeedback: 'Outstanding consistency this week Mahmoud! Waist down 1cm while strength is climbing. Keep the carb intake steady.',
    trainerFeedbackDate: 'Oct 26, 2026'
  }
];
