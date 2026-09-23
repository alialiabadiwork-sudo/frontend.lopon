import Cookies from 'js-cookie';

/**
 * Sets a cookie with path=/ and syncs with localStorage as fallback.
 * @param {string} name 
 * @param {any} value 
 * @param {number} days 
 */
export function setCookie(name, value, days = 7) {
  if (value === undefined || value === null) return;
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  
  try {
    Cookies.set(name, stringValue, { expires: days, path: '/', sameSite: 'Lax' });
  } catch (e) {
    console.error('Cookie set error:', e);
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(name, stringValue);
    }
  } catch (e) {
    console.error('LocalStorage set error:', e);
  }
}

/**
 * Gets a cookie by name, with fallback to localStorage and legacy token key.
 * @param {string} name 
 * @returns {string|null}
 */
export function getCookie(name) {
  let value = null;
  
  try {
    value = Cookies.get(name);
  } catch (e) {
    console.error('Cookie get error:', e);
  }

  if (!value && typeof window !== 'undefined' && window.localStorage) {
    try {
      value = localStorage.getItem(name);
      if (!value && name === 'token') {
        value = localStorage.getItem('t_sa!@!##@$df');
      }
    } catch (e) {
      console.error('LocalStorage get error:', e);
    }
  }

  if (value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return value;
    }
  }

  return null;
}

/**
 * Deletes a cookie and removes from localStorage.
 * @param {string} name 
 */
export function deleteCookie(name) {
  try {
    Cookies.remove(name, { path: '/' });
  } catch (e) {
    console.error('Cookie remove error:', e);
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(name);
      if (name === 'token') {
        localStorage.removeItem('t_sa!@!##@$df');
      }
    }
  } catch (e) {
    console.error('LocalStorage remove error:', e);
  }
}
