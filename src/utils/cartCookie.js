import Cookies from 'js-cookie';

const CART_COOKIE_NAME = 'cart';
const CART_STORAGE_KEY = 'lopon_cart';
const COOKIE_EXPIRES_DAYS = 30;

// In-memory fallback
let memoryCartCache = null;

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

/**
 * Reads and returns the cart array from LocalStorage, Cookie, or Memory.
 * Safely handles parsing errors and invalid structures.
 * @returns {Array} Array of cart items
 */
export const getCart = () => {
  try {
    // 1. Try LocalStorage first for maximum reliability & capacity
    if (typeof window !== 'undefined' && window.localStorage) {
      const localData = window.localStorage.getItem(CART_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          memoryCartCache = parsed;
          return parsed;
        }
      }
    }

    // 2. Fallback to Cookie
    const cartData = Cookies.get(CART_COOKIE_NAME);
    if (cartData) {
      if (Array.isArray(cartData)) {
        memoryCartCache = cartData;
        return cartData;
      }
      if (typeof cartData === 'string') {
        try {
          const parsed = JSON.parse(cartData);
          if (Array.isArray(parsed)) {
            memoryCartCache = parsed;
            // Sync back to localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(parsed));
            }
            return parsed;
          }
        } catch (_) {
          Cookies.remove(CART_COOKIE_NAME);
        }
      }
    }

    // 3. Fallback to Memory cache
    if (Array.isArray(memoryCartCache)) {
      return memoryCartCache;
    }

    return [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return Array.isArray(memoryCartCache) ? memoryCartCache : [];
  }
};

/**
 * Saves the cart array to LocalStorage, Cookie, and memory cache,
 * and notifies all listeners across the application.
 * @param {Array} cart - The cart array to save
 * @returns {Array} Saved cart array
 */
export const saveCart = (cart) => {
  try {
    const cleanCart = Array.isArray(cart) ? cart : [];

    if (cleanCart.length === 0) {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
      try {
        Cookies.remove(CART_COOKIE_NAME, { path: '/' });
      } catch (err) {
        // Ignore cookie removal error in non-browser env
      }
      memoryCartCache = [];

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cartChange', { detail: [] }));
      }
      return [];
    }

    // Strip huge redundant fields if needed, keep necessary data intact
    const serialized = JSON.stringify(cleanCart);

    // Save to LocalStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CART_STORAGE_KEY, serialized);
    }

    // Save to Cookie (with size-safe fallback)
    try {
      if (serialized.length < 3800) {
        Cookies.set(CART_COOKIE_NAME, serialized, {
          expires: COOKIE_EXPIRES_DAYS,
          path: '/',
          sameSite: 'Lax',
        });
      } else {
        // Save compact version to cookie if too large
        const compactCart = cleanCart.map((i) => ({
          id: i.id || i.vendorServiceId || i._id,
          quantity: Number(i.quantity) || 1,
        }));
        Cookies.set(CART_COOKIE_NAME, JSON.stringify(compactCart), {
          expires: COOKIE_EXPIRES_DAYS,
          path: '/',
          sameSite: 'Lax',
        });
      }
    } catch (err) {
      // Ignore cookie set error in non-browser env
    }

    memoryCartCache = cleanCart;

    // Dispatch global event for instant reactive updates across all components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cartChange', { detail: cleanCart }));
      window.dispatchEvent(new Event('storage'));
    }

    return cleanCart;
  } catch (error) {
    console.error('Error saving cart:', error);
    return Array.isArray(cart) ? cart : [];
  }
};

/**
 * Checks if two item IDs match (handles string vs number, id vs vendorServiceId vs _id).
 */
const isSameId = (item, targetId) => {
  if (!item || targetId === undefined || targetId === null) return false;
  const tId = String(targetId);
  return (
    String(item.id) === tId ||
    String(item.vendorServiceId) === tId ||
    String(item._id) === tId ||
    String(item.serviceId) === tId
  );
};

/**
 * Adds an item to the cart.
 * If the item already exists (by id), increases its quantity.
 * Otherwise, adds full item details to the cart.
 * @param {Object} item - Item object containing at least an `id`
 * @returns {Array} Updated cart array
 */
export const addToCart = (item) => {
  if (!item) return getCart();

  const currentCart = getCart();
  const itemId = typeof item === 'object' ? (item.id || item.vendorServiceId || item._id || item.serviceId) : item;

  if (itemId === undefined || itemId === null) {
    return currentCart;
  }

  const existingIndex = currentCart.findIndex((i) => isSameId(i, itemId));
  const addQty = typeof item === 'object' && item.quantity ? Math.max(1, Number(item.quantity) || 1) : 1;

  let updatedCart;
  if (existingIndex > -1) {
    const existingItem = currentCart[existingIndex];
    const newQty = (Number(existingItem.quantity) || 1) + addQty;

    const mergedItem =
      typeof item === 'object'
        ? { ...existingItem, ...item, id: existingItem.id || itemId, quantity: newQty }
        : { ...existingItem, quantity: newQty };

    updatedCart = [...currentCart];
    updatedCart[existingIndex] = mergedItem;
  } else {
    const newItem = typeof item === 'object' ? { ...item, id: itemId } : { id: itemId };
    newItem.quantity = addQty;
    updatedCart = [...currentCart, newItem];
  }

  return saveCart(updatedCart);
};

/**
 * Removes an item from the cart by its id.
 * @param {string|number} id - Item ID to remove
 * @returns {Array} Updated cart array
 */
export const removeFromCart = (id) => {
  const currentCart = getCart();
  const updatedCart = currentCart.filter((i) => !isSameId(i, id));
  return saveCart(updatedCart);
};

/**
 * Updates the quantity of a specific item in the cart by id.
 * If quantity <= 0, removes the item from cart.
 * @param {string|number} id - Item ID
 * @param {number} quantity - New quantity
 * @returns {Array} Updated cart array
 */
export const updateQuantity = (id, quantity) => {
  const numQty = Number(quantity);
  if (isNaN(numQty) || numQty <= 0) {
    return removeFromCart(id);
  }

  const currentCart = getCart();
  const existingIndex = currentCart.findIndex((i) => isSameId(i, id));

  if (existingIndex === -1) {
    return currentCart;
  }

  const updatedCart = currentCart.map((i) =>
    isSameId(i, id) ? { ...i, quantity: numQty } : i
  );

  return saveCart(updatedCart);
};

/**
 * Updates specific fields of an existing cart item by id.
 * @param {string|number} id - Item ID
 * @param {Object} updatedFields - Fields to merge
 * @returns {Array} Updated cart array
 */
export const updateCartItemDetails = (id, updatedFields) => {
  const currentCart = getCart();
  const existingIndex = currentCart.findIndex((i) => isSameId(i, id));
  if (existingIndex === -1) return currentCart;

  const updatedCart = [...currentCart];
  updatedCart[existingIndex] = {
    ...updatedCart[existingIndex],
    ...updatedFields,
  };
  return saveCart(updatedCart);
};

/**
 * Clears the cart completely.
 * @returns {Array} Empty array
 */
export const clearCart = () => {
  return saveCart([]);
};

