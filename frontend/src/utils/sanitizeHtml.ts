import DOMPurify from 'dompurify';

// Propriétés CSS autorisées
const ALLOWED_CSS_PROPERTIES = [
  'color',
  'background-color',
  'font-size',
  'font-weight',
  'font-style',
  'text-decoration',
  'margin',
  'margin-top',
  'margin-bottom',
  'padding',
  'text-align',
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML string safe to render
 */
export const sanitizeHtml: (dirty: string) => string = (dirty: string): string => {
  // Hook pour filtrer les propriétés CSS
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.hasAttribute('style')) {
      const styles = node.getAttribute('style');
      if (styles) {
        const filteredStyles = styles
          .split(';')
          .filter(style => {
            const prop = style.split(':')[0]?.trim().toLowerCase();
            return ALLOWED_CSS_PROPERTIES.includes(prop);
          })
          .join(';');
        
        if (filteredStyles) {
          node.setAttribute('style', filteredStyles);
        } else {
          node.removeAttribute('style');
        }
      }
    }
  });

  const sanitized = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'div', 
      'span', 'pre', 'code', 'img', 'table', 'thead', 'tbody', 
      'tr', 'th', 'td', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'style', 'src', 'alt', 
      'width', 'height', 'title'
    ],
    ALLOW_DATA_ATTR: false,
  });

  // Nettoyer le hook après utilisation
  DOMPurify.removeHook('afterSanitizeAttributes');

  return sanitized;
};
