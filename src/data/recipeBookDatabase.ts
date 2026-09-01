import { Recipe } from '../types';

export const shawkyRecipeBookDatabase: Recipe[] = [
  // ==========================================
  // 1. وجبات الفطور (HIGH-PROTEIN BREAKFAST)
  // ==========================================
  {
    id: 'rec_protein_pancakes',
    name: {
      en: 'Blueberry Protein Fluffy Pancakes',
      ar: 'بان كيك البروتين بالتوت الأزرق'
    },
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preparationTimeMin: 10,
    cookTimeMin: 5,
    category: 'breakfast',
    mealType: 'breakfast',
    servingSize: '1 serving (3 pancakes)',
    calories: 448,
    protein: 48,
    carbohydrates: 54,
    fat: 5,
    tags: ['High Protein', 'Under 15m', 'Breakfast', 'Low Fat'],
    ingredients: [
      { ingredientId: 'ing_oats', name: { en: 'Rolled Oats (Blended)', ar: 'شوفان مطحون' }, amountGrams: 60, amount: '60g', unit: 'g' },
      { ingredientId: 'ing_whey_protein', name: { en: 'Whey Protein Isolate (Vanilla)', ar: 'واي بروتين آيزوليت فانيليا' }, amountGrams: 30, amount: '1 scoop (30g)', unit: 'g' },
      { ingredientId: 'ing_egg_whites', name: { en: 'Liquid Egg Whites', ar: 'بياض بيض سائل' }, amountGrams: 120, amount: '120g (approx 3 whites)', unit: 'g' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' }, amountGrams: 50, amount: '50g', unit: 'g' },
      { ingredientId: 'ing_blueberries', name: { en: 'Fresh Blueberries', ar: 'توت أزرق طازج' }, amountGrams: 40, amount: '40g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Place the rolled oats in a blender and pulse until a fine flour forms.',
        'Add vanilla whey protein, liquid egg whites, and 0% Greek yogurt. Blend on medium for 30 seconds until a smooth batter forms.',
        'Heat a non-stick skillet over medium-low heat and lightly coat with cooking spray.',
        'Pour the batter into 3 equal circles. Drop fresh blueberries evenly on top of each pancake.',
        'Cook for 2-3 minutes until bubbles appear on the surface and edges look set.',
        'Gently flip and cook for another 1-2 minutes until golden brown.',
        'Serve warm with a drizzle of sugar-free maple syrup or a dash of cinnamon.'
      ],
      ar: [
        'اطحن الشوفان في الخلاط حتى يتحول إلى دقيق ناعم.',
        'أضف سكوب الواي بروتين فانيليا، بياض البيض والزبادي اليوناني خالي الدسم. اخلط لمدة 30 ثانية حتى يتجانس الخليط.',
        'سخن مقلاة غير لاصقة على نار متوسطة هادئة مع رشة خفيفة من بخاخ الزيت.',
        'اسكب الخليط لتشكيل 3 أقراص بان كيك متساوية، ثم وزع حبات التوت الأزرق على الوجه.',
        'اتركها لمدة دقيقتين إلى 3 دقائق حتى تظهر فقاعات على السطح وتتماسك الأطراف.',
        'اقلب البان كيك بحذر واطهه لمدة دقيقة إلى دقيقتين إضافيتين حتى يصبح ذهبي اللون.',
        'قدمه دافئاً مع رشة قرفة أو سيرب خالي من السكر.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_turkish_shakshuka',
    name: {
      en: 'Turkish High-Protein Egg Shakshuka with Feta',
      ar: 'شكشوكة البيض التركية بالجبن الفيتا'
    },
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 12,
    cookTimeMin: 8,
    category: 'breakfast',
    mealType: 'breakfast',
    servingSize: '1 pan serving',
    calories: 340,
    protein: 28,
    carbohydrates: 16,
    fat: 18,
    tags: ['High Protein', 'Under 15m', 'Breakfast', 'Keto Friendly'],
    ingredients: [
      { ingredientId: 'ing_eggs', name: { en: 'Whole Eggs', ar: 'بيض كامل' }, amountGrams: 100, amount: '2 large eggs', unit: 'eggs' },
      { ingredientId: 'ing_egg_whites', name: { en: 'Egg Whites', ar: 'بياض بيض' }, amountGrams: 80, amount: '80g (2 whites)', unit: 'g' },
      { ingredientId: 'ing_tomato', name: { en: 'Diced Ripe Tomatoes', ar: 'طماطم مفرومة طازجة' }, amountGrams: 120, amount: '120g', unit: 'g' },
      { ingredientId: 'ing_bell_pepper', name: { en: 'Red & Green Bell Pepper', ar: 'فلفل رومي ملون مفروم' }, amountGrams: 60, amount: '60g', unit: 'g' },
      { ingredientId: 'ing_feta', name: { en: 'Light Feta Cheese Crumbles', ar: 'جبنة فيتا لايت مفتتة' }, amountGrams: 30, amount: '30g', unit: 'g' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر' }, amountGrams: 5, amount: '1 tsp (5g)', unit: 'g' }
    ],
    instructions: {
      en: [
        'Heat olive oil in a small skillet over medium heat. Sauté diced bell peppers for 2 minutes until soft.',
        'Add diced ripe tomatoes, cumin, smoked paprika, black pepper, and sea salt. Simmer for 3 minutes until thick tomato sauce forms.',
        'Create small wells in the simmering sauce. Pour in the whole eggs and liquid egg whites.',
        'Cover the pan and cook on low heat for 4-5 minutes until egg whites are set and yolks remain slightly runny.',
        'Remove cover, scatter crumbled light feta cheese and chopped fresh parsley over the top. Serve hot in the skillet.'
      ],
      ar: [
        'سخن زيت الزيتون في مقلاة صغيرة على نار متوسطة، ثم شوح الفلفل الرومي لمدة دقيقتين حتى يلين.',
        'أضف الطماطم المفرومة، الكمون، البابريكا المدخنة، الفلفل الأسود ورشة الملح. اتركها تتسبك لمدة 3 دقائق.',
        'اصنع تجاويف صغيرة في الصلصة، ثم اسكب البيضتين وبياض البيض.',
        'غطِ المقلاة واتركها على نار هادئة لمدة 4 إلى 5 دقائق حتى ينضج بياض البيض ويبقى الصفار طرياً.',
        'ارفع الغطاء ورش جبنة الفيتا اللايت والبقدونس المفروم وقدمها ساخنة مباشرة.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_baked_apple_cinnamon_oats',
    name: {
      en: 'Baked Cinnamon Apple Protein Oats',
      ar: 'شوفان مخبوز بالتفاح والقرفة والواي بروتين'
    },
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 15,
    category: 'breakfast',
    mealType: 'breakfast',
    servingSize: '1 ramekin serving',
    calories: 385,
    protein: 36,
    carbohydrates: 48,
    fat: 6,
    tags: ['High Protein', 'Breakfast', 'Meal Prep', 'Air Fryer'],
    ingredients: [
      { ingredientId: 'ing_oats', name: { en: 'Rolled Oats', ar: 'شوفان كامل الحبة' }, amountGrams: 50, amount: '50g', unit: 'g' },
      { ingredientId: 'ing_whey_protein', name: { en: 'Vanilla Whey Protein', ar: 'واي بروتين فانيليا' }, amountGrams: 30, amount: '1 scoop (30g)', unit: 'g' },
      { ingredientId: 'ing_apple', name: { en: 'Diced Honeycrisp/Green Apple', ar: 'تفاح مفروم مكعبات صغيرة' }, amountGrams: 80, amount: '80g', unit: 'g' },
      { ingredientId: 'ing_almond_milk', name: { en: 'Unsweetened Almond Milk', ar: 'حليب لوز غير محلى' }, amountGrams: 100, amount: '100ml', unit: 'ml' },
      { ingredientId: 'ing_cinnamon', name: { en: 'Ceylon Cinnamon & Baking Powder', ar: 'قرفة مطحونة ورشة بيكنج بودر' }, amountGrams: 3, amount: '1/2 tsp', unit: 'g' }
    ],
    instructions: {
      en: [
        'Preheat oven or air fryer to 180°C (350°F).',
        'In an oven-safe bowl or ramekin, mix rolled oats, vanilla whey protein, cinnamon, and 1/2 tsp baking powder.',
        'Pour in unsweetened almond milk and stir thoroughly until well combined.',
        'Fold in diced apple pieces, reserving a few slices for the top topping.',
        'Bake for 12-15 minutes until top is golden and center is warm and fluffy cake-like texture.',
        'Let rest for 2 minutes and enjoy warm.'
      ],
      ar: [
        'سخن الفرن أو القلاية الهوائية مسبقاً على حرارة 180 مئوية.',
        'في وعاء مقاوم لحرارة الفرن، اخلط الشوفان، الواي بروتين فانيليا، القرفة ورشة البيكنج بودر.',
        'اسكب حليب اللوز غير المحلى وقلب جيداً حتى يمتزج الخليط.',
        'أضف مكعبات التفاح وقلب، مع الاحتفاظ ببعض الشرائح للتزيين في الأعلى.',
        'اخبز لمدة 12-15 دقيقة حتى يكتسب السطح قرمشة خفيفة ويصبح القوام كالكيك الطري.',
        'اتركه يهدأ لدقيقتين واستمتع به دافئاً.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_french_toast_protein',
    name: {
      en: 'Crispy High-Protein French Toast',
      ar: 'فرنش توست البروتين الصحي المقرمش'
    },
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 8,
    cookTimeMin: 6,
    category: 'breakfast',
    mealType: 'breakfast',
    servingSize: '2 thick slices',
    calories: 370,
    protein: 38,
    carbohydrates: 42,
    fat: 5,
    tags: ['High Protein', 'Under 15m', 'Breakfast', 'Quick'],
    ingredients: [
      { ingredientId: 'ing_sourdough', name: { en: 'Sourdough or Whole Grain Bread', ar: 'خبز ساوردو أو توست حبوب كاملة' }, amountGrams: 70, amount: '2 slices (70g)', unit: 'g' },
      { ingredientId: 'ing_egg_whites', name: { en: 'Liquid Egg Whites', ar: 'بياض بيض سائل' }, amountGrams: 120, amount: '120g', unit: 'g' },
      { ingredientId: 'ing_whey_protein', name: { en: 'Vanilla Whey Isolate', ar: 'واي بروتين آيزوليت فانيليا' }, amountGrams: 20, amount: '20g', unit: 'g' },
      { ingredientId: 'ing_almond_milk', name: { en: 'Unsweetened Almond Milk', ar: 'حليب لوز خالي من السكر' }, amountGrams: 40, amount: '40ml', unit: 'ml' },
      { ingredientId: 'ing_berries', name: { en: 'Fresh Strawberries', ar: 'فراولة طازجة' }, amountGrams: 50, amount: '50g', unit: 'g' }
    ],
    instructions: {
      en: [
        'In a shallow dish, whisk together liquid egg whites, vanilla whey protein, almond milk, cinnamon, and a drop of vanilla extract.',
        'Dip bread slices into the batter, allowing each side to soak for 20 seconds.',
        'Heat a non-stick skillet on medium heat with a light spray of olive oil.',
        'Sear the bread slices for 2-3 minutes per side until golden brown and crisp on the edges.',
        'Top with sliced fresh strawberries and zero-calorie syrup.'
      ],
      ar: [
        'في طبق واسع، اخفق بياض البيض مع الواي بروتين، حليب اللوز، القرفة وقطرات الفانيليا.',
        'غمس شرائح الخبز في الخليط واتركها تتشرب لمدة 20 ثانية لكل جانب.',
        'سخن مقلاة غير لاصقة على نار متوسطة مع رشة بخاخ زيت خفيفة.',
        'اطهِ شرائح التوست لمدة دقيقتين إلى 3 دقائق لكل جانب حتى تتحمر وتصبح مقرمشة الأطراف.',
        'زين بشرائح الفراولة الطازجة مع سيرب خالي من السعرات.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_avocado_egg_bowl',
    name: {
      en: 'Creamy Avocado & Poached Farm Egg Bowl',
      ar: 'وعاء الأفوكادو والبيض المسلوق'
    },
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 5,
    category: 'breakfast',
    mealType: 'breakfast',
    servingSize: '1 bowl',
    calories: 420,
    protein: 26,
    carbohydrates: 28,
    fat: 22,
    tags: ['Under 15m', 'Breakfast', 'Healthy Fats'],
    ingredients: [
      { ingredientId: 'ing_eggs', name: { en: 'Farm Fresh Whole Eggs', ar: 'بيض كامل بلدي' }, amountGrams: 100, amount: '2 eggs', unit: 'eggs' },
      { ingredientId: 'ing_egg_whites', name: { en: 'Egg Whites', ar: 'بياض بيض' }, amountGrams: 60, amount: '60g', unit: 'g' },
      { ingredientId: 'ing_avocado', name: { en: 'Ripe Avocado', ar: 'أفوكادو طازج ناضج' }, amountGrams: 70, amount: '70g (approx 1/2 avocado)', unit: 'g' },
      { ingredientId: 'ing_sourdough', name: { en: 'Toasted Sourdough Slice', ar: 'شريحة خبز ساوردو محمصة' }, amountGrams: 40, amount: '1 slice (40g)', unit: 'g' }
    ],
    instructions: {
      en: [
        'Bring water with a splash of apple cider vinegar to a gentle simmer in a small saucepan.',
        'Swirl water to create a gentle vortex and slide in cracked eggs and whites. Poach for 3 minutes for soft yolks.',
        'Mash fresh avocado in a bowl with sea salt, cracked black pepper, and lime juice.',
        'Spread mashed avocado on toasted sourdough, top with poached eggs, and sprinkle red chili flakes.'
      ],
      ar: [
        'اغلِ ماء مع ملعقة خل في قدر صغير على نار هادئة.',
        'حرك الماء بشكل دائري برفق ثم اسكب البيض والبياض. اتركه يسلق لمدة 3 دقائق للحصول على صفار طري.',
        'اهرس الأفوكادو في وعاء مع ملح بحري، فلفل أسود وعصير ليمون.',
        'افرد الأفوكادو على خبز الساوردو المحمص وضع فوقه البيض المسلوق ورشة رقائق شطة.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 2. وجبات أساسية (MAIN MEALS - LUNCH & DINNER)
  // ==========================================
  {
    id: 'rec_miso_salmon',
    name: {
      en: 'Miso Glazed Atlantic Salmon Bowl',
      ar: 'وعاء السلمون بصلصة الميسو والأرز الياسمين'
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preparationTimeMin: 12,
    cookTimeMin: 10,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 bowl serving',
    calories: 520,
    protein: 44,
    carbohydrates: 48,
    fat: 16,
    tags: ['High Protein', 'Under 15m', 'Omega 3', 'Lunch', 'Dinner'],
    ingredients: [
      { ingredientId: 'ing_salmon', name: { en: 'Fresh Atlantic Salmon Filet', ar: 'فيليه سلمون أطلسي طازج' }, amountGrams: 170, amount: '170g', unit: 'g' },
      { ingredientId: 'ing_rice', name: { en: 'Steamed Jasmine Rice (Cooked)', ar: 'أرز ياسمين مطبوخ' }, amountGrams: 160, amount: '160g', unit: 'g' },
      { ingredientId: 'ing_edamame', name: { en: 'Steamed Shelled Edamame', ar: 'فول إدامامي مقشر مسلوق' }, amountGrams: 50, amount: '50g', unit: 'g' },
      { ingredientId: 'ing_avocado', name: { en: 'Fresh Sliced Avocado', ar: 'شرائح أفوكادو' }, amountGrams: 35, amount: '35g', unit: 'g' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Extra Virgin Olive Oil / Sesame', ar: 'زيت سمسم أو زيت زيتون' }, amountGrams: 4, amount: '1 tsp (4g)', unit: 'g' }
    ],
    instructions: {
      en: [
        'Mix 1 tsp white miso paste with low-sodium soy sauce, garlic, and fresh lime juice.',
        'Brush the marinade evenly over the fresh salmon filet.',
        'Heat olive oil in a non-stick skillet over medium-high heat. Sear salmon for 3-4 minutes per side until caramelized.',
        'Assemble the bowl: place warm steamed jasmine rice at base.',
        'Top with the seared salmon filet, steamed edamame, sliced avocado, and garnish with toasted sesame seeds and green onions.'
      ],
      ar: [
        'اخلط معجون الميسو مع صويا صوص قليل الصوديوم، ثوم مهروس وعصير ليمون.',
        'ادهن فيليه السلمون بالتتبيلة بالتساوي من جميع الجهات.',
        'سخن المقلاة مع ملعقة صغيرة زيت على نار متوسطة إلى عالية، واشوِ السلمون 3-4 دقائق لكل جانب.',
        'في وعاء التقديم، ضع أرز الياسمين الدافئ كقاعدة.',
        'رتب فوقه فيليه السلمون المشوي، الإدامامي وشرائح الأفوكادو، وزين بالسمسم المحمص والبصل الأخضر.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_steak_sweet_potato',
    name: {
      en: 'Charred Flank Steak & Roasted Sweet Potato',
      ar: 'ستيك اللحم المشوي مع البطاطا الحلوة'
    },
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    preparationTimeMin: 10,
    cookTimeMin: 15,
    category: 'main_meals',
    mealType: 'dinner',
    servingSize: '1 plate serving',
    calories: 535,
    protein: 51,
    carbohydrates: 36,
    fat: 20,
    tags: ['High Protein', 'Dinner', 'Iron Rich', 'Bulking'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Lean Flank Steak / Tenderloin', ar: 'فيليه لحم بقري صافي قليل الدهن' }, amountGrams: 180, amount: '180g', unit: 'g' },
      { ingredientId: 'ing_sweet_potato', name: { en: 'Sweet Potato Cubes', ar: 'مكعبات بطاطا حلوة' }, amountGrams: 180, amount: '180g', unit: 'g' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' }, amountGrams: 8, amount: '8g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Toss diced sweet potatoes with 4g olive oil, smoked paprika, sea salt, and air-fry at 200°C for 15 minutes.',
        'Season steak generously with coarse sea salt, black pepper, and garlic powder.',
        'Preheat a cast iron skillet over high heat until smoking hot.',
        'Sear steak for 3-4 minutes on the first side, flip and sear for 2-3 minutes for medium-rare.',
        'Rest steak on a cutting board for 5 minutes before slicing against the grain.',
        'Plate sliced steak next to the roasted sweet potato cubes and steamed greens.'
      ],
      ar: [
        'تبل مكعبات البطاطا الحلوة مع نصف كمية زيت الزيتون والبابريكا والملح واشوها في القلاية الهوائية على 200 مئوية لمدة 15 دقيقة.',
        'تبل قطعة الستيك بملح البحر الخشن، فلفل أسود مجروش وبودرة ثوم.',
        'سخن مقلاة حديد زهر على نار عالية جداً.',
        'اشوِ الستيك لمدة 3-4 دقائق على الوجه الأول، ثم اقلب لمدة 2-3 دقائق لدرجة نضج متوسطة.',
        'اترك الستيك ليرتاح 5 دقائق قبل التقطيع بعكس اتجاه الألياف.',
        'قدم شرائح الستيك مع مكعبات البطاطا الحلوة المقرمشة.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_crispy_chicken_quesadilla',
    name: {
      en: 'Crispy High-Protein Chicken & Cheese Quesadilla',
      ar: 'كاساديا الدجاج المقرمشة بالجبن اللايت'
    },
    image: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 8,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 full quesadilla',
    calories: 460,
    protein: 48,
    carbohydrates: 38,
    fat: 12,
    tags: ['High Protein', 'Under 15m', 'Quick Meals', 'Lunch'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Cooked Shredded Chicken Breast', ar: 'صدر دجاج مسلوق أو مشوي ومفتت' }, amountGrams: 150, amount: '150g', unit: 'g' },
      { ingredientId: 'ing_tortilla', name: { en: 'Whole Wheat Large Tortilla', ar: 'خبز تورتيلا قمح كامل كبير' }, amountGrams: 55, amount: '1 tortilla (55g)', unit: 'piece' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Low Fat Mozzarella / Light Cheddar', ar: 'جبنة موزاريلا لايت قليلة الدسم' }, amountGrams: 40, amount: '40g', unit: 'g' },
      { ingredientId: 'ing_bell_pepper', name: { en: 'Diced Bell Pepper & Red Onion', ar: 'فلفل رومي وبصل مفروم ناعم' }, amountGrams: 50, amount: '50g', unit: 'g' }
    ],
    instructions: {
      en: [
        'In a bowl, mix shredded chicken with fajita seasoning, diced bell peppers, and onion.',
        'Place a whole wheat tortilla flat on a dry hot skillet over medium heat.',
        'Layer half the light cheese on one half of the tortilla, top with seasoned chicken mixture, and cover with remaining cheese.',
        'Fold tortilla over to form a half-moon shape. Press down gently with a spatula.',
        'Cook for 3-4 minutes per side until tortilla is crispy golden and cheese is completely melted.',
        'Slice into 3 wedges and serve with light Greek yogurt dip or fresh salsa.'
      ],
      ar: [
        'في وعاء، اخلط الدجاج المفتت مع بهارات الفاهيتا والفلفل الرومي والبصل المفروم.',
        'ضع خبز التورتيلا في مقلاة ساخنة على نار متوسطة.',
        'وزع نصف الجبنة اللايت على نصف التورتيلا، ثم أضف خليط الدجاج وغطه بباقي الجبنة.',
        'اطوِ الخبز على شكل نصف دائرة واضغط بخفة باستخدام ملعقة التقليب.',
        'اطهِ لمدة 3-4 دقائق لكل جانب حتى يصبح الخبز مقرمشاً وتذوب الجبنة تماماً.',
        'قطعها إلى 3 مثلثات وقدمها مع صوص الزبادي أو السالسا الطازجة.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_gourmet_lean_burger',
    name: {
      en: 'Gourmet Lean Beef Burger with Air-Fried Potato Wedges',
      ar: 'برجر اللحم الصافي الصحي مع ودجز البطاطس بالقلاية'
    },
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 12,
    cookTimeMin: 12,
    category: 'main_meals',
    mealType: 'dinner',
    servingSize: '1 burger + side wedges',
    calories: 495,
    protein: 50,
    carbohydrates: 44,
    fat: 13,
    tags: ['High Protein', 'Comfort Food', 'Dinner', 'Air Fryer'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: '95% Extra Lean Ground Beef', ar: 'لحم بقري مفروم قليل الدهن 95%' }, amountGrams: 160, amount: '160g', unit: 'g' },
      { ingredientId: 'ing_bun', name: { en: 'Whole Wheat Brioche / Potato Bun', ar: 'خبز برجر حبوب كاملة أو بطاطس' }, amountGrams: 50, amount: '1 bun (50g)', unit: 'piece' },
      { ingredientId: 'ing_potato', name: { en: 'Fresh Potato Wedges', ar: 'أصابع بطاطس طازجة' }, amountGrams: 150, amount: '150g', unit: 'g' },
      { ingredientId: 'ing_cheese_slice', name: { en: 'Light Cheddar Cheese Slice', ar: 'شريحة جبن شيدر لايت' }, amountGrams: 20, amount: '1 slice (20g)', unit: 'slice' }
    ],
    instructions: {
      en: [
        'Cut fresh potatoes into wedges, season with paprika, garlic, sea salt, and air-fry at 200°C for 15 minutes until crispy.',
        'Form lean ground beef into a burger patty. Season both sides with salt, pepper, and onion powder.',
        'Grill in a hot skillet for 3-4 minutes per side. Place cheese slice on top during the last minute to melt.',
        'Lightly toast the bun in the pan.',
        'Assemble burger with lettuce, tomato, pickles, and light burger sauce (Greek yogurt + mustard + light ketchup).',
        'Serve immediately alongside the hot crispy potato wedges.'
      ],
      ar: [
        'قطع البطاطس إلى أصابع ودجز وتبلها بالبابريكا، بودرة الثوم والملح واشوها بالقلاية الهوائية على 200 مئوية لمدة 15 دقيقة.',
        'شكل اللحم المفروم على شكل قرص برجر، وتبل الجانبين بالملح والفلفل الأسود وبودرة البصل.',
        'اشوِ القرص في مقلاة ساخنة لمدة 3-4 دقائق لكل جانب، ثم ضع شريحة الجبن في الدقيقة الأخيرة لتذوب.',
        'حمص خبز البرجر خفيفاً في نفس المقلاة.',
        'ركب البرجر مع الخس، الطماطم، الخيار المخلل وصوص البرجر الصحي (زبادي + خردل + كيتشاب لايت).',
        'قدمه فوراً بجانب ودجز البطاطس المقرمشة.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_healthy_butter_chicken',
    name: {
      en: 'Healthy High-Protein Butter Chicken with Basmati Rice',
      ar: 'دجاج بالزبدة الصحي مع الأرز البسمتي الهندي'
    },
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 15,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 bowl',
    calories: 490,
    protein: 52,
    carbohydrates: 45,
    fat: 11,
    tags: ['High Protein', 'Meal Prep', 'Lunch', 'Dinner'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Diced Chicken Breast', ar: 'صدور دجاج مكعبات' }, amountGrams: 180, amount: '180g', unit: 'g' },
      { ingredientId: 'ing_rice', name: { en: 'Cooked Basmati Rice', ar: 'أرز بسمتي مطبوخ' }, amountGrams: 150, amount: '150g', unit: 'g' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt (Sauce Base)', ar: 'زبادي يوناني خالي الدسم لصوص الكريمة' }, amountGrams: 80, amount: '80g', unit: 'g' },
      { ingredientId: 'ing_tomato_puree', name: { en: 'Tomato Puree / Passata', ar: 'صلصة طماطم بيوريه طبيعية' }, amountGrams: 100, amount: '100g', unit: 'g' },
      { ingredientId: 'ing_cashew_butter', name: { en: 'Light Cashew Butter / Coconut Cream', ar: 'زبدة كاجو طبيعية خفيفة' }, amountGrams: 10, amount: '10g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Marinate diced chicken with Greek yogurt, garam masala, turmeric, ginger, garlic, and sea salt for 10 minutes.',
        'Sear chicken cubes in a non-stick pan until nicely charred, then remove and set aside.',
        'In the same pan, add tomato puree, cashew butter, and spices. Simmer on low heat for 5 minutes until rich and fragrant.',
        'Stir Greek yogurt into the warm sauce and blend until completely silky.',
        'Return chicken to the sauce and simmer for 3 minutes.',
        'Serve hot over steamed basmati rice with fresh coriander.'
      ],
      ar: [
        'تبل مكعبات الدجاج بالزبادي اليوناني، بهارات الجرام ماسالا، كركم، زنجبيل، ثوم وملح لمدة 10 دقائق.',
        'شوح الدجاج في مقلاة غير لاصقة حتى يتحمر، ثم ارفعه جانباً.',
        'في نفس المقلاة، أضف صلصة الطماطم وزبدة الكاجو والبهارات، واتركها تتسبك على نار هادئة 5 دقائق.',
        'أضف الزبادي اليوناني للصلصة وحرك جيداً حتى يصبح قوامها حريرياً ناعماً.',
        'أعد الدجاج إلى الصلصة واتركه يتشرب النكهات لمدة 3 دقائق.',
        'قدمه ساخناً فوق الأرز البسمتي وزين بالكزبرة الطازجة.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_grilled_sea_bass_quinoa',
    name: {
      en: 'Mediterranean Grilled Sea Bass with Lemon Herb Quinoa',
      ar: 'فيليه سمك القاروص المشوي مع الكينوا والليمون'
    },
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 12,
    category: 'main_meals',
    mealType: 'dinner',
    servingSize: '1 plate',
    calories: 420,
    protein: 48,
    carbohydrates: 32,
    fat: 10,
    tags: ['High Protein', 'Under 15m', 'Lean Protein', 'Dinner'],
    ingredients: [
      { ingredientId: 'ing_salmon', name: { en: 'Fresh White Sea Bass Filet', ar: 'فيليه سمك قاروص أبيض طازج' }, amountGrams: 200, amount: '200g', unit: 'g' },
      { ingredientId: 'ing_quinoa', name: { en: 'Cooked Fluffy Quinoa', ar: 'كينوا مطبوخة خفيفة' }, amountGrams: 140, amount: '140g', unit: 'g' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر ممتاز' }, amountGrams: 6, amount: '6g', unit: 'g' },
      { ingredientId: 'ing_lemon', name: { en: 'Fresh Lemon Juice & Fresh Dill', ar: 'عصير ليمون وشبت طازج' }, amountGrams: 15, amount: '1 tbsp', unit: 'ml' }
    ],
    instructions: {
      en: [
        'Pat sea bass filet completely dry with a paper towel. Score the skin lightly with a knife.',
        'Rub with olive oil, sea salt, black pepper, and dried oregano.',
        'Sear skin-side down in a hot non-stick pan for 4 minutes until crisp, then flip and cook for 2 more minutes.',
        'Toss cooked quinoa with lemon zest, lemon juice, chopped dill, and sea salt.',
        'Serve crispy sea bass on top of the fragrant warm quinoa.'
      ],
      ar: [
        'جفف فيليه السمك جيداً بورق المطبخ واصنع شقوقاً خفيفة في الجلد.',
        'ادهن السمك بزيت الزيتون وتبل بالملح، الفلفل الأسود والأوريجانو.',
        'اشوِ السمك على جهة الجلد في مقلاة ساخنة لمدة 4 دقائق حتى يقرمش، ثم اقلبه لدقيقتين.',
        'اخلط الكينوا المطبوخة مع بشر الليمون، عصير الليمون، الشبت المفروم ورشة ملح.',
        'قدم السمك المقرمش فوق الكينوا الدافئة.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 3. ساندوتشات ووجبات سريعة (SANDWICHES & WRAPS)
  // ==========================================
  {
    id: 'rec_spicy_tuna_wrap',
    name: {
      en: 'Spicy Tuna Crunch Protein Wrap',
      ar: 'راب التونة الحار بالخردل والجرجير'
    },
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 8,
    category: 'sandwiches',
    mealType: 'lunch',
    servingSize: '1 wrap',
    calories: 360,
    protein: 42,
    carbohydrates: 32,
    fat: 7,
    tags: ['High Protein', 'Under 15m', 'No Cook', 'Quick Lunch'],
    ingredients: [
      { ingredientId: 'ing_salmon', name: { en: 'Solid White Tuna in Water (Drained)', ar: 'تونة بيضاء مصفاة من الماء' }, amountGrams: 160, amount: '1 can (160g)', unit: 'g' },
      { ingredientId: 'ing_tortilla', name: { en: 'Whole Wheat Tortilla', ar: 'خبز تورتيلا قمح كامل' }, amountGrams: 50, amount: '1 wrap (50g)', unit: 'piece' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt (Mayo Sub)', ar: 'زبادي يوناني خالي الدسم كبديل للمايونيز' }, amountGrams: 40, amount: '40g', unit: 'g' },
      { ingredientId: 'ing_mustard', name: { en: 'Dijon Mustard & Sriracha', ar: 'خردل ديجون وصوص سريراتشا حار' }, amountGrams: 15, amount: '1 tbsp', unit: 'g' },
      { ingredientId: 'ing_arugula', name: { en: 'Fresh Arugula / Spinach', ar: 'أوراق جرجير طازجة مقرمشة' }, amountGrams: 30, amount: '30g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Drain the tuna thoroughly and place in a mixing bowl.',
        'Add Greek yogurt, Dijon mustard, sriracha, finely diced celery or pickles, sea salt, and black pepper. Mix with a fork until creamy.',
        'Warm the whole wheat tortilla in a dry pan for 15 seconds.',
        'Spread the tuna salad down the center of the tortilla, top with fresh crisp arugula.',
        'Fold the sides inward and roll tightly into a burrito wrap. Slice diagonally and enjoy.'
      ],
      ar: [
        'صفِ علبة التونة تماماً من الماء وضعها في وعاء.',
        'أضف الزبادي اليوناني، خردل الديجون، صوص السريراتشا، مخلل مفروم، ملح وفلفل أسود واخلط بالشوكة.',
        'سخن خبز التورتيلا في مقلاة جافة لمدة 15 ثانية.',
        'ضع حشوة التونة في منتصف الخبز وأضف فوقها أوراق الجرجير الطازجة.',
        'اطوِ الجوانب ولف الراب بإحكام، ثم اقطعه نصفين واستمتع.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_philly_cheesesteak_roll',
    name: {
      en: 'Healthy High-Protein Philly Cheesesteak Roll',
      ar: 'ساندوتش الستيك والجبن الفيلادلفيا الصحي'
    },
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 7,
    category: 'sandwiches',
    mealType: 'lunch',
    servingSize: '1 sandwich',
    calories: 460,
    protein: 48,
    carbohydrates: 35,
    fat: 14,
    tags: ['High Protein', 'Under 15m', 'Sandwich', 'Lunch'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Thinly Sliced Lean Beef Sirloin', ar: 'شرائح لحم بقري صافي مقطع رفيع' }, amountGrams: 160, amount: '160g', unit: 'g' },
      { ingredientId: 'ing_bun', name: { en: 'Whole Grain Hoagie / Sub Roll', ar: 'خبز صامولي أو باغيت حبوب كاملة' }, amountGrams: 60, amount: '1 roll (60g)', unit: 'piece' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Light Provolone / Low Fat Mozzarella', ar: 'جبنة بروفولون لايت أو موزاريلا' }, amountGrams: 30, amount: '30g', unit: 'g' },
      { ingredientId: 'ing_bell_pepper', name: { en: 'Sliced Green Peppers & Onions', ar: 'شرائح فلفل أخضر وبصل' }, amountGrams: 60, amount: '60g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Sauté sliced peppers and onions in a hot skillet with light oil spray for 3 minutes until caramelized.',
        'Push vegetables to the side, add thinly sliced beef sirloin, and sear quickly on high heat for 2 minutes.',
        'Mix beef and vegetables together, season with garlic powder, Worcestershire sauce, salt, and pepper.',
        'Place light cheese slices directly over the hot meat until melted.',
        'Scoop the cheesy beef mixture into the toasted whole grain roll and serve hot.'
      ],
      ar: [
        'شوح شرائح البصل والفلفل الأخضر في مقلاة ساخنة مع رشة زيت خفيفة لمدة 3 دقائق حتى تذبل.',
        'أزح الخضار للجانب، وضع شرائح اللحم البقري الرفيعة واشوها على نار عالية لدقيقتين.',
        'اخلط اللحم مع الخضار وتبل ببودرة الثوم، ملح، فلفل أسود وقطرات ورشستر صوص.',
        'ضع شرائح الجبن اللايت مباشرة فوق اللحم الساخن لتذوب.',
        'احشِ الخبز باللحم والجبن الذائب وقدم الساندوتش ساخناً.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 4. سلطات البروتين (PROTEIN SALADS)
  // ==========================================
  {
    id: 'rec_caesar_salad_protein',
    name: {
      en: 'Grilled Chicken Caesar Salad with Greek Yogurt Dressing',
      ar: 'سلطة الدجاج السيزر الكلاسيكية بصوص الزبادي اليوناني'
    },
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 8,
    category: 'salads',
    mealType: 'lunch',
    servingSize: '1 large bowl',
    calories: 360,
    protein: 44,
    carbohydrates: 14,
    fat: 13,
    tags: ['High Protein', 'Under 15m', 'Low Carb', 'Salad'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Grilled Herb Chicken Breast', ar: 'صدر دجاج مشوي بالأعشاب' }, amountGrams: 160, amount: '160g', unit: 'g' },
      { ingredientId: 'ing_green_salad', name: { en: 'Crisp Romaine Lettuce', ar: 'خس روماني مقرمش مفروم' }, amountGrams: 150, amount: '150g', unit: 'g' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt (Dressing Base)', ar: 'زبادي يوناني خالي الدسم لصلصة السيزر' }, amountGrams: 50, amount: '50g', unit: 'g' },
      { ingredientId: 'ing_parmesan', name: { en: 'Grated Fresh Parmesan', ar: 'جبنة بارميزان طازجة مبشورة' }, amountGrams: 15, amount: '15g', unit: 'g' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Extra Virgin Olive Oil', ar: 'زيت زيتون بكر' }, amountGrams: 5, amount: '1 tsp (5g)', unit: 'g' }
    ],
    instructions: {
      en: [
        'For the dressing: whisk Greek yogurt, olive oil, lemon juice, minced garlic, Dijon mustard, black pepper, and 5g Parmesan in a small ramekin.',
        'Grill chicken breast with oregano and garlic until cooked through (75°C internal), then rest and slice.',
        'Toss crisp chopped romaine lettuce in a large bowl with the creamy dressing.',
        'Top with warm sliced chicken breast and remaining grated Parmesan cheese.'
      ],
      ar: [
        'لتحضير الصلصة: اخفق الزبادي اليوناني مع زيت الزيتون، عصير الليمون، الثوم المفروم، الخردل، الفلفل الأسود وجزء من جبنة البارميزان.',
        'اشوِ صدر الدجاج مع الأوريجانو وبودرة الثوم حتى ينضج تماماً، ثم قطعه شرائح.',
        'اخلط الخس الروماني المفروم في وعاء واسع مع صلصة السيزر الصحية.',
        'ضع شرائح الدجاج المشوي الدافئة في الأعلى ورش باقي جبنة البارميزان المبشورة.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 5. حلا وسناك صحي (HEALTHY DESSERTS & SNACKS)
  // ==========================================
  {
    id: 'rec_chocolate_protein_brownies',
    name: {
      en: 'Fudgy High-Protein Double Chocolate Brownies',
      ar: 'براونيز الشوكولاتة الداكنة بالواي بروتين'
    },
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 18,
    category: 'dessert',
    mealType: 'snack',
    servingSize: '1 large square (makes 4 squares)',
    calories: 180,
    protein: 18,
    carbohydrates: 16,
    fat: 4,
    tags: ['High Protein', 'Dessert', 'Sweet Tooth', 'Low Calorie'],
    ingredients: [
      { ingredientId: 'ing_whey_protein', name: { en: 'Chocolate Whey Protein Isolate', ar: 'واي بروتين آيزوليت شوكولاتة' }, amountGrams: 40, amount: '40g', unit: 'g' },
      { ingredientId: 'ing_oats', name: { en: 'Oat Flour / Blended Oats', ar: 'دقيق الشوفان المطحون' }, amountGrams: 30, amount: '30g', unit: 'g' },
      { ingredientId: 'ing_cocoa', name: { en: 'Pure Unsweetened Cocoa Powder', ar: 'بودرة كاكاو خام غير محلاة' }, amountGrams: 20, amount: '20g', unit: 'g' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' }, amountGrams: 80, amount: '80g', unit: 'g' },
      { ingredientId: 'ing_egg_whites', name: { en: 'Egg Whites & Stevia', ar: 'بياض بيض ومحلي ستيفيا' }, amountGrams: 60, amount: '60g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Preheat oven to 175°C (350°F) and line a small baking dish with parchment paper.',
        'In a bowl, mix chocolate whey, oat flour, cocoa powder, stevia, and baking powder.',
        'Add Greek yogurt, liquid egg whites, and 2 tbsp of unsweetened almond milk. Stir into a thick glossy brownie batter.',
        'Spread batter evenly into the pan. Optionally sprinkle a few sugar-free dark chocolate chips.',
        'Bake for 16-18 minutes until edges are set while center remains moist and fudgy.',
        'Cool in the fridge for 20 minutes before slicing into 4 fudgy brownie squares.'
      ],
      ar: [
        'سخن الفرن على 175 مئوية وافرش صينية صغيرة بورق الزبدة.',
        'في وعاء، اخلط الواي بروتين شوكولاتة، دقيق الشوفان، الكاكاو الخام، الستيفيا والبيكنج بودر.',
        'أضف الزبادي اليوناني وبياض البيض وملعقتين حليب لوز، وقلب حتى يتشكل خليط براونيز كثيف ولامع.',
        'افرد الخليط في الصينية ويمكنك إضافة قليل من حبيبات الشوكولاتة الداكنة الخالية من السكر.',
        'اخبز لمدة 16-18 دقيقة حتى تتماسك الأطراف ويبقى القلب طرياً وغنياً.',
        'اتركه يبرد في الثلاجة 20 دقيقة ثم قطعه إلى 4 قطع براونيز غنية بالبروتين.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_strawberry_protein_cheesecake',
    name: {
      en: 'Strawberry Greek Yogurt Protein Cheesecake Cups',
      ar: 'كاسات التشيز كيك بالزبادي اليوناني والفراولة'
    },
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    category: 'dessert',
    mealType: 'snack',
    servingSize: '1 large jar cup',
    calories: 210,
    protein: 24,
    carbohydrates: 18,
    fat: 3,
    tags: ['High Protein', 'Under 15m', 'No Cook', 'Dessert'],
    ingredients: [
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' }, amountGrams: 150, amount: '150g', unit: 'g' },
      { ingredientId: 'ing_whey_protein', name: { en: 'Vanilla Whey Protein Isolate', ar: 'واي بروتين آيزوليت فانيليا' }, amountGrams: 20, amount: '20g', unit: 'g' },
      { ingredientId: 'ing_berries', name: { en: 'Fresh Strawberries Puree', ar: 'بيوريه فراولة طازجة' }, amountGrams: 60, amount: '60g', unit: 'g' },
      { ingredientId: 'ing_rice_cakes', name: { en: 'Crushed Light Graham/Digestive or Rice Cake', ar: 'بسكويت شوفان أو كعك أرز مطحون' }, amountGrams: 15, amount: '15g', unit: 'g' }
    ],
    instructions: {
      en: [
        'Crush the light digestive biscuit or rice cake into crumbs and press at the bottom of a glass cup for the crust.',
        'In a bowl, vigorously mix 0% Greek yogurt, vanilla whey protein, a squeeze of lemon juice, and a drop of vanilla extract until ultra creamy.',
        'Spoon the cheesecake cream over the biscuit crust base.',
        'Top with homemade fresh strawberry puree and sliced fresh strawberries.',
        'Chill in the freezer for 10 minutes or fridge for 30 minutes before enjoying.'
      ],
      ar: [
        'اطحن بسكويت الشوفان أو كعك الأرز وضعه في قاع الكوب لتشكيل قاعدة التشيز كيك.',
        'في وعاء، اخفق الزبادي اليوناني مع الواي بروتين فانيليا وقطرات الليمون والفانيليا حتى يصبح القوام كريمياً ناعماً.',
        'اسكب كريمة التشيز كيك فوق طبقة البسكويت.',
        'زين بصلصة الفراولة الطازجة المهروسة وشرائح الفراولة.',
        'اتركها في الثلاجة لمدة 30 دقيقة وقدمها باردة ومنعشة.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 6. المشروبات الصحية وسموذي الطاقة (SMOOTHIES & SHAKES)
  // ==========================================
  {
    id: 'rec_pb_banana_recovery_shake',
    name: {
      en: 'Peanut Butter Banana Post-Workout Recovery Shake',
      ar: 'سموذي زبدة الفول السوداني والموز للتعافي'
    },
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 5,
    category: 'drinks',
    mealType: 'snack',
    servingSize: '1 large smoothie (500ml)',
    calories: 340,
    protein: 35,
    carbohydrates: 36,
    fat: 7,
    tags: ['High Protein', 'Under 15m', 'Post Workout', 'Smoothie'],
    ingredients: [
      { ingredientId: 'ing_whey_protein', name: { en: '100% Whey Isolate (Vanilla or Chocolate)', ar: 'واي بروتين آيزوليت شوكولاتة أو فانيليا' }, amountGrams: 30, amount: '1 scoop (30g)', unit: 'g' },
      { ingredientId: 'ing_banana', name: { en: 'Frozen Ripe Banana', ar: 'موزة ناضجة مجمدة' }, amountGrams: 100, amount: '1 medium banana', unit: 'g' },
      { ingredientId: 'ing_peanut_butter', name: { en: 'Natural Peanut Butter Powder / Butter', ar: 'زبدة فول سوداني طبيعية' }, amountGrams: 15, amount: '1 tbsp (15g)', unit: 'g' },
      { ingredientId: 'ing_almond_milk', name: { en: 'Unsweetened Almond Milk & Ice', ar: 'حليب لوز غير محلى ومكعبات ثلج' }, amountGrams: 250, amount: '250ml', unit: 'ml' }
    ],
    instructions: {
      en: [
        'Add unsweetened almond milk to blender first to ensure smooth blending.',
        'Add frozen banana slices, whey protein isolate, natural peanut butter, a dash of cinnamon, and a handful of ice cubes.',
        'Blend on high speed for 45-60 seconds until thick, frothy, and completely smooth.',
        'Pour into a tall glass and enjoy immediately after training.'
      ],
      ar: [
        'ضع حليب اللوز غير المحلى في قاع الخلاط أولاً لتسهيل الخفق.',
        'أضف شرائح الموز المجمد، سكوب الواي بروتين، زبدة الفول السوداني الطبيعية، رشة قرفة ومكعبات ثلج.',
        'اخلط على سرعة عالية لمدة 45 إلى 60 ثانية حتى يصبح القوام كريمياً وسميكاً.',
        'اسكب السموذي في كوب طويل واستمتع به بعد التمرين مباشرة للتعافي السريع.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_triple_berry_protein_blast',
    name: {
      en: 'Triple Berry Antioxidant Protein Blast',
      ar: 'سموذي التوت المشكل ومضادات الأكسدة'
    },
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 5,
    category: 'drinks',
    mealType: 'snack',
    servingSize: '1 large smoothie (450ml)',
    calories: 260,
    protein: 30,
    carbohydrates: 28,
    fat: 2,
    tags: ['High Protein', 'Under 15m', 'Antioxidants', 'Low Fat'],
    ingredients: [
      { ingredientId: 'ing_whey_protein', name: { en: 'Vanilla Whey Isolate', ar: 'واي بروتين آيزوليت فانيليا' }, amountGrams: 30, amount: '1 scoop (30g)', unit: 'g' },
      { ingredientId: 'ing_blueberries', name: { en: 'Frozen Mixed Berries (Blueberry, Raspberry, Strawberry)', ar: 'توت مشكل مجمد (أزرق، أحمر، فراولة)' }, amountGrams: 120, amount: '120g', unit: 'g' },
      { ingredientId: 'ing_greek_yogurt', name: { en: '0% Fat Greek Yogurt', ar: 'زبادي يوناني خالي الدسم' }, amountGrams: 60, amount: '60g', unit: 'g' },
      { ingredientId: 'ing_almond_milk', name: { en: 'Unsweetened Almond Milk', ar: 'حليب لوز غير محلى' }, amountGrams: 200, amount: '200ml', unit: 'ml' }
    ],
    instructions: {
      en: [
        'Add almond milk and Greek yogurt to the blender container.',
        'Add frozen mixed berries and vanilla whey protein.',
        'Blend on high for 45 seconds until vibrant purple and velvety smooth.',
        'Serve immediately chilled.'
      ],
      ar: [
        'أضف حليب اللوز والزبادي اليوناني في الخلاط.',
        'أضف التوت المشكل المجمد وسكوب الواي بروتين فانيليا.',
        'اخلط جيداً لمدة 45 ثانية حتى يصبح ناعماً بلون بنفسجي جذاب.',
        'يقدم بارداً ومنعشاً فوراً.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_iced_coffee_protein_frappe',
    name: {
      en: 'Iced Salted Caramel Coffee Protein Frappe',
      ar: 'ميلك شيك الآيس كوفي بروتين المثلج'
    },
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 4,
    category: 'drinks',
    mealType: 'breakfast',
    servingSize: '1 large tumbler (500ml)',
    calories: 220,
    protein: 32,
    carbohydrates: 14,
    fat: 3,
    tags: ['High Protein', 'Under 15m', 'Caffeine Boost', 'Pre Workout'],
    ingredients: [
      { ingredientId: 'ing_whey_protein', name: { en: 'Vanilla or Salted Caramel Whey Protein', ar: 'واي بروتين فانيليا أو كراميل مملح' }, amountGrams: 30, amount: '1 scoop (30g)', unit: 'g' },
      { ingredientId: 'ing_espresso', name: { en: 'Double Shot Espresso / Cold Brew', ar: 'شوت مزدوج إسبريسو أو قهوة كولد برو مركزة' }, amountGrams: 60, amount: '60ml', unit: 'ml' },
      { ingredientId: 'ing_almond_milk', name: { en: 'Unsweetened Almond Milk & Ice', ar: 'حليب لوز غير محلى وثلج' }, amountGrams: 200, amount: '200ml', unit: 'ml' },
      { ingredientId: 'ing_stevia', name: { en: 'Stevia & Pinch of Himalayan Salt', ar: 'محلي ستيفيا ورشة ملح هيمالايا' }, amountGrams: 1, amount: '1 pinch', unit: 'pinch' }
    ],
    instructions: {
      en: [
        'Brew a double shot of espresso and let cool for 2 minutes.',
        'Add almond milk, chilled espresso, whey protein, pinch of sea salt, and 1 cup of ice cubes to the blender.',
        'Pulse and blend for 30 seconds until icy, frothy, and cafe-style frappe consistency is achieved.',
        'Pour into a cup and enjoy a high-protein morning or pre-workout caffeine surge.'
      ],
      ar: [
        'حضر شوت إسبريسو مزدوج ودعه يهدأ لدقيقتين.',
        'في الخلاط، ضع حليب اللوز، الإسبريسو، سكوب الواي بروتين، رشة ملح بحري وكوب ثلج.',
        'اخلط لمدة 30 ثانية حتى يتشكل فوم غني ومثلج كفرابيه الكافيهات.',
        'اسكب في الكوب واستمتع بجرعة بروتين وكافيين صباحية أو قبل التمرين.'
      ]
    },
    isBookmarked: false
  },

  // ==========================================
  // 7. الوجبات الأساسية والوصفات المستوردة (IMPORTED RECIPES)
  // ==========================================
  {
    id: 'rec_turkish_kebab_healthy',
    name: {
      en: 'Healthy Turkish Kebab with Yogurt Dip',
      ar: 'كباب تركي صحي'
    },
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 25,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 sandwich',
    calories: 495,
    protein: 50,
    carbohydrates: 23,
    fat: 18,
    tags: ['Turkish', 'High Protein', 'Air Fryer', 'Kebab'],
    ingredients: [
      { ingredientId: 'ing_onion', name: { en: 'Diced Half Onion', ar: 'نصف بصلة مكعبات' }, amountGrams: 50, amount: 'نصف بصلة', unit: 'piece' },
      { ingredientId: 'ing_lean_beef', name: { en: 'Minced Meat', ar: 'نصف كيلو لحمة مفرومة' }, amountGrams: 500, amount: 'نصف كيلو', unit: 'g' },
      { ingredientId: 'ing_spices', name: { en: 'Salt, Pepper, Garlic Powder, Ottoman Spices', ar: 'ملح، فلفل، توم بودرة، بهارات عثمانية' }, amountGrams: 10, amount: 'حسب الرغبة', unit: 'pinch' },
      { ingredientId: 'ing_tortilla', name: { en: 'Tortilla Bread', ar: 'تورتيلا' }, amountGrams: 60, amount: '1 رغيف', unit: 'piece' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Mozzarella Cheese', ar: '30 جم جبنة موزاريلا' }, amountGrams: 30, amount: '30 جم', unit: 'g' },
      { ingredientId: 'ing_yogurt_dip', name: { en: 'Sauce: 1 Yogurt cup, Salt, Paprika, Garlic Powder, Dried Coriander', ar: 'للصوص: علبة زبادي، ملح، بابريكا، توم بودرة، كزبرة ناشفة' }, amountGrams: 120, amount: 'علبة زبادي + بهارات', unit: 'portion' }
    ],
    instructions: {
      en: [
        'Dice half an onion and mix with 500g minced meat along with salt, pepper, garlic powder, and Ottoman spices.',
        'Spread the seasoned meat evenly over the tortilla wrap, sprinkle with mozzarella cheese, and fold the sandwich.',
        'Cut the sandwich into equal slices and arrange them in the air fryer meat-side up at 200°C for 15 minutes.',
        'Prepare the dip: In a bowl, combine 1 cup of yogurt with salt, paprika, garlic powder, and dried coriander. Serve alongside.'
      ],
      ar: [
        'نقطع نصف بصلة مكعبات، ونحطها على نصف كيلو اللحمة المفرومة مع ملح، فلفل، توم بودرة، والبهارات العثمانية.',
        'نفرد اللحمة على رغيف التورتيلا، ونحط عليه شوية جبنة، ونقفل الساندوتش.',
        'نقطّع الساندوتش قطع متساوية، ونرصّهم في الإير فراير، ويكون وشّ اللحمة لفوق، على درجة حرارة 200 لمدة 15 دقيقة.',
        'نحضر الصصوص: نجيب بولة ونحط فيها علبة زبادي، شوية ملح، شوية بابريكا، شوية توم بودرة، وشوية كزبرة ناشفة.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_kabsa_hashi',
    name: {
      en: 'Traditional Hashi (Camel) Meat Kabsa',
      ar: 'كبسة حاشي'
    },
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 95,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 whole pot / family serving',
    calories: 2750,
    protein: 235,
    carbohydrates: 75,
    fat: 165,
    tags: ['Traditional', 'High Protein', 'Kabsa', 'Pressure Cooker'],
    ingredients: [
      { ingredientId: 'ing_hashi_meat', name: { en: 'Hashi (Camel) Meat Chunks', ar: 'قطع لحم حاشي' }, amountGrams: 1000, amount: 'حوالي 1 كيلو', unit: 'g' },
      { ingredientId: 'ing_basmati_rice', name: { en: 'Basmati Rice (Soaked in Boiling Water)', ar: 'أرز بسمتي (منقوع في ماء مغلي)' }, amountGrams: 180, amount: '1 كوب', unit: 'cup' },
      { ingredientId: 'ing_onion', name: { en: 'Sliced Large Onions', ar: 'بصل مقطع شرائح متساوية' }, amountGrams: 200, amount: '2 حبة كبيرة', unit: 'piece' },
      { ingredientId: 'ing_olive_oil', name: { en: 'Olive Oil', ar: 'زيت زيتون' }, amountGrams: 15, amount: 'رشة زيت زيتون', unit: 'tbsp' },
      { ingredientId: 'ing_salt', name: { en: 'Salt', ar: 'ملح' }, amountGrams: 10, amount: '2 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_black_pepper', name: { en: 'Black Pepper', ar: 'فلفل أسود' }, amountGrams: 5, amount: '1 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_garlic_powder', name: { en: 'Garlic Powder', ar: 'ثوم بودرة' }, amountGrams: 8, amount: '1 1/2 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_smoked_paprika', name: { en: 'Smoked Paprika', ar: 'بابريكا مدخنة' }, amountGrams: 5, amount: '1 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_ginger', name: { en: 'Ground Ginger', ar: 'زنجبيل مطحون' }, amountGrams: 5, amount: '1 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_cinnamon', name: { en: 'Ground Cinnamon', ar: 'قرفة' }, amountGrams: 2, amount: '1/4 ملعقة صغيرة', unit: 'tsp' }
    ],
    instructions: {
      en: [
        'In a pressure cooker, drizzle olive oil and sear the meat chunks thoroughly until lightly browned.',
        'Add sliced onions to the meat and sauté together.',
        'Add all spices (salt, black pepper, garlic powder, smoked paprika, ground ginger, cinnamon), mix well, cover with water, and cook for approx. 1 hour and 15 minutes until meat is completely tender.',
        'Rice prep: While meat is simmering, soak basmati rice in boiling water, then drain well.',
        'Once meat is fully cooked, remove from the cooker and add drained rice to the seasoned broth.',
        'Cover and cook the rice for about 10 minutes until fluffy and fragrant.',
        'Return the meat cuts on top of the rice and serve warm.'
      ],
      ar: [
        'في حلة ضغط، نرش زيت الزيتون، ثم نشوّح قطع اللحم جيداً حتى يتغير لونها وتتحمر خفيف.',
        'هنضيف شرائح البصل على اللحم ونقلّب.',
        'هنضيف جميع البهارات ونقلّب كويس ونغطّي اللحم بالماء ونسيبها على النار حوالي ساعة وربع أو لحد ما اللحم يستوي تماماً.',
        'تحضير الأرز: أثناء تسوية اللحم، ننقع الأرز البسمتي في ماء مغلي، ثم نصفّيه كويس.',
        'بعد نضج اللحم نشيله من الحلة ثم نضيف الأرز إلى الحلة.',
        'نغطّي الحلة ونسيب الأرز يستوي حوالي 10 دقائق.',
        'ثم نعيد قطع اللحم فوق الأرز.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_salmon_with_rice_pomegranate',
    name: {
      en: 'Air-Fried Glazed Salmon with Turmeric Rice',
      ar: 'سالمون مع الارز'
    },
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 12,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 meal plate',
    calories: 500,
    protein: 29,
    carbohydrates: 42,
    fat: 25,
    tags: ['Omega 3', 'High Protein', 'Air Fryer', 'Salmon'],
    ingredients: [
      { ingredientId: 'ing_salmon_fillet', name: { en: 'Fresh Salmon Fillet', ar: '120 جرام سمك سالمون' }, amountGrams: 120, amount: '120 جرام', unit: 'g' },
      { ingredientId: 'ing_basmati_rice', name: { en: 'Basmati Rice (Soaked in Hot Water)', ar: 'نصف كوب أرز بسمتي منقوع في مية حاره' }, amountGrams: 75, amount: 'نصف كوب', unit: 'cup' },
      { ingredientId: 'ing_salmon_rub', name: { en: 'Base Rub: Salt, Paprika, Black Pepper, 1/2 tsp Olive Oil', ar: 'للتتبيلة الأولى: ملح، بابريكا، فلفل أسود، نصف معلقه زيت زيتون' }, amountGrams: 5, amount: 'ملح، بابريكا، فلفل، زيت', unit: 'portion' },
      { ingredientId: 'ing_pomegranate_sauce', name: { en: 'Glaze: 2 tsp Olive Oil, Pomegranate Molasses, Italian Herbs, Garlic Powder', ar: 'للصوص (التتبيلة الثانية): معلقتين زيت زيتون، دبس رمان، بهارات إيطالية، ثوم بودرة' }, amountGrams: 20, amount: 'دبس رمان، زيت، بهارات', unit: 'portion' },
      { ingredientId: 'ing_rice_seasoning', name: { en: 'Rice Seasoning: Salt, Turmeric, 1/2 tsp Olive Oil', ar: 'للأرز: ملح + كركم، نصف معلقه زيت زيتون' }, amountGrams: 5, amount: 'كركم وملح وزيت', unit: 'portion' }
    ],
    instructions: {
      en: [
        'Season salmon: Place salmon fillets in a bowl and rub with salt, paprika, black pepper, and 1/2 tsp olive oil until well coated.',
        'Initial air-fry: Place salmon in air fryer for 10 minutes at 180°C.',
        'Prepare glaze: In a small bowl, whisk 2 tsp olive oil, pomegranate molasses, Italian herbs, and garlic powder.',
        'After 8 minutes of air frying, remove salmon, brush top with pomegranate glaze, and return to air fryer for 2-4 more minutes until caramelized.',
        'Prepare rice: In a pot, heat 1/2 tsp olive oil and soaked basmati rice with salt and turmeric. Pour in boiling water and simmer until fully cooked.'
      ],
      ar: [
        'تتبيل السلمون: نضع شرائح السلمون في وعاء ونضيف الملح، البابريكا، الفلفل الأسود، وزيت الزيتون ونقلبهم جيداً حتى تتغطى القطع بالكامل.',
        'التسوية الأولية: نرص السلمون في (Air Fryer) لمدة 10 دقائق.',
        'تحضير الصوص: في وعاء صغير، نخلط زيت الزيتون، دبس الرمان، البهارات الإيطالية، والثوم البودرة.',
        'بعد مرور 8 دقائق، نخرج السلمون وندهن الوجه بالصوص اللي حضرناه، ثم نعيده للقلاية لمدة 2 - 4 دقائق إضافية حتى يأخذ لوناً محمراً.',
        'تحضير الأرز: في حلة على النار، نضع زيت زيتون والأرز البسمتي، ثم نضيف الملح والكركم ونقلبهم. نضع الماء المغلي ونتركه حتى ينضج تماماً.'
      ]
    },
    isBookmarked: true
  },
  {
    id: 'rec_ground_beef_tortilla_sandwich',
    name: {
      en: 'Toasted Ground Beef & Mozzarella Tortilla Sandwich',
      ar: 'ساندوتش التورتيلا باللحم المفروم'
    },
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 15,
    category: 'sandwiches',
    mealType: 'lunch',
    servingSize: '1 sandwich',
    calories: 520,
    protein: 38,
    carbohydrates: 35,
    fat: 23,
    tags: ['High Protein', 'Quick Lunch', 'Sandwich', 'Tortilla'],
    ingredients: [
      { ingredientId: 'ing_ground_beef', name: { en: 'Lean Minced Meat', ar: '120 جم لحمة مفرومة' }, amountGrams: 120, amount: '120 جم', unit: 'g' },
      { ingredientId: 'ing_tortilla', name: { en: 'Tortilla Bread', ar: 'خبز تورتيلا' }, amountGrams: 60, amount: '1 رغيف', unit: 'piece' },
      { ingredientId: 'ing_red_onion', name: { en: 'Sliced Red Onion', ar: 'بصل أحمر مقطع شرايح' }, amountGrams: 40, amount: 'شرائح بصل', unit: 'piece' },
      { ingredientId: 'ing_spices', name: { en: 'Salt, Black Pepper, Garlic Powder', ar: 'ملح، فلفل أسود، ثوم بودرة' }, amountGrams: 5, amount: 'حسب الرغبة', unit: 'pinch' },
      { ingredientId: 'ing_tomato_paste', name: { en: 'Tomato Paste', ar: 'معجون طماطم' }, amountGrams: 20, amount: '1 ملعقة كبيرة', unit: 'tbsp' },
      { ingredientId: 'ing_milk', name: { en: 'Milk Splash', ar: 'الحليب' }, amountGrams: 30, amount: 'رشة حليب', unit: 'ml' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Mozzarella Cheese', ar: 'جبنة موتزاريللا' }, amountGrams: 30, amount: '30 جم', unit: 'g' },
      { ingredientId: 'ing_tahini_sauce', name: { en: 'Tahini Yogurt Sauce (Yogurt, Tahini, Salt, Garlic Powder, 1/2 Lemon)', ar: 'للصوص: زبادي، طحينة، ملح، ثوم بودرة، نصف ليمونة' }, amountGrams: 60, amount: 'خلطة الصوص', unit: 'portion' }
    ],
    instructions: {
      en: [
        'In a hot skillet with olive oil spray, sauté sliced red onions, then add minced meat and stir thoroughly.',
        'Season with salt, black pepper, garlic powder, tomato paste, and a splash of milk, then simmer until meat is cooked.',
        'Layer mozzarella cheese on top of the meat and cover pan for a couple minutes until melted.',
        'Prepare sauce: In a small bowl, whisk yogurt, tahini, salt, garlic powder, and juice of half a lemon.',
        'Assemble sandwich: Spread tahini yogurt sauce on tortilla bread, add the cheesy minced meat filling, and wrap.',
        'Toast sandwich on a hot grill pan until crispy and golden on both sides.'
      ],
      ar: [
        'في طاسة ساخنة مع رشة زيت زيتون شوّح البصل ثم نضيف اللحم المفروم ونقلبه جيداً.',
        'التتبيل: أضف الملح، الفلفل الأسود، والثوم البودرة، ثم أضف معجون الطماطم والحليب واترك اللحم يستوي.',
        'ضع الجبنة الموتزاريللا على وجه اللحم وغطي الطاسة لدقائق حتى تذوب.',
        'تحضير الصصوص: في وعاء صغير، اخلط الزبادي، الطحينة، الملح، الثوم البودرة، ونصف الليمونة.',
        'تجهيز الساندوتش: ادهن خبز التورتيلا بالصوص، ثم ضع كمية من حشوة اللحم، ولف الخبز.',
        'ضع الساندوتش على جريل ساخن حتى يأخذ لوناً ذهبياً وقرمشة من الجهتين.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_sweet_potato_minced_meat_bowl',
    name: {
      en: 'Mashed Sweet Potato with Cheesy Minced Beef & Mustard Yogurt Sauce',
      ar: 'بطاطا باللحم المفروم والصوص'
    },
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 20,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 bowl',
    calories: 660,
    protein: 40,
    carbohydrates: 52,
    fat: 27,
    tags: ['High Protein', 'Complex Carbs', 'Loaded Sweet Potato', 'Dinner'],
    ingredients: [
      { ingredientId: 'ing_ground_beef', name: { en: 'Lean Minced Meat', ar: '120 جم لحم مفروم' }, amountGrams: 120, amount: '120 جم', unit: 'g' },
      { ingredientId: 'ing_sweet_potato', name: { en: 'Mashed Roasted Sweet Potato', ar: '150 جم بطاطا حلوة مهروسة (مشوية مسبقاً)' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_red_onion', name: { en: 'Sliced Red Onion', ar: 'بصل أحمر مقطع شرايح' }, amountGrams: 30, amount: 'شرائح بصل', unit: 'piece' },
      { ingredientId: 'ing_seasoning', name: { en: 'Olive Oil, Salt, Black Pepper, Garlic Powder', ar: 'زيت زيتون، ملح، فلفل أسود، ثوم بودرة' }, amountGrams: 8, amount: 'توابل وزيت', unit: 'portion' },
      { ingredientId: 'ing_tomato_milk', name: { en: 'Tomato Paste & Milk Splash', ar: 'معجون طماطم، الحليب' }, amountGrams: 30, amount: 'معجون وحليب', unit: 'tbsp' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Mozzarella Cheese', ar: '25 جم جبنة موتزاريللا' }, amountGrams: 25, amount: '25 جم', unit: 'g' },
      { ingredientId: 'ing_mustard_sauce', name: { en: 'Sauce: 1 Yogurt Cup, Tahini, Mustard, Salt, Garlic Powder, 1/2 Lemon', ar: 'للصوص: علبة زبادي، طحينة، مستردة (خردل)، ملح، ثوم بودرة، نصف ليمونة' }, amountGrams: 80, amount: 'خلطة الصوص', unit: 'portion' }
    ],
    instructions: {
      en: [
        'In a hot pan with olive oil spray, sauté red onion slices, then add minced meat and brown nicely.',
        'Add salt, black pepper, and garlic powder, cover and simmer for 10 minutes.',
        'Add tomato paste and a splash of milk, stir and cook covered for another 5 minutes.',
        'Sprinkle mozzarella cheese on top, cover until melted and gooey.',
        'Whisk yogurt, tahini, yellow mustard, garlic powder, salt, and lemon juice into a tangy sauce.',
        'Plating: Spoon mashed sweet potato into a bowl, layer with cheesy minced beef, and drizzle sauce generously on top.'
      ],
      ar: [
        'في طاسة ساخنة مع رشة زيت زيتون شوّح البصل ثم نضيف اللحم المفروم ونقلبه جيداً.',
        'ونضيف الملح والفلفل والثوم البودرة، ويُترك مغطى لمدة 10 دقائق.',
        'نضيف معجون الطماطم والحليب ونقلب ثم يُترك 5 دقائق.',
        'نوزع الجبنة الموتزاريللا على الوجه وتُغطى حتى تذوب.',
        'تحضير الصصوص: تُخلط جميع مكونات الصوص (الزبادي، الطحينة، المستردة، التوابل، والليمون).',
        'التقديم: تُوضع البطاطا المهروسة في طبق، ويُضاف فوقها اللحم المفروم ثم الصوص.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_chicken_or_kofta_with_rice',
    name: {
      en: 'Air-Fried Chicken / Kofta with Basmati Rice & Garden Salad',
      ar: 'دجاج اوكفتة مع الأرز'
    },
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 30,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 meal plate',
    calories: 420,
    protein: 37,
    carbohydrates: 48,
    fat: 4,
    tags: ['High Protein', 'Low Fat', 'Meal Prep', 'Clean Eating'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Diced Chicken Breast or Pre-made Kofta Meatballs', ar: '150 جم صدور دجاج مقطعة مكعبات، او كفتة مجهزة مسبقاً' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_marinade', name: { en: 'Marinade: Salt, Black Pepper, Smoked Paprika, Italian Herbs, Garlic Powder, Tomato Paste', ar: 'تتبيلة الدجاج: ملح، فلفل أسود، بابريكا مدخنة، بهارات إيطالية، ثوم بودرة، ومعجون طماطم' }, amountGrams: 15, amount: 'خلطة التتبيل', unit: 'portion' },
      { ingredientId: 'ing_salad', name: { en: 'Green Salad: Scallions, Tomatoes, Shredded Cucumber, Shredded Carrots', ar: 'السلطة الخضراء: بصل أخضر، طماطم، خيار مبشور، وجزر مبشور' }, amountGrams: 100, amount: 'طبق سلطة طازج', unit: 'portion' },
      { ingredientId: 'ing_steamed_rice', name: { en: 'Boiled / Steamed White Rice', ar: '150 جم أرز أبيض مسلوق' }, amountGrams: 150, amount: '150 جم', unit: 'g' }
    ],
    instructions: {
      en: [
        'Season chicken: Coat diced chicken breasts (or kofta meatballs) thoroughly with spices, Italian herbs, and tomato paste.',
        'Place chicken or kofta in air fryer at 180°C for 15-18 minutes until thoroughly cooked and juicy.',
        'Prepare salad: Chop green onions and tomatoes, grate cucumber and carrots, and toss together.',
        'Plating: Arrange boiled white rice, fresh crunchy garden salad, and hot protein (chicken or kofta) side-by-side.'
      ],
      ar: [
        'تتبيل الدجاج: تُخلط مكعبات الصدور مع البهارات ومعجون الطماطم جيداً.',
        'يوضع الدجاج أو كرات اللحم في القلاية الهوائية (Air Fryer).',
        'تحضير السلطة: تُقطع الخضروات ويُبشر الخيار والجزر وتُخلط المكونات معاً.',
        'التقديم: تُقسم الوجبات بوضع الأرز المسلوق، بجانبه السلطة، ثم البروتين (الدجاج أو الكفتة).'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_honey_soy_chicken_rice',
    name: {
      en: 'Honey Soy Glazed Sesame Chicken with White Rice',
      ar: 'دجاج بصوص الصويا والعسل مع الأرز الأبيض'
    },
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 10,
    cookTimeMin: 20,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 bowl',
    calories: 465,
    protein: 35,
    carbohydrates: 48,
    fat: 9,
    tags: ['High Protein', 'Asian Inspired', 'Honey Soy', 'Meal Prep'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Diced Chicken Breast', ar: '150 جم صدور دجاج مقطعة مكعبات' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_onion', name: { en: 'Sliced Onion', ar: 'بصل مقطع شرائح' }, amountGrams: 50, amount: 'شرائح بصل', unit: 'piece' },
      { ingredientId: 'ing_spices', name: { en: 'Salt, Black Pepper, Garlic Powder', ar: 'ملح، فلفل أسود، ثوم بودرة' }, amountGrams: 5, amount: 'حسب الرغبة', unit: 'pinch' },
      { ingredientId: 'ing_soy_sauce', name: { en: 'Soy Sauce', ar: 'صويا صوص' }, amountGrams: 20, amount: '2 ملعقة كبيرة', unit: 'tbsp' },
      { ingredientId: 'ing_sesame', name: { en: 'Sesame Seeds', ar: 'سمسم' }, amountGrams: 5, amount: '1 ملعقة صغيرة', unit: 'tsp' },
      { ingredientId: 'ing_honey', name: { en: 'Pure Honey', ar: 'ملعقة كبيرة عسل' }, amountGrams: 15, amount: '1 ملعقة كبيرة', unit: 'tbsp' },
      { ingredientId: 'ing_white_rice', name: { en: 'White Rice & 1/2 tsp Olive Oil', ar: 'للأرز: 100 جم أرز أبيض، نصف معلقه زيت زيتون' }, amountGrams: 100, amount: '100 جم أرز + زيت', unit: 'g' }
    ],
    instructions: {
      en: [
        'Chicken prep: In a skillet over medium heat, sauté onion slices until soft and lightly caramelized.',
        'Add diced chicken, salt, pepper, garlic powder, and soy sauce; stir-fry over high heat.',
        'Add sesame seeds and 1 tbsp honey, continue stirring until glazed, then cover and simmer until chicken is fully cooked.',
        'Rice prep: Soak white rice in boiling water for 10 minutes, then drain.',
        'In a pot, heat 1/2 tsp olive oil, stir rice for a minute, add water, bring to boil, and reduce to low heat until fluffy.'
      ],
      ar: [
        'تحضير الدجاج: في طاسة على النار، شوّح شرائح البصل حتى تتكرمل.',
        'أضف قطع الدجاج، الملح، الفلفل الأسود، بودرة الثوم، والصويا صوص، وقلبهم جيداً.',
        'أضف السمسم وملعقة العسل، واستمر في التقليب، ثم غطِّ الدجاج واتركه ينضج.',
        'تحضير الأرز: انقع الأرز في ماء مغلي لمدة 10 دقائق.',
        'في قدر آخر، أضف القليل من زيت زيتون، ثم اضف الأرز وقلّبه قليلاً.',
        'أضف الماء واتركه يغلي، وبمجرد أن يتشرب الأرز الماء، هدّي النار تماماً.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_paprika_chicken_mashed_potatoes',
    name: {
      en: 'Smoked Paprika Chicken with Mashed Potato Casserole',
      ar: 'دجاج بالبابريكا مع البطاطس المهروسة'
    },
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 20,
    category: 'main_meals',
    mealType: 'dinner',
    servingSize: '1 casserole dish',
    calories: 430,
    protein: 38,
    carbohydrates: 29,
    fat: 14,
    tags: ['High Protein', 'Comfort Food', 'Mashed Potatoes', 'Air Fryer'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Chicken Breast Slices', ar: '150 جم صدور دجاج' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_seasoning', name: { en: 'Salt, Black Pepper, Garlic Powder, Smoked Paprika, Olive Oil', ar: 'ملح، فلفل أسود، ثوم بودرة، بابريكا مدخنة، زيت زيتون' }, amountGrams: 10, amount: 'بهارات وزيت', unit: 'portion' },
      { ingredientId: 'ing_potatoes', name: { en: 'Mashed Potatoes Base: Potatoes, Milk, Salt, Pepper, Onion Powder', ar: 'للبطاطس المهروسة: 150 جم بطاطس، حليب، ملح، فلفل أسود، بصل بودرة' }, amountGrams: 150, amount: '150 جم بطاطس + إضافات', unit: 'g' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Mozzarella Cheese', ar: 'للطاجن: 30 جم جبنة موتزاريللا' }, amountGrams: 30, amount: '30 جم', unit: 'g' }
    ],
    instructions: {
      en: [
        'Chicken prep: Cut chicken breasts into strips and season with salt, black pepper, garlic powder, smoked paprika, and a drizzle of olive oil.',
        'Cook in air fryer at 180°C for 18 minutes until juicy and browned.',
        'Mashed potatoes prep: Slice potatoes and boil in salted water until soft. Peel and mash thoroughly.',
        'Add milk, salt, pepper, and onion powder to mashed potatoes, stirring until creamy.',
        'Casserole assembly: Spread mashed potatoes in a baking dish, layer air-fried paprika chicken on top, cover with mozzarella cheese, and broil briefly until cheese is melted and bubbling.'
      ],
      ar: [
        'تحضير الدجاج: يُقطع الدجاج إلى شرائح.',
        'يُتبل بالملح، الفلفل الأسود، الثوم البودرة، والبابريكا المدخنة مع القليل من زيت الزيتون.',
        'نحطه في (Air Fryer) لمدة 18 دقيقة على درجة حرارة 180.',
        'تحضير البطاطس: تُقطع البطاطس لشرائح وتُسلق في ماء مملح.',
        'تُقشر البطاطس بعد السلق وتُهرس.',
        'يُضاف إليها الحليب والتوابل (ملح، فلفل، بصل بودرة) وتُقلب.',
        'التقديم (طاجن): تُفرد البطاطس المهروسة ويُرص فوقها الدجاج والجبن الموتزريلا.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_pasta_casserole_minced_meat',
    name: {
      en: 'Baked Minced Meat Pasta Casserole',
      ar: 'طاجن مكرونة باللحمة المفرومة'
    },
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 30,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 casserole dish',
    calories: 520,
    protein: 33,
    carbohydrates: 49,
    fat: 21,
    tags: ['High Protein', 'Comfort Food', 'Pasta', 'Oven Baked'],
    ingredients: [
      { ingredientId: 'ing_ground_beef', name: { en: 'Lean Minced Meat', ar: '150 جم لحم مفروم' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_pasta', name: { en: 'Dry Pasta', ar: '60 جم مكرونة' }, amountGrams: 60, amount: '60 جم', unit: 'g' },
      { ingredientId: 'ing_onion', name: { en: 'Diced Small Onion', ar: 'بصل مقطع مكعبات صغيرة' }, amountGrams: 40, amount: 'بصلة صغيرة', unit: 'piece' },
      { ingredientId: 'ing_tomatoes', name: { en: 'Fresh Tomatoes & Tomato Sauce', ar: 'طماطم طازجة، صلصة طماطم' }, amountGrams: 100, amount: 'طماطم وصلصة', unit: 'g' },
      { ingredientId: 'ing_garlic_spices', name: { en: 'Minced Garlic, Salt, Black Pepper, Cumin, Olive Oil', ar: 'ثوم مفروم، ملح، فلفل أسود، كمون، زيت زيتون' }, amountGrams: 10, amount: 'ثوم وبهارات وزيت', unit: 'portion' }
    ],
    instructions: {
      en: [
        'In a pan with olive oil spray, sauté diced onion, minced garlic, and minced beef. Season with salt and pepper until cooked through.',
        'Prepare tomato sauce: In a blender, puree fresh tomatoes with tomato paste, a bit of water, salt, pepper, and cumin.',
        'Assemble casserole: Place a layer of minced meat at the bottom of the casserole dish, add uncooked pasta, add another layer of meat, and pour blended tomato sauce over everything until covered.',
        'Baking: Cover casserole and bake in preheated oven at 200°C for 30 minutes until pasta is tender and sauce is bubbly.'
      ],
      ar: [
        'في طاسة مدهونة برشة زيت، شوّح البصل، ثم أضف الثوم المفروم واللحم المفروم. تبّل بالملح والفلفل الأسود واترك اللحم حتى ينضج.',
        'تحضير الصلصة: في الخلاط، اخلط الطماطم مع صلصة الطماطم والقليل من الماء، ثم أضف الملح والفلفل الأسود والكمون.',
        'تجهيز الطاجن: ضع طبقة من اللحم المفروم في قاع الطاجن، ثم أضف المكرونة (بدون سلق)، وكرر دا تاني وأخيراً اسكب خليط الصلصة فوق المكرونة حتى يغطيها.',
        'الطهي: غطِّ الطاجن وضعه في فرن مسخن مسبقاً على درجة حرارة 200 مئوية لمدة نصف ساعة.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_healthy_chicken_mutabbaq',
    name: {
      en: 'Healthy Air-Fried Chicken Mutabbaq',
      ar: 'مطبق دجاج صحي'
    },
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 30,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 mutabbaq pastry',
    calories: 460,
    protein: 43,
    carbohydrates: 32,
    fat: 15,
    tags: ['High Protein', 'Traditional', 'Mutabbaq', 'Air Fryer'],
    ingredients: [
      { ingredientId: 'ing_chicken_seasoning', name: { en: 'Chicken: 100g Chicken Breast, Salt, Pepper, Garlic Powder, Smoked Paprika, Olive Oil', ar: 'للدجاج: 100 جم صدور دجاج، ملح، فلفل اسود، ثوم بودره، بابريكا مدخنه، معلقة زيت زيتون' }, amountGrams: 100, amount: '100 جم صدور دجاج + بهارات', unit: 'portion' },
      { ingredientId: 'ing_sauce_filling', name: { en: 'Filling: 50g Cottage Cheese, 2 tbsp Yogurt, Garlic Powder, Smoked Paprika, Pepper', ar: 'للصوص: 50 جرام جبن قريش، معلقتين زبادي، توم بودره، بابريكا مدخنه، فلفل اسود' }, amountGrams: 80, amount: 'جبن قريش وزبادي وتوابل', unit: 'portion' },
      { ingredientId: 'ing_dough', name: { en: 'Dough: 25g Flour, 1 Yogurt Cup, Salt, Italian Herbs / Dried Coriander', ar: 'للخبز: 25 جرام دقيق، علبه زبادي، ملح، بهارات ايطاليه او كزبره ناشفه' }, amountGrams: 140, amount: 'عجينة الزبادي والدقيق', unit: 'portion' },
      { ingredientId: 'ing_mozzarella', name: { en: 'Mozzarella Cheese', ar: 'للاضافة: جبنة موتزاريللا 10 جرام' }, amountGrams: 10, amount: '10 جم', unit: 'g' }
    ],
    instructions: {
      en: [
        'Cook chicken: Season chicken breast with spices and olive oil, then air-fry at 180°C for 20 minutes.',
        'Once cooked, chop chicken into small bites and mix with yogurt, paprika, salt, pepper, and mozzarella cheese.',
        'Prepare dough: Knead flour with yogurt and herbs until cohesive dough forms, divide into balls and roll flat.',
        'Place chicken filling in the center of rolled dough, fold into mutabbaq envelope, and crisp in a lightly sprayed pan or air fryer until golden and crunchy.'
      ],
      ar: [
        'طهي الدجاج: تبل صدور الدجاج بالتوابل وزيت الزيتون، ثم ضعها في Air Fryer لمدة 20 دقيقة على درجة حرارة 180 مئوية.',
        'بعد ما تستوي، قطع الدجاج إلى قطع صغيرة واخلطها مع الزبادي، بابريكا وملح وفلفل، والجبنة الموتزاريللا.',
        'تحضير العجينة: اخلط الدقيق مع الزبادي والتوابل حتى تتكون عجينة متماسكة، ثم قسمها إلى كرات وافردها.',
        'ضع كمية من الحشوة داخل العجينة المفرودة بعدها في الطاسة مع رشة زيت زتون او في الـ air fryer.'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_airfryer_roasted_whole_chicken',
    name: {
      en: 'Air Fryer Herb Roasted Whole Chicken with Tahini Dip',
      ar: 'الدجاج المشوي في air fryer'
    },
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 30,
    category: 'main_meals',
    mealType: 'dinner',
    servingSize: '1 whole roasted chicken (sharing / multiple meals)',
    calories: 1650,
    protein: 140,
    carbohydrates: 18,
    fat: 115,
    tags: ['High Protein', 'Feast / Sharing', 'Air Fryer', 'Keto Friendly'],
    ingredients: [
      { ingredientId: 'ing_whole_chicken', name: { en: 'Whole Chicken (Butterflied)', ar: '1 دجاجة كاملة' }, amountGrams: 1200, amount: '1 دجاجة كاملة', unit: 'piece' },
      { ingredientId: 'ing_tomato_paste', name: { en: 'Tomato Paste', ar: 'معجون طماطم' }, amountGrams: 30, amount: 'معجون طماطم', unit: 'tbsp' },
      { ingredientId: 'ing_chicken_rub', name: { en: 'Seasoning: Salt, Black Pepper, Garlic & Onion Powder, Smoked Paprika, Olive Oil', ar: 'ملح وفلفل أسود، ثوم وبصل بودرة، بابريكا مدخنة، زيت زيتون' }, amountGrams: 20, amount: 'توابل وزيت زيتون', unit: 'portion' },
      { ingredientId: 'ing_tahini_dip', name: { en: 'Dip: 1 Yogurt Cup, 1 tbsp Tahini, 1/2 Lemon, Salt, Pepper, Coriander, Garlic Powder, Paprika', ar: 'للصوص: 1 علبة زبادي، 1 ملعقة كبيرة طحينة، نصف ليمونة، ملح وفلفل أسود، كزبرة ناشفة وثوم بودرة، بابريكا' }, amountGrams: 140, amount: 'صوص الطحينة والزبادي', unit: 'portion' }
    ],
    instructions: {
      en: [
        'Prep chicken: Butterfly chicken lengthwise through backbone, remove excess skin/fat, and wash thoroughly with fresh lemon and water.',
        'In a large bowl, coat chicken thoroughly with tomato paste, salt, black pepper, garlic powder, onion powder, smoked paprika, and olive oil.',
        'Cooking: Place marinated chicken in air fryer at 200°C for 30 minutes until skin is crispy and meat is tender and cooked through.',
        'Prepare sauce: In a bowl, mix yogurt, tahini, lemon juice, salt, pepper, coriander, garlic powder, and paprika.'
      ],
      ar: [
        'تجهيز الدجاج: يتم تقسيم الدجاجة من المنتصف طولياً، وإزالة أي زوائد من الجلد والأجنحة، ثم تُغسل جيداً بالماء والليمون.',
        'في وعاء كبير، نضع الدجاج ونضيف عليه معجون الطماطم، الملح، الفلفل، الثوم والبصل البودرة، البابريكا، وزيت الزيتون.',
        'الطهي: نضع الدجاج في (Air Fryer) على درجة حرارة 200 درجة مئوية لمدة 30 دقيقة.',
        'تحضير الصصوص: أثناء طهي الدجاج، نخلط الزبادي مع الطحينة، الليمون، والبهارات (الملح، الفلفل، الكزبرة، الثوم البودرة، والبابريكا).'
      ]
    },
    isBookmarked: false
  },
  {
    id: 'rec_potato_chicken_tacos_skillet',
    name: {
      en: 'Crispy Potato & Chicken Mozzarella Skillet',
      ar: 'تاكو بطاطس ودجاج'
    },
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    preparationTimeMin: 15,
    cookTimeMin: 20,
    category: 'main_meals',
    mealType: 'lunch',
    servingSize: '1 skillet plate',
    calories: 510,
    protein: 40,
    carbohydrates: 29,
    fat: 20,
    tags: ['High Protein', 'Air Fryer', 'Loaded Skillet', 'Tacos'],
    ingredients: [
      { ingredientId: 'ing_chicken_breast', name: { en: 'Diced Chicken Breast', ar: '150 جم صدور دجاج مقطعة مكعبات' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_chicken_spices', name: { en: 'Chicken Spices: Salt, Smoked Paprika, Black Pepper, Garlic Powder, Whole Lemon, Olive Oil', ar: 'ملح، بابريكا مدخنة، فلفل أسود، ثوم بودرة، ليمونة كاملة، زيت زيتون' }, amountGrams: 15, amount: 'بهارات وليمون وزيت', unit: 'portion' },
      { ingredientId: 'ing_potatoes', name: { en: 'Diced Potatoes', ar: '150 جم بطاطس مقطعة مكعبات' }, amountGrams: 150, amount: '150 جم', unit: 'g' },
      { ingredientId: 'ing_potato_spices', name: { en: 'Potato Seasoning: 1 tsp Olive Oil, Salt, Black Pepper, Paprika, Garlic Powder', ar: 'معلقه صغيره زيت زيتون، ملح، فلفل أسود، بابريكا، ثوم بودرة' }, amountGrams: 8, amount: 'توابل وزيت', unit: 'portion' },
      { ingredientId: 'ing_cheese_sauce', name: { en: 'Cheesy Sauce: Milk, Mozzarella Cheese, Paprika, Salt', ar: 'للصوص: حليب، جبنة موزاريلا، بابريكا، ملح' }, amountGrams: 60, amount: 'صوص الجبنة والموزاريلا', unit: 'portion' }
    ],
    instructions: {
      en: [
        'Season chicken: Toss diced chicken with spices, whole lemon juice, and olive oil.',
        'Prep potatoes: Dice potatoes, wash, and season with olive oil, paprika, garlic powder, salt, and black pepper.',
        'Cook: Roast potatoes in oven at 180°C for 25 minutes; cook chicken in air fryer at 180°C for 18-20 minutes.',
        'In a pan, bring milk, mozzarella, and paprika to a simmer until cheese sauce forms, then add crispy potatoes and chicken, stirring together. Top with extra mozzarella for 30 seconds to melt.'
      ],
      ar: [
        'تتبيل الدجاج: اخلط مكعبات الدجاج مع التوابل، الليمون، وزيت الزيتون.',
        'تجهيز البطاطس: قطع البطاطس مكعبات واغسلها، ثم تبّلها بالزيت والبهارات المذكورة.',
        'الطهي: ضع البطاطس في الفرن على درجة حرارة 180°C لمدة 25 دقيقة.',
        'ضع الدجاج في القلاية الهوائية (Air Fryer) على درجة حرارة 180°C لمدة 18-20 دقيقة.',
        'في طاسة على النار، ضعي الحليب والموزاريلا والبهارات حتى يغلي الصوص، ثم أضيفي البطاطس والدجاج وقلّبيهم معاً. يمكنكِ إضافة رشة موزاريلا إضافية وتغطيتها لمدة نصف دقيقة لتذوب.'
      ]
    },
    isBookmarked: false
  }
];
