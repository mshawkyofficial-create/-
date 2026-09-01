import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductType } from '../../types';
import { X, UserPlus, Sparkles, Dumbbell, Apple, BookOpen } from 'lucide-react';

interface TrainerAddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: (clientId: string) => void;
}

export const TrainerAddClientModal: React.FC<TrainerAddClientModalProps> = ({
  isOpen,
  onClose,
  onClientAdded,
}) => {
  const { addClient, trainingPrograms, nutritionPlans, language } = useApp();
  const isRtl = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weightKg, setWeightKg] = useState(82);
  const [targetWeightKg, setTargetWeightKg] = useState(76);
  const [dailyCalories, setDailyCalories] = useState(2200);
  const [proteinGrams, setProteinGrams] = useState(165);
  const [carbsGrams, setCarbsGrams] = useState(240);
  const [fatGrams, setFatGrams] = useState(65);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>(['full_access']);
  const [assignedProgramId, setAssignedProgramId] = useState<string>(
    trainingPrograms[0]?.id || ''
  );
  const [assignedNutritionId, setAssignedNutritionId] = useState<string>(
    nutritionPlans[0]?.id || ''
  );

  if (!isOpen) return null;

  const toggleProduct = (prod: ProductType) => {
    if (selectedProducts.includes(prod)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prod));
      }
    } else {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient = addClient({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@shawkyfit.com`,
      phone: phone.trim() || '+971 50 000 0000',
      weightKg,
      targetWeightKg,
      dailyCaloriesTarget: dailyCalories,
      proteinTarget: proteinGrams,
      carbsTarget: carbsGrams,
      fatTarget: fatGrams,
      activeProducts: selectedProducts,
      currentTrainingProgramId: assignedProgramId,
      currentNutritionPlanId: assignedNutritionId,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
    });

    if (onClientAdded) {
      onClientAdded(newClient.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-start">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-xl shadow-2xl border border-[#eceef0] max-h-[90vh] overflow-y-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ccff00]/30 text-[#506600] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#191c1e]">
                {isRtl ? 'إضافة مشترك / عميل جديد' : 'Add New Client / Athlete'}
              </h3>
              <p className="text-xs text-[#565e74]">
                {isRtl ? 'إنشاء حساب العميل وتعيين الخطة والماكروز' : 'Create profile and assign initial training & nutrition'}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'اسم العميل' : 'Client Full Name'} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mansour"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#ccff00]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tariq@example.com"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'رقم الهاتف' : 'Phone'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الوزن الحالي (كجم)' : 'Current Weight (kg)'}
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'الوزن المستهدف (كجم)' : 'Target Weight (kg)'}
              </label>
              <input
                type="number"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none focus:ring-2 focus:ring-[#ccff00]"
              />
            </div>
          </div>

          {/* Subscribed Products */}
          <div>
            <label className="text-xs font-bold text-[#565e74] uppercase block mb-1.5">
              {isRtl ? 'الباقات المفعلة للعميل' : 'Active Client Products / Entitlements'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'full_access' as ProductType, label: isRtl ? 'VIP تدريب وتغذية' : 'Full VIP Access' },
                { id: 'training' as ProductType, label: isRtl ? 'تدريب فقط' : 'Training Only' },
                { id: 'nutrition' as ProductType, label: isRtl ? 'تغذية فقط' : 'Nutrition Only' },
                { id: 'recipe_book' as ProductType, label: isRtl ? 'كتاب الوصفات' : 'Recipe Book' },
              ].map((p) => {
                const isSelected = selectedProducts.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`h-10 px-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#ccff00] border-[#506600] text-[#191c1e] shadow-xs'
                        : 'bg-[#f2f4f6] border-[#e0e3e5] text-[#565e74] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Plan Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#eceef0]">
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'تعيين خطة تدريب مبدئية' : 'Assign Training Program'}
              </label>
              <select
                value={assignedProgramId}
                onChange={(e) => setAssignedProgramId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                {trainingPrograms.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {isRtl ? prog.title.ar : prog.title.en} ({prog.durationWeeks} wks)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#565e74] uppercase block mb-1">
                {isRtl ? 'تعيين خطة تغذية مبدئية' : 'Assign Nutrition Plan'}
              </label>
              <select
                value={assignedNutritionId}
                onChange={(e) => setAssignedNutritionId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#f2f4f6] text-xs font-bold text-[#191c1e] outline-none"
              >
                {nutritionPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {isRtl ? plan.title.ar : plan.title.en} ({plan.dailyCalories} kcal)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily Macros Targets */}
          <div className="p-3.5 rounded-2xl bg-[#f7faf0] border border-[#506600]/20 flex flex-col gap-2">
            <span className="text-xs font-bold text-[#506600] uppercase">
              {isRtl ? 'الأهداف الغذائية اليومية المستهدفة' : 'Target Daily Macros'}
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-[#565e74] block">{isRtl ? 'السعرات' : 'Calories'}</span>
                <input
                  type="number"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(Number(e.target.value))}
                  className="w-full h-9 px-2 rounded-lg bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#565e74] block">{isRtl ? 'بروتين (جم)' : 'Protein (g)'}</span>
                <input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  className="w-full h-9 px-2 rounded-lg bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#565e74] block">{isRtl ? 'كارب (جم)' : 'Carbs (g)'}</span>
                <input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  className="w-full h-9 px-2 rounded-lg bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#565e74] block">{isRtl ? 'دهون (جم)' : 'Fat (g)'}</span>
                <input
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  className="w-full h-9 px-2 rounded-lg bg-white border border-[#e0e3e5] text-xs font-bold text-[#191c1e]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-[#191c1e] font-black text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'حفظ وإضافة العميل' : 'Save & Add Client'}</span>
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
