/**
 * Creates an SEO-friendly Persian/English slug from a title string.
 * Trims, lowercases, replaces whitespace and underscores with hyphens,
 * and preserves Persian, Arabic, and alphanumeric characters.
 */
export const createSlug = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]/gi, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Losslessly encodes a 24-hex MongoDB ObjectId (12 bytes) into a short 16-character base64url string.
 * Reduces ID length by 35% without database changes.
 */
export const encodeId = (hexId) => {
  if (!hexId || typeof hexId !== 'string') return '';
  const clean = hexId.trim();
  if (clean.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(clean)) return clean;
  const match = clean.match(/.{1,2}/g);
  if (!match) return clean;
  const bytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Decodes a short 16-character base64url string back into its original 24-hex MongoDB ObjectId.
 * Automatically accepts standard 24-hex IDs as-is for 100% backwards compatibility.
 */
export const decodeId = (shortId) => {
  if (!shortId || typeof shortId !== 'string') return '';
  const clean = shortId.trim();
  if (clean.length === 24 && /^[0-9a-fA-F]{24}$/.test(clean)) return clean;
  try {
    let base64 = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    let hex = '';
    for (let i = 0; i < binary.length; i++) {
      const h = binary.charCodeAt(i).toString(16).padStart(2, '0');
      hex += h;
    }
    if (hex.length === 24) return hex;
  } catch (e) {}
  return clean;
};

/**
 * Generates an ultra-short, SEO-friendly URL for a business & service.
 * - When serviceTitle is present: slug includes BOTH service + salon name (e.g. /salon/:id/کاشت-ناخن-سالن-آوینا?s=...)
 * - When serviceTitle is empty: slug includes ONLY salon name (e.g. /salon/:id/سالن-آوینا)
 */
export const getShortBusinessUrl = (businessId, businessName = '', serviceId = null, serviceTitle = '') => {
  if (!businessId) return '/';
  const shortVendorId = encodeId(businessId);

  let slug = '';
  if (serviceTitle && businessName) {
    slug = `${createSlug(serviceTitle)}-${createSlug(businessName)}`;
  } else if (businessName) {
    slug = createSlug(businessName);
  } else if (serviceTitle) {
    slug = createSlug(serviceTitle);
  }

  let url = `/salon/${shortVendorId}`;
  if (slug) {
    url += `/${slug}`;
  }
  if (serviceId) {
    url += `?s=${encodeId(serviceId)}`;
  }
  return url;
};

export default {
  createSlug,
  encodeId,
  decodeId,
  getShortBusinessUrl,
};
