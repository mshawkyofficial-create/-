import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  Play,
  Video,
  CheckCircle2,
  Sparkles,
  Filter,
  ExternalLink,
  Flame,
  Clock,
  Layers,
  Utensils,
} from 'lucide-react';

interface TrainerRecipeDatabaseViewProps {
  onAddNewRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
}

export const TrainerRecipeDatabaseView: React.FC<TrainerRecipeDatabaseViewProps> = ({
  onAddNewRecipe,
  onEditRecipe,
}) => {
  const {
    recipes,
    deleteRecipe,
    duplicateRecipe,
    toggleRecipeVisibility,
    archiveRecipe,
    language,
    t,
  } = useApp();

  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'hidden' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [videoFilter, setVideoFilter] = useState<'all' | 'has_video' | 'no_video'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Confirmation state for deleting
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Quick Video Preview modal
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<{ url: string; title: string } | null>(null);

  // Helper for localized text
  const getLocalizedText = (val: string | { en?: string; ar?: string } | undefined, fallback: string = ''): string => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    return (isRtl ? val.ar || val.en : val.en || val.ar) || fallback;
  };

  // Summary Metrics
  const totalCount = recipes.length;
  const publishedCount = recipes.filter((r) => r.published !== false && !r.archived).length;
  const hiddenCount = recipes.filter((r) => r.published === false && !r.archived).length;
  const archivedCount = recipes.filter((r) => r.archived === true).length;
  const withVideoCount = recipes.filter((r) => Boolean(r.videoUrl && r.videoUrl.trim().length > 0)).length;

  // Filtered recipes
  const filteredRecipes = recipes.filter((r) => {
    // 1. Search Query
    const enName = typeof r.name === 'string' ? r.name.toLowerCase() : r.name?.en?.toLowerCase() || '';
    const arName = typeof r.name === 'string' ? r.name.toLowerCase() : r.name?.ar?.toLowerCase() || '';
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = enName.includes(q) || arName.includes(q);
    if (!matchesSearch) return false;

    // 2. Status Filter
    if (statusFilter === 'published' && (r.published === false || r.archived)) return false;
    if (statusFilter === 'hidden' && (r.published !== false || r.archived)) return false;
    if (statusFilter === 'archived' && !r.archived) return false;
    if (statusFilter === 'all' && r.archived) return false; // In 'all' view, don't mix active with archived unless selected

    // 3. Category Filter
    if (categoryFilter !== 'all') {
      const matchCat = r.category === categoryFilter || r.mealType === categoryFilter;
      if (!matchCat) return false;
    }

    // 4. Video Filter
    const hasVid = Boolean(r.videoUrl && r.videoUrl.trim().length > 0);
    if (videoFilter === 'has_video' && !hasVid) return false;
    if (videoFilter === 'no_video' && hasVid) return false;

    // 5. Tag Filter
    if (selectedTag !== 'all') {
      if (!r.tags || !r.tags.includes(selectedTag)) return false;
    }

    return true;
  });

  const categories = [
    { id: 'all', label: isRtl ? 'جميع الأقسام' : 'All Categories' },
    { id: 'breakfast', label: isRtl ? 'فطور' : 'Breakfast' },
    { id: 'main_meals', label: isRtl ? 'وجبات أساسية' : 'Main Meals' },
    { id: 'snacks_desserts', label: isRtl ? 'حلا وسناك' : 'Snacks & Desserts' },
    { id: 'drinks', label: isRtl ? 'مشروبات' : 'Drinks' },
    { id: 'salads', label: isRtl ? 'سلطات' : 'Salads' },
    { id: 'sandwiches', label: isRtl ? 'سندوتشات' : 'Sandwiches' },
  ];

  return (
    <div className="flex flex-col gap-5 text-start animate-fade-in">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#e0e3e5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#191c1e]">
              {isRtl ? 'قاعدة بيانات الوصفات الموحدة' : 'Recipe Database'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#191c1e] text-[#ccff00] text-[10px] font-black uppercase">
              MASTER DB
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#565e74] mt-0.5">
            {isRtl
              ? 'التحكم الكامل بجميع الوصفات، روابط الفيديو، نشر/إخفاء الوصفات للعملاء، وتخصيص الماكروز.'
              : 'Full control over all recipe entries, video demonstrations, client visibility, and nutrition.'}
          </p>
        </div>

        <button
          onClick={onAddNewRecipe}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#191c1e] text-[#ccff00] hover:bg-black font-black text-xs shadow-md active:scale-95 transition-all self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة وصفة جديدة' : 'Add New Recipe'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div
          onClick={() => {
            setStatusFilter('all');
            setVideoFilter('all');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'all' && videoFilter === 'all'
              ? 'bg-[#191c1e] text-white border-[#191c1e] shadow-xs'
              : 'bg-white text-[#191c1e] border-[#e0e3e5] hover:border-[#506600]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold opacity-75">{isRtl ? 'إجمالي الوصفات' : 'Total Recipes'}</span>
            <BookOpen className={`w-3.5 h-3.5 ${statusFilter === 'all' && videoFilter === 'all' ? 'text-[#ccff00]' : 'text-[#506600]'}`} />
          </div>
          <span className="text-xl font-black">{totalCount}</span>
        </div>

        <div
          onClick={() => {
            setStatusFilter('published');
            setVideoFilter('all');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'published'
              ? 'bg-[#f7faf0] text-[#506600] border-[#506600] shadow-xs font-bold'
              : 'bg-white text-[#191c1e] border-[#e0e3e5] hover:border-[#506600]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#506600]">{isRtl ? 'منشورة للعملاء' : 'Published'}</span>
            <Eye className="w-3.5 h-3.5 text-[#506600]" />
          </div>
          <span className="text-xl font-black text-[#506600]">{publishedCount}</span>
        </div>

        <div
          onClick={() => {
            setStatusFilter('hidden');
            setVideoFilter('all');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'hidden'
              ? 'bg-[#fffbeb] text-[#d97706] border-[#d97706] shadow-xs font-bold'
              : 'bg-white text-[#191c1e] border-[#e0e3e5] hover:border-[#d97706]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#d97706]">{isRtl ? 'مخفية (مسودة)' : 'Hidden (Draft)'}</span>
            <EyeOff className="w-3.5 h-3.5 text-[#d97706]" />
          </div>
          <span className="text-xl font-black text-[#d97706]">{hiddenCount}</span>
        </div>

        <div
          onClick={() => {
            setStatusFilter('all');
            setVideoFilter('has_video');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            videoFilter === 'has_video'
              ? 'bg-[#f0f9ff] text-[#0284c7] border-[#0284c7] shadow-xs font-bold'
              : 'bg-white text-[#191c1e] border-[#e0e3e5] hover:border-[#0284c7]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[#0284c7]">{isRtl ? 'بفيديو توضيحي' : 'With Video'}</span>
            <Video className="w-3.5 h-3.5 text-[#0284c7]" />
          </div>
          <span className="text-xl font-black text-[#0284c7]">{withVideoCount}</span>
        </div>

        <div
          onClick={() => {
            setStatusFilter('archived');
            setVideoFilter('all');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'archived'
              ? 'bg-[#f2f4f6] text-[#565e74] border-[#191c1e] shadow-xs font-bold'
              : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#565e74]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold">{isRtl ? 'المؤرشفة' : 'Archived'}</span>
            <Archive className="w-3.5 h-3.5" />
          </div>
          <span className="text-xl font-black text-[#565e74]">{archivedCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#e0e3e5] shadow-xs flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#565e74] absolute top-3.5 left-3.5 rtl:right-3.5 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث باسم الوصفة بالعربية أو الإنجليزية...' : 'Search recipes in English or Arabic...'}
              className="w-full h-11 px-10 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] text-xs font-bold text-[#191c1e] focus:border-[#506600] outline-none"
            />
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: isRtl ? 'النشطة' : 'Active' },
              { id: 'published', label: isRtl ? 'منشورة' : 'Published' },
              { id: 'hidden', label: isRtl ? 'مخفية' : 'Hidden' },
              { id: 'archived', label: isRtl ? 'مؤرشفة' : 'Archived' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st.id
                    ? 'bg-[#191c1e] text-[#ccff00] shadow-xs'
                    : 'bg-[#f7f9fb] text-[#565e74] hover:bg-[#e0e3e5]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Video Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-[#eceef0] pt-3">
          <span className="text-xs font-bold text-[#565e74] flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{isRtl ? 'القسم:' : 'Category:'}</span>
          </span>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                categoryFilter === cat.id
                  ? 'bg-[#506600] text-white border-[#506600]'
                  : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#506600]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <span className="text-xs font-bold text-[#565e74] flex items-center gap-1 shrink-0 ml-2 rtl:mr-2 rtl:ml-0">
            <Video className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الفيديو:' : 'Video:'}</span>
          </span>

          {[
            { id: 'all', label: isRtl ? 'الكل' : 'All' },
            { id: 'has_video', label: isRtl ? 'يوجد فيديو' : 'Has Video' },
            { id: 'no_video', label: isRtl ? 'بدون فيديو' : 'No Video' },
          ].map((vf) => (
            <button
              key={vf.id}
              onClick={() => setVideoFilter(vf.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                videoFilter === vf.id
                  ? 'bg-[#0284c7] text-white border-[#0284c7]'
                  : 'bg-white text-[#565e74] border-[#e0e3e5] hover:border-[#0284c7]'
              }`}
            >
              {vf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes List / Table */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#e0e3e5] text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f2f4f6] text-[#565e74] flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#191c1e]">
            {isRtl ? 'لم يتم العثور على وصفات مطابقة' : 'No matching recipes found'}
          </h3>
          <p className="text-xs text-[#565e74]">
            {isRtl ? 'جرب تغيير شروط البحث أو الفلتر أعلاه، أو أضف وصفة جديدة.' : 'Try changing search keywords, filters, or add a new recipe.'}
          </p>
          <button
            onClick={onAddNewRecipe}
            className="mt-2 px-4 py-2 rounded-xl bg-[#191c1e] text-[#ccff00] text-xs font-bold hover:bg-black transition-all"
          >
            {isRtl ? 'إضافة وصفة جديدة' : 'Add New Recipe'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => {
            const isPublished = recipe.published !== false && !recipe.archived;
            const isArchived = recipe.archived === true;
            const hasVideo = Boolean(recipe.videoUrl && recipe.videoUrl.trim().length > 0);

            return (
              <div
                key={recipe.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isArchived
                    ? 'border-dashed border-gray-300 opacity-75'
                    : isPublished
                    ? 'border-[#e0e3e5] hover:border-[#506600]'
                    : 'border-amber-300 bg-amber-50/20'
                }`}
              >
                {/* Recipe Header Row with Image & Details */}
                <div className="p-4 flex items-start gap-3.5">
                  <div className="relative w-20 h-20 rounded-2xl bg-[#f2f4f6] overflow-hidden shrink-0">
                    <img
                      src={recipe.image}
                      alt={getLocalizedText(recipe.name, 'Recipe')}
                      className="w-full h-full object-cover"
                    />
                    {hasVideo && (
                      <button
                        onClick={() =>
                          setVideoPreviewUrl({
                            url: recipe.videoUrl!,
                            title: getLocalizedText(recipe.name, 'Recipe Video'),
                          })
                        }
                        title={isRtl ? 'معاينة رابط الفيديو' : 'Preview Video Link'}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#ccff00] hover:bg-black/60 transition-colors"
                      >
                        <Play className="w-5 h-5 fill-[#ccff00]" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title & Status Badges */}
                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <h4 className="text-sm font-black text-[#191c1e] truncate">
                        {getLocalizedText(recipe.name, 'Recipe')}
                      </h4>

                      {/* Status Badge */}
                      {isArchived ? (
                        <span className="px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 text-[10px] font-black shrink-0">
                          {isRtl ? 'مؤرشفة' : 'Archived'}
                        </span>
                      ) : isPublished ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#f7faf0] text-[#506600] border border-[#506600]/30 text-[10px] font-black shrink-0 flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5" />
                          <span>{isRtl ? 'منشورة' : 'Published'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black shrink-0 flex items-center gap-1">
                          <EyeOff className="w-2.5 h-2.5" />
                          <span>{isRtl ? 'مخفية' : 'Hidden'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#565e74] line-clamp-1 mb-2">
                      {getLocalizedText(recipe.description, '')}
                    </p>

                    {/* Quick Macros & Prep info */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#565e74]">
                      <span className="text-[#191c1e] font-extrabold">{recipe.calories || 0} kcal</span>
                      <span>•</span>
                      <span>P: {recipe.protein || 0}g</span>
                      <span>•</span>
                      <span>C: {recipe.carbohydrates ?? 0}g</span>
                      <span>•</span>
                      <span>F: {recipe.fat || 0}g</span>
                    </div>
                  </div>
                </div>

                {/* Video URL Display bar (if attached) */}
                <div className="px-4 py-2 bg-[#f7f9fb] border-t border-[#eceef0] flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 truncate max-w-[65%] text-[11px]">
                    <Video className={`w-3.5 h-3.5 shrink-0 ${hasVideo ? 'text-[#0284c7]' : 'text-gray-400'}`} />
                    {hasVideo ? (
                      <span className="truncate text-[#0284c7] font-medium" title={recipe.videoUrl}>
                        {recipe.videoUrl}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        {isRtl ? 'لا يوجد فيديو مرفق' : 'No video URL'}
                      </span>
                    )}
                  </div>

                  {hasVideo && (
                    <button
                      onClick={() => window.open(recipe.videoUrl, '_blank', 'noopener,noreferrer')}
                      className="text-[11px] font-extrabold text-[#0284c7] hover:underline flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{isRtl ? 'فتح الرابط' : 'Open Link'}</span>
                    </button>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="p-3 bg-[#fdfdfd] border-t border-[#eceef0] flex items-center justify-between gap-1.5">
                  {/* Quick Visibility Switch (Eye / EyeOff) */}
                  <button
                    onClick={() => toggleRecipeVisibility(recipe.id)}
                    title={
                      recipe.published === false
                        ? (isRtl ? 'نشر الوصفة لتظهر للمشتركين' : 'Publish recipe for clients')
                        : (isRtl ? 'إخفاء الوصفة عن المشتركين' : 'Hide recipe from clients')
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      recipe.published === false
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-[#f7faf0] text-[#506600] hover:bg-[#506600] hover:text-white'
                    }`}
                  >
                    {recipe.published === false ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{isRtl ? 'مخفية (اضغط للنشر)' : 'Hidden (Publish)'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{isRtl ? 'منشورة' : 'Published'}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Duplicate Action */}
                    <button
                      onClick={() => duplicateRecipe(recipe.id)}
                      title={isRtl ? 'تكرار الوصفة لإنشاء نسخة معدلة' : 'Duplicate recipe'}
                      className="p-2 rounded-xl bg-[#f2f4f6] text-[#191c1e] hover:bg-[#e0e3e5] active:scale-95 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Action */}
                    <button
                      onClick={() => onEditRecipe(recipe)}
                      title={isRtl ? 'تعديل كامل بيانات الوصفة' : 'Edit recipe details'}
                      className="p-2 rounded-xl bg-[#191c1e] text-[#ccff00] hover:bg-black active:scale-95 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Archive / Restore Action */}
                    <button
                      onClick={() => archiveRecipe(recipe.id, !recipe.archived)}
                      title={
                        recipe.archived
                          ? (isRtl ? 'استعادة من الأرشيف' : 'Restore from archive')
                          : (isRtl ? 'أرشفة الوصفة' : 'Archive recipe')
                      }
                      className="p-2 rounded-xl bg-[#f2f4f6] text-[#565e74] hover:bg-[#e0e3e5] active:scale-95 transition-all"
                    >
                      {recipe.archived ? (
                        <ArchiveRestore className="w-3.5 h-3.5 text-[#506600]" />
                      ) : (
                        <Archive className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Delete Action with confirm */}
                    <button
                      onClick={() => setRecipeToDelete(recipe)}
                      title={isRtl ? 'حذف الوصفة نهائياً' : 'Delete recipe permanently'}
                      className="p-2 rounded-xl bg-[#fff0f0] text-[#ba1a1a] hover:bg-[#ffdad6] active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-[#eceef0] flex flex-col gap-4 text-start animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-[#fff0f0] text-[#ba1a1a] flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-[#191c1e]">
                {isRtl ? 'تأكيد حذف الوصفة' : 'Delete Recipe Confirmation'}
              </h3>
              <p className="text-xs text-[#565e74] mt-1">
                {isRtl
                  ? `هل أنت متأكد من رغبتك في حذف وصفة "${getLocalizedText(recipeToDelete.name, 'Recipe')}" نهائياً من قاعدة البيانات؟`
                  : `Are you sure you want to permanently delete "${getLocalizedText(recipeToDelete.name, 'Recipe')}" from the Recipe Database?`}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRecipeToDelete(null)}
                className="flex-1 h-10 rounded-xl bg-[#f2f4f6] text-[#191c1e] font-bold text-xs hover:bg-[#e0e3e5] transition-colors"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRecipe(recipeToDelete.id);
                  setRecipeToDelete(null);
                }}
                className="flex-1 h-10 rounded-xl bg-[#ba1a1a] text-white font-black text-xs hover:bg-[#93000a] transition-colors shadow-xs"
              >
                {isRtl ? 'نعم، احذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Video Player Modal */}
      {videoPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xl shadow-2xl border border-[#eceef0] flex flex-col gap-3 text-start animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#0284c7]" />
                <h4 className="text-sm font-black text-[#191c1e]">{videoPreviewUrl.title}</h4>
              </div>
              <button
                onClick={() => setVideoPreviewUrl(null)}
                className="text-xs font-bold text-[#565e74] hover:text-[#191c1e]"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>

            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {videoPreviewUrl.url.includes('youtube.com') || videoPreviewUrl.url.includes('youtu.be') ? (
                <iframe
                  src={
                    videoPreviewUrl.url.includes('embed')
                      ? videoPreviewUrl.url
                      : `https://www.youtube.com/embed/${
                          videoPreviewUrl.url.includes('v=')
                            ? videoPreviewUrl.url.split('v=')[1]?.split('&')[0]
                            : videoPreviewUrl.url.split('/').pop()
                        }`
                  }
                  title={videoPreviewUrl.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center gap-3 p-6 text-center text-white">
                  <Play className="w-12 h-12 text-[#ccff00]" />
                  <p className="text-xs text-gray-300 font-mono break-all max-w-md">
                    {videoPreviewUrl.url}
                  </p>
                  <a
                    href={videoPreviewUrl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#ccff00] text-[#191c1e] font-black text-xs hover:bg-white transition-colors"
                  >
                    {isRtl ? 'فتح في نافذة جديدة' : 'Open Video Link'}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#565e74] pt-1">
              <span>{isRtl ? 'معاينة مشغل الفيديو التوضيحي' : 'Video demonstration preview'}</span>
              <button
                onClick={() => setVideoPreviewUrl(null)}
                className="px-4 py-1.5 rounded-xl bg-[#191c1e] text-white font-bold text-xs hover:bg-black"
              >
                {isRtl ? 'تم' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
