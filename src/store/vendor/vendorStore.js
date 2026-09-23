import { create } from 'zustand';

// Initial realistic data reflecting beauty salons in Kerman
const INITIAL_VENDOR = {
  id: 'v_nazanin',
  title: 'سالن زیبایی نازنین',
  category: 'خدمات تخصصی مو، پوست و ناخن',
  auxiliaryPhone: '۰۳۴-۳۲۴۵۶۷۸۹',
  mobile: '۰۹۱۳۱۲۳۴۵۶۷',
  isActive: true, // کلید فعال یا غیرفعال بودن سالن
  city: 'کرمان',
  address: 'کرمان، خیابان بهمنیار، کوچه ۸، پلاک ۱۲',
  lat: 30.28393,
  lng: 57.07879,
  iban: 'IR820120000000001234567890',
  commissionFreeUnitsTotal: 50,
  commissionFreeUnitsUsed: 38, // ۳۸ تا از ۵۰ سهمیه رایگان استفاده شده
  coverImage: 'https://cdn.takhfifan.com/images/1.0?id=vendor/production/business/images/114603/m06a16wns0I_QQ-QOTddZA.png',
  gallery: [
    'https://cdn.takhfifan.com/images/1.0?id=vendor/production/business/images/114603/m06a16wns0I_QQ-QOTddZA.png',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
  ],
  workingDays: [
    { day: 'شنبه', key: 'sat', isOpen: true, from: '۰۹:۰۰', to: '۲۰:۰۰' },
    { day: 'یکشنبه', key: 'sun', isOpen: true, from: '۰۹:۰۰', to: '۲۰:۰۰' },
    { day: 'دوشنبه', key: 'mon', isOpen: true, from: '۰۹:۰۰', to: '۲۰:۰۰' },
    { day: 'سه‌شنبه', key: 'tue', isOpen: true, from: '۰۹:۰۰', to: '۲۰:۰۰' },
    { day: 'چهارشنبه', key: 'wed', isOpen: true, from: '۰۹:۰۰', to: '۲۰:۰۰' },
    { day: 'پنج‌شنبه', key: 'thu', isOpen: true, from: '۰۹:۰۰', to: '۱۸:۰۰' },
    { day: 'جمعه', key: 'fri', isOpen: false, from: '۱۰:۰۰', to: '۱۶:۰۰' },
  ],
};

const INITIAL_CATALOG_CATEGORIES = [
  { id: 'hair', name: 'مو و کراتین', icon: 'Scissors' },
  { id: 'nail', name: 'ناخن و پدیکور', icon: 'Sparkles' },
  { id: 'skin', name: 'پوست و فیشیال', icon: 'Flower' },
  { id: 'brow', name: 'مژه و ابرو', icon: 'Eye' },
  { id: 'makeup', name: 'میکاپ و گریم', icon: 'Smile' },
  { id: 'massage', name: 'ماساژ و اسپا', icon: 'Heart' },
  { id: 'epilation', name: 'اپیلاسیون', icon: 'Flame' },
];

const INITIAL_SYSTEM_CATALOG = [
  {
    id: 'cat_h1',
    categoryId: 'hair',
    title: 'کراتینه و احیای ابریشمی مو',
    categoryName: 'مو و کراتین',
    suggestedPrice: 2200000,
    duration: '۱۲۰ دقیقه',
    image: 'https://www.digikala.com/mag/wp-content/uploads/2023/04/keratine.jpg',
    description: 'احیای عمقی ساقه‌های آسیب‌دیده با بوتاکس و پروتئین طبیعی برزیلی',
  },
  {
    id: 'cat_h2',
    categoryId: 'hair',
    title: 'رنگ و لایت بالیاژ اروپایی',
    categoryName: 'مو و کراتین',
    suggestedPrice: 3500000,
    duration: '۱۸۰ دقیقه',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrDacnFl0RJ_EOwFFMIFl_WWhDpAkd2Fssb2GJqM1nKtIOkxgrNNHvhYSt&s=10',
    description: 'ترکیب تکنیک‌های جدید فویل و بالیاژ بدون آسیب به ریشه مو',
  },
  {
    id: 'cat_h3',
    categoryId: 'hair',
    title: 'براشینگ و حالت‌دهی هالیوودی',
    categoryName: 'مو و کراتین',
    suggestedPrice: 450000,
    duration: '۴۵ دقیقه',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlcww6J-xMRPPp77rtQYA92fKJiuyiQqH0wCu08ghmeA&s',
    description: 'شینیون نیمه‌باز و براشینگ مجلسی با اسپری‌های ضد وز',
  },
  {
    id: 'cat_n1',
    categoryId: 'nail',
    title: 'کاشت ناخن با ژل و پلی‌ژل',
    categoryName: 'ناخن و پدیکور',
    suggestedPrice: 700000,
    duration: '۹۰ دقیقه',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmgtWbU5MVIxtkEJ5nLDyo2lsh6aLtgVDLjDqn6NN80OUmAJrV1cWuVCVE&s=10',
    description: 'کاشت سبک بدون گرد و غبار، همراه با مانیکور روسی تخصصی',
  },
  {
    id: 'cat_n2',
    categoryId: 'nail',
    title: 'ژلیش ناخن طبیعی دست',
    categoryName: 'ناخن و پدیکور',
    suggestedPrice: 280000,
    duration: '۴۵ دقیقه',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwyLFBKNs_rU__HQ2WaM28DIbA_HWIBl0vxBSeXF2WvUUn-qV5pc7tyXb1&s=10',
    description: 'استحکام‌بخشی و پوشش ژلی با ماندگاری بالای ۴ هفته',
  },
  {
    id: 'cat_n3',
    categoryId: 'nail',
    title: 'پدیکور و کفسابی VIP با جکوزی و کوکتل',
    categoryName: 'ناخن و پدیکور',
    suggestedPrice: 550000,
    duration: '۶۰ دقیقه',
    image: 'https://s100.divarcdn.com/static/photo/neda/webp_post/XKFm7wuH5n49OEtSINyuBg/1d1f88a6-657e-4686-a30c-c08515762e56.webp',
    description: 'رفع ترک و پینه‌های پا با پارافین‌تراپی و روغن‌های گیاهی معطر',
  },
  {
    id: 'cat_s1',
    categoryId: 'skin',
    title: 'فیشیال تخصصی پوست و هیدرودرمی',
    categoryName: 'پوست و فیشیال',
    suggestedPrice: 1100000,
    duration: '۷۵ دقیقه',
    image: 'https://i1.delgarm.com/i/828/020813/65462621f1fcd.jpeg',
    description: 'تخلیه منافذ، اکسیژن‌رسانی، بخور سرد و گرم و لایه‌برداری آنزیمی',
  },
  {
    id: 'cat_s2',
    categoryId: 'skin',
    title: 'پاکسازی و لیفت جوانسازی پلاژن',
    categoryName: 'پوست و فیشیال',
    suggestedPrice: 1500000,
    duration: '۶۰ دقیقه',
    image: 'https://cdn.takhfifan.com/images/1.0?id=vendor/production/business/images/114348/cnOIHeAIc43Edf8365_CWg.jpg',
    description: 'تحریک کلاژن‌سازی با امواج آراف و کپسول‌های تغذیه‌کننده',
  },
  {
    id: 'cat_b1',
    categoryId: 'brow',
    title: 'اکستنشن مژه اسپایکی و والیوم روسی',
    categoryName: 'مژه و ابرو',
    suggestedPrice: 850000,
    duration: '۱۰۰ دقیقه',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    description: 'تارهای ابریشمی فوق سبک و ضد حساسیت با ماندگاری عالی',
  },
  {
    id: 'cat_b2',
    categoryId: 'brow',
    title: 'لیفت و لمینت ابرو با مواد مای‌لمینیشن',
    categoryName: 'مژه و ابرو',
    suggestedPrice: 420000,
    duration: '۵۰ دقیقه',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
    description: 'حالت‌دهی پهن و طبیعی تارهای ابرو با کراتین و تقویت‌کننده گیاهی',
  },
  {
    id: 'cat_m1',
    categoryId: 'makeup',
    title: 'میکاپ لایت اروپایی و گریم صورت',
    categoryName: 'میکاپ و گریم',
    suggestedPrice: 1800000,
    duration: '۹۰ دقیقه',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    description: 'کانتورینگ چهره متناسب با فرم صورت با برندهای هدی‌بیوتی و مک',
  },
];

const INITIAL_VENDOR_SERVICES = [
  {
    id: 'vs_1',
    catalogId: 'cat_h1',
    title: 'کراتینه و احیای ابریشمی مو',
    category: 'مو و کراتین',
    price: 2200000,
    discountPercent: 25,
    finalPrice: 1650000,
    couponValidityDays: 30,
    purchaseLimit: 30,
    soldCount: 19,
    isActive: true,
    image: 'https://www.digikala.com/mag/wp-content/uploads/2023/04/keratine.jpg',
  },
  {
    id: 'vs_2',
    catalogId: 'cat_h2',
    title: 'رنگ و لایت بالیاژ اروپایی',
    category: 'مو و کراتین',
    price: 3500000,
    discountPercent: 20,
    finalPrice: 2800000,
    couponValidityDays: 30,
    purchaseLimit: 20,
    soldCount: 11,
    isActive: true,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrDacnFl0RJ_EOwFFMIFl_WWhDpAkd2Fssb2GJqM1nKtIOkxgrNNHvhYSt&s=10',
  },
  {
    id: 'vs_3',
    catalogId: 'cat_n1',
    title: 'کاشت ناخن با ژل و پلی‌ژل',
    category: 'ناخن و پدیکور',
    price: 700000,
    discountPercent: 20,
    finalPrice: 560000,
    couponValidityDays: 30,
    purchaseLimit: 50,
    soldCount: 42,
    isActive: true,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmgtWbU5MVIxtkEJ5nLDyo2lsh6aLtgVDLjDqn6NN80OUmAJrV1cWuVCVE&s=10',
  },
  {
    id: 'vs_4',
    catalogId: 'cat_s1',
    title: 'فیشیال تخصصی پوست و هیدرودرمی',
    category: 'پوست و فیشیال',
    price: 1100000,
    discountPercent: 30,
    finalPrice: 770000,
    couponValidityDays: 30,
    purchaseLimit: 40,
    soldCount: 26,
    isActive: true,
    image: 'https://i1.delgarm.com/i/828/020813/65462621f1fcd.jpeg',
  },
  {
    id: 'vs_5',
    catalogId: 'cat_b2',
    title: 'لیفت و لمینت ابرو با مواد مای‌لمینیشن',
    category: 'مژه و ابرو',
    price: 450000,
    discountPercent: 15,
    finalPrice: 382500,
    couponValidityDays: 30,
    purchaseLimit: 25,
    soldCount: 8,
    isActive: false, // موقتاً متوقف شده
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
  },
];

const INITIAL_COUPONS = [
  {
    id: 'cp_582914',
    code: '582914',
    customerName: 'مبینا کاربخش',
    customerPhone: '۰۹۱۳۸۸۲۴۵۹۰',
    serviceTitle: 'کاشت ناخن با ژل و پلی‌ژل',
    serviceCategory: 'ناخن',
    preferredVisitDate: '۱۴۰۵/۰۳/۱۸',
    preferredTimeSlot: '۱۵:۰۰ تا ۱۸:۰۰',
    price: 700000,
    discountPercent: 20,
    customerPaid: 560000,
    salonShare: 560000, // سهم خالص سالن (بدون کارمزد سهمیه)
    status: 'pending', // در انتظار مراجعه
    purchasedAt: '۱۴۰۵/۰۳/۱۴ - ۱۰:۳۰',
    expireAt: '۱۴۰۵/۰۴/۱۴',
    usedAt: null,
  },
  {
    id: 'cp_741295',
    code: '741295',
    customerName: 'فاطمه رضایی',
    customerPhone: '۰۹۳۵۶۷۱۸۹۰۰',
    serviceTitle: 'فیشیال تخصصی پوست و هیدرودرمی',
    serviceCategory: 'پوست',
    preferredVisitDate: '۱۴۰۵/۰۳/۱۸',
    preferredTimeSlot: '۱۱:۰۰ تا ۱۳:۰۰',
    price: 1100000,
    discountPercent: 30,
    customerPaid: 770000,
    salonShare: 770000,
    status: 'pending', // در انتظار مراجعه (امروز)
    purchasedAt: '۱۴۰۵/۰۳/۱۵ - ۱۸:۲۰',
    expireAt: '۱۴۰۵/۰۴/۱۵',
    usedAt: null,
  },
  {
    id: 'cp_963852',
    code: '963852',
    customerName: 'سحر تهرانی',
    customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    serviceTitle: 'کراتینه و احیای ابریشمی مو',
    serviceCategory: 'مو',
    preferredVisitDate: '۱۴۰۵/۰۳/۱۰',
    preferredTimeSlot: '۱۶:۰۰ تا ۱۹:۰۰',
    price: 2200000,
    discountPercent: 25,
    customerPaid: 1650000,
    salonShare: 1650000,
    status: 'used', // استفاده شده
    purchasedAt: '۱۴۰۵/۰۲/۲۸ - ۱۲:۰۰',
    expireAt: '۱۴۰۵/۰۳/۲۸',
    usedAt: '۱۴۰۵/۰۳/۱۰ - ۱۶:۴۵',
  },
  {
    id: 'cp_357159',
    code: '357159',
    customerName: 'مریم منصوری',
    customerPhone: '۰۹۱۳۴۵۶۹۸۷۴',
    serviceTitle: 'رنگ و لایت بالیاژ اروپایی',
    serviceCategory: 'مو',
    preferredVisitDate: '۱۴۰۵/۰۳/۰۴',
    preferredTimeSlot: '۱۰:۰۰ تا ۱۴:۰۰',
    price: 3500000,
    discountPercent: 20,
    customerPaid: 2800000,
    salonShare: 2800000,
    status: 'used',
    purchasedAt: '۱۴۰۵/۰۲/۲۰ - ۰۹:۱۵',
    expireAt: '۱۴۰۵/۰۳/۲۰',
    usedAt: '۱۴۰۵/۰۳/۰۴ - ۱۰:۳۰',
  },
  {
    id: 'cp_159753',
    code: '159753',
    customerName: 'آرزو کمالی',
    customerPhone: '۰۹۱۹۸۷۶۵۴۳۲',
    serviceTitle: 'کاشت ناخن با ژل و پلی‌ژل',
    serviceCategory: 'ناخن',
    preferredVisitDate: '۱۴۰۵/۰۱/۱۵',
    preferredTimeSlot: '۱۴:۰۰ تا ۱۶:۰۰',
    price: 700000,
    discountPercent: 20,
    customerPaid: 560000,
    salonShare: 560000,
    status: 'expired', // منقضی شده
    purchasedAt: '۱۴۰۵/۰۱/۰۲ - ۱۱:۳۰',
    expireAt: '۱۴۰۵/۰۲/۰۲',
    usedAt: null,
  },
  {
    id: 'cp_852461',
    code: '852461',
    customerName: 'نگین شجاعی',
    customerPhone: '۰۹۳۶۹۸۷۱۲۳۴',
    serviceTitle: 'فیشیال تخصصی پوست و هیدرودرمی',
    serviceCategory: 'پوست',
    preferredVisitDate: '۱۴۰۵/۰۲/۱۴',
    preferredTimeSlot: '۱۷:۰۰ تا ۱۹:۰۰',
    price: 1100000,
    discountPercent: 30,
    customerPaid: 770000,
    salonShare: 0,
    status: 'cancelled', // لغو شده
    purchasedAt: '۱۴۰۵/۰۲/۱۰ - ۲۰:۰۰',
    expireAt: '۱۴۰۵/۰۳/۱۰',
    usedAt: null,
  },
];

const INITIAL_CRM_CUSTOMERS = [
  {
    id: 'crm_1',
    name: 'مبینا کاربخش',
    phone: '۰۹۱۳۸۸۲۴۵۹۰',
    onlineOrdersCount: 4,
    offlineVisitsCount: 3,
    totalLtv: 6850000,
    lastVisitDate: '۱۴۰۵/۰۳/۱۰',
    lastVisitDaysAgo: 8,
    tier: 'VIP', // VIP
    birthday: '۱۴۰۵/۰۴/۱۵',
    anniversary: '۱۴۰۵/۰۷/۱۰',
    staffNotes: [
      'حساسیت به پرایمر اسیدی ناخن؛ همیشه پرایمر غیراسیدی استفاده شود.',
      'ترکیب رنگ مورد علاقه: دودی زیتونی پایه ۸',
      'چای سبز با هل میل می‌کنند.',
    ],
    history: [
      { date: '۱۴۰۵/۰۳/۱۰', service: 'ترمیم ناخن با ژل', staff: 'مهسا مرادی', amount: 350000, type: 'offline' },
      { date: '۱۴۰۵/۰۲/۱۵', service: 'کراتینه و احیا', staff: 'نازنین ابراهیمی', amount: 1650000, type: 'online' },
      { date: '۱۴۰۵/۰۱/۲۰', service: 'فیشیال پاکسازی', staff: 'یلدا رحیمی', amount: 770000, type: 'online' },
      { date: '۱۴۰۴/۱۲/۲۲', service: 'رنگ و لایت فویلی', staff: 'نازنین ابراهیمی', amount: 2800000, type: 'online' },
    ],
  },
  {
    id: 'crm_2',
    name: 'فاطمه رضایی',
    phone: '۰۹۳۵۶۷۱۸۹۰۰',
    onlineOrdersCount: 2,
    offlineVisitsCount: 1,
    totalLtv: 2200000,
    lastVisitDate: '۱۴۰۵/۰۲/۲۴',
    lastVisitDaysAgo: 24,
    tier: 'silver', // نقره‌ای
    birthday: '۱۴۰۵/۰۵/۰۲',
    staffNotes: [
      'پوست حساس و دهیدراته؛ استفاده از ماسک آبرسان عمیق.',
    ],
    history: [
      { date: '۱۴۰۵/۰۲/۲۴', service: 'پاکسازی پوست', staff: 'یلدا رحیمی', amount: 650000, type: 'offline' },
      { date: '۱۴۰۵/۰۱/۱۵', service: 'فیشیال تخصصی', staff: 'یلدا رحیمی', amount: 770000, type: 'online' },
    ],
  },
  {
    id: 'crm_3',
    name: 'سحر تهرانی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    onlineOrdersCount: 5,
    offlineVisitsCount: 4,
    totalLtv: 9400000,
    lastVisitDate: '۱۴۰۵/۰۳/۰۲',
    lastVisitDaysAgo: 16,
    tier: 'VIP',
    birthday: '۱۴۰۵/۰۶/۱۸',
    staffNotes: [
      'تار موی نازک و شکننده؛ اتوکشی کراتین با دمای حداکثر ۲۱۰ درجه.',
      'مشتری بسیار وقت‌شناس و منظم.',
    ],
    history: [
      { date: '۱۴۰۵/۰۳/۰۲', service: 'کراتینه ابریشمی', staff: 'نازنین ابراهیمی', amount: 1650000, type: 'online' },
      { date: '۱۴۰۵/۰۲/۰۱', service: 'براشینگ تخصصی', staff: 'سارا حسینی', amount: 300000, type: 'offline' },
      { date: '۱۴۰۴/۱۲/۲۶', service: 'بالیاژ برزیلی', staff: 'نازنین ابراهیمی', amount: 3200000, type: 'offline' },
    ],
  },
  {
    id: 'crm_4',
    name: 'مریم منصوری',
    phone: '۰۹۱۳۴۵۶۹۸۷۴',
    onlineOrdersCount: 1,
    offlineVisitsCount: 1,
    totalLtv: 3150000,
    lastVisitDate: '۱۴۰۴/۱۱/۲۰',
    lastVisitDaysAgo: 115, // بیش از ۴۵ روز عدم مراجعه (مشتری بازگشتی هدف)
    tier: 'bronze',
    birthday: '۱۴۰۵/۰۳/۲۵',
    staffNotes: [
      'علاقه‌مند به متدهای کوتاهی مدرن.',
    ],
    history: [
      { date: '۱۴۰۴/۱۱/۲۰', service: 'رنگ و لایت', staff: 'نازنین ابراهیمی', amount: 2800000, type: 'online' },
      { date: '۱۴۰۴/۱۰/۱۲', service: 'کوپ ژورنالی', staff: 'سارا حسینی', amount: 350000, type: 'offline' },
    ],
  },
  {
    id: 'crm_5',
    name: 'شیوا ابراهیمی',
    phone: '۰۹۱۳۳۴۰۵۵۲۱',
    onlineOrdersCount: 0,
    offlineVisitsCount: 2,
    totalLtv: 1200000,
    lastVisitDate: '۱۴۰۴/۱۲/۰۵',
    lastVisitDaysAgo: 102, // بیش از ۴۵ روز عدم مراجعه
    tier: 'bronze',
    birthday: '۱۴۰۵/۰۸/۱۰',
    staffNotes: ['مدل ابروی پهن را می‌پسندد.'],
    history: [
      { date: '۱۴۰۴/۱۲/۰۵', service: 'لیفت مژه و ابرو', staff: 'سارا حسینی', amount: 750000, type: 'offline' },
      { date: '۱۴۰۴/۱۰/۲۸', service: 'مانیکور روسی', staff: 'مهسا مرادی', amount: 450000, type: 'offline' },
    ],
  },
  {
    id: 'crm_6',
    name: 'الهام سلیمانی',
    phone: '۰۹۳۷۴۴۵۱۲۸۹',
    onlineOrdersCount: 2,
    offlineVisitsCount: 2,
    totalLtv: 4300000,
    lastVisitDate: '۱۴۰۵/۰۱/۱۵',
    lastVisitDaysAgo: 63, // بیش از ۴۵ روز عدم مراجعه
    tier: 'silver',
    birthday: '۱۴۰۵/۰۹/۰۴',
    staffNotes: ['کاشت فرم بادامی متوسط.'],
    history: [
      { date: '۱۴۰۵/۰۱/۱۵', service: 'ژلیش و لمینت ناخن', staff: 'مهسا مرادی', amount: 420000, type: 'offline' },
      { date: '۱۴۰۴/۱۲/۱۸', service: 'فیشیال هیدرودرمی', staff: 'یلدا رحیمی', amount: 770000, type: 'online' },
    ],
  },
];

const INITIAL_STAFF = [
  { id: 'st_1', name: 'نازنین ابراهیمی', specialty: 'مدیر و مدرس رنگ و لایت', color: '#F47A20' },
  { id: 'st_2', name: 'سارا حسینی', specialty: 'میکاپ و مژه و ابرو', color: '#ec4899' },
  { id: 'st_3', name: 'مهسا مرادی', specialty: 'لاین تخصصی ناخن', color: '#8b5cf6' },
  { id: 'st_4', name: 'یلدا رحیمی', specialty: 'تراپیست پوست و فیشیال', color: '#06b6d4' },
];

const INITIAL_OFFLINE_BOOKINGS = [
  {
    id: 'bk_1',
    customerName: 'زهرا کاظمی',
    customerPhone: '۰۹۱۳۱۴۰۸۸۹۹',
    serviceTitle: 'کاشت ناخن با ژل و پلی‌ژل',
    serviceLine: 'ناخن',
    staffId: 'st_3',
    staffName: 'مهسا مرادی',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۰:۰۰',
    duration: 90,
    amount: 700000,
    paidAmount: 700000,
    paymentMethod: 'pos', // کارتخوان
    status: 'completed',
    notes: 'تسویه کامل با دستگاه کارتخوان سامان',
  },
  {
    id: 'bk_2',
    customerName: 'پریسا نامدار',
    customerPhone: '۰۹۳۹۵۵۴۱۲۳۱',
    serviceTitle: 'رنگ ریشه و براشینگ',
    serviceLine: 'رنگ و مو',
    staffId: 'st_1',
    staffName: 'نازنین ابراهیمی',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۱:۳۰',
    duration: 120,
    amount: 1400000,
    paidAmount: 1400000,
    paymentMethod: 'card_to_card', // کارت به کارت
    status: 'in_progress',
    notes: 'فیش واریزی بانک ملی دریافت شد',
  },
  {
    id: 'bk_3',
    customerName: 'رویا حسنی',
    customerPhone: '۰۹۱۲۸۸۴۹۰۱۱',
    serviceTitle: 'فیشیال آبرسانی عمیق',
    serviceLine: 'پوست',
    staffId: 'st_4',
    staffName: 'یلدا رحیمی',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۴:۳۰',
    duration: 60,
    amount: 900000,
    paidAmount: 300000, // بیعانه
    paymentMethod: 'credit', // نسیه / مانده بدهی
    status: 'confirmed',
    notes: '۳۰۰ هزار بیعانه نقدی داده شد، ۶۰۰ هزار مانده هنگام خروج',
  },
  {
    id: 'bk_4',
    customerName: 'سمانه امیری',
    customerPhone: '۰۹۱۳۵۵۶۷۸۹۰',
    serviceTitle: 'اکستنشن مژه کلاسیک',
    serviceLine: 'مژه و ابرو',
    staffId: 'st_2',
    staffName: 'سارا حسینی',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۶:۰۰',
    duration: 90,
    amount: 650000,
    paidAmount: 650000,
    paymentMethod: 'cash', // نقدی
    status: 'confirmed',
    notes: 'رزرو تلفنی هماهنگ شده',
  },
];

const LOCAL_STORAGE_KEY = 'lopon_vendor_state_v1';

const loadSavedState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Error loading vendor state', e);
    return null;
  }
};

const saveState = (state) => {
  if (typeof window === 'undefined') return;
  try {
    const { vendor, services, coupons, crmCustomers, staff, offlineBookings } = state;
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ vendor, services, coupons, crmCustomers, staff, offlineBookings })
    );
  } catch (e) {
    console.error('Error saving vendor state', e);
  }
};

const saved = loadSavedState();

export const useVendorStore = create((set, get) => ({
  // State
  vendor: saved?.vendor || INITIAL_VENDOR,
  catalogCategories: INITIAL_CATALOG_CATEGORIES,
  systemCatalog: INITIAL_SYSTEM_CATALOG,
  services: saved?.services || INITIAL_VENDOR_SERVICES,
  coupons: saved?.coupons || INITIAL_COUPONS,
  crmCustomers: saved?.crmCustomers || INITIAL_CRM_CUSTOMERS,
  staff: saved?.staff || INITIAL_STAFF,
  offlineBookings: saved?.offlineBookings || INITIAL_OFFLINE_BOOKINGS,
  quickRedeemModalOpen: false,

  // UI helpers
  setQuickRedeemModalOpen: (open) => set({ quickRedeemModalOpen: open }),

  // 1. Vendor Profile Actions
  updateVendorProfile: (fields) => {
    set((state) => {
      const nextVendor = { ...state.vendor, ...fields };
      const next = { ...state, vendor: nextVendor };
      saveState(next);
      return { vendor: nextVendor };
    });
  },

  toggleVendorActiveStatus: () => {
    set((state) => {
      const nextVendor = { ...state.vendor, isActive: !state.vendor.isActive };
      const next = { ...state, vendor: nextVendor };
      saveState(next);
      return { vendor: nextVendor };
    });
  },

  // 2. Coupons Actions
  redeemCoupon: (couponCode) => {
    const state = get();
    const cleanCode = String(couponCode).trim();
    const couponIndex = state.coupons.findIndex((c) => c.code === cleanCode);

    if (couponIndex === -1) {
      return { success: false, message: `کوپنی با کد ${cleanCode} یافت نشد!` };
    }

    const targetCoupon = state.coupons[couponIndex];

    if (targetCoupon.status === 'used') {
      return {
        success: false,
        message: `این کوپن قبلاً در تاریخ ${targetCoupon.usedAt || 'نامشخص'} استفاده شده است.`,
        coupon: targetCoupon,
      };
    }

    if (targetCoupon.status === 'expired') {
      return {
        success: false,
        message: `مهلت اعتبار این کوپن در تاریخ ${targetCoupon.expireAt} به پایان رسیده است.`,
        coupon: targetCoupon,
      };
    }

    if (targetCoupon.status === 'cancelled') {
      return {
        success: false,
        message: 'این کوپن لغو یا مرجوع شده است و قابل پذیرش نیست.',
        coupon: targetCoupon,
      };
    }

    const now = new Date();
    const jDate = '۱۴۰۵/۰۳/۱۸'; // Simulated current Persian date
    const jTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const usedAtStr = `${jDate} - ${jTime}`;

    const updatedCoupons = [...state.coupons];
    const updatedCoupon = {
      ...targetCoupon,
      status: 'used',
      usedAt: usedAtStr,
    };
    updatedCoupons[couponIndex] = updatedCoupon;

    // Also update CRM customer records if exists
    let updatedCrm = [...state.crmCustomers];
    const crmIndex = updatedCrm.findIndex((c) => c.phone === targetCoupon.customerPhone);
    if (crmIndex !== -1) {
      const client = updatedCrm[crmIndex];
      updatedCrm[crmIndex] = {
        ...client,
        onlineOrdersCount: client.onlineOrdersCount + 1,
        totalLtv: client.totalLtv + targetCoupon.customerPaid,
        lastVisitDate: jDate,
        lastVisitDaysAgo: 0,
        history: [
          {
            date: jDate,
            service: targetCoupon.serviceTitle,
            staff: 'پذیرش آنلاین لوپُن',
            amount: targetCoupon.customerPaid,
            type: 'online',
          },
          ...client.history,
        ],
      };
    }

    const nextState = {
      ...state,
      coupons: updatedCoupons,
      crmCustomers: updatedCrm,
    };
    saveState(nextState);
    set({ coupons: updatedCoupons, crmCustomers: updatedCrm });

    return {
      success: true,
      message: `کوپن کد ${cleanCode} (${targetCoupon.serviceTitle}) با موفقیت ثبت استفاده شد!`,
      coupon: updatedCoupon,
    };
  },

  // 3. Services Actions
  toggleServiceStatus: (serviceId) => {
    set((state) => {
      const updated = state.services.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      );
      const next = { ...state, services: updated };
      saveState(next);
      return { services: updated };
    });
  },

  updateService: (serviceId, fields) => {
    set((state) => {
      const updated = state.services.map((s) => {
        if (s.id !== serviceId) return s;
        const newPrice = fields.price !== undefined ? Number(fields.price) : s.price;
        const newDiscount = fields.discountPercent !== undefined ? Number(fields.discountPercent) : s.discountPercent;
        const finalPrice = Math.round(newPrice * (1 - newDiscount / 100));

        return {
          ...s,
          ...fields,
          price: newPrice,
          discountPercent: newDiscount,
          finalPrice,
        };
      });
      const next = { ...state, services: updated };
      saveState(next);
      return { services: updated };
    });
  },

  addServiceFromCatalog: ({ catalogId, price, discountPercent, couponValidityDays = 30, purchaseLimit = 50 }) => {
    const state = get();
    const catalogItem = state.systemCatalog.find((c) => c.id === catalogId);
    if (!catalogItem) return { success: false, message: 'آیتم کاتالوگ یافت نشد' };

    const parsedPrice = Number(price) || catalogItem.suggestedPrice;
    const parsedDiscount = Number(discountPercent) || 15;
    const finalPrice = Math.round(parsedPrice * (1 - parsedDiscount / 100));

    const newService = {
      id: `vs_${Date.now()}`,
      catalogId: catalogItem.id,
      title: catalogItem.title,
      category: catalogItem.categoryName,
      price: parsedPrice,
      discountPercent: parsedDiscount,
      finalPrice,
      couponValidityDays: Number(couponValidityDays) || 30,
      purchaseLimit: Number(purchaseLimit) || 50,
      soldCount: 0,
      isActive: true,
      image: catalogItem.image,
    };

    const updated = [newService, ...state.services];
    const next = { ...state, services: updated };
    saveState(next);
    set({ services: updated });
    return { success: true, service: newService };
  },

  deleteService: (serviceId) => {
    set((state) => {
      const updated = state.services.filter((s) => s.id !== serviceId);
      const next = { ...state, services: updated };
      saveState(next);
      return { services: updated };
    });
  },

  // 4. CRM Actions
  addCustomerNote: (customerId, noteText) => {
    set((state) => {
      const updated = state.crmCustomers.map((c) => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          staffNotes: [noteText, ...c.staffNotes],
        };
      });
      const next = { ...state, crmCustomers: updated };
      saveState(next);
      return { crmCustomers: updated };
    });
  },

  sendMarketingSms: ({ targetPhones, message, discountCode }) => {
    // Simulated SMS broadcast
    return {
      success: true,
      sentCount: targetPhones.length,
      message: `پیامک تخفیف اختصاصی با موفقیت برای ${targetPhones.length} نفر ارسال گردید.`,
    };
  },

  // 5. Offline Bookings Actions
  addOfflineBooking: (bookingData) => {
    const state = get();

    // Check staff overlap
    const hasConflict = state.offlineBookings.some((b) => {
      return (
        b.staffId === bookingData.staffId &&
        b.date === bookingData.date &&
        b.time === bookingData.time &&
        b.status !== 'cancelled'
      );
    });

    if (hasConflict) {
      return {
        success: false,
        message: `پرسنل انتخاب‌شده در تاریخ ${bookingData.date} ساعت ${bookingData.time} نوبت رزروشده دیگری دارد! لطفاً ساعت دیگری انتخاب نمایید.`,
      };
    }

    const newBooking = {
      id: `bk_${Date.now()}`,
      ...bookingData,
      status: 'confirmed',
    };

    const updatedBookings = [newBooking, ...state.offlineBookings];

    // Connect to CRM automatically
    let updatedCrm = [...state.crmCustomers];
    const existingIndex = updatedCrm.findIndex((c) => c.phone === bookingData.customerPhone);
    const jDate = bookingData.date || '۱۴۰۵/۰۳/۱۸';

    if (existingIndex !== -1) {
      const current = updatedCrm[existingIndex];
      updatedCrm[existingIndex] = {
        ...current,
        offlineVisitsCount: current.offlineVisitsCount + 1,
        totalLtv: current.totalLtv + (Number(bookingData.paidAmount) || Number(bookingData.amount)),
        lastVisitDate: jDate,
        lastVisitDaysAgo: 0,
        history: [
          {
            date: jDate,
            service: bookingData.serviceTitle,
            staff: bookingData.staffName,
            amount: Number(bookingData.amount),
            type: 'offline',
          },
          ...current.history,
        ],
      };
    } else {
      // New CRM customer
      const newClient = {
        id: `crm_${Date.now()}`,
        name: bookingData.customerName,
        phone: bookingData.customerPhone,
        onlineOrdersCount: 0,
        offlineVisitsCount: 1,
        totalLtv: Number(bookingData.paidAmount) || Number(bookingData.amount),
        lastVisitDate: jDate,
        lastVisitDaysAgo: 0,
        tier: 'bronze',
        birthday: '',
        staffNotes: ['ثبت شده از طریق سیستم نوبت‌دهی سالن'],
        history: [
          {
            date: jDate,
            service: bookingData.serviceTitle,
            staff: bookingData.staffName,
            amount: Number(bookingData.amount),
            type: 'offline',
          },
        ],
      };
      updatedCrm = [newClient, ...updatedCrm];
    }

    const next = {
      ...state,
      offlineBookings: updatedBookings,
      crmCustomers: updatedCrm,
    };
    saveState(next);
    set({ offlineBookings: updatedBookings, crmCustomers: updatedCrm });

    return {
      success: true,
      message: `نوبت با موفقیت برای خانم ${bookingData.customerName} ثبت و پرونده مشتری به‌روز شد.`,
      booking: newBooking,
    };
  },

  // Reset to default
  resetVendorData: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    set({
      vendor: INITIAL_VENDOR,
      services: INITIAL_VENDOR_SERVICES,
      coupons: INITIAL_COUPONS,
      crmCustomers: INITIAL_CRM_CUSTOMERS,
      staff: INITIAL_STAFF,
      offlineBookings: INITIAL_OFFLINE_BOOKINGS,
    });
  },
}));
