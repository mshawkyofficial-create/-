export type Language = 'ar' | 'en';

export type UserRole = 'client' | 'trainer';

export type ProductType = 
  | 'recipe_book' 
  | 'training' 
  | 'nutrition' 
  | 'training_nutrition' 
  | 'full_access';

export interface UserEntitlements {
  hasRecipeBook: boolean;
  hasTraining: boolean;
  hasNutrition: boolean;
  recipeBookExpires?: string;
  trainingExpires?: string;
  nutritionExpires?: string;
}

export interface AccessCode {
  code: string;
  product: ProductType;
  status: 'active' | 'used' | 'expired';
  expirationDate: string;
  assignedUser?: string;
  activationDate?: string;
}

export interface MeasurementLocation {
  id: string;
  name: { en: string; ar: string };
  defaultUnit?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  entitlements: UserEntitlements;
  activeProduct: ProductType;
  currentStreak: number;
  weightKg: number;
  targetWeightKg: number;
  dailyCaloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  currentProgramId?: string;
  currentNutritionPlanId?: string;
  onboardingCompleted?: boolean;
  onboardingData?: ClientOnboardingData;
}

export interface Exercise {
  id: string;
  name: string; // Must ALWAYS be English in both languages
  muscleGroup: string; // Primary Muscle Group
  secondaryMuscles?: string[]; // Secondary Muscle(s)
  category: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl: string; // Direct file upload or optional URL
  videoType?: 'direct_upload' | 'url';
  instructions: {
    en: string[];
    ar: string[];
  };
  trainerNotes?: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestSec: number;
  targetWeightLbs?: number;
  thumbnail?: string;
  isArchived?: boolean;
}

export interface SetLog {
  setNumber: number;
  weightKg?: number; // Empty until client enters it (KG only)
  repsCompleted?: number;
  isCompleted: boolean;
}

export interface ExercisePerformanceLog {
  id: string;
  clientId: string;
  workoutDate: string;
  workoutTitle: string;
  exerciseId: string;
  exerciseName: string; // English name
  sets: SetLog[];
  clientNote?: string;
  trainerNote?: string;
  previousPerformance?: {
    date: string;
    sets: { setNumber: number; weightKg?: number; repsCompleted?: number }[];
  };
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exerciseName?: string; // Always English
  muscleGroup?: string;
  sets: number;
  reps: string; // e.g. "8-10" or "10"
  restSec: number;
  tempo?: string;
  targetWeight?: string;
  targetRpe?: string;
  trainerNote?: string; // Prescribed by trainer
  customVideoUrl?: string;
  clientNote?: string; // Added by client
  isCompleted?: boolean;
  loggedSets?: SetLog[]; // Set-by-set actual logs (weight in kg, reps completed, completion)
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayName: { en: string; ar: string };
  dayNumber: number;
  title: { en: string; ar: string };
  durationMin: number;
  caloriesBurn: number;
  exercises: WorkoutExerciseItem[];
  completed?: boolean;
}

export interface TrainingProgram {
  id: string;
  clientId?: string; // If undefined or 'template', it is a general template
  title: { en: string; ar: string };
  description?: { en: string; ar: string };
  durationWeeks: number;
  startDate?: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  days: WorkoutDay[];
  isTemplate?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ClientMealFood {
  id: string;
  ingredientId?: string;
  foodName: { en: string; ar: string };
  amountGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit?: string;
}

export interface ClientMealOption {
  id: string;
  name: { en: string; ar: string };
  recipeId?: string;
  sourceType: 'ai' | 'recipe' | 'custom';
  videoUrl?: string;
  notes?: string;
  substitutions?: string;
  foods: ClientMealFood[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface ClientMeal {
  id: string;
  name: { en: string; ar: string };
  timing: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  notes?: string;
  substitutions?: string;
  foods: ClientMealFood[];
  options?: ClientMealOption[];
  selectedOptionIndex?: number;
  isCompleted?: boolean;
}

export interface NutritionPlan {
  id: string;
  clientId?: string;
  title: { en: string; ar: string };
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  status: 'active' | 'paused' | 'draft' | 'archived';
  meals: ClientMeal[];
  isTemplate?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Ingredient {
  id: string;
  name: { en: string; ar: string };
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultUnit: string;
}

export type NutritionMealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

export interface DailyFoodLogItem {
  id: string;
  clientId: string;
  date: string; // YYYY-MM-DD in the client's local timezone
  mealSlot: NutritionMealSlot;
  name: { en: string; ar: string };
  amountGrams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'manual' | 'plan' | 'ai';
  originalText?: string;
  loggedAt: string;
}

export interface FoodLogDraft {
  ingredientId: string;
  name: { en: string; ar: string };
  amountGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  needsClarification: boolean;
  clarificationMessage?: { en: string; ar: string };
}

export interface RecipeIngredientItem {
  ingredientId: string;
  name?: { en: string; ar: string };
  amountGrams: number;
  amount?: string;
  unit?: string;
  customNote?: { en: string; ar: string };
}

export interface Recipe {
  id: string;
  name: { en: string; ar: string } | string;
  image: string;
  imageUrl?: string;
  videoUrl?: string;
  preparationTimeMin: number;
  prepTimeMinutes?: number;
  cookTimeMin?: number;
  category?: string;
  servingSize?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  tags: string[];
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'drinks' | 'salads' | 'sandwiches' | string;
  ingredients: RecipeIngredientItem[];
  instructions: { en: string[]; ar: string[] } | string[];
  isBookmarked?: boolean;
  notes?: string;
  trainerNotes?: string;
  published?: boolean;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckIn {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  weightKg: number;
  measurements: {
    [locationId: string]: number | undefined;
    waistCm?: number;
    abdomenCm?: number;
    chestCm?: number;
    hipsCm?: number;
    armsCm?: number;
    armCm?: number;
    thighCm?: number;
    calfCm?: number;
  };
  notes: string;
  photoUrls: string[];
  status: 'pending' | 'reviewed';
  trainerFeedback?: string;
  trainerFeedbackDate?: string;
  trainerPrivateNotes?: string;
}

export interface ClientOnboardingData {
  // Step 1: About You
  age?: number;
  heightCm?: number;
  currentWeightKg?: number;
  goal?: 'Fat Loss' | 'Muscle Gain' | 'Maintenance' | 'Fitness Improvement' | 'Custom' | 'Custom Goal';
  customGoalText?: string;
  trainingLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  trainingExperience?: string;

  // Step 2: Training Preferences
  trainingDaysPerWeek?: number;
  restDaysPerWeek?: number;
  preferredTrainingDays?: string[];
  preferredRestDays?: string[];
  availableEquipment?: string[];
  customEquipmentText?: string;
  workoutDurationMin?: number;
  preferredWorkoutTime?: string;
  exercisesToAvoid?: string;

  // Step 3: Nutrition Preferences
  foodsToAvoid?: string;
  allergies?: string;
  preferredFoods?: string;
  mealsPerDay?: number;
  eatingStyle?: 'Home Cooked' | 'Quick Meals' | 'Meal Prep' | 'No Preference';
  mealTimes?: string;
  nutritionNotes?: string;

  // Step 4: Injuries / Limitations
  hasInjuries?: boolean;
  injuryDescription?: string;

  // Step 5: Baseline Progress
  baselineWeightKg?: number;
  baselineMeasurements?: {
    [locationId: string]: number | undefined;
    waistCm?: number;
    abdomenCm?: number;
    chestCm?: number;
    hipsCm?: number;
    armCm?: number;
    thighCm?: number;
    calfCm?: number;
  };
  baselinePhotos?: string[];
  baselineNotes?: string;
  completedAt?: string;

  // Legacy/Nested mappings fallback
  about?: any;
  training?: any;
  nutrition?: any;
  injuries?: any;
  baseline?: any;
}

export interface WeeklyMealPlanDay {
  dayOfWeek: number;
  dayName: { en: string; ar: string };
  meals: {
    mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    recipeId?: string;
    customName?: { en: string; ar: string };
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export interface ShoppingListItem {
  id: string;
  name: { en: string; ar: string };
  amount: number;
  unit: string;
  checked: boolean;
  category?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'trainer';
  recipientId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  replyToNote?: string;
}

export interface TrainerNote {
  id: string;
  clientId: string;
  exerciseId?: string;
  date: string;
  content: string;
  isPrivate: boolean; // Private Trainer Note vs Client Visible Note
  authorName: string;
}

export interface ActivityFeedItem {
  id: string;
  clientId: string;
  clientName: string;
  type: 'workout_completed' | 'message_sent' | 'pr_achieved' | 'checkin_submitted';
  title: { en: string; ar: string };
  detail: { en: string; ar: string };
  timeAgo: { en: string; ar: string };
  icon: string;
  colorType: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export interface RecipeBookDailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeBookLoggedItem {
  id: string;
  recipeId: string;
  recipeName: { en: string; ar: string };
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  loggedAt: string;
}

export interface RecipeBookDailyLog {
  date: string; // 'YYYY-MM-DD'
  items: RecipeBookLoggedItem[];
}

export interface ClientOverview {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  activeProducts: ProductType[];
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  goal?: string;
  dailyCaloriesTarget?: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  currentTrainingProgramId?: string;
  currentNutritionPlanId?: string;
  onboardingCompleted?: boolean;
  onboardingData?: ClientOnboardingData;
  statusAlert?: {
    type: 'weight_plateau' | 'missed_workout' | 'new_checkin';
    text: { en: string; ar: string };
  };
  lastActive: string;
  complianceScore: number;
}
