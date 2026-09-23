import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { getCart } from '@utils/cartCookie';

// Custom exact SVG icons matching the design screenshot

export const IconHome = ({ active }) => {
  return active ? (

    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.0402 6.82018L14.2802 2.79018C12.7102 1.69018 10.3002 1.75018 8.79023 2.92018L3.78023 6.83018C2.78023 7.61018 1.99023 9.21018 1.99023 10.4702V17.3702C1.99023 19.9202 4.06023 22.0002 6.61023 22.0002H17.3902C19.9402 22.0002 22.0102 19.9302 22.0102 17.3802V10.6002C22.0102 9.25018 21.1402 7.59018 20.0402 6.82018ZM12.7502 18.0002C12.7502 18.4102 12.4102 18.7502 12.0002 18.7502C11.5902 18.7502 11.2502 18.4102 11.2502 18.0002V15.0002C11.2502 14.5902 11.5902 14.2502 12.0002 14.2502C12.4102 14.2502 12.7502 14.5902 12.7502 15.0002V18.0002Z"
        fill="#F47A20"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17.9902V14.9902"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const IconOrders = ({ active }) =>
  active ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.1897 4.96C17.1897 4.97 17.1897 4.97 17.1897 4.98C16.9397 4.97 16.6897 4.96 16.4197 4.96H8.71973L9.78973 3.9C10.7697 2.91 11.8497 2 13.0997 2C14.3597 2 15.4397 2.91 16.4197 3.9L16.9797 4.46C17.1197 4.59 17.1897 4.77 17.1897 4.96Z"
        fill="#F47A20"
      />
      <path
        d="M20.8403 13.1702C21.2303 13.1702 21.5404 12.8502 21.5404 12.4502V11.5702C21.5404 7.6402 20.3403 6.4502 16.4202 6.4502H10.1201H7.58007C3.65999 6.4502 2.45996 7.6502 2.45996 11.5702V12.0002C2.45996 12.4002 2.76997 12.7102 3.15998 12.7102C3.99999 12.7102 4.67001 13.3902 4.67001 14.2202C4.67001 15.0502 3.99999 15.7402 3.15998 15.7402C2.76997 15.7402 2.45996 16.0502 2.45996 16.4502V16.8802C2.45996 20.8102 3.65999 22.0002 7.58007 22.0002H10.1101H16.4102C20.3303 22.0002 21.5303 20.8002 21.5303 16.8802C21.5303 16.4902 21.2203 16.1702 20.8303 16.1702C19.9903 16.1702 19.3203 15.5002 19.3203 14.6702C19.3303 13.8402 20.0003 13.1702 20.8403 13.1702ZM10.8201 18.8602C10.8201 19.2502 10.5001 19.5702 10.1101 19.5702C9.72011 19.5702 9.4001 19.2502 9.4001 18.8602V16.1802C9.4001 15.7902 9.72011 15.4702 10.1101 15.4702C10.5001 15.4702 10.8201 15.7902 10.8201 16.1802V18.8602ZM10.8201 12.2702C10.8201 12.6602 10.5001 12.9802 10.1101 12.9802C9.72011 12.9802 9.4001 12.6602 9.4001 12.2702V9.5902C9.4001 9.2002 9.72011 8.8802 10.1101 8.8802C10.5001 8.8802 10.8201 9.2002 10.8201 9.5902V12.2702Z"
        fill="#F47A20"
      />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.9103 14.6927C18.9103 15.9827 19.9704 17.0327 21.2604 17.0327C21.2604 20.7827 20.3204 21.7227 16.5703 21.7227H7.1901C3.44002 21.7227 2.5 20.7827 2.5 17.0327V16.5727C3.79003 16.5727 4.85005 15.5127 4.85005 14.2227C4.85005 12.9327 3.79003 11.8727 2.5 11.8727V11.4127C2.51 7.66266 3.44002 6.72266 7.1901 6.72266H16.5603C20.3104 6.72266 21.2504 7.66266 21.2504 11.4127V12.3527C19.9604 12.3527 18.9103 13.3927 18.9103 14.6927Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2111 6.7225H7.12109L10.0511 3.7925C12.4411 1.4025 13.6411 1.4025 16.0311 3.7925L16.6311 4.3925C16.0011 5.0225 15.8511 5.9525 16.2111 6.7225Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.87891 6.72266L9.87891 21.7227"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 5"
      />
    </svg>

  );

const IconProfile = ({ active }) =>

  active ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
        fill="#F47A20"
      />
      <path
        d="M17.08 14.1499C14.29 12.2899 9.73996 12.2899 6.92996 14.1499C5.65996 14.9999 4.95996 16.1499 4.95996 17.3799C4.95996 18.6099 5.65996 19.7499 6.91996 20.5899C8.31996 21.5299 10.16 21.9999 12 21.9999C13.84 21.9999 15.68 21.5299 17.08 20.5899C18.34 19.7399 19.04 18.5999 19.04 17.3599C19.03 16.1299 18.34 14.9899 17.08 14.1499Z"
        fill="#F47A20"
      />
    </svg>

  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1596 10.87C12.0596 10.86 11.9396 10.86 11.8296 10.87C9.44957 10.79 7.55957 8.84 7.55957 6.44C7.55957 3.99 9.53957 2 11.9996 2C14.4496 2 16.4396 3.99 16.4396 6.44C16.4296 8.84 14.5396 10.79 12.1596 10.87Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15973 14.56C4.73973 16.18 4.73973 18.82 7.15973 20.43C9.90973 22.27 14.4197 22.27 17.1697 20.43C19.5897 18.81 19.5897 16.17 17.1697 14.56C14.4297 12.73 9.91973 12.73 7.15973 14.56Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  );

const IconCart = ({ active }) =>
  active ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.9597 8.9599C19.2897 8.2199 18.2797 7.7899 16.8797 7.6399V6.8799C16.8797 5.5099 16.2997 4.1899 15.2797 3.2699C14.2497 2.3299 12.9097 1.8899 11.5197 2.0199C9.12975 2.2499 7.11975 4.5599 7.11975 7.0599V7.6399C5.71975 7.7899 4.70975 8.2199 4.03975 8.9599C3.06975 10.0399 3.09975 11.4799 3.20975 12.4799L3.90975 18.0499C4.11975 19.9999 4.90975 21.9999 9.20975 21.9999H14.7897C19.0897 21.9999 19.8797 19.9999 20.0897 18.0599L20.7897 12.4699C20.8997 11.4799 20.9197 10.0399 19.9597 8.9599ZM11.6597 3.4099C12.6597 3.3199 13.6097 3.6299 14.3497 4.2999C15.0797 4.9599 15.4897 5.8999 15.4897 6.8799V7.5799H8.50975V7.0599C8.50975 5.2799 9.97975 3.5699 11.6597 3.4099ZM6.5 14L8.40975 13.1499C7.85975 13.1499 7.40975 12.6999 7.40975 12.1499C6.85975 12.1499 7.40975 11.5999 7.40975 12.1499C7.96975 12.1499 6.5 11.5999 6.5 12.1499C6.5 12.6999 7.05 14 6.5 14ZM15 12L15.4097 13.1499C14.8597 13.1499 17.5 12.05 17.5 11.5C17.5 10.95 14.8597 11.1499 15.4097 11.1499C15.9697 11.1499 16.4197 11.5999 16.4197 12.1499C16.4197 12.6999 15.55 12 15 12Z"
        fill="#F47A20"
      />
    </svg>

  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 7.67001V6.70001C7.5 4.45001 9.31 2.24001 11.56 2.03001C14.24 1.77001 16.5 3.88001 16.5 6.51001V7.89001"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99983 22H14.9998C19.0198 22 19.7398 20.39 19.9498 18.43L20.6998 12.43C20.9698 9.99 20.2698 8 15.9998 8H7.99983C3.72983 8 3.02983 9.99 3.29983 12.43L4.04983 18.43C4.25983 20.39 4.97983 22 8.99983 22Z"
        stroke="#F47A20"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  );


const NAV_ITEMS = [
  {
    id: 'home',
    label: 'خانه',
    path: '/',
    icon: IconHome,
  },
  {
    id: 'cart',
    label: 'خرید',
    path: '/cart',
    icon: IconCart,
  },
  {
    id: 'orders',
    label: 'سفارشات',
    path: '/orders',
    icon: IconOrders,
  },
  {
    id: 'profile',
    label: 'پروفایل',
    path: '/profile',
    icon: IconProfile,
  },
];

export default function BottomNavigation() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
    const raw = getCart();
    return Array.isArray(raw) ? raw : [];
  });

  useEffect(() => {
    const updateCartState = (e) => {
      const updated = e?.detail || getCart();
      setCartItems(Array.isArray(updated) ? updated : []);
    };

    window.addEventListener('cartChange', updateCartState);
    window.addEventListener('storage', updateCartState);

    // Initial check
    const current = getCart();
    setCartItems(Array.isArray(current) ? current : []);

    return () => {
      window.removeEventListener('cartChange', updateCartState);
      window.removeEventListener('storage', updateCartState);
    };
  }, [location.pathname]);

  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);

  return (
    <nav
      aria-label="منوی اصلی"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] bg-white rounded-none shadow-[0_-6px_25px_rgba(0,0,0,0.06)] border-t border-slate-100 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] transition-all duration-300 select-none border-x border-slate-200"
    >
      <div className="grid grid-cols-4 items-center justify-items-center">
        {NAV_ITEMS.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center w-full group"
            >
              {/* Top orange pill indicator */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-top-pill"
                  className="absolute -top-2 w-6 h-[3.5px] bg-[#F47A20] rounded-full shadow-[0_1px_4px_rgba(244,122,32,0.4)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Active capsule / item styling */}
              <motion.div
                whileTap={{ scale: 0.94 }}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-[18px] transition-colors duration-200 ${active
                    ? 'bg-[#fde8d8] text-[#F47A20]'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <div
                  className={`relative transition-transform duration-200 ${active ? 'scale-105' : ''
                    }`}
                >
                  <Icon active={active} />
                  {item.id === 'cart' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#F47A20] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11.5px] leading-tight mt-0.5 font-kal-3 transition-colors duration-200 ${active ? 'font-bold text-[#F47A20]' : 'font-medium text-slate-500'
                    }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


