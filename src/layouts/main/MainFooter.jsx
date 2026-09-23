
import { Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import RubikaImg from "@assets/images/rubika.png";
import ZarinPalImg from "@assets/images/zarin-palpng.png";

function MainFooter() {
  const location = useLocation().pathname
  return (
    <div
      className="
        w-full
        max-w-md
        md:max-w-xl
        mx-auto
        relative
        bg-slate-50
        pb-[84px]
      "
    >
      <div className="absolute  top-0 left-0 right-0 w-full h-24 bg-gradient-to-b from-gray-400/30 via-gray-200/5 to-transparent blur-sm" />
      <footer className="bg-slate-50 pt-10 pb-6 border-t border-slate-100 text-center">
        <div className="px-6 flex flex-col gap-10">
          <div id="footer-about">
            <h3 className="text-base font-bold mb-3 font-kal-3">درباره لوپُن</h3>
            <p className="text-slate-500 leading-relaxed text-[12px] font-kal-2">
              لوپُن پلتفرمی برای معرفی تخفیف خدمات محلی در شهر کرمان است. ما تلاش میکنیم بهترین مجموعههای شهر را با پیشنهادهای ویژه به شما معرفی کنیم.
            </p>
          </div>

          <div id="footer-social" className="flex flex-col items-center">
            <h3 className="text-base font-bold mb-4 font-kal-3">با ما در ارتباط باشید</h3>
            <div className="flex gap-4">
              <a href="https://rubika.ir/lopon11" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white rounded-xl shadow-sm hover:opacity-80 transition-all border border-slate-100 flex items-center justify-center" aria-label="روبیکا لوپُن">
                <img src={RubikaImg} alt="روبیکا لوپُن" className="w-[18px] h-[18px] object-contain" />
              </a>
              <a href="tel:09967911083" className="p-2.5 bg-white rounded-xl shadow-sm hover:text-primary-s transition-all border border-slate-100" aria-label="تماس با پشتیبانی"><Phone size={18} /></a>
            </div>
          </div>
          <div id="footer-contact">
            <h3 className="text-base font-bold mb-3 font-kal-3">تماس با ما</h3>
            <p className="text-slate-500 text-[12px] mb-1 font-kal-2">کرمان , فرهنگسرای کوثر</p>
            <p className="text-slate-500 text-[12px] font-kal-2">Email: info@lopon.ir</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 my-3">
          <div className=" border border-gray-800 rounded-lg flex justify-center items-center w-[80px] ">
            <a
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://trustseal.enamad.ir/?id=763513&Code=UIQeXlSRZ57jd1bdFV18lN63ANr5ld7B"
            >
              <img

                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=763513&Code=UIQeXlSRZ57jd1bdFV18lN63ANr5ld7B"
                alt="نماد اعتماد الکترونیکی"
                style={{ cursor: "pointer" }}
                code="UIQeXlSRZ57jd1bdFV18lN63ANr5ld7B"
              />
            </a>

          </div>

          <div className=" border border-gray-800 rounded-lg ">
            <img src={ZarinPalImg} alt="" className="w-[80px]" />

          </div>

        </div>
        <div className="px-4 text-center border-t border-slate-200 pt-6 mt-10">
          <p className="text-slate-400 text-[10px] font-kal-2">© ۱۴۰۵ لوپُن. تمامی حقوق محفوظ است.</p>
        </div>
      </footer>
      <div className="absolute bottom-0 left-0 right-0 w-full h-6 bg-gradient-to-t from-gray-400/15 to-transparent pointer-events-none blur-xs" />

    </div>
  );
}

export default MainFooter;
