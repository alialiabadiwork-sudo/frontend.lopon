import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { TopAlertContext } from '../hooks/useTopAlert';

export const TopAlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const showAlert = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const alertId = Date.now();
    setAlert({ message, type, id: alertId });

    if (duration > 0) {
      setTimeout(() => {
        setAlert((current) => (current && current.id === alertId ? null : current));
      }, duration);
    }
  }, []);

  return (
    <TopAlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      <AnimatePresence>
        {alert && (
          <div className="fixed top-4 inset-x-0 z-[99999] flex justify-center px-4 pointer-events-none">
            <motion.div
              key={alert.id}
              initial={{ y: -80, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -80, opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`pointer-events-auto w-full max-w-sm rounded-2xl p-3.5 shadow-lg backdrop-blur-md border flex items-center justify-between gap-3 text-right dir-rtl transition-all ${
                alert.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-200/90 text-emerald-900 shadow-emerald-900/5'
                  : alert.type === 'error'
                  ? 'bg-rose-50/95 border-rose-200/90 text-rose-900 shadow-rose-900/5'
                  : 'bg-slate-900/95 border-slate-700/90 text-white shadow-slate-900/20'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-xl shrink-0 ${
                    alert.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600'
                      : alert.type === 'error'
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {alert.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {alert.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {alert.type === 'info' && <Info className="w-5 h-5" />}
                </div>

                <p className="font-kal-3 text-xs sm:text-sm font-medium leading-snug break-words">
                  {alert.message}
                </p>
              </div>

              <button
                onClick={hideAlert}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </TopAlertContext.Provider>
  );
};
