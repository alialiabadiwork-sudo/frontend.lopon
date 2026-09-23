import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, PhoneCall } from 'lucide-react';
import QuestionIcon from '@components/svg/QuestionIcon';

const FAQ_DATA = [
  {
    id: 1,
    category: 'نحوه استفاده',
    question: 'چطور از کوپن های سایت لوپن استفاده کنیم؟',
    answer: 'بعد از خرید، کد و جزئیات سفارش بلافاصله از طریق پیامک برای شما ارسال میشود و در بخش «سفارشهای من» نیز قابل مشاهده است. هنگام مراجعه به مجموعه کافی است پیامک یا صفحه سفارش خود را به پذیرش مجموعه نشان دهید تا از خدمت خریداری شده استفاده کنید.',
  },
  {
    id: 2,
    category: 'نحوه استفاده',
    question: 'اطلاعات تماس مجموعه هارا چطور مشاهده کنم؟',
    answer: 'در صفحه هر مجموعه میتوانید آدرس، روزها و ساعتهای کاری آن را مشاهده کنید. شماره تماس مجموعه نیز بعد از خرید، داخل جزئیات سفارش شما نمایش داده میشود تا در صورت نیاز بتوانید با مجموعه هماهنگ کنید.',
  },
  {
    id: 3,
    category: 'خرید و پرداخت',
    question: 'نحوه پرداخت در لوپن به چه صورت است؟',
    answer: 'پرداخت سفارشها از طریق درگاه مستقیم بانکی و با تمام کارتهای عضو شتاب انجام میشود. همچنین لوپن دارای نماد اعتماد الکترونیکی (اینماد) است، بنابراین میتوانید با خیال راحت و با امنیت کامل خرید خود را انجام دهید.',
  },
  {
    id: 4,
    category: 'خرید و پرداخت',
    question: 'اگر مبلغ از حسابم کسر شد اما سفارش ثبت نشد، چکار کنم؟',
    answer: 'ابتدا وارد بخش «سفارشهای من» شوید و مطمئن شوید سفارش شما ثبت نشده است. اگر سفارش شما ثبت نشده باشد، مبلغ پرداختی طبق فرایند بانکی حداکثر تا ۷۲ ساعت به همان حسابی که پرداخت را انجام داده‌اید بازگردانده میشود. اگر بعد از این مدت مبلغ به حسابتان برنگشت، با پشتیبانی لوپن تماس بگیرید.',
  },
  {
    id: 5,
    category: 'کنسلی و استرداد',
    question: 'امکان کنسلی کوپن خریداری شده وجود دارد؟',
    answer: 'بله، اما شرایط کنسلی و استرداد بسته به هر مجموعه متفاوت است و در بخش شرایط استفاده هر خدمت درج شده است. اگر به هر دلیلی قصد کنسل کردن سفارش خود را دارید، کافی است با پشتیبانی لوپن تماس بگیرید تا در سریعترین زمان شما را راهنمایی کنیم.',
  },
  {
    id: 6,
    category: 'نحوه استفاده',
    question: 'چه تضمینی وجود داره که مجموعه خدمات خریداری شده را ارائه بده؟',
    answer: 'کیفیت و تعهد تمام مجموعه‌های لوپن از قبل بررسی و تایید شده است؛ با این حال اگر هنگام مراجعه با مشکلی مواجه شدید یا خدمات دریافتی با توضیحات سایت مغایرت داشت، کافی است با پشتیبانی لوپن تماس بگیرید. ما تا حل کامل مشکل و رضایت شما در کنارتان هستیم.',
  },
  {
    id: 7,
    category: 'نحوه استفاده',
    question: 'تا چه زمانی می توانم از کوپن خریداری شده استفاده کنم؟',
    answer: 'هر کوپن مهلت استفاده مشخصی دارد که هنگام خرید برای شما نمایش داده میشود. پس از اتمام مهلت خرید بنا به تصمیم فروشگاه ممکن است کوپن شما تمدید شود اما چنانچه فروشگاه نپذیرد، شما میتوانید از قسمت «تماس با ما» با تیم پشتیبانی تماس حاصل فرمایید تا پس از بررسیهای انجام شده در صورت امکان کوپن شما ابطال گردد.',
  },
  {
    id: 8,
    category: 'کنسلی و استرداد',
    question: 'چگونه می توانم کسب کار خود را در لوپن ثبت کنم؟',
    answer: 'کافی است فرم همکاری با ما را در سایت پر کنید؛ کارشناسان ما اطلاعات شما را بررسی میکنند و در کوتاهترین زمان برای هماهنگی و شروع همکاری با شما تماس میگیرند.',
  },
  {
    id: 9,
    category: 'نحوه استفاده',
    question: 'چگونه می توانم از جدیدترین پیشنهاد های ویژه لوپن مطلع شوم؟',
    answer: 'کافی است کانال رسمی لوپن در پیامرسان بله یا روبیکا را دنبال کنید تا زودتر از همه از جدیدترین پیشنهادها و تخفیفهای ویژه باخبر شوید.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'همه سوالات' },
  { id: 'payment', label: 'خرید و پرداخت', match: 'خرید و پرداخت' },
  { id: 'usage', label: 'نحوه استفاده', match: 'نحوه استفاده' },
  { id: 'cancel', label: 'کنسلی و استرداد', match: 'کنسلی و استرداد' },
];

function Faq() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(1); // Default first one expanded as shown in mockup

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    if (activeTab === 'all') return true;
    const currentCategory = CATEGORIES.find(c => c.id === activeTab);
    return faq.category === currentCategory?.match;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md md:max-w-xl mx-auto px-4 pt-7 pb-24 flex flex-col gap-6 select-none relative"
      dir="rtl"
    >
      {/* Brand Orange Header Card */}
      <div className="bg-[#FFF8F3] rounded-[24px] p-6 flex items-center gap-4 text-right border border-[#FFE8D6] shadow-xs relative overflow-hidden mb-2">
        {/* Right side in RTL: Brand question mark bubble icon */}
        <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-xs border border-orange-100/60"> 
          <QuestionIcon className="w-8 h-8 object-contain" />
        </div>

        {/* Left side in RTL: Title and Subtitle */}
        <div className="flex flex-col gap-1.5 flex-1">
          <h2 className="text-[17px] sm:text-[18px] font-bold text-[#2B364B] font-kal-3 tracking-tight">
            سوالات متداول کاربران
          </h2>
          <p className="text-[11.5px] sm:text-[12px] text-[#5A6A85] font-kal-2 leading-[20px] sm:leading-[22px]">
            پاسخ به متداول ترین پرسش های شما درباره نحوه خرید، استفاده و کنسلی کوپن های لوپن
          </p>
        </div>
      </div>

      {/* Category Horizontal Filter Badges */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 direction-rtl mb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-5 py-2.5 rounded-full text-[12px] font-kal-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#F47A20] text-white font-bold font-kal-3 shadow-xs'
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Accordion Questions List */}
      <div className="flex flex-col gap-4 mt-2">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white border border-[#f1f5f9] rounded-[20px] transition-all duration-300 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
            >
              {/* Question Click Trigger */}
              <button
                type="button"
                onClick={() => toggleExpand(faq.id)}
                className="w-full text-right py-[6px] px-6 md:px-8 flex items-center gap-4 justify-between cursor-pointer select-none"
              >
                {/* Question title on the right */}
                <span className="text-[12.5px] font-bold text-slate-800 font-kal-3 leading-relaxed text-right flex-1 pr-1">
                  {faq.question}
                </span>

                {/* Chevron circle on the left */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-full bg-[#f1f5f9] text-slate-500 flex items-center justify-center shrink-0"
                >
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </motion.div>
              </button>

              {/* Collapsible Answer */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5 pt-4 bg-[#f8fafc]/50 border-t border-[#f1f5f9]">
                      <p className="text-[12px] text-slate-600 font-kal-2 leading-[22px] text-right font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Premium Support CTA Card */}
      <div className="bg-white border border-[#f1f5f9] rounded-[24px] p-6 flex flex-col sm:flex-row items-center justify-between gap-5 mt-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F47A20]/[0.015] rounded-full blur-xl"></div>
        <div className="flex items-center gap-4 text-right">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F47A20] flex items-center justify-center shrink-0 shadow-3xs">
            <PhoneCall className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-slate-800 font-kal-3">پاسخ سوال خود را پیدا نکردید؟</h4>
            <p className="text-[11px] text-slate-500 font-kal-2 mt-1 leading-relaxed">
              پشتیبانی لوپُن ۲۴ ساعته در هفت روز هفته در کنار شماست تا به سوالات شما پاسخ دهد.
            </p>
          </div>
        </div>
        <a
          href="tel:09967911083"
          className="bg-[#F47A20] hover:bg-[#d66311] active:scale-95 text-white text-[12px] font-bold font-kal-3 px-6 py-3 rounded-full transition-all shadow-sm shadow-[#F47A20]/10 whitespace-nowrap cursor-pointer text-center w-full sm:w-auto"
        >
          تماس با پشتیبانی
        </a>
      </div>
    </motion.div>
  );
}

export default Faq;
