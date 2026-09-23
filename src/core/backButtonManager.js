import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Stack to hold registered modal close functions
const modalStack = [];

const TARGET_ROUTES = [
  '/orders',
  '/profile/orders',
  '/cart',
  '/profile/myPaymentList',
  '/profile',
];

/**
 * Register a modal's close handler.
 * Returns an unregister function to remove the handler when the modal unmounts.
 */
export function registerModal(closeFn) {
  if (typeof closeFn !== 'function') return () => {};

  const modalItem = { closeFn };
  modalStack.push(modalItem);

  // Push state to browser history so pressing Back button fires popstate event
  try {
    window.history.pushState({ modalOpen: true }, '');
  } catch (e) {
    console.warn('History push state skipped:', e);
  }

  return () => {
    const index = modalStack.indexOf(modalItem);
    if (index !== -1) {
      modalStack.splice(index, 1);
    }
  };
}

/**
 * React Hook to register a modal/drawer/dialog when it is open.
 */
export function useRegisterModal(isOpen, onClose) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const handleClose = (...args) => {
      if (typeof onCloseRef.current === 'function') {
        onCloseRef.current(...args);
      }
    };

    const unregister = registerModal(handleClose);
    return () => {
      unregister();
    };
  }, [isOpen]);
}

/**
 * Checks whether any modal/drawer/alert/dialog is open (registered or in DOM).
 */
export function hasOpenModal() {
  if (modalStack.length > 0) return true;

  // Fallback DOM detection for any modal, dialog, drawer, or backdrop
  const hasDomModal = Boolean(
    document.querySelector('dialog[open]') ||
    document.querySelector('.modal-open') ||
    document.querySelector('[data-vaul-drawer]') ||
    document.querySelector('.MuiDialog-root') ||
    document.querySelector('[role="dialog"]')
  );

  return hasDomModal;
}

/**
 * Closes the top-most modal/drawer/alert/popup.
 * Returns true if closed successfully, false otherwise.
 */
export function closeTopModal() {
  // 1. Registered modal stack (LIFO)
  if (modalStack.length > 0) {
    const topModal = modalStack.pop();
    if (topModal && typeof topModal.closeFn === 'function') {
      try {
        topModal.closeFn();
      } catch (e) {
        console.error('Error closing registered modal:', e);
      }
      return true;
    }
  }

  // 2. Fallback DOM event dispatch (Escape key)
  const escEvent = new KeyboardEvent('keydown', {
    key: 'Escape',
    code: 'Escape',
    keyCode: 27,
    which: 27,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(escEvent);
  document.dispatchEvent(escEvent);

  const openDialog = document.querySelector('dialog[open]');
  if (openDialog) {
    try {
      openDialog.close();
      return true;
    } catch (e) {
      console.warn('Could not close dialog element:', e);
    }
  }

  const activeModal = document.querySelector('[role="dialog"], [data-vaul-drawer], .modal-open, .MuiDialog-root');
  if (activeModal) {
    const closeBtn = activeModal.querySelector(
      'button[id*="close"], button[aria-label*="close"], button.btn-close, #close-receipt-btn, #close-terms-btn'
    );
    if (closeBtn) {
      closeBtn.click();
      return true;
    }

    const overlay = document.querySelector('.fixed.inset-0, [data-vaul-overlay], .MuiBackdrop-root');
    if (overlay) {
      overlay.click();
      return true;
    }
    return true;
  }

  return false;
}

/**
 * Custom hook to handle Android Back Button press logic globally.
 */
export function useBackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  // Push history state on target routes so popstate is guaranteed to fire when pressing hardware Back button
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const isTargetPage = TARGET_ROUTES.some(
      (route) => pathname === route || pathname === route + '/'
    );

    if (isTargetPage) {
      if (!window.history.state || !window.history.state.hasBackOverride) {
        window.history.pushState({ hasBackOverride: true }, '', window.location.href);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handlePopState = () => {
      // Priority 1: Close active Alert, Dialog, Modal, Drawer, or Popup without navigating
      if (hasOpenModal()) {
        const closed = closeTopModal();
        if (closed) {
          window.history.pushState(null, '', window.location.href);
          return;
        }
      }

      // Priority 2: Redirect to Home ('/') if on Orders, Purchase/Cart, or Profile pages
      const pathname = window.location.pathname.replace(/\/$/, '') || '/';
      const isTargetPage = TARGET_ROUTES.some(
        (route) => pathname === route || pathname === route + '/'
      );

      if (isTargetPage) {
        navigate('/', { replace: true });
        return;
      }

      // Priority 3: Default behavior for other pages
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);
}
