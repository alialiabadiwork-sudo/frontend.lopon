/**
 * Image normalization and key extraction utilities
 */

export const normalizeImageUrl = (img, type = 'vendor') => {
  if (!img || typeof img !== 'string') return '';
  let trimmed = img.trim();
  if (!trimmed) return '';

  // Remove potential 'undefined/' or 'null/' prefix
  trimmed = trimmed.replace(/^(undefined|null)\/+/, '/');

  // Strip localhost / 127.0.0.1 / lopon.ir domain prefix if pointing to storage or file
  trimmed = trimmed.replace(/^https?:\/\/(?:localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?|(?:www\.)?lopon\.ir)(?=\/(?:storage|file))/i, '');

  // If already other external full URL or data URI
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // If has leading slash
  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('/file/') || trimmed.startsWith('/storage/')) {
      return trimmed;
    }
    if (trimmed.startsWith('./images/')) {
      return '/' + trimmed.slice(2);
    }
    if (trimmed.startsWith('images/')) {
      return '/' + trimmed;
    }
    const stripped = trimmed.replace(/^\/+/, '');
    if (stripped.startsWith('vendor-service-')) {
      return `/storage/file/vendor-services/${stripped}`;
    }
    if (stripped.startsWith('vendor-')) {
      return `/storage/file/vendors/${stripped}`;
    }
    if (stripped.startsWith('service-')) {
      return `/storage/file/services/${stripped}`;
    }
    if (stripped.startsWith('category-') || stripped.startsWith('cat-')) {
      return `/storage/file/categorys/${stripped}`;
    }
    return trimmed;
  }

  // Handle storage/ or file/
  if (trimmed.startsWith('storage/') || trimmed.startsWith('file/')) {
    return `/${trimmed}`;
  }

  // Raw filenames
  if (trimmed.startsWith('vendor-service-')) {
    return `/storage/file/vendor-services/${trimmed}`;
  }
  if (trimmed.startsWith('vendor-')) {
    return `/storage/file/vendors/${trimmed}`;
  }
  if (trimmed.startsWith('service-')) {
    return `/storage/file/services/${trimmed}`;
  }
  if (trimmed.startsWith('category-') || strippedStartsWithCat(trimmed)) {
    return `/storage/file/categorys/${trimmed}`;
  }

  if (type === 'service' || type === 'vendor-service') {
    return `/storage/file/vendor-services/${trimmed}`;
  }
  if (type === 'general-service') {
    return `/storage/file/services/${trimmed}`;
  }
  if (type === 'category' || type === 'cat') {
    return `/storage/file/categorys/${trimmed}`;
  }
  return `/storage/file/vendors/${trimmed}`;
};

function strippedStartsWithCat(str) {
  return str.startsWith('cat-') || str.startsWith('category-');
}

export const getCanonicalImageKey = (img) => {
  if (!img || typeof img !== 'string') return '';
  const clean = img.trim().split('?')[0].split('#')[0];
  const parts = clean.split('/');
  return (parts[parts.length - 1] || clean).toLowerCase();
};
