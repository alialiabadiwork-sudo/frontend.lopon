import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from 'vaul';
import { Phone, Headset, HelpCircle } from 'lucide-react';
import { useRegisterModal } from '@core/backButtonManager';

function SupportDrawer({ isOpen, setIsOpen }) {
  useRegisterModal(isOpen, () => setIsOpen(false));

  return (
    <Drawer.Root dismissible={true} open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>

        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs transition-opacity" />
        <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[28px] z-50 p-5 shadow-2xl border-t border-slate-100 outline-none max-w-md md:max-w-lg mx-auto">
          {/* Grab handle */}
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />
          
          {/* Drawer Title */}
          <Drawer.Title className="text-center font-kal-3 font-bold text-slate-800 text-base mb-5">
            پشتیبانی
          </Drawer.Title>

          {/* Options List Box with dashed separators */}
          <div className="bg-white rounded-2xl mb-5">
            {/* Option 1: تماس تلفنی */}
            <a
              href="tel:09967911083"
              className="flex items-center justify-between py-5 px-3 hover:bg-slate-50 transition-colors rounded-xl text-slate-700"
            >
              <span className="font-kal-2 text-sm font-bold text-slate-600">تماس تلفنی</span>
              <Phone className="w-5 h-5 text-slate-600 shrink-0" />
            </a>

            <div className="border-b border-dashed border-slate-200 my-2 mx-1" />

            {/* Option 2: سوالات متداول */}
            <Link
              to="/faq"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between py-5 px-3 hover:bg-slate-50 transition-colors rounded-xl text-slate-700 cursor-pointer"
            >
              <span className="font-kal-2 text-sm font-bold text-slate-600">سوالات متداول</span>
              <HelpCircle className="w-5 h-5 text-slate-600 shrink-0" />
            </Link>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 rounded-xl border border-slate-300 text-slate-700 font-kal-3 font-bold text-sm hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer shadow-2xs"
          >
            بستن
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default SupportDrawer;


