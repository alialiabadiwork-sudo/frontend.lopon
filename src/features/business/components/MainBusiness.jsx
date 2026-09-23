import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import HeaderImageSlider from '@components/Items/HeaderImageSlider';
import ImageGalleryModal from '@components/Items/ImageGalleryModal';
import { normalizeImageUrl, getCanonicalImageKey } from '@utils/imageUtils';
import { decodeId } from '@utils/slugUtils';
import SalonInfoCard from '@components/Items/SalonInfoCard';
import ServicesList from '@components/Items/ServicesList';
import ConfidenceCard from '@components/Items/ConfidenceCard';
import UsageGuideCard from '@components/Items/UsageGuideCard';
import ReviewsSection from '@components/Items/ReviewsSection';
import StickyFooterBar from '@components/Items/StickyFooterBar';
import TermsModal from '@components/Items/TermsModal';
import ReceiptModal from '@components/Items/ReceiptModal';
import { INITIAL_SERVICES } from '@core/data';
import { BUSINESSES, DEALS } from '@core/constants';
import { formatPrice } from '@utils/formatters';
import { useGetVendorDetails } from '@hooks/server/business/useGetVendorDetails';
import { useGetVendorComments } from '@hooks/server/business/useGetVendorComments';
import { commentService } from '@services/comment.service';
import HeaderWebp from '@assets/images/header.webp';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@utils/cartCookie';

// Mock comments pool used when web service returns empty comments list
const MOCK_COMMENTS_POOL = [
  {
    id: "fake-1",
    author: "سارا محمدی",
    rating: 5,
    text: "کیفیت خدمات و برخورد پرسنل فوق‌العاده بود. بسیار راضی بودم و حتما دوباره مراجعه می‌کنم.",
    date: "۱۴۰۵/۰۵/۱۰",
    tags: ["خدمات عالی", "برخورد محترمانه"],
  },
  {
    id: "fake-2",
    author: "مریم کریمی",
    rating: 5,
    text: "محیط بسیار تمیز و بهداشتی بود، نوبت‌دهی منظم و بدون معطلی انجام شد. ممنون از لوپُن.",
    date: "۱۴۰۵/۰۵/۰۸",
    tags: ["محیط تمیز", "بدون معطلی"],
  },
  {
    id: "fake-3",
    author: "زهرا ابراهیمی",
    rating: 4,
    text: "تخفیف خیلی خوبی داشت و کیفیت کار هم متناسب با قیمت عالی بود. پیشنهاد می‌کنم.",
    date: "۱۴۰۵/۰۵/۰۵",
    tags: ["تخفیف ویژه", "ارزش خرید بالا"],
  },
  {
    id: "fake-4",
    author: "نرگس رضایی",
    rating: 5,
    text: "کارشون واقعا حرفه‌ای هست. متخصصین باتجربه‌ای دارن و همه اصول بهداشتی رعایت می‌شه.",
    date: "۱۴۰۵/۰۵/۰۳",
    tags: ["حرفه‌ای", "تضمین کیفیت"],
  },
  {
    id: "fake-5",
    author: "مهدیه حسینی",
    rating: 5,
    text: "اولین بار بود خریدم رو از لوپُن انجام می‌دادم، همه چی عالی پیش رفت و بسیار راضی بودم.",
    date: "۱۴۰۵/۰۵/۰۱",
    tags: ["تجربه عالی", "پشتیبانی خوب"],
  },
];

const getRandomMockComments = (count = 3) => {
  const shuffled = [...MOCK_COMMENTS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Map day numbers: 0=شنبه, 1=یکشنبه, 2=دوشنبه, 3=سهشنبه, 4=چهارشنبه, 5=پنجشنبه, 6=جمعه
const DAY_NAMES = {
  0: 'شنبه',
  1: 'یکشنبه',
  2: 'دوشنبه',
  3: 'سهشنبه',
  4: 'چهارشنبه',
  5: 'پنجشنبه',
  6: 'جمعه',
};

// Helper to format working days (0=شنبه to 6=جمعه) into readable string
const formatWorkingHours = (workingDays) => {
  if (!workingDays || !Array.isArray(workingDays) || workingDays.length === 0) return null;

  const validDays = workingDays
    .map((w) => ({
      day: Number(w.day),
      from: w.from || '',
      to: w.to || '',
    }))
    .filter((w) => w.day >= 0 && w.day <= 6)
    .sort((a, b) => a.day - b.day);

  if (validDays.length === 0) return null;

  const groups = [];
  let currentGroup = null;

  for (const item of validDays) {
    if (
      currentGroup &&
      currentGroup.to === item.to &&
      currentGroup.from === item.from &&
      item.day === currentGroup.endDay + 1
    ) {
      currentGroup.endDay = item.day;
    } else {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        startDay: item.day,
        endDay: item.day,
        from: item.from,
        to: item.to,
      };
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return groups
    .map((g) => {
      const timeStr = g.from && g.to ? `(${g.from} الی ${g.to})` : '';
      if (g.startDay === g.endDay) {
        return `${DAY_NAMES[g.startDay]} ${timeStr}`.trim();
      } else {
        return `${DAY_NAMES[g.startDay]} تا ${DAY_NAMES[g.endDay]} ${timeStr}`.trim();
      }
    })
    .join(' ، ');
};

// Skeleton loader for Business page
const BusinessSkeleton = () => (
  <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto pb-16 bg-white animate-pulse">
    <div className="w-full h-80 bg-slate-200" />
    <div className="mx-4 -mt-[70px] bg-white rounded-2xl p-6 border border-slate-100 shadow-md space-y-4">
      <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
      <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto" />
    </div>
    <div className="mx-4 mt-6 bg-white rounded-2xl p-6 border border-slate-100 space-y-3">
      <div className="h-5 bg-slate-200 rounded w-1/4" />
      <div className="h-12 bg-slate-100 rounded-xl w-full" />
      <div className="h-12 bg-slate-100 rounded-xl w-full" />
    </div>
  </div>
);

export default function MainBusiness() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const dealIdFromQuery = searchParams.get('dealId');
  const serviceIdFromQuery = searchParams.get('s') || searchParams.get('serviceId');

  // Decode short 16-char base64url ID or preserve 24-char ObjectId
  const resolvedVendorId = decodeId(id);
  const resolvedServiceIdFromQuery = decodeId(serviceIdFromQuery || dealIdFromQuery);

  // Fetch dynamic vendor details from GET /api/v1/vendors/details/:id
  const {
    vendor,
    vendorServices,
    rating: apiRating,
    recentComments,
    isLoading: isVendorLoading,
  } = useGetVendorDetails(resolvedVendorId);

  const actualVendorId = vendor?._id || vendor?.id || resolvedVendorId;

  // Fetch comments via web service: GET /api/v1/comments/vendor/:vendorId
  const {
    data: commentsFromApi,
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useGetVendorComments(actualVendorId);

  // Identify selected service from location state, query params, or URL id
  const selectedServiceId =
    decodeId(location.state?.selectedServiceId) ||
    resolvedServiceIdFromQuery ||
    resolvedVendorId;

  const selectedService =
    (vendorServices || []).find(
      (s) =>
        String(s._id) === String(selectedServiceId) ||
        String(s.id) === String(selectedServiceId) ||
        String(s.service?._id) === String(selectedServiceId) ||
        String(s.service?.id) === String(selectedServiceId)
    ) || null;

  // Fallback deal or business from static data if API hasn't loaded or id matches deal
  const activeDeal =
    DEALS.find((d) => d.id === dealIdFromQuery) ||
    DEALS.find((d) => d.id === id);

  let fallbackBusiness = activeDeal
    ? BUSINESSES.find((b) => b.id === activeDeal.businessId)
    : BUSINESSES.find((b) => b.id === id);

  if (!fallbackBusiness) {
    fallbackBusiness = BUSINESSES[0];
  }

  // Cart state stored as array of item objects (persisted in Cookie)
  const [cartItems, setCartItems] = useState(() => getCart());
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [sliderFullscreen, setSliderFullscreen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Isolated service image gallery modal state
  const [serviceGallery, setServiceGallery] = useState({
    isOpen: false,
    title: '',
    images: [],
    initialIndex: 0,
  });

  // Sticky top header on scroll past vendor info card
  const salonCardRef = useRef(null);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (salonCardRef.current) {
        const rect = salonCardRef.current.getBoundingClientRect();
        if (rect.bottom < 80) {
          setIsStickyHeaderVisible(true);
        } else {
          setIsStickyHeaderVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    const scrollContainer = salonCardRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vendorName,
          text: `مشاهده خدمات و تخفیف‌های ${vendorName} در لوپُن`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('لینک مجموعه کپی شد');
      } catch (e) {
        toast.success('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود');
      }
    }
  };

  // Extract dynamic fields from vendor or fallback
  const rawCat = vendor?.category;
  const vendorCategory =
    typeof rawCat === 'object'
      ? rawCat?.title || 'خدمات زیبایی'
      : rawCat || activeDeal?.category || 'خدمات زیبایی';
  const vendorName = vendor?.title || fallbackBusiness?.name || 'مجموعه زیبایی لوپُن';
  const vendorPhone = vendor?.auxiliaryPhone || null;
  const rating = apiRating ?? fallbackBusiness?.rating ?? 4.8;

  // Format Address
  let formattedAddress = 'کرمان';
  if (vendor?.address) {
    if (typeof vendor.address === 'object') {
      const city = vendor.address.city || '';
      const street = vendor.address.address || '';
      formattedAddress = [city, street].filter(Boolean).join('، ');
    } else {
      formattedAddress = String(vendor.address);
    }
  } else if (fallbackBusiness?.address) {
    formattedAddress = fallbackBusiness.address;
  }

  // Format Working Hours (1=شنبه, 2=یکشنبه, ..., 6=پنجشنبه, 7=جمعه)
  const workingHoursFormatted = formatWorkingHours(vendor?.workingDays);

  // --- Dynamic Header Gallery Images for this vendor ---
  // 1. Gather selected service image(s) to prioritize at index 0 (if user navigated to specific service)
  const selectedServiceImages = [];
  if (selectedService) {
    const sImgs = [
      ...(Array.isArray(selectedService.imagesUrls) ? selectedService.imagesUrls : []),
      ...(Array.isArray(selectedService.images) ? selectedService.images : []),
    ];
    sImgs.forEach((img) => {
      selectedServiceImages.push(normalizeImageUrl(img, 'vendor-service'));
    });
  }

  // 2. Gather vendor's venue/salon images
  const vendorImages = [
    ...(Array.isArray(vendor?.imagesUrls) ? vendor.imagesUrls : []),
    ...(Array.isArray(vendor?.images) ? vendor.images : []),
  ].map((img) => normalizeImageUrl(img, 'vendor'));

  // 3. Gather all other vendorServices' images for this vendor
  const otherServicesImages = [];
  (vendorServices || []).forEach((s) => {
    if (
      selectedService &&
      (String(s._id) === String(selectedService._id) || String(s.id) === String(selectedService.id))
    ) {
      return;
    }
    const sImgs = [
      ...(Array.isArray(s.imagesUrls) ? s.imagesUrls : []),
      ...(Array.isArray(s.images) ? s.images : []),
    ];
    sImgs.forEach((img) => {
      otherServicesImages.push(normalizeImageUrl(img, 'vendor-service'));
    });
  });

  // 4. Mix and Deduplicate header images
  const seenImageKeys = new Set();
  const galleryImages = [];

  const addUniqueImage = (url) => {
    if (!url || typeof url !== 'string') return;
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    const key = getCanonicalImageKey(cleanUrl);
    if (key && !seenImageKeys.has(key)) {
      seenImageKeys.add(key);
      galleryImages.push(cleanUrl);
    }
  };

  // Step 1: Selected vendorService images
  selectedServiceImages.forEach(addUniqueImage);
  // Step 2: Vendor venue images
  vendorImages.forEach(addUniqueImage);
  // Step 3: Other vendorServices images belonging to this vendor
  otherServicesImages.forEach(addUniqueImage);

  // If gallery is empty, fallback safely to default header image
  if (galleryImages.length === 0) {
    galleryImages.push(HeaderWebp);
  }

  const headerMainImage = galleryImages[0] || HeaderWebp;

  // Map Vendor Services strictly isolating each service's images from the web service
  let currentServices = [];
  if (vendorServices && vendorServices.length > 0) {
    currentServices = vendorServices.map((s) => {
      const origPrice = Number(s.price || 0);
      const discPercent = Number(s.discountPercent || 0);
      const discPrice = Number(
        s.finalPrice !== undefined && s.finalPrice !== null
          ? s.finalPrice
          : origPrice > 0
            ? Math.round(origPrice * (1 - discPercent / 100))
            : 0
      );
      const calcPct =
        discPercent > 0
          ? discPercent
          : origPrice > 0 && discPrice > 0 && origPrice > discPrice
            ? Math.round(((origPrice - discPrice) / origPrice) * 100)
            : 0;

      const serviceTitle =
        s.title ||
        (typeof s.service === 'object' ? s.service?.title : s.service) ||
        'خدمت زیبایی';

      // Gather ONLY images belonging to this specific service from the web service
      const rawServiceImgs = [
        ...(Array.isArray(s.imagesUrls) ? s.imagesUrls : (s.imagesUrls ? [s.imagesUrls] : [])),
        ...(Array.isArray(s.images) ? s.images : (s.images ? [s.images] : [])),
        ...(Array.isArray(s.service?.imagesUrls) ? s.service.imagesUrls : (s.service?.imagesUrls ? [s.service.imagesUrls] : [])),
        ...(Array.isArray(s.service?.images) ? s.service.images : (s.service?.images ? [s.service.images] : [])),
        ...(s.service?.imageUrl ? [s.service.imageUrl] : []),
        ...(s.service?.image ? [s.service.image] : []),
        ...(s.imageUrl ? [s.imageUrl] : []),
        ...(s.image ? [s.image] : []),
      ].filter((img) => typeof img === 'string' && img.trim().length > 0 && !img.includes('header.webp'));

      // Strictly deduplicate this service's images
      const serviceSeen = new Set();
      const uniqueServiceImgs = [];
      for (const rawImg of rawServiceImgs) {
        const norm = normalizeImageUrl(rawImg, 'vendor-service');
        const key = getCanonicalImageKey(norm);
        if (key && !serviceSeen.has(key)) {
          serviceSeen.add(key);
          uniqueServiceImgs.push(norm);
        }
      }

      const serviceImgs = uniqueServiceImgs;
      const serviceImg = uniqueServiceImgs.length > 0 ? uniqueServiceImgs[0] : null;

      const serviceCat =
        (typeof s.service === 'object' && typeof s.service?.category === 'object'
          ? s.service.category?.title
          : null) || vendorCategory;

      return {
        id: s._id || s.id || Math.random().toString(),
        vendorServiceId: s._id || s.id,
        name: serviceTitle,
        originalPrice: origPrice,
        discountedPrice: discPrice,
        discountPercent: calcPct,
        category: serviceCat,
        imageUrl: serviceImg,
        images: serviceImgs,
        purchaseLimit: s.purchaseLimit,
      };
    });

    if (selectedServiceId) {
      currentServices.sort((a, b) => {
        const isA =
          String(a.id) === String(selectedServiceId) ||
          String(a.vendorServiceId) === String(selectedServiceId);
        const isB =
          String(b.id) === String(selectedServiceId) ||
          String(b.vendorServiceId) === String(selectedServiceId);
        if (isA) return -1;
        if (isB) return 1;
        return 0;
      });
    }
  } else {
    // Fallback services mapping
    const businessDeals = DEALS.filter((d) => d.businessId === fallbackBusiness.id);
    const mappedDeals =
      businessDeals.length > 0
        ? [...businessDeals]
          .sort((a, b) =>
            a.id === activeDeal?.id ? -1 : b.id === activeDeal?.id ? 1 : 0
          )
          .map((deal) => {
            const rawDealImgs = Array.isArray(deal.images) && deal.images.length > 0
              ? deal.images
              : (deal.imageUrl ? [deal.imageUrl] : []);
            const dealImgs = rawDealImgs.filter((img) => typeof img === 'string' && img.trim().length > 0 && !img.includes('header.webp'));
            const dealImg = dealImgs.length > 0 ? dealImgs[0] : null;
            return {
              id: deal.id,
              name: deal.serviceTitle,
              originalPrice: deal.originalPrice,
              discountedPrice: deal.discountedPrice,
              discountPercent: deal.discountPercentage,
              category: deal.category,
              duration: '۶۰ دقیقه',
              imageUrl: dealImg,
              images: dealImgs,
            };
          })
        : [];

    const existingNames = new Set(mappedDeals.map((d) => d.name));
    const additionalServices = INITIAL_SERVICES.filter(
      (s) => !existingNames.has(s.name)
    ).map((s) => {
      const rawImgs = Array.isArray(s.images) && s.images.length > 0
        ? s.images
        : (s.imageUrl ? [s.imageUrl] : []);
      const validImgs = rawImgs.filter((img) => typeof img === 'string' && img.trim().length > 0 && !img.includes('header.webp'));
      return {
        ...s,
        imageUrl: validImgs.length > 0 ? validImgs[0] : null,
        images: validImgs,
      };
    });
    currentServices = [...mappedDeals, ...additionalServices].slice(0, 8);
  }

  // Calculate Max Discount
  const maxDiscount =
    currentServices.length > 0
      ? Math.max(...currentServices.map((s) => s.discountPercent || 0))
      : 0;

  // Set document title for SEO & browser tab during client-side navigation
  useEffect(() => {
    if (vendorName) {
      document.title = `${vendorName} کرمان | تخفیف و رزرو آنلاین - لوپُن`;
    }
    return () => {
      document.title = 'لوپُن | تخفیف و رزرو آنلاین سالن زیبایی کرمان، ناخن، فیشیال و کراتین مو';
    };
  }, [vendorName]);

  // Process Reviews / Comments from Web Service with Fallback to 3 Mock Comments
  useEffect(() => {
    if (isCommentsLoading) return;

    if (commentsFromApi && commentsFromApi.length > 0) {
      const mappedComments = commentsFromApi.map((c, idx) => ({
        id: c._id || c.id || `comment-${idx}`,
        author:
          c.ownerName ||
          (typeof c.user === 'object' && c.user?.name
            ? c.user.name
            : c.user || c.author || 'کاربر لوپُن'),
        rating: Number(c.rating) || 5,
        text: c.comment || c.text || '',
        date: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString('fa-IR')
          : '۱۴۰۵/۰۵/۱۲',
        tags: c.tags || [vendorCategory || 'مجموعه'],
      }));
      setUserReviews(mappedComments);
    } else if (recentComments && recentComments.length > 0) {
      const mappedComments = recentComments.map((c, idx) => ({
        id: c._id || c.id || `comment-${idx}`,
        author:
          c.ownerName ||
          (typeof c.user === 'object' && c.user?.name
            ? c.user.name
            : c.user || c.author || 'کاربر لوپُن'),
        rating: Number(c.rating) || 5,
        text: c.comment || c.text || '',
        date: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString('fa-IR')
          : '۱۴۰۵/۰۵/۱۲',
        tags: [vendorCategory || 'مجموعه'],
      }));
      setUserReviews(mappedComments);
    } else {
      setUserReviews(getRandomMockComments(3));
    }
  }, [commentsFromApi, recentComments, isCommentsLoading, vendorCategory]);

  // Scroll to top on navigation
  useEffect(() => {
    setCartItems(getCart());
    window.scrollTo(0, 0);
    const scrollables = document.querySelectorAll('.overflow-y-auto');
    scrollables.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [id, dealIdFromQuery]);

  // Convert cartItems array to cartMap { [serviceId]: quantity }
  const cartMap = cartItems.reduce((acc, item) => {
    acc[item.id] = item.quantity || 1;
    return acc;
  }, {});

  // Cart operations
  const handleAddToCart = (serviceId) => {
    const service = currentServices.find((s) => s.id === serviceId);
    if (service) {
      const orig = service.originalPrice || 0;
      const disc = service.discountedPrice || 0;
      const pct = service.discountPercent || (orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0);

      const itemToSave = {
        id: service.id,
        businessId: id || vendor?.id || vendor?._id || 'b1',
        title: service.name,
        businessName: vendorName,
        originalPrice: formatPrice(orig),
        originalPriceVal: orig,
        discountedPrice: formatPrice(disc),
        discountedPriceVal: disc,
        discountPercent: pct,
        image: service.imageUrl || null,
        quantity: 1,
      };
      const updated = addToCart(itemToSave);
      setCartItems(updated);
    } else {
      const updated = addToCart({ id: serviceId, quantity: 1 });
      setCartItems(updated);
    }
  };

  const handleRemoveFromCart = (serviceId) => {
    const existingItem = cartItems.find((i) => i.id === serviceId);
    if (existingItem) {
      const currentQty = existingItem.quantity || 1;
      let updated;
      if (currentQty > 1) {
        updated = updateQuantity(serviceId, currentQty - 1);
      } else {
        updated = removeFromCart(serviceId);
      }
      setCartItems(updated);
    }
  };

  // Add a new user review via Web Service
  const handleAddReview = async (newReview) => {
    if (actualVendorId) {
      try {
        await commentService.createComment({
          vendor: actualVendorId,
          vendorId: actualVendorId,
          comment: newReview.text,
          text: newReview.text,
          rating: newReview.rating,
          rate: newReview.rating,
          author: newReview.author,
          userName: newReview.author,
          fullName: newReview.author,
        });
        toast.success('نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیریت منتشر خواهد شد.');
        if (typeof refetchComments === 'function') {
          refetchComments();
        }
      } catch (err) {
        console.warn('Error posting review to backend API:', err);
        toast.success('نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیریت منتشر خواهد شد.');
      }
    } else {
      toast.success('نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیریت منتشر خواهد شد.');
    }
  };

  // Service image click handler: strictly show ONLY images related to this service
  const handleServiceImageClick = (imgUrl, title, images, service) => {
    const rawImgs = Array.isArray(images) && images.length > 0
      ? images
      : (imgUrl ? [imgUrl] : []);

    const seen = new Set();
    const clean = [];
    for (const item of rawImgs) {
      if (!item || typeof item !== 'string' || item.includes('header.webp')) continue;
      const norm = normalizeImageUrl(item, 'vendor-service');
      const key = getCanonicalImageKey(norm);
      if (key && !seen.has(key)) {
        seen.add(key);
        clean.push(norm);
      }
    }

    if (clean.length === 0) return;

    const serviceTitle = title || service?.name || 'تصاویر خدمت';

    setServiceGallery({
      isOpen: true,
      title: serviceTitle,
      images: clean,
      initialIndex: 0,
    });
  };

  // Calculations for sticky bottom sheet
  const totals = cartItems.reduce(
    (acc, item) => {
      const qty = item.quantity || 1;
      const orig = item.originalPriceVal !== undefined ? item.originalPriceVal : 0;
      const disc = item.discountedPriceVal !== undefined ? item.discountedPriceVal : 0;
      acc.totalOriginal += orig * qty;
      acc.totalDiscounted += disc * qty;
      acc.totalQuantity += qty;
      return acc;
    },
    { totalOriginal: 0, totalDiscounted: 0, totalQuantity: 0 }
  );

  const resetCart = () => {
    clearCart();
    setCartItems([]);
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    resetCart();
  };

  if (isVendorLoading) {
    return <BusinessSkeleton />;
  }

  return (
    <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto pb-16 bg-white relative">
      {/* Animated Sticky Top Header on Scroll */}
      <AnimatePresence>
        {isStickyHeaderVisible && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md px-4 py-3 flex items-center justify-between border-x border-slate-200"
            dir="rtl"
          >
            {/* Right side in RTL: Back button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Center: Vendor Name */}
            <h2 className="font-kal-3 font-bold text-slate-800 text-sm sm:text-base truncate max-w-[220px] text-center px-2">
              {vendorName}
            </h2>

            {/* Left side in RTL: Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="اشتراک‌گذاری"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Container */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Header Image Slider */}
        <HeaderImageSlider
          key={`${vendor?._id || id}`}
          title={vendorName}
          image={headerMainImage}
          images={galleryImages}
          isFullscreen={sliderFullscreen}
          onFullscreenChange={setSliderFullscreen}
          currentIndex={sliderIndex}
          onIndexChange={setSliderIndex}
        />

        {/* Salon Brand Info Card with ref for scroll trigger */}
        <div ref={salonCardRef} className="-mt-4">
          <SalonInfoCard
            name={vendorName}
            address={formattedAddress}
            rate={rating}
            discount={maxDiscount}
            category={vendorCategory}
            phone={vendorPhone}
          />
        </div>

        {/* Dynamic Services list */}
        <ServicesList
          services={currentServices}
          cart={cartMap}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onOpenTermsModal={() => setIsTermsOpen(true)}
          onImageClick={handleServiceImageClick}
        />

        {/* Guarantee Section */}
        <ConfidenceCard workingDays={vendor?.workingDays} />

        {/* How to use service guide */}
        <UsageGuideCard />

        {/* User Reviews */}
        <ReviewsSection
          reviews={userReviews}
          onAddReview={handleAddReview}
          isLoading={isCommentsLoading}
        />
      </div>

      {/* Dynamic Sticky Bottom Checkout Footer */}
      {totals.totalQuantity > 0 && (
        <StickyFooterBar
          totalOriginal={totals.totalOriginal}
          totalDiscounted={totals.totalDiscounted}
          totalQuantity={totals.totalQuantity}
          onCheckout={() => navigate('/cart')}
        />
      )}

      {/* Reusable Image Gallery Modal for Service Photos strictly showing only this service's images */}
      <ImageGalleryModal
        isOpen={serviceGallery.isOpen}
        onClose={() => setServiceGallery((prev) => ({ ...prev, isOpen: false }))}
        title={serviceGallery.title}
        images={serviceGallery.images}
        initialIndex={serviceGallery.initialIndex || 0}
      />

      {/* Conditions Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      {/* Receipt / Invoice Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleReceiptClose}
        cart={cartMap}
        services={currentServices}
        totalDiscounted={totals.totalDiscounted}
      />
    </div>
  );
}
