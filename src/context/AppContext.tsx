import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccessCode,
  CheckIn,
  ClientMeal,
  ClientMealFood,
  ClientMealOption,
  ClientOnboardingData,
  ClientOverview,
  DailyFoodLogItem,
  Exercise,
  ExercisePerformanceLog,
  Ingredient,
  Language,
  MeasurementLocation,
  Message,
  NutritionPlan,
  NutritionMealSlot,
  ProductType,
  Recipe,
  RecipeBookDailyLog,
  RecipeBookDailyTargets,
  RecipeBookLoggedItem,
  SetLog,
  TrainerNote,
  TrainingProgram,
  User,
  UserEntitlements,
  UserRole,
  WorkoutDay,
  WorkoutExerciseItem,
} from '../types';
import {
  defaultMeasurementLocations,
  defaultUser,
  exercisesDatabase,
  ingredientsDatabase,
  initialAccessCodes,
  initialNutritionPlans,
  initialTrainingPrograms,
  mockActivityFeed,
  mockCheckIns,
  mockExercisePerformanceHistory,
  mockMessages,
  mockRecipes,
  mockTrainerClients,
  mockTrainerNotes,
  weeklyWorkoutProgram,
} from '../data/mockData';
import { getTranslation } from '../i18n/translations';
import { calculateRecipeMacros } from '../utils/nutritionEngine';

export const SUBSCRIPTION_PAGE_URL = 'https://shawkyfit.com/coaching-plans';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: any) => string;
  
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  switchRole: () => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Entitlements & Access Codes
  accessCodes: AccessCode[];
  redeemAccessCode: (code: string) => { success: boolean; messageKey: string; product?: ProductType };
  generateAccessCode: (product: ProductType, daysValid?: number) => AccessCode;
  
  // Workouts & Performance Tracking (Client's active program)
  workoutProgram: WorkoutDay[];
  selectedDayId: string;
  setSelectedDayId: (id: string) => void;
  exercises: Exercise[];
  addCustomExercise: (exercise: Exercise) => void;
  logExerciseSet: (dayId: string, exerciseId: string, setNumber: number, weightKg: number | undefined, repsCompleted: number | undefined) => void;
  toggleSetCompletion: (dayId: string, exerciseId: string, setNumber: number) => void;
  saveExerciseNote: (dayId: string, exerciseId: string, note: string) => void;
  toggleExerciseCompletion: (dayId: string, exerciseId: string) => void;
  finishWorkout: (dayId: string, sessionNote?: string) => void;
  performanceHistory: ExercisePerformanceLog[];
  getExerciseHistory: (exerciseId: string, clientId?: string) => ExercisePerformanceLog[];
  getPreviousExercisePerformance: (exerciseId: string, clientId?: string) => ExercisePerformanceLog | undefined;
  
  // Training Programs (Trainer & Client Architecture)
  trainingPrograms: TrainingProgram[];
  createTrainingProgram: (programData: Partial<TrainingProgram>, assignToClientId?: string) => TrainingProgram;
  updateTrainingProgram: (programId: string, updates: Partial<TrainingProgram>) => void;
  assignTrainingProgramToClient: (clientId: string, programId: string) => void;
  duplicateTrainingProgram: (
    programId: string,
    options?: {
      targetClientId?: string;
      asTemplate?: boolean;
      customTitle?: { en: string; ar: string };
    }
  ) => TrainingProgram;
  duplicateTrainingProgramForClient: (programId: string, targetClientId: string) => TrainingProgram;
  deleteTrainingProgram: (programId: string) => void;
  addDayToProgram: (programId: string, day: WorkoutDay) => void;
  updateProgramDay: (programId: string, dayId: string, updates: Partial<WorkoutDay>) => void;
  deleteProgramDay: (programId: string, dayId: string) => void;
  addExerciseToDay: (programId: string, dayId: string, exerciseItem: WorkoutExerciseItem) => void;
  removeExerciseFromDay: (programId: string, dayId: string, exerciseId: string) => void;
  reorderExercisesInDay: (programId: string, dayId: string, fromIndex: number, toIndex: number) => void;
  updateExerciseInDay: (programId: string, dayId: string, exerciseId: string, updates: Partial<WorkoutExerciseItem>) => void;

  // Nutrition Plans (Trainer & Client Architecture)
  nutritionPlans: NutritionPlan[];
  activeNutritionPlan: NutritionPlan | null;
  createNutritionPlan: (planData: Partial<NutritionPlan>, assignToClientId?: string) => NutritionPlan;
  updateNutritionPlan: (planId: string, updates: Partial<NutritionPlan>) => void;
  assignNutritionPlanToClient: (clientId: string, planId: string) => void;
  duplicateNutritionPlanForClient: (planId: string, targetClientId: string) => NutritionPlan;
  deleteNutritionPlan: (planId: string) => void;
  addMealToPlan: (planId: string, meal: ClientMeal) => void;
  updateMealInPlan: (planId: string, mealId: string, updates: Partial<ClientMeal>) => void;
  deleteMealFromPlan: (planId: string, mealId: string) => void;
  addFoodToMeal: (planId: string, mealId: string, food: ClientMealFood) => void;
  removeFoodFromMeal: (planId: string, mealId: string, foodId: string) => void;
  selectClientMealOption: (planId: string, mealId: string, optionIndex: number) => void;
  updateMealOptionInPlan: (planId: string, mealId: string, optionId: string, updates: Partial<ClientMealOption>) => void;
  replaceMealOptionInPlan: (planId: string, mealId: string, optionIndex: number, newOption: ClientMealOption) => void;
  addOptionToMeal: (planId: string, mealId: string, option: ClientMealOption) => void;
  removeOptionFromMeal: (planId: string, mealId: string, optionId: string) => void;
  toggleMealCompletion: (mealId: string) => void;
  ingredients: Ingredient[];

  // Nutrition Tracking & User Targets
  consumedNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  nutritionLogDate: string;
  setNutritionLogDate: (date: string) => void;
  dailyFoodLogItems: DailyFoodLogItem[];
  logNutritionQuickAdd: (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    name?: string | { en: string; ar: string },
    mealSlot?: NutritionMealSlot,
    source?: DailyFoodLogItem['source'],
    amountGrams?: number,
    originalText?: string
  ) => void;
  removeDailyFoodLogItem: (itemId: string) => void;
  clearDailyFoodLog: () => void;
  updateUserTargets: (calories: number, protein: number, carbs: number, fat: number) => void;
  
  // Recipes
  recipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipeId: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (recipeId: string) => void;
  duplicateRecipe: (recipeId: string) => Recipe;
  archiveRecipe: (recipeId: string, archiveState?: boolean) => void;
  toggleRecipeVisibility: (recipeId: string) => void;
  toggleRecipeBookmark: (id: string) => void;

  // Recipe Book Daily Tracker (Completely independent from Trainer Nutrition Plan)
  recipeBookTargets: RecipeBookDailyTargets;
  setRecipeBookTargets: (targets: RecipeBookDailyTargets) => void;
  recipeBookLogs: Record<string, RecipeBookLoggedItem[]>;
  recipeBookTodayItems: RecipeBookLoggedItem[];
  recipeBookTodayTotals: { calories: number; protein: number; carbs: number; fat: number };
  addRecipeToTodayLog: (recipe: Recipe, servings?: number) => void;
  removeRecipeFromTodayLog: (logItemId: string) => void;
  updateRecipeLogServings: (logItemId: string, servings: number) => void;
  clearTodayRecipeLog: () => void;
  getTodayDateKey: () => string;
  
  // Messages & Check-ins
  messages: Message[];
  sendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video', recipientId?: string) => void;
  checkIns: CheckIn[];
  submitCheckIn: (checkIn: Omit<CheckIn, 'id' | 'clientId' | 'clientName' | 'status'>) => void;
  trainerReviewCheckIn: (checkInId: string, feedback: string) => void;
  
  // Measurement Locations (Defined by Trainer)
  measurementLocations: MeasurementLocation[];
  addMeasurementLocation: (name: { en: string; ar: string }) => void;
  removeMeasurementLocation: (id: string) => void;
  updateMeasurementLocation: (id: string, name: { en: string; ar: string }) => void;

  // Client Onboarding
  completeOnboarding: (data: ClientOnboardingData) => void;
  resetOnboarding: () => void;
  
  // Trainer Specific & Client Management
  clients: ClientOverview[];
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  addClient: (client: Partial<ClientOverview>) => ClientOverview;
  updateClient: (clientId: string, updates: Partial<ClientOverview>) => void;
  trainerNotes: TrainerNote[];
  addTrainerNote: (clientId: string, content: string, isPrivate: boolean, exerciseId?: string) => void;
  deleteTrainerNote: (noteId: string) => void;
  activityFeed: typeof mockActivityFeed;
  
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  logout: () => void;
  loginWithCredentials: (email: string, pass: string) => boolean;
  activateWithCode: (name: string, email: string, code: string, pass: string) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  authMode: 'login' | 'activate' | 'welcome';
  setAuthMode: (mode: 'login' | 'activate' | 'welcome') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('shawky_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const [activeRole, setActiveRole] = useState<UserRole>('client');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('shawky_auth');
    return saved === 'true' || true;
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'activate' | 'welcome'>('welcome');

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('shawky_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultUser;
  });

  const [accessCodes, setAccessCodes] = useState<AccessCode[]>(() => {
    const saved = localStorage.getItem('shawky_access_codes');
    return saved ? JSON.parse(saved) : initialAccessCodes;
  });

  // Clients state
  const [clients, setClients] = useState<ClientOverview[]>(() => {
    const saved = localStorage.getItem('shawky_clients');
    return saved ? JSON.parse(saved) : mockTrainerClients;
  });

  const [activeClientId, setActiveClientId] = useState<string>('user_mahmoud_1');

  // Training Programs State
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem('shawky_training_programs');
    return saved ? JSON.parse(saved) : initialTrainingPrograms;
  });

  // Nutrition Plans State
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(() => {
    const saved = localStorage.getItem('shawky_nutrition_plans');
    return saved ? JSON.parse(saved) : initialNutritionPlans;
  });

  // Workouts active for current client
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutDay[]>(() => {
    const saved = localStorage.getItem('shawky_workouts');
    return saved ? JSON.parse(saved) : weeklyWorkoutProgram;
  });
  const [selectedDayId, setSelectedDayId] = useState<string>('day_wed_14');

  // Exercise Database
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('shawky_exercises');
    return saved ? JSON.parse(saved) : exercisesDatabase;
  });

  // Ingredient Database
  const [ingredients] = useState<Ingredient[]>(ingredientsDatabase);

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem('shawky_recipes');
      if (saved) {
        const parsed: Recipe[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((r) => [r.id, r]));
          // Merge every recipe from mockRecipes, preserving any trainer updates (image, videoUrl, name, etc.) or client bookmarks
          const mergedMockRecipes = mockRecipes.map((mockR) => {
            const savedR = savedMap.get(mockR.id);
            if (savedR) {
              return {
                ...mockR,
                ...savedR,
                isBookmarked: savedR.isBookmarked ?? mockR.isBookmarked,
              };
            }
            return mockR;
          });
          // Also include any user/trainer created custom recipes
          const customRecipes = parsed.filter(
            (r) => !mockRecipes.some((m) => m.id === r.id)
          );
          const fullMerged = [...mergedMockRecipes, ...customRecipes];
          localStorage.setItem('shawky_recipes', JSON.stringify(fullMerged));
          return fullMerged;
        }
      }
    } catch (e) {
      console.error('Error loading recipes from localStorage', e);
    }
    localStorage.setItem('shawky_recipes', JSON.stringify(mockRecipes));
    return mockRecipes;
  });

  useEffect(() => {
    try {
      localStorage.setItem('shawky_recipes', JSON.stringify(recipes));
    } catch (e) {
      console.error('Error syncing recipes to localStorage', e);
    }
  }, [recipes]);

  // Recipe Book Daily Targets (Independent from Trainer Plan)
  const [recipeBookTargets, setRecipeBookTargetsState] = useState<RecipeBookDailyTargets>(() => {
    const saved = localStorage.getItem('shawky_recipe_book_targets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      calories: 2200,
      protein: 160,
      carbs: 250,
      fat: 70,
    };
  });

  const setRecipeBookTargets = (targets: RecipeBookDailyTargets) => {
    setRecipeBookTargetsState(targets);
    localStorage.setItem('shawky_recipe_book_targets', JSON.stringify(targets));
  };

  const getTodayDateKey = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [recipeBookLogs, setRecipeBookLogs] = useState<Record<string, RecipeBookLoggedItem[]>>(() => {
    const saved = localStorage.getItem('shawky_recipe_book_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('shawky_recipe_book_logs', JSON.stringify(recipeBookLogs));
  }, [recipeBookLogs]);

  const todayKey = getTodayDateKey();
  const recipeBookTodayItems = recipeBookLogs[todayKey] || [];

  const recipeBookTodayTotals = recipeBookTodayItems.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const addRecipeToTodayLog = (recipe: Recipe, servings = 1) => {
    const macros = calculateRecipeMacros(recipe);
    const validServings = Math.max(0.25, servings);
    const addedCals = Math.round(macros.calories * validServings);
    const addedProt = Math.round(macros.protein * validServings);
    const addedCarbs = Math.round(macros.carbs * validServings);
    const addedFat = Math.round(macros.fat * validServings);

    const newItem: RecipeBookLoggedItem = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      recipeId: recipe.id,
      recipeName: typeof recipe.name === 'string'
        ? { en: recipe.name, ar: recipe.name }
        : recipe.name,
      servings: validServings,
      calories: addedCals,
      protein: addedProt,
      carbs: addedCarbs,
      fat: addedFat,
      image: recipe.image,
      loggedAt: new Date().toISOString(),
    };

    setRecipeBookLogs((prev) => {
      const currentList = prev[todayKey] || [];
      return {
        ...prev,
        [todayKey]: [newItem, ...currentList],
      };
    });

  };

  const removeRecipeFromTodayLog = (logItemId: string) => {
    setRecipeBookLogs((prev) => {
      const currentList = prev[todayKey] || [];
      return {
        ...prev,
        [todayKey]: currentList.filter((item) => item.id !== logItemId),
      };
    });
  };

  const updateRecipeLogServings = (logItemId: string, servings: number) => {
    if (servings <= 0) {
      removeRecipeFromTodayLog(logItemId);
      return;
    }
    setRecipeBookLogs((prev) => {
      const currentList = prev[todayKey] || [];
      const updatedList = currentList.map((item) => {
        if (item.id !== logItemId) return item;
        const targetRecipe = recipes.find((r) => r.id === item.recipeId);
        let newCals = 0;
        let newProt = 0;
        let newCarbs = 0;
        let newFat = 0;
        if (targetRecipe) {
          const baseMacros = calculateRecipeMacros(targetRecipe);
          newCals = Math.round(baseMacros.calories * servings);
          newProt = Math.round(baseMacros.protein * servings);
          newCarbs = Math.round(baseMacros.carbs * servings);
          newFat = Math.round(baseMacros.fat * servings);
        } else {
          const unitFactor = item.servings > 0 ? servings / item.servings : 1;
          newCals = Math.round(item.calories * unitFactor);
          newProt = Math.round(item.protein * unitFactor);
          newCarbs = Math.round(item.carbs * unitFactor);
          newFat = Math.round(item.fat * unitFactor);
        }

        return {
          ...item,
          servings,
          calories: newCals,
          protein: newProt,
          carbs: newCarbs,
          fat: newFat,
        };
      });
      return {
        ...prev,
        [todayKey]: updatedList,
      };
    });
  };

  const clearTodayRecipeLog = () => {
    setRecipeBookLogs((prev) => {
      return {
        ...prev,
        [todayKey]: [],
      };
    });
  };

  const [nutritionLogDate, setNutritionLogDate] = useState(getTodayDateKey);
  const [dailyFoodLogs, setDailyFoodLogs] = useState<Record<string, DailyFoodLogItem[]>>(() => {
    try {
      const saved = localStorage.getItem('shawky_daily_food_logs_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('shawky_daily_food_logs_v2', JSON.stringify(dailyFoodLogs));
  }, [dailyFoodLogs]);

  const nutritionLogKey = `${user.id}:${nutritionLogDate}`;
  const dailyFoodLogItems = dailyFoodLogs[nutritionLogKey] || [];
  const consumedNutrition = dailyFoodLogItems.reduce(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: Number((total.protein + item.protein).toFixed(1)),
      carbs: Number((total.carbs + item.carbs).toFixed(1)),
      fat: Number((total.fat + item.fat).toFixed(1)),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('shawky_messages');
    return saved ? JSON.parse(saved) : mockMessages;
  });

  const [measurementLocations, setMeasurementLocations] = useState<MeasurementLocation[]>(() => {
    const saved = localStorage.getItem('shawky_measurement_locations');
    return saved ? JSON.parse(saved) : defaultMeasurementLocations;
  });

  useEffect(() => {
    localStorage.setItem('shawky_measurement_locations', JSON.stringify(measurementLocations));
  }, [measurementLocations]);

  const addMeasurementLocation = (name: { en: string; ar: string }) => {
    const newLoc: MeasurementLocation = {
      id: 'meas_' + Date.now(),
      name,
      defaultUnit: 'cm',
    };
    setMeasurementLocations((prev) => [...prev, newLoc]);
  };

  const removeMeasurementLocation = (id: string) => {
    setMeasurementLocations((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMeasurementLocation = (id: string, name: { en: string; ar: string }) => {
    setMeasurementLocations((prev) =>
      prev.map((m) => (m.id === id ? { ...m, name } : m))
    );
  };

  const completeOnboarding = (data: ClientOnboardingData) => {
    const completedAt = new Date().toISOString();
    const updatedUser: User = {
      ...user,
      onboardingCompleted: true,
      onboardingData: {
        ...data,
        completedAt,
      },
      weightKg: data.currentWeightKg || data.baselineWeightKg || user.weightKg,
      targetWeightKg: data.baselineWeightKg ? Number(data.baselineWeightKg) - 4 : user.targetWeightKg,
    };
    setUser(updatedUser);
    localStorage.setItem('shawky_user', JSON.stringify(updatedUser));

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === user.id || c.email === user.email || c.id === 'user_mahmoud_1') {
          return {
            ...c,
            onboardingCompleted: true,
            onboardingData: {
              ...data,
              completedAt,
            },
            weightKg: data.currentWeightKg || data.baselineWeightKg || c.weightKg,
            goal: data.goal === 'Custom' || data.goal === 'Custom Goal' ? data.customGoalText || 'Custom Goal' : data.goal || c.goal,
            heightCm: data.heightCm || c.heightCm,
          };
        }
        return c;
      })
    );
  };

  const resetOnboarding = () => {
    setUser((prev) => {
      const updated = {
        ...prev,
        onboardingCompleted: false,
      };
      localStorage.setItem('shawky_user', JSON.stringify(updated));
      return updated;
    });
  };

  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => {
    const saved = localStorage.getItem('shawky_checkins');
    return saved ? JSON.parse(saved) : mockCheckIns;
  });

  const [trainerNotes, setTrainerNotes] = useState<TrainerNote[]>(() => {
    const saved = localStorage.getItem('shawky_trainer_notes');
    return saved ? JSON.parse(saved) : mockTrainerNotes;
  });

  const [performanceHistory, setPerformanceHistory] = useState<ExercisePerformanceLog[]>(() => {
    const saved = localStorage.getItem('shawky_perf_history');
    return saved ? JSON.parse(saved) : mockExercisePerformanceHistory;
  });

  const [activityFeed] = useState(mockActivityFeed);

  // Sync language and DOM direction
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shawky_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('shawky_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shawky_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('shawky_access_codes', JSON.stringify(accessCodes));
  }, [accessCodes]);

  useEffect(() => {
    localStorage.setItem('shawky_training_programs', JSON.stringify(trainingPrograms));
  }, [trainingPrograms]);

  useEffect(() => {
    localStorage.setItem('shawky_nutrition_plans', JSON.stringify(nutritionPlans));
  }, [nutritionPlans]);

  useEffect(() => {
    localStorage.setItem('shawky_workouts', JSON.stringify(workoutProgram));
  }, [workoutProgram]);

  useEffect(() => {
    localStorage.setItem('shawky_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('shawky_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('shawky_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('shawky_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem('shawky_trainer_notes', JSON.stringify(trainerNotes));
  }, [trainerNotes]);

  useEffect(() => {
    localStorage.setItem('shawky_perf_history', JSON.stringify(performanceHistory));
  }, [performanceHistory]);

  // Automatic synchronization: If user is logged in as Mahmoud (or user.id), synchronize workoutProgram and nutrition targets
  useEffect(() => {
    const clientProgram = trainingPrograms.find(
      (p) => p.clientId === user.id && p.status === 'active'
    ) || trainingPrograms.find((p) => p.id === user.currentProgramId);

    if (clientProgram && clientProgram.days && clientProgram.days.length > 0) {
      setWorkoutProgram(clientProgram.days);
    }
  }, [trainingPrograms, user.id, user.currentProgramId]);

  useEffect(() => {
    const clientPlan = nutritionPlans.find(
      (p) => p.clientId === user.id && p.status === 'active'
    ) || nutritionPlans.find((p) => p.id === user.currentNutritionPlanId);

    if (clientPlan) {
      setUser((prev) => ({
        ...prev,
        dailyCaloriesTarget: clientPlan.dailyCalories,
        proteinTarget: clientPlan.proteinGrams,
        carbsTarget: clientPlan.carbsGrams,
        fatTarget: clientPlan.fatGrams,
      }));
    }
  }, [nutritionPlans, user.id, user.currentNutritionPlanId]);

  const t = (key: any) => getTranslation(key, language);

  const switchRole = () => {
    const newRole = activeRole === 'client' ? 'trainer' : 'client';
    setActiveRole(newRole);
    setActiveTab(newRole === 'trainer' ? 'dashboard' : 'home');
  };

  const redeemAccessCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    const foundIndex = accessCodes.findIndex(
      (c) => c.code.toUpperCase() === code && c.status === 'active'
    );

    if (foundIndex === -1) {
      return { success: false, messageKey: 'invalidCode' };
    }

    const matchedCode = accessCodes[foundIndex];
    const updatedCodes = [...accessCodes];
    updatedCodes[foundIndex] = {
      ...matchedCode,
      status: 'used',
      assignedUser: user.name,
      activationDate: new Date().toISOString().split('T')[0],
    };
    setAccessCodes(updatedCodes);

    // Update entitlements based on product
    const updatedEntitlements: UserEntitlements = { ...user.entitlements };
    const expiry = matchedCode.expirationDate || '2026-12-31';

    if (matchedCode.product === 'recipe_book') {
      updatedEntitlements.hasRecipeBook = true;
      updatedEntitlements.recipeBookExpires = expiry;
    } else if (matchedCode.product === 'training') {
      updatedEntitlements.hasTraining = true;
      updatedEntitlements.trainingExpires = expiry;
    } else if (matchedCode.product === 'nutrition') {
      updatedEntitlements.hasNutrition = true;
      updatedEntitlements.nutritionExpires = expiry;
    } else if (matchedCode.product === 'training_nutrition') {
      updatedEntitlements.hasTraining = true;
      updatedEntitlements.hasNutrition = true;
      updatedEntitlements.trainingExpires = expiry;
      updatedEntitlements.nutritionExpires = expiry;
    } else if (matchedCode.product === 'full_access') {
      updatedEntitlements.hasRecipeBook = true;
      updatedEntitlements.hasTraining = true;
      updatedEntitlements.hasNutrition = true;
      updatedEntitlements.recipeBookExpires = expiry;
      updatedEntitlements.trainingExpires = expiry;
      updatedEntitlements.nutritionExpires = expiry;
    }

    setUser((prev) => ({
      ...prev,
      entitlements: updatedEntitlements,
      activeProduct: matchedCode.product,
    }));

    return {
      success: true,
      messageKey: 'codeRedeemedSuccess',
      product: matchedCode.product,
    };
  };

  const generateAccessCode = (product: ProductType, daysValid = 180): AccessCode => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = product === 'recipe_book' ? 'RECIPE' : product === 'training' ? 'TRAIN' : product === 'nutrition' ? 'NUTR' : 'VIP';
    const codeStr = `SHAWKY-${prefix}-${randomSuffix}`;
    
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + daysValid);
    const expirationDate = expDate.toISOString().split('T')[0];

    const newCode: AccessCode = {
      code: codeStr,
      product,
      status: 'active',
      expirationDate,
    };

    setAccessCodes((prev) => [newCode, ...prev]);
    return newCode;
  };

  // Workout Tracker & Performance Logging Actions
  const logExerciseSet = (
    dayId: string,
    exerciseId: string,
    setNumber: number,
    weightKg: number | undefined,
    repsCompleted: number | undefined
  ) => {
    setWorkoutProgram((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((ex) => {
            if (ex.exerciseId !== exerciseId) return ex;
            const existingSets: SetLog[] = ex.loggedSets && ex.loggedSets.length > 0
              ? [...ex.loggedSets]
              : Array.from({ length: ex.sets }, (_, i) => ({
                  setNumber: i + 1,
                  weightKg: undefined,
                  repsCompleted: undefined,
                  isCompleted: false,
                }));
            
            const targetIdx = setNumber - 1;
            if (targetIdx >= 0 && targetIdx < existingSets.length) {
              existingSets[targetIdx] = {
                ...existingSets[targetIdx],
                weightKg,
                repsCompleted,
                isCompleted: weightKg !== undefined && repsCompleted !== undefined ? true : existingSets[targetIdx].isCompleted,
              };
            }

            const allCompleted = existingSets.every((s) => s.isCompleted);
            const anyCompleted = existingSets.some((s) => s.isCompleted);

            return {
              ...ex,
              loggedSets: existingSets,
              isCompleted: allCompleted,
              completedSets: existingSets.filter((s) => s.isCompleted).length,
            };
          }),
        };
      })
    );
  };

  const toggleSetCompletion = (dayId: string, exerciseId: string, setNumber: number) => {
    setWorkoutProgram((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((ex) => {
            if (ex.exerciseId !== exerciseId) return ex;
            const existingSets: SetLog[] = ex.loggedSets && ex.loggedSets.length > 0
              ? [...ex.loggedSets]
              : Array.from({ length: ex.sets }, (_, i) => ({
                  setNumber: i + 1,
                  weightKg: undefined,
                  repsCompleted: undefined,
                  isCompleted: false,
                }));
            
            const targetIdx = setNumber - 1;
            if (targetIdx >= 0 && targetIdx < existingSets.length) {
              existingSets[targetIdx] = {
                ...existingSets[targetIdx],
                isCompleted: !existingSets[targetIdx].isCompleted,
              };
            }

            const allCompleted = existingSets.every((s) => s.isCompleted);

            return {
              ...ex,
              loggedSets: existingSets,
              isCompleted: allCompleted,
              completedSets: existingSets.filter((s) => s.isCompleted).length,
            };
          }),
        };
      })
    );
  };

  const saveExerciseNote = (dayId: string, exerciseId: string, note: string) => {
    setWorkoutProgram((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((ex) => {
            if (ex.exerciseId !== exerciseId) return ex;
            return { ...ex, clientNote: note };
          }),
        };
      })
    );
  };

  const toggleExerciseCompletion = (dayId: string, exerciseId: string) => {
    setWorkoutProgram((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          exercises: day.exercises.map((ex) => {
            if (ex.exerciseId !== exerciseId) return ex;
            const willBeCompleted = !ex.isCompleted;
            const updatedSets: SetLog[] = Array.from({ length: ex.sets }, (_, i) => {
              const current = ex.loggedSets?.[i];
              return {
                setNumber: i + 1,
                weightKg: current?.weightKg,
                repsCompleted: current?.repsCompleted,
                isCompleted: willBeCompleted,
              };
            });

            return {
              ...ex,
              isCompleted: willBeCompleted,
              completedSets: willBeCompleted ? ex.sets : 0,
              loggedSets: updatedSets,
            };
          }),
        };
      })
    );
  };

  const getExerciseHistory = (exerciseId: string, clientId?: string): ExercisePerformanceLog[] => {
    const targetClientId = clientId || user.id;
    return performanceHistory.filter(
      (log) => log.exerciseId === exerciseId && (!log.clientId || log.clientId === targetClientId)
    );
  };

  const getPreviousExercisePerformance = (exerciseId: string, clientId?: string): ExercisePerformanceLog | undefined => {
    const history = getExerciseHistory(exerciseId, clientId);
    return history[0]; // First entry is the latest performance
  };

  const finishWorkout = (dayId: string, sessionNote?: string) => {
    const currentDay = workoutProgram.find((d) => d.id === dayId);
    if (currentDay) {
      const todayStr = new Date().toISOString().split('T')[0];
      const newLogs: ExercisePerformanceLog[] = [];

      currentDay.exercises.forEach((ex) => {
        const exerciseData = exercises.find((e) => e.id === ex.exerciseId);
        const prevPerf = getPreviousExercisePerformance(ex.exerciseId, user.id);
        
        const setsToLog: SetLog[] = ex.loggedSets && ex.loggedSets.length > 0
          ? ex.loggedSets
          : Array.from({ length: ex.sets }, (_, i) => ({
              setNumber: i + 1,
              weightKg: undefined,
              repsCompleted: undefined,
              isCompleted: true,
            }));

        const perfLog: ExercisePerformanceLog = {
          id: `perf_${Date.now()}_${ex.exerciseId}`,
          clientId: user.id,
          workoutDate: todayStr,
          workoutTitle:
            typeof currentDay.title === 'string'
              ? currentDay.title
              : currentDay.title?.en || currentDay.title?.ar || 'Workout',
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName || exerciseData?.name || 'Exercise',
          sets: setsToLog,
          clientNote: ex.clientNote,
          trainerNote: ex.trainerNote,
          previousPerformance: prevPerf
            ? {
                date: prevPerf.workoutDate,
                sets: prevPerf.sets.map((s) => ({
                  setNumber: s.setNumber,
                  weightKg: s.weightKg,
                  repsCompleted: s.repsCompleted,
                })),
              }
            : undefined,
        };

        newLogs.push(perfLog);
      });

      if (newLogs.length > 0) {
        setPerformanceHistory((prev) => [...newLogs, ...prev]);
      }
    }

    setWorkoutProgram((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          completed: true,
          exercises: day.exercises.map((ex) => ({
            ...ex,
            isCompleted: true,
            completedSets: ex.sets,
            loggedSets: (ex.loggedSets && ex.loggedSets.length > 0)
              ? ex.loggedSets.map((s) => ({ ...s, isCompleted: true }))
              : Array.from({ length: ex.sets }, (_, i) => ({
                  setNumber: i + 1,
                  weightKg: undefined,
                  repsCompleted: undefined,
                  isCompleted: true,
                })),
          })),
        };
      })
    );

    if (sessionNote && sessionNote.trim()) {
      addTrainerNote(user.id, `Workout Session Note: "${sessionNote}"`, false);
    }
  };

  const addCustomExercise = (exercise: Exercise) => {
    setExercises((prev) => [exercise, ...prev]);
  };

  // ==========================================
  // TRAINING PROGRAM BUILDER & ASSIGNMENTS
  // ==========================================
  const createTrainingProgram = (
    programData: Partial<TrainingProgram>,
    assignToClientId?: string
  ): TrainingProgram => {
    const newProg: TrainingProgram = {
      id: 'prog_' + Date.now(),
      clientId: assignToClientId,
      title: programData.title || { en: 'New Training Plan', ar: 'خطة تدريب جديدة' },
      description: programData.description || { en: 'Customized training plan', ar: 'خطة تدريب مخصصة' },
      durationWeeks: programData.durationWeeks || 8,
      startDate: programData.startDate || new Date().toISOString().split('T')[0],
      status: programData.status || 'active',
      isTemplate: !assignToClientId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      days: programData.days && programData.days.length > 0 ? programData.days : [
        {
          id: 'day_' + Date.now() + '_1',
          dayOfWeek: 1,
          dayName: { en: 'Day 1', ar: 'اليوم ١' },
          dayNumber: 1,
          title: { en: 'Push (Chest, Shoulders, Triceps)', ar: 'دفع (صدر، أكتاف، ترايسبس)' },
          durationMin: 55,
          caloriesBurn: 420,
          completed: false,
          exercises: [
            {
              exerciseId: 'ex_bench_press',
              exerciseName: 'Barbell Bench Press',
              muscleGroup: 'Chest',
              sets: 4,
              reps: '8',
              restSec: 90,
              tempo: '3-0-1-0',
              trainerNote: 'Keep elbows tucked at 60 degrees. Drive through feet.',
              customVideoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
              isCompleted: false,
            },
            {
              exerciseId: 'ex_incline_db_press',
              exerciseName: 'Incline Dumbbell Press',
              muscleGroup: 'Chest',
              sets: 3,
              reps: '10',
              restSec: 60,
              tempo: '2-1-1-0',
              trainerNote: 'Set bench to 30 degree angle.',
              isCompleted: false,
            }
          ]
        },
        {
          id: 'day_' + Date.now() + '_2',
          dayOfWeek: 2,
          dayName: { en: 'Day 2', ar: 'اليوم ٢' },
          dayNumber: 2,
          title: { en: 'Pull (Back & Biceps)', ar: 'سحب (ظهر وبايسبس)' },
          durationMin: 50,
          caloriesBurn: 400,
          completed: false,
          exercises: [
            {
              exerciseId: 'ex_lat_pulldown',
              exerciseName: 'Lat Pulldown',
              muscleGroup: 'Back',
              sets: 4,
              reps: '10-12',
              restSec: 75,
              tempo: '3-1-1-0',
              trainerNote: 'Pull with elbows down and back.',
              isCompleted: false,
            }
          ]
        },
        {
          id: 'day_' + Date.now() + '_3',
          dayOfWeek: 3,
          dayName: { en: 'Day 3', ar: 'اليوم ٣' },
          dayNumber: 3,
          title: { en: 'Legs & Core', ar: 'أرجل وبطن' },
          durationMin: 60,
          caloriesBurn: 480,
          completed: false,
          exercises: [
            {
              exerciseId: 'ex_barbell_squat',
              exerciseName: 'Barbell Squat',
              muscleGroup: 'Legs',
              sets: 4,
              reps: '6-8',
              restSec: 120,
              tempo: '3-1-1-0',
              trainerNote: 'Full depth to parallel, knees tracking over toes.',
              isCompleted: false,
            },
            {
              exerciseId: 'ex_romanian_deadlift',
              exerciseName: 'Romanian Deadlift (RDL)',
              muscleGroup: 'Legs',
              sets: 3,
              reps: '10-12',
              restSec: 90,
              tempo: '3-0-1-0',
              trainerNote: 'Hinge back deeply, feel hamstrings stretch.',
              isCompleted: false,
            }
          ]
        }
      ]
    };

    setTrainingPrograms((prev) => [newProg, ...prev]);

    if (assignToClientId) {
      assignTrainingProgramToClient(assignToClientId, newProg.id);
    }

    return newProg;
  };

  const updateTrainingProgram = (programId: string, updates: Partial<TrainingProgram>) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const updated = {
          ...prog,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        // If this program is currently assigned to user, sync workoutProgram
        if (prog.clientId === user.id || prog.id === user.currentProgramId) {
          if (updated.days) {
            setWorkoutProgram(updated.days);
          }
        }
        return updated;
      })
    );
  };

  const assignTrainingProgramToClient = (clientId: string, programId: string) => {
    const targetProg = trainingPrograms.find((p) => p.id === programId);
    if (!targetProg) return;

    // If targetProg is a template (isTemplate: true or no clientId), clone it as an independent copy for the client
    if (targetProg.isTemplate || !targetProg.clientId || targetProg.clientId !== clientId) {
      const client = clients.find((c) => c.id === clientId);
      const clientName = client ? client.name.split(' ')[0] : 'Client';
      const enTitle = typeof targetProg.title === 'string' ? targetProg.title : targetProg.title?.en || targetProg.title?.ar || 'Program';
      const arTitle = typeof targetProg.title === 'string' ? targetProg.title : targetProg.title?.ar || targetProg.title?.en || 'برنامج';

      // Deep clone days with fresh IDs
      const clonedDays: WorkoutDay[] = (targetProg.days || []).map((d, dIdx) => ({
        ...d,
        id: `day_${Date.now()}_${dIdx + 1}_${Math.random().toString(36).substring(2, 5)}`,
        exercises: (d.exercises || []).map((ex) => ({
          ...ex,
          isCompleted: false,
          loggedSets: [],
        })),
      }));

      const clonedProg: TrainingProgram = {
        ...targetProg,
        id: 'prog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        clientId,
        title: {
          en: targetProg.isTemplate ? `${enTitle} (${clientName})` : enTitle,
          ar: targetProg.isTemplate ? `${arTitle} (${clientName})` : arTitle,
        },
        isTemplate: false,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        days: clonedDays,
      };

      setTrainingPrograms((prev) => [
        clonedProg,
        ...prev.map((p) => (p.clientId === clientId ? { ...p, status: 'paused' as const } : p)),
      ]);

      updateClient(clientId, { currentTrainingProgramId: clonedProg.id });

      if (clientId === user.id) {
        setUser((prev) => ({ ...prev, currentProgramId: clonedProg.id }));
        if (clonedProg.days && clonedProg.days.length > 0) {
          setWorkoutProgram(clonedProg.days);
        }
      }
      return;
    }

    // Set other programs for this client to paused
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          return {
            ...prog,
            clientId,
            status: 'active',
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        if (prog.clientId === clientId && prog.id !== programId) {
          return { ...prog, status: 'paused' };
        }
        return prog;
      })
    );

    // Update Client Overview
    updateClient(clientId, { currentTrainingProgramId: programId });

    // If client is current user, update user state
    if (clientId === user.id) {
      setUser((prev) => ({ ...prev, currentProgramId: programId }));
      if (targetProg.days && targetProg.days.length > 0) {
        setWorkoutProgram(targetProg.days);
      }
    }
  };

  const duplicateTrainingProgram = (
    programId: string,
    options?: {
      targetClientId?: string;
      asTemplate?: boolean;
      customTitle?: { en: string; ar: string };
    }
  ): TrainingProgram => {
    const sourceProg = trainingPrograms.find((p) => p.id === programId) || initialTrainingPrograms[0];
    const isTargetingClient = !!options?.targetClientId;
    const client = isTargetingClient ? clients.find((c) => c.id === options?.targetClientId) : null;
    const clientName = client ? client.name.split(' ')[0] : '';

    const enTitle =
      typeof sourceProg.title === 'string'
        ? sourceProg.title
        : sourceProg.title?.en || sourceProg.title?.ar || 'Program';
    const arTitle =
      typeof sourceProg.title === 'string'
        ? sourceProg.title
        : sourceProg.title?.ar || sourceProg.title?.en || 'برنامج';

    let finalTitle = options?.customTitle;
    if (!finalTitle) {
      if (isTargetingClient) {
        finalTitle = {
          en: `${enTitle} (Copy for ${clientName || 'Client'})`,
          ar: `${arTitle} (نسخة لـ ${clientName || 'العميل'})`,
        };
      } else {
        finalTitle = {
          en: `${enTitle} (Copy)`,
          ar: `${arTitle} (نسخة)`,
        };
      }
    }

    const clonedDays: WorkoutDay[] = (sourceProg.days || []).map((d, dIdx) => ({
      ...d,
      id: `day_${Date.now()}_${dIdx + 1}_${Math.random().toString(36).substring(2, 5)}`,
      completed: false,
      exercises: (d.exercises || []).map((ex) => ({
        ...ex,
        isCompleted: false,
        loggedSets: [],
      })),
    }));

    const duplicated: TrainingProgram = {
      ...sourceProg,
      id: 'prog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      clientId: options?.asTemplate ? undefined : options?.targetClientId || sourceProg.clientId,
      title: finalTitle,
      isTemplate: options?.asTemplate !== undefined ? options.asTemplate : !options?.targetClientId,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      days: clonedDays,
    };

    setTrainingPrograms((prev) => [duplicated, ...prev]);

    if (options?.targetClientId) {
      updateClient(options.targetClientId, { currentTrainingProgramId: duplicated.id });
      if (options.targetClientId === user.id) {
        setUser((prev) => ({ ...prev, currentProgramId: duplicated.id }));
        setWorkoutProgram(duplicated.days);
      }
    }

    return duplicated;
  };

  const duplicateTrainingProgramForClient = (programId: string, targetClientId: string): TrainingProgram => {
    return duplicateTrainingProgram(programId, { targetClientId });
  };

  const deleteTrainingProgram = (programId: string) => {
    setTrainingPrograms((prev) => prev.filter((p) => p.id !== programId));
  };

  const addDayToProgram = (programId: string, day: WorkoutDay) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = [...prog.days, day];
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const updateProgramDay = (programId: string, dayId: string, updates: Partial<WorkoutDay>) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.map((d) => (d.id === dayId ? { ...d, ...updates } : d));
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const deleteProgramDay = (programId: string, dayId: string) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.filter((d) => d.id !== dayId);
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const addExerciseToDay = (programId: string, dayId: string, exerciseItem: WorkoutExerciseItem) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.map((d) => {
          if (d.id !== dayId) return d;
          return {
            ...d,
            exercises: [...d.exercises, exerciseItem],
          };
        });
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const removeExerciseFromDay = (programId: string, dayId: string, exerciseId: string) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.map((d) => {
          if (d.id !== dayId) return d;
          return {
            ...d,
            exercises: d.exercises.filter((ex) => ex.exerciseId !== exerciseId),
          };
        });
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const reorderExercisesInDay = (programId: string, dayId: string, fromIndex: number, toIndex: number) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.map((d) => {
          if (d.id !== dayId) return d;
          const updatedList = [...d.exercises];
          const [moved] = updatedList.splice(fromIndex, 1);
          updatedList.splice(toIndex, 0, moved);
          return { ...d, exercises: updatedList };
        });
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  const updateExerciseInDay = (
    programId: string,
    dayId: string,
    exerciseId: string,
    updates: Partial<WorkoutExerciseItem>
  ) => {
    setTrainingPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id !== programId) return prog;
        const newDays = prog.days.map((d) => {
          if (d.id !== dayId) return d;
          return {
            ...d,
            exercises: d.exercises.map((ex) => (ex.exerciseId === exerciseId ? { ...ex, ...updates } : ex)),
          };
        });
        if (prog.clientId === user.id) setWorkoutProgram(newDays);
        return { ...prog, days: newDays };
      })
    );
  };

  // ==========================================
  // NUTRITION PLAN BUILDER & ASSIGNMENTS
  // ==========================================
  const activeNutritionPlan =
    nutritionPlans.find((p) => p.clientId === user.id && p.status === 'active') ||
    nutritionPlans.find((p) => p.clientId === user.id && p.id === user.currentNutritionPlanId) ||
    null;

  const createNutritionPlan = (
    planData: Partial<NutritionPlan>,
    assignToClientId?: string
  ): NutritionPlan => {
    const newPlan: NutritionPlan = {
      id: 'nutr_' + Date.now(),
      clientId: assignToClientId,
      title: planData.title || { en: 'Personalized Nutrition Plan', ar: 'خطة تغذية مخصصة' },
      dailyCalories: planData.dailyCalories ?? 2200,
      proteinGrams: planData.proteinGrams ?? 160,
      carbsGrams: planData.carbsGrams ?? 250,
      fatGrams: planData.fatGrams ?? 70,
      status: planData.status ?? 'active',
      isTemplate: !assignToClientId,
      notes: planData.notes || 'Ensure consistent water intake and hit minimum protein targets daily.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      meals: planData.meals && planData.meals.length > 0 ? planData.meals : [
        {
          id: 'meal_' + Date.now() + '_1',
          name: { en: 'Breakfast (Power Oats & Eggs)', ar: 'الفطور (شوفان الطاقة والبيض)' },
          timing: '08:00 AM',
          notes: 'Drink with 500ml water.',
          substitutions: 'Can swap oats for 80g cream of rice.',
          foods: [
            {
              id: 'f_1',
              ingredientId: 'ing_oats',
              foodName: { en: 'Rolled Whole Oats', ar: 'شوفان كامل الحبة' },
              amountGrams: 80,
              calories: 304,
              protein: 10.4,
              carbs: 54.4,
              fat: 5.6,
            },
            {
              id: 'f_2',
              ingredientId: 'ing_eggs',
              foodName: { en: 'Whole Eggs & Whites', ar: 'بيض كامل وبياض بيض' },
              amountGrams: 150,
              calories: 160,
              protein: 20.0,
              carbs: 1.0,
              fat: 8.5,
            }
          ]
        },
        {
          id: 'meal_' + Date.now() + '_2',
          name: { en: 'Lunch (Grilled Chicken & Rice)', ar: 'الغداء (دجاج مشوي وأرز)' },
          timing: '01:30 PM',
          notes: 'Season with garlic, paprika and herbs.',
          substitutions: 'Can swap chicken for lean ground beef.',
          foods: [
            {
              id: 'f_3',
              ingredientId: 'ing_chicken_breast',
              foodName: { en: 'Skinless Chicken Breast', ar: 'صدر دجاج منزوع الجلد' },
              amountGrams: 200,
              calories: 330,
              protein: 62.0,
              carbs: 0.0,
              fat: 7.2,
            },
            {
              id: 'f_4',
              ingredientId: 'ing_rice',
              foodName: { en: 'Steamed Jasmine Rice', ar: 'أرز ياسمين مطبوخ' },
              amountGrams: 220,
              calories: 286,
              protein: 5.5,
              carbs: 63.8,
              fat: 0.6,
            }
          ]
        },
        {
          id: 'meal_' + Date.now() + '_3',
          name: { en: 'Dinner (Salmon & Sweet Potato)', ar: 'العشاء (سلمون وبطاطا حلوة)' },
          timing: '08:30 PM',
          notes: 'High Omega-3 for muscle recovery.',
          substitutions: 'Can swap salmon for sea bass.',
          foods: [
            {
              id: 'f_5',
              ingredientId: 'ing_salmon',
              foodName: { en: 'Fresh Atlantic Salmon', ar: 'سلمون أطلسي طازج' },
              amountGrams: 180,
              calories: 374,
              protein: 36.7,
              carbs: 0.0,
              fat: 24.1,
            },
            {
              id: 'f_6',
              ingredientId: 'ing_sweet_potato',
              foodName: { en: 'Baked Sweet Potato', ar: 'بطاطا حلوة مشوية' },
              amountGrams: 200,
              calories: 172,
              protein: 3.2,
              carbs: 40.2,
              fat: 0.2,
            }
          ]
        }
      ]
    };

    setNutritionPlans((prev) => [
      newPlan,
      ...prev.map((item) => assignToClientId && item.clientId === assignToClientId
        ? { ...item, status: 'paused' as const }
        : item),
    ]);

    if (assignToClientId) {
      updateClient(assignToClientId, {
        currentNutritionPlanId: newPlan.id,
        dailyCaloriesTarget: newPlan.dailyCalories,
        proteinTarget: newPlan.proteinGrams,
        carbsTarget: newPlan.carbsGrams,
        fatTarget: newPlan.fatGrams,
      });
    }

    return newPlan;
  };

  const updateNutritionPlan = (planId: string, updates: Partial<NutritionPlan>) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const updated = {
          ...plan,
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0],
        };
        // If this plan is assigned to current user, sync user targets
        if (plan.clientId === user.id || plan.id === user.currentNutritionPlanId) {
          setUser((u) => ({
            ...u,
            dailyCaloriesTarget: updated.dailyCalories ?? u.dailyCaloriesTarget,
            proteinTarget: updated.proteinGrams ?? u.proteinTarget,
            carbsTarget: updated.carbsGrams ?? u.carbsTarget,
            fatTarget: updated.fatGrams ?? u.fatTarget,
          }));
        }
        return updated;
      })
    );
  };

  const assignNutritionPlanToClient = (clientId: string, planId: string) => {
    const targetPlan = nutritionPlans.find((p) => p.id === planId);
    if (!targetPlan) return;

    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            clientId,
            status: 'active',
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        if (plan.clientId === clientId && plan.id !== planId) {
          return { ...plan, status: 'paused' };
        }
        return plan;
      })
    );

    // Update Client Overview
    updateClient(clientId, {
      currentNutritionPlanId: planId,
      dailyCaloriesTarget: targetPlan.dailyCalories,
      proteinTarget: targetPlan.proteinGrams,
      carbsTarget: targetPlan.carbsGrams,
      fatTarget: targetPlan.fatGrams,
    });

    if (clientId === user.id) {
      setUser((prev) => ({
        ...prev,
        currentNutritionPlanId: planId,
        dailyCaloriesTarget: targetPlan.dailyCalories,
        proteinTarget: targetPlan.proteinGrams,
        carbsTarget: targetPlan.carbsGrams,
        fatTarget: targetPlan.fatGrams,
      }));
    }
  };

  const duplicateNutritionPlanForClient = (planId: string, targetClientId: string): NutritionPlan => {
    const sourcePlan = nutritionPlans.find((p) => p.id === planId) || initialNutritionPlans[0];
    const client = clients.find((c) => c.id === targetClientId);
    const clientName = client ? client.name.split(' ')[0] : 'Client';

    const enTitle =
      typeof sourcePlan.title === 'string'
        ? sourcePlan.title
        : sourcePlan.title?.en || sourcePlan.title?.ar || 'Nutrition Plan';
    const arTitle =
      typeof sourcePlan.title === 'string'
        ? sourcePlan.title
        : sourcePlan.title?.ar || sourcePlan.title?.en || 'خطة غذائية';

    const duplicated: NutritionPlan = {
      ...sourcePlan,
      id: 'nutr_' + Date.now(),
      clientId: targetClientId,
      title: {
        en: `${enTitle} (${clientName})`,
        ar: `${arTitle} (${clientName})`,
      },
      isTemplate: false,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      meals: JSON.parse(JSON.stringify(sourcePlan.meals)),
    };

    setNutritionPlans((prev) => [
      duplicated,
      ...prev.map((item) => item.clientId === targetClientId
        ? { ...item, status: 'paused' as const }
        : item),
    ]);
    updateClient(targetClientId, {
      currentNutritionPlanId: duplicated.id,
      dailyCaloriesTarget: duplicated.dailyCalories,
      proteinTarget: duplicated.proteinGrams,
      carbsTarget: duplicated.carbsGrams,
      fatTarget: duplicated.fatGrams,
    });
    return duplicated;
  };

  const deleteNutritionPlan = (planId: string) => {
    setNutritionPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const addMealToPlan = (planId: string, meal: ClientMeal) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: [...plan.meals, meal],
        };
      })
    );
  };

  const updateMealInPlan = (planId: string, mealId: string, updates: Partial<ClientMeal>) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => (m.id === mealId ? { ...m, ...updates } : m)),
        };
      })
    );
  };

  const deleteMealFromPlan = (planId: string, mealId: string) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.filter((m) => m.id !== mealId),
        };
      })
    );
  };

  const addFoodToMeal = (planId: string, mealId: string, food: ClientMealFood) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            return {
              ...m,
              foods: [...m.foods, food],
            };
          }),
        };
      })
    );
  };

  const removeFoodFromMeal = (planId: string, mealId: string, foodId: string) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            return {
              ...m,
              foods: m.foods.filter((f) => f.id !== foodId),
            };
          }),
        };
      })
    );
  };

  const selectClientMealOption = (planId: string, mealId: string, optionIndex: number) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            const selectedOpt = m.options?.[optionIndex];
            return {
              ...m,
              selectedOptionIndex: optionIndex,
              foods: selectedOpt?.foods || m.foods,
            };
          }),
        };
      })
    );
  };

  const updateMealOptionInPlan = (
    planId: string,
    mealId: string,
    optionId: string,
    updates: Partial<ClientMealOption>
  ) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            const updatedOptions = (m.options || []).map((opt) =>
              opt.id === optionId ? { ...opt, ...updates } : opt
            );
            const currentIdx = m.selectedOptionIndex || 0;
            return {
              ...m,
              options: updatedOptions,
              foods: updatedOptions[currentIdx]?.foods || m.foods,
            };
          }),
        };
      })
    );
  };

  const replaceMealOptionInPlan = (
    planId: string,
    mealId: string,
    optionIndex: number,
    newOption: ClientMealOption
  ) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            const updatedOptions = [...(m.options || [])];
            updatedOptions[optionIndex] = newOption;
            const currentIdx = m.selectedOptionIndex || 0;
            return {
              ...m,
              options: updatedOptions,
              foods: updatedOptions[currentIdx]?.foods || m.foods,
            };
          }),
        };
      })
    );
  };

  const addOptionToMeal = (planId: string, mealId: string, option: ClientMealOption) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            return {
              ...m,
              options: [...(m.options || []), option],
            };
          }),
        };
      })
    );
  };

  const removeOptionFromMeal = (planId: string, mealId: string, optionId: string) => {
    setNutritionPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        return {
          ...plan,
          meals: plan.meals.map((m) => {
            if (m.id !== mealId) return m;
            const updatedOptions = (m.options || []).filter((opt) => opt.id !== optionId);
            return {
              ...m,
              options: updatedOptions,
              selectedOptionIndex: 0,
              foods: updatedOptions[0]?.foods || m.foods,
            };
          }),
        };
      })
    );
  };

  const toggleMealCompletion = (mealId: string) => {
    if (!activeNutritionPlan) return;
    updateMealInPlan(activeNutritionPlan.id, mealId, {
      isCompleted: !activeNutritionPlan.meals.find((m) => m.id === mealId)?.isCompleted,
    });
  };

  // Client Management actions
  const addClient = (clientData: Partial<ClientOverview>): ClientOverview => {
    const newClient: ClientOverview = {
      id: 'client_' + Date.now(),
      name: clientData.name || 'New Athlete',
      email: clientData.email || 'athlete@shawkyfit.com',
      phone: clientData.phone || '+971 50 000 0000',
      avatar: clientData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      activeProducts: clientData.activeProducts || ['full_access'],
      weightKg: clientData.weightKg || 80,
      targetWeightKg: clientData.targetWeightKg || 75,
      dailyCaloriesTarget: clientData.dailyCaloriesTarget || 2200,
      proteinTarget: clientData.proteinTarget || 160,
      carbsTarget: clientData.carbsTarget || 250,
      fatTarget: clientData.fatTarget || 70,
      lastActive: 'Just added',
      complianceScore: 100,
    };

    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (clientId: string, updates: Partial<ClientOverview>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return { ...c, ...updates };
      })
    );

    if (clientId === user.id) {
      setUser((prev) => ({
        ...prev,
        weightKg: updates.weightKg ?? prev.weightKg,
        targetWeightKg: updates.targetWeightKg ?? prev.targetWeightKg,
        dailyCaloriesTarget: updates.dailyCaloriesTarget ?? prev.dailyCaloriesTarget,
        proteinTarget: updates.proteinTarget ?? prev.proteinTarget,
        carbsTarget: updates.carbsTarget ?? prev.carbsTarget,
        fatTarget: updates.fatTarget ?? prev.fatTarget,
      }));
    }
  };

  const logNutritionQuickAdd = (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    name: string | { en: string; ar: string } = { en: 'Quick add', ar: 'إضافة سريعة' },
    mealSlot: NutritionMealSlot = 'other',
    source: DailyFoodLogItem['source'] = 'manual',
    amountGrams?: number,
    originalText?: string
  ) => {
    const safeName = typeof name === 'string' ? { en: name, ar: name } : name;
    const item: DailyFoodLogItem = {
      id: `food_log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      clientId: user.id,
      date: nutritionLogDate,
      mealSlot,
      name: safeName,
      amountGrams,
      calories: Math.max(0, Math.round(Number(calories) || 0)),
      protein: Math.max(0, Number(Number(protein || 0).toFixed(1))),
      carbs: Math.max(0, Number(Number(carbs || 0).toFixed(1))),
      fat: Math.max(0, Number(Number(fat || 0).toFixed(1))),
      source,
      originalText,
      loggedAt: new Date().toISOString(),
    };
    setDailyFoodLogs((prev) => ({
      ...prev,
      [nutritionLogKey]: [item, ...(prev[nutritionLogKey] || [])],
    }));
  };

  const removeDailyFoodLogItem = (itemId: string) => {
    setDailyFoodLogs((prev) => ({
      ...prev,
      [nutritionLogKey]: (prev[nutritionLogKey] || []).filter((item) => item.id !== itemId),
    }));
  };

  const clearDailyFoodLog = () => {
    setDailyFoodLogs((prev) => ({ ...prev, [nutritionLogKey]: [] }));
  };

  const updateUserTargets = (calories: number, protein: number, carbs: number, fat: number) => {
    setUser((prev) => ({
      ...prev,
      dailyCaloriesTarget: calories,
      proteinTarget: protein,
      carbsTarget: carbs,
      fatTarget: fat,
    }));

    if (activeNutritionPlan) {
      updateNutritionPlan(activeNutritionPlan.id, {
        dailyCalories: calories,
        proteinGrams: protein,
        carbsGrams: carbs,
        fatGrams: fat,
      });
    }
  };

  const addCustomRecipe = (recipe: Recipe) => {
    setRecipes((prev) => {
      const next = [recipe, ...prev];
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving custom recipe', e);
      }
      return next;
    });
  };

  const updateRecipe = (recipeId: string, updates: Partial<Recipe>) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === recipeId ? { ...r, ...updates } : r));
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error updating recipe in localStorage', e);
      }
      return next;
    });
  };

  const deleteRecipe = (recipeId: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== recipeId);
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error deleting recipe from localStorage', e);
      }
      return next;
    });
  };

  const duplicateRecipe = (recipeId: string): Recipe => {
    const original = recipes.find((r) => r.id === recipeId);
    const newId = 'rec_copy_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    
    let copyName: { en: string; ar: string } | string;
    if (original) {
      if (typeof original.name === 'object' && original.name !== null) {
        copyName = {
          en: `${original.name.en || 'Recipe'} (Copy)`,
          ar: `${original.name.ar || 'وصفة'} (نسخة)`,
        };
      } else {
        copyName = `${String(original.name || 'Recipe')} (Copy)`;
      }
    } else {
      copyName = { en: 'New Recipe Copy', ar: 'نسخة وصفة جديدة' };
    }

    const duplicated: Recipe = original
      ? {
          ...original,
          id: newId,
          name: copyName,
          published: false, // Default to unpublished draft for editing
          archived: false,
          isBookmarked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : {
          id: newId,
          name: copyName,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          preparationTimeMin: 15,
          category: 'main_meals',
          mealType: 'lunch',
          tags: ['High Protein'],
          ingredients: [],
          instructions: { en: ['Prepare ingredients and cook thoroughly.'], ar: ['جهز المكونات واطهها جيداً.'] },
          calories: 450,
          protein: 35,
          carbohydrates: 40,
          fat: 12,
          published: false,
          archived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    setRecipes((prev) => {
      const next = [duplicated, ...prev];
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving duplicated recipe', e);
      }
      return next;
    });

    return duplicated;
  };

  const archiveRecipe = (recipeId: string, archiveState: boolean = true) => {
    setRecipes((prev) => {
      const next = prev.map((r) => (r.id === recipeId ? { ...r, archived: archiveState, updatedAt: new Date().toISOString() } : r));
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error archiving recipe', e);
      }
      return next;
    });
  };

  const toggleRecipeVisibility = (recipeId: string) => {
    setRecipes((prev) => {
      const next = prev.map((r) => {
        if (r.id === recipeId) {
          // If published is undefined, it was previously published (true), so toggling makes it false
          const currentPublished = r.published !== false;
          return {
            ...r,
            published: !currentPublished,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      });
      try {
        localStorage.setItem('shawky_recipes', JSON.stringify(next));
      } catch (e) {
        console.error('Error toggling recipe visibility', e);
      }
      return next;
    });
  };

  const toggleRecipeBookmark = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const sendMessage = (text: string, mediaUrl?: string, mediaType?: 'image' | 'video', customRecipientId?: string) => {
    const isTrainer = activeRole === 'trainer';
    const recipient = customRecipientId || (isTrainer ? activeClientId : 'trainer_alex_1');

    const newMsg: Message = {
      id: 'msg_' + Date.now(),
      senderId: isTrainer ? 'trainer_alex_1' : user.id,
      senderName: isTrainer ? 'Coach Alex Shawky' : user.name,
      senderRole: activeRole,
      recipientId: recipient,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      mediaUrl,
      mediaType,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const submitCheckIn = (data: Omit<CheckIn, 'id' | 'clientId' | 'clientName' | 'status'>) => {
    const newCheckIn: CheckIn = {
      ...data,
      id: 'chk_' + Date.now(),
      clientId: user.id,
      clientName: user.name,
      status: 'pending',
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);
  };

  const trainerReviewCheckIn = (checkInId: string, feedback: string) => {
    setCheckIns((prev) =>
      prev.map((chk) => {
        if (chk.id !== checkInId) return chk;
        return {
          ...chk,
          status: 'reviewed',
          trainerFeedback: feedback,
          trainerFeedbackDate: new Date().toLocaleDateString(),
        };
      })
    );
  };

  const addTrainerNote = (clientId: string, content: string, isPrivate: boolean, exerciseId?: string) => {
    const newNote: TrainerNote = {
      id: 'tn_' + Date.now(),
      clientId,
      exerciseId,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
      content,
      isPrivate,
      authorName: 'Coach Alex',
    };
    setTrainerNotes((prev) => [newNote, ...prev]);
  };

  const deleteTrainerNote = (noteId: string) => {
    setTrainerNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('shawky_auth', 'false');
    setShowAuthModal(true);
    setAuthMode('welcome');
  };

  const loginWithCredentials = (email: string, pass: string) => {
    if (email && pass) {
      setIsAuthenticated(true);
      localStorage.setItem('shawky_auth', 'true');
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const activateWithCode = (name: string, email: string, code: string, pass: string) => {
    const res = redeemAccessCode(code);
    if (res.success) {
      const newUser: User = {
        ...user,
        name: name || user.name,
        email: email || user.email,
        onboardingCompleted: false, // Show onboarding on first client login
        onboardingData: undefined,
      };
      setUser(newUser);
      localStorage.setItem('shawky_user', JSON.stringify(newUser));
      setIsAuthenticated(true);
      localStorage.setItem('shawky_auth', 'true');
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        user,
        setUser,
        activeRole,
        setActiveRole,
        switchRole,
        activeTab,
        setActiveTab,
        accessCodes,
        redeemAccessCode,
        generateAccessCode,
        workoutProgram,
        selectedDayId,
        setSelectedDayId,
        exercises,
        addCustomExercise,
        logExerciseSet,
        toggleSetCompletion,
        saveExerciseNote,
        toggleExerciseCompletion,
        finishWorkout,
        performanceHistory,
        getExerciseHistory,
        getPreviousExercisePerformance,
        trainingPrograms,
        createTrainingProgram,
        updateTrainingProgram,
        assignTrainingProgramToClient,
        duplicateTrainingProgram,
        duplicateTrainingProgramForClient,
        deleteTrainingProgram,
        addDayToProgram,
        updateProgramDay,
        deleteProgramDay,
        addExerciseToDay,
        removeExerciseFromDay,
        reorderExercisesInDay,
        updateExerciseInDay,
        nutritionPlans,
        activeNutritionPlan,
        createNutritionPlan,
        updateNutritionPlan,
        assignNutritionPlanToClient,
        duplicateNutritionPlanForClient,
        deleteNutritionPlan,
        addMealToPlan,
        updateMealInPlan,
        deleteMealFromPlan,
        addFoodToMeal,
        removeFoodFromMeal,
        selectClientMealOption,
        updateMealOptionInPlan,
        replaceMealOptionInPlan,
        addOptionToMeal,
        removeOptionFromMeal,
        toggleMealCompletion,
        ingredients,
        consumedNutrition,
        nutritionLogDate,
        setNutritionLogDate,
        dailyFoodLogItems,
        logNutritionQuickAdd,
        removeDailyFoodLogItem,
        clearDailyFoodLog,
        updateUserTargets,
        recipes,
        addCustomRecipe,
        updateRecipe,
        deleteRecipe,
        duplicateRecipe,
        archiveRecipe,
        toggleRecipeVisibility,
        toggleRecipeBookmark,
        recipeBookTargets,
        setRecipeBookTargets,
        recipeBookLogs,
        recipeBookTodayItems,
        recipeBookTodayTotals,
        addRecipeToTodayLog,
        removeRecipeFromTodayLog,
        updateRecipeLogServings,
        clearTodayRecipeLog,
        getTodayDateKey,
        messages,
        sendMessage,
        checkIns,
        submitCheckIn,
        trainerReviewCheckIn,
        measurementLocations,
        addMeasurementLocation,
        removeMeasurementLocation,
        updateMeasurementLocation,
        completeOnboarding,
        resetOnboarding,
        clients,
        activeClientId,
        setActiveClientId,
        addClient,
        updateClient,
        trainerNotes,
        addTrainerNote,
        deleteTrainerNote,
        activityFeed,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        loginWithCredentials,
        activateWithCode,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
