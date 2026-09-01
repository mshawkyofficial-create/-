import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe, RecipeIngredientItem } from '../../types';
import {
  X,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Link,
  Play,
  ExternalLink,
  Check,
  Clock,
  Flame,
  Utensils,
  AlertCircle,
  Eye,
  EyeOff,
  Archive,
  Copy,
  Tag,
  FileText,
} from 'lucide-react';

interface TrainerEditRecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_FOOD_IMAGES = [
  {
    title: 'Protein Pancakes & Berries',
    url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Grilled Chicken & Rice',
    url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Salmon & Steamed Asparagus',
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Shakshuka Eggs & Feta',
    url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Lean Steak & Sweet Potato',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Protein Oatmeal Bowl',
    url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Fresh Garden Salad',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Turkey Protein Sandwich',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
  },
  {
    title: 'Post-Workout Green Smoothie',
    url: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&auto=format&fit=crop&q=80',
  },
];

export const TrainerEditRecipeModal: React.FC<TrainerEditRecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { updateRecipe, duplicateRecipe, language, t } = useApp();
  const isRtl = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState<string>('breakfast');
  const [prepTimeMin, setPrepTimeMin] = useState(15);
  const [cookTimeMin, setCookTimeMin] = useState(10);
  const [servingSize, setServingSize] = useState('1 serving');
  
  // Macros
  const [calories, setCalories] = useState(450);
  const [proteinGrams, setProteinGrams] = useState(40);
  const [carbsGrams, setCarbsGrams] = useState(45);
  const [fatGrams, setFatGrams] = useState(12);

  // Image and Video
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageTab, setImageTab] = useState<'url' | 'upload' | 'presets'>('url');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [videoTestStatus, setVideoTestStatus] = useState<'none' | 'success' | 'error'>('none');

  // Visibility and Archive
  const [published, setPublished] = useState<boolean>(true);
  const [archived, setArchived] = useState<boolean>(false);

  // Tags & Notes
  const [tagsInput, setTagsInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Ingredients list
  const [ingredientsList, setIngredientsList] = useState<{ name: string; amount: string }[]>([]);
  const [newIngName, setNewIngName] = useState('');
  const [newIngAmount, setNewIngAmount] = useState('');

  // Instructions
  const [instructionsListEn, setInstructionsListEn] = useState<string[]>([]);
  const [instructionsListAr, setInstructionsListAr] = useState<string[]>([]);
  const [newInstructionEn, setNewInstructionEn] = useState('');
  const [newInstructionAr, setNewInstructionAr] = useState('');

  // Status message
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Populate state when recipe changes
  useEffect(() => {
    if (recipe) {
      const enName = typeof recipe.name === 'string' ? recipe.name : recipe.name?.en || '';
      const arName = typeof recipe.name === 'string' ? recipe.name : recipe.name?.ar || enName;
      setTitleEn(enName);
      setTitleAr(arName);
      setCategory(recipe.category || recipe.mealType || 'breakfast');
      setPrepTimeMin(recipe.preparationTimeMin || recipe.prepTimeMinutes || 15);
      setCookTimeMin(recipe.cookTimeMin || 0);
      setServingSize(recipe.servingSize || '1 serving');
      
      setCalories(recipe.calories || 450);
      setProteinGrams(recipe.protein || 40);
      setCarbsGrams(recipe.carbohydrates || 45);
      setFatGrams(recipe.fat || 12);

      setImageUrl(recipe.image || recipe.imageUrl || '');
      setVideoUrl(recipe.videoUrl || '');

      setPublished(recipe.published !== false);
      setArchived(recipe.archived === true);

      setTagsInput(recipe.tags ? recipe.tags.join(', ') : '');
      setNotes(recipe.notes || recipe.trainerNotes || '');

      // Load Ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        setIngredientsList(
          recipe.ingredients.map((ing) => ({
            name: typeof ing.name === 'object' && ing.name !== null
              ? (isRtl ? ing.name.ar || ing.name.en : ing.name.en || ing.name.ar)
              : String(ing.name || ing.ingredientId || 'Ingredient'),
            amount: ing.amount || `${ing.amountGrams || 100}g`,
          }))
        );
      } else {
        setIngredientsList([]);
      }

      // Load Instructions
      const inst = recipe.instructions;
      if (Array.isArray(inst)) {
        setInstructionsListEn(inst);
        setInstructionsListAr(inst);
      } else if (inst) {
        setInstructionsListEn(inst.en || []);
        setInstructionsListAr(inst.ar || inst.en || []);
      } else {
        setInstructionsListEn([]);
        setInstructionsListAr([]);
      }

      setSaveSuccess(false);
      setImageUploadError(null);
      setVideoTestStatus('none');
    }
  }, [recipe, isOpen, isRtl]);

  if (!isOpen || !recipe) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError(isRtl ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError(isRtl ? 'حجم الصورة كبير جداً (أقصى حد 5 ميجابايت)' : 'Image is too large (max 5MB)');
      return;
    }

    setImageUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddIngredient = () => {
    if (!newIngName.trim()) return;
    setIngredientsList([
      ...ingredientsList,
      {
        name: newIngName.trim(),
        amount: newIngAmount.trim() || '1 serving',
      },
    ]);
    setNewIngName('');
    setNewIngAmount('');
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredientsList(ingredientsList.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (!newInstructionEn.trim() && !newInstructionAr.trim()) return;
    const enText = newInstructionEn.trim() || newInstructionAr.trim();
    const arText = newInstructionAr.trim() || newInstructionEn.trim();
    setInstructionsListEn([...instructionsListEn, enText]);
    setInstructionsListAr([...instructionsListAr, arText]);
    setNewInstructionEn('');
    setNewInstructionAr('');
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructionsListEn(instructionsListEn.filter((_, i) => i !== index));
    setInstructionsListAr(instructionsListAr.filter((_, i) => i !== index));
  };

  const handleTestVideo = () => {
    const url = videoUrl.trim();
    if (!url) {
      setVideoTestStatus('error');
      return;
    }

    try {
      // Validate url format
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        setVideoTestStatus('success');
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        setVideoTestStatus('error');
      }
    } catch {
      setVideoTestStatus('error');
    }
  };

  const handleDuplicate = () => {
    if (!recipe) return;
    const copy = duplicateRecipe(recipe.id);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipe) return;

    const trimmedEn = titleEn.trim() || 'Custom Recipe';
    const trimmedAr = titleAr.trim() || trimmedEn;
    const finalImage = imageUrl.trim() || recipe.image;
    const finalVideo = videoUrl.trim() || undefined;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const parsedIngredients: RecipeIngredientItem[] = ingredientsList.map((ing, idx) => ({
      ingredientId: 'ing_custom_' + idx,
      name: { en: ing.name, ar: ing.name },
      amountGrams: 100,
      amount: ing.amount,
    }));

    const updatedData: Partial<Recipe> = {
      name: {
        en: trimmedEn,
        ar: trimmedAr,
      },
      image: finalImage,
      imageUrl: finalImage,
      videoUrl: finalVideo,
      mealType: category as any,
      category: category as any,
      preparationTimeMin: Number(prepTimeMin) || 15,
      cookTimeMin: Number(cookTimeMin) || 0,
      servingSize: servingSize.trim() || '1 serving',
      calories: Number(calories) || 0,
      protein: Number(proteinGrams) || 0,
      carbohydrates: Number(carbsGrams) || 0,
      fat: Number(fatGrams) || 0,
      published: published,
      archived: archived,
      tags: parsedTags.length > 0 ? parsedTags : ['Fitness Meal'],
      notes: notes.trim() || undefined,
      trainerNotes: notes.trim() || undefined,
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : recipe.ingredients,
      instructions: {
        en: instructionsListEn.length > 0 ? instructionsListEn : ['Prepare according to recipe guidelines.'],
        ar: instructionsListAr.length > 0 ? instructionsListAr : ['تحضير الوجبة حسب المكونات المقررة.'],
      },
      updatedAt: new Date().toISOString(),
    };

    updateRecipe(recipe.id, updatedData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eceef0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#191c1e] text-[#ccff00] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#191c1e]">
                {isRtl ? 'تعديل بيانات وصورة الوصفة' : 'Edit Recipe & Media'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl
                  ? 'إدارة كاملة للصورة، رابط الفيديو، القيم الغذائية، والتحكم بالنشر والأرشفة.'
                  : 'Full control over image, video link, nutrition macros, and visibility.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f2f4f6] text-[#191c1e] flex items-center justify-center hover:bg-[#e0e3e5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ======================================================== */}
          {/* 1. RECIPE VISIBILITY & ARCHIVE STATUS BAR                */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5]">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                {published ? (
                  <Eye className="w-4 h-4 text-[#506600]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                )}
                <div>
                  <span className="text-xs font-black text-[#191c1e] block">
                    {isRtl ? 'حالة النشر للمتدربين' : 'Client Visibility'}
                  </span>
                  <span className="text-[10px] text-[#565e74]">
                    {published
                      ? isRtl ? 'منشورة وظاهرة للمتدربين' : 'Published & Visible to Clients'
                      : isRtl ? 'مخفية (تظهر للمدرب فقط)' : 'Hidden (Trainer Only)'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  published
                    ? 'bg-[#506600] text-white shadow-2xs'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {published ? (isRtl ? 'منشورة' : 'Published') : (isRtl ? 'مخفية' : 'Hidden')}
              </button>
            </div>

            {/* Archive Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#e0e3e5]">
              <div className="flex items-center gap-2">
                <Archive className={`w-4 h-4 ${archived ? 'text-rose-600' : 'text-[#565e74]'}`} />
                <div>
                  <span className="text-xs font-black text-[#191c1e] block">
                    {isRtl ? 'أرشفة الوصفة' : 'Archive Status'}
                  </span>
                  <span className="text-[10px] text-[#565e74]">
                    {archived
                      ? isRtl ? 'مؤرشفة في قاعدة المدرب' : 'Archived in Database'
                      : isRtl ? 'نشطة في القائمة' : 'Active in System'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setArchived(!archived)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  archived
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5]'
                }`}
              >
                {archived ? (isRtl ? 'مؤرشفة' : 'Archived') : (isRtl ? 'نشطة' : 'Active')}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. RECIPE IMAGE MANAGEMENT                               */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f8faf2] border border-[#506600]/25 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#506600]" />
                <label className="text-sm font-black text-[#191c1e]">
                  {isRtl ? 'صورة الوصفة (تعديل ومعاينة حية)' : 'Recipe Image (Change & Live Preview)'}
                </label>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#506600]/15 text-[#506600]">
                {isRtl ? 'تحكم المدرب' : 'Trainer Control'}
              </span>
            </div>

            {/* Live Image Preview Card */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-[#506600]/40 group">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt={titleEn || 'Recipe Preview'}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageUploadError(isRtl ? 'تعذر تحميل الصورة من الرابط' : 'Failed to load image from URL');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80" />
                  <div className="absolute bottom-3 left-3 rtl:right-3 rtl:left-auto flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>{isRtl ? 'المعاينة الحية' : 'Live Preview'}</span>
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                  <span className="text-xs font-medium">
                    {isRtl ? 'لم يتم تعيين صورة بعد' : 'No image specified yet'}
                  </span>
                </div>
              )}
            </div>

            {imageUploadError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{imageUploadError}</span>
              </div>
            )}

            {/* Image Selector Tabs: URL / Upload / Presets */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  imageTab === 'url' ? 'bg-[#191c1e] text-white shadow-xs' : 'text-[#565e74] hover:bg-[#f2f4f6]'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>{isRtl ? 'رابط مباشر' : 'Image URL'}</span>
              </button>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  imageTab === 'upload' ? 'bg-[#191c1e] text-white shadow-xs' : 'text-[#565e74] hover:bg-[#f2f4f6]'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isRtl ? 'رفع من الجهاز' : 'Upload File'}</span>
              </button>
              <button
                type="button"
                onClick={() => setImageTab('presets')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  imageTab === 'presets' ? 'bg-[#191c1e] text-white shadow-xs' : 'text-[#565e74] hover:bg-[#f2f4f6]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>{isRtl ? 'صور جاهزة' : 'Presets'}</span>
              </button>
            </div>

            {/* URL Input */}
            {imageTab === 'url' && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageUploadError(null);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="h-10 px-3 rounded-xl bg-[#f2f4f6] text-[#565e74] hover:text-rose-600 text-xs font-bold transition-colors"
                  >
                    {isRtl ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>
            )}

            {/* File Upload Button */}
            {imageTab === 'upload' && (
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-11 rounded-xl bg-white border border-dashed border-[#506600] hover:bg-[#f2f4f6] text-[#191c1e] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Upload className="w-4 h-4 text-[#506600]" />
                  <span>{isRtl ? 'اختر ملف صورة من هاتفك أو جهازك (JPG, PNG, WebP)' : 'Select Image File (JPG, PNG, WebP)'}</span>
                </button>
              </div>
            )}

            {/* Presets Gallery */}
            {imageTab === 'presets' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                {PRESET_FOOD_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setImageUploadError(null);
                    }}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all text-start group ${
                      imageUrl === preset.url ? 'border-[#506600] ring-2 ring-[#506600]/30' : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <span className="text-[9px] font-bold text-white leading-tight line-clamp-1">
                        {preset.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 3. RECIPE VIDEO URL MANAGEMENT & TEST LINK               */}
          {/* ======================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f0f7fc] border border-[#0284c7]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#0284c7] fill-[#0284c7]" />
                <label className="text-sm font-black text-[#191c1e]">
                  {isRtl ? 'رابط فيديو الوصفة (YouTube / Vimeo / TikTok / Direct)' : 'Recipe Video Link (YouTube / Vimeo / TikTok / Direct)'}
                </label>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#0284c7]/15 text-[#0284c7]">
                {isRtl ? 'أيقونة الفيديو للمتدرب' : 'Client Video Icon'}
              </span>
            </div>

            <p className="text-xs text-[#565e74]">
              {isRtl
                ? 'يمكنك وضع رابط الفيديو (أو تركه فارغاً). أيقونة الفيديو ستظهر للمتدرب دوماً، وإذا كان الرابط فارغاً سيتم إعلامه بأن الفيديو غير متاح حالياً.'
                : 'You can provide a video URL or leave it empty. The video icon will always show for clients, gracefully displaying "Video is currently unavailable" if empty.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Play className="w-3.5 h-3.5 text-[#565e74] absolute top-3.5 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setVideoTestStatus('none');
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full h-10 px-9 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#0284c7] outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleTestVideo}
                  className="h-10 px-3.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                  title={isRtl ? 'تجربة فتح الرابط' : 'Test Video Link'}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'تجربة تشغيل الرابط' : 'Test Video Link'}</span>
                </button>

                {videoUrl.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl('');
                      setVideoTestStatus('none');
                    }}
                    className="h-10 px-3 rounded-xl bg-[#f2f4f6] text-[#565e74] hover:text-rose-600 text-xs font-bold transition-colors"
                  >
                    {isRtl ? 'إزالة' : 'Remove'}
                  </button>
                )}
              </div>
            </div>

            {videoTestStatus === 'success' && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{isRtl ? 'الرابط صالح وتم فتحه في نافذة جديدة للاختبار!' : 'Valid link! Opened in new tab for verification.'}</span>
              </div>
            )}

            {videoTestStatus === 'error' && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{isRtl ? 'الرابط غير صالح. يرجى التأكد من كتابة رابط كامل يبدأ بـ https://' : 'Invalid URL. Please enter a valid URL starting with https://'}</span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 4. RECIPE TITLES & CATEGORY                              */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] block mb-1">
                {isRtl ? 'اسم الوصفة (إنجليزي)' : 'Recipe Title (English)'}
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] block mb-1">
                {isRtl ? 'اسم الوصفة (عربي)' : 'Recipe Title (Arabic)'}
              </label>
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#565e74] block mb-1">
                {isRtl ? 'القسم / التصنيف' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-2.5 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              >
                <option value="breakfast">{isRtl ? 'فطور / Breakfast' : 'Breakfast'}</option>
                <option value="main_meals">{isRtl ? 'وجبات أساسية / Main Meals' : 'Main Meals'}</option>
                <option value="lunch">{isRtl ? 'غداء / Lunch' : 'Lunch'}</option>
                <option value="dinner">{isRtl ? 'عشاء / Dinner' : 'Dinner'}</option>
                <option value="snacks_desserts">{isRtl ? 'حلا وسناك / Snacks & Desserts' : 'Snacks & Desserts'}</option>
                <option value="snack">{isRtl ? 'سناك / Snack' : 'Snack'}</option>
                <option value="drinks">{isRtl ? 'مشروبات / Drinks' : 'Drinks'}</option>
                <option value="salads">{isRtl ? 'سلطات / Salads' : 'Salads'}</option>
                <option value="sandwiches">{isRtl ? 'سندوتشات / Sandwiches' : 'Sandwiches'}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#565e74] block mb-1">
                {isRtl ? 'وقت التحضير (دقيقة)' : 'Prep Time (min)'}
              </label>
              <input
                type="number"
                min="1"
                value={prepTimeMin}
                onChange={(e) => setPrepTimeMin(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#565e74] block mb-1">
                {isRtl ? 'وقت الطهي (دقيقة)' : 'Cook Time (min)'}
              </label>
              <input
                type="number"
                min="0"
                value={cookTimeMin}
                onChange={(e) => setCookTimeMin(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#565e74] block mb-1">
                {isRtl ? 'حجم الحصة' : 'Serving Size'}
              </label>
              <input
                type="text"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-semibold text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>
          </div>

          {/* Macros (Calories, Protein, Carbs, Fat) */}
          <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5]">
            <span className="text-xs font-black text-[#191c1e] block mb-2">
              {isRtl ? 'القيم الغذائية للحصة (الماكروز)' : 'Nutritional Values per Serving (Macros)'}
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <label className="text-[10px] font-bold text-[#565e74] uppercase block mb-1">
                  {t('calories')}
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full h-9 text-center rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] focus:border-[#506600] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#506600] uppercase block mb-1">
                  {t('protein')} (g)
                </label>
                <input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  className="w-full h-9 text-center rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] focus:border-[#506600] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#0284c7] uppercase block mb-1">
                  {t('carbs')} (g)
                </label>
                <input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  className="w-full h-9 text-center rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] focus:border-[#506600] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#d97706] uppercase block mb-1">
                  {t('fat')} (g)
                </label>
                <input
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  className="w-full h-9 text-center rounded-xl bg-white border border-[#e0e3e5] text-xs font-black text-[#191c1e] focus:border-[#506600] outline-none"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. INGREDIENTS & QUANTITIES MANAGEMENT                   */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#565e74] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#506600]" />
                <span>{isRtl ? 'المكونات والمقادير' : 'Ingredients & Quantities'} ({ingredientsList.length})</span>
              </label>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {ingredientsList.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs"
                >
                  <span className="font-semibold text-[#191c1e] flex-1">
                    <span className="font-bold text-[#506600] mr-1 rtl:ml-1 rtl:mr-0">•</span>
                    {ing.name}
                  </span>
                  <span className="text-[11px] font-bold text-[#565e74] px-2 py-0.5 rounded-lg bg-white border border-[#e0e3e5] mr-2 rtl:ml-2 rtl:mr-0">
                    {ing.amount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(i)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
                placeholder={isRtl ? 'اسم المكون (مثال: صدور دجاج)' : 'Ingredient name...'}
                className="flex-2 h-9 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
              />
              <input
                type="text"
                value={newIngAmount}
                onChange={(e) => setNewIngAmount(e.target.value)}
                placeholder={isRtl ? 'الكمية (مثال: 200g)' : 'Amount (e.g. 200g)'}
                className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="h-9 px-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#e0e3e5] text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 6. INSTRUCTIONS MANAGEMENT                               */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#565e74]">
              {isRtl ? 'خطوات التحضير' : 'Preparation Instructions'} ({instructionsListEn.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {instructionsListEn.map((inst, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs"
                >
                  <span className="font-semibold text-[#191c1e] flex-1 line-clamp-2">
                    <span className="font-bold text-[#506600] mr-1 rtl:ml-1 rtl:mr-0">{i + 1}.</span>
                    {isRtl ? (instructionsListAr[i] || inst) : inst}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(i)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={isRtl ? newInstructionAr : newInstructionEn}
                onChange={(e) => {
                  if (isRtl) {
                    setNewInstructionAr(e.target.value);
                    setNewInstructionEn(e.target.value);
                  } else {
                    setNewInstructionEn(e.target.value);
                    setNewInstructionAr(e.target.value);
                  }
                }}
                placeholder={isRtl ? 'أدخل خطوة تحضير جديدة...' : 'Add preparation step...'}
                className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInstruction();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="h-9 px-3 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#e0e3e5] text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 7. TAGS & TRAINER NOTES                                   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] flex items-center gap-1 mb-1">
                <Tag className="w-3.5 h-3.5 text-[#506600]" />
                <span>{isRtl ? 'الوسوم (مفصولة بفواصل)' : 'Tags (comma separated)'}</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="High Protein, Quick Prep, Muscle Gain"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] flex items-center gap-1 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#506600]" />
                <span>{isRtl ? 'ملاحظات وتوجيهات المدرب' : 'Trainer Notes'}</span>
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRtl ? 'نصيحة للمتدرب أو إرشادات بدائل...' : 'Coach advice or substitutions...'}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e0e3e5] text-xs font-medium text-[#191c1e] focus:border-[#506600] outline-none"
              />
            </div>
          </div>

          {/* Form Actions & Duplicate Shortcut */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#eceef0]">
            <button
              type="button"
              onClick={handleDuplicate}
              className="h-10 px-4 rounded-xl bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] hover:bg-[#e0f2fe] text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isRtl ? 'نسخ الوصفة كمسودة جديدة' : 'Duplicate Recipe'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-2xl bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#191c1e] text-xs font-black transition-colors"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className={`h-11 px-6 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                  saveSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-[#506600] hover:bg-[#3d4e00] text-white shadow-[#506600]/25'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{isRtl ? 'تم الحفظ بنجاح!' : 'Changes Saved!'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ تعديلات الوصفة' : 'Save Recipe Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
