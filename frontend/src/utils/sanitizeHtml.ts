import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - Unsanitized HTML string
 * @returns Sanitized HTML string safe to render
 */
export const sanitizeHtml: (dirty: string) => string = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
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
    // ALLOWED_STYLES: {
    //   '*': {
    //     'color': [/.*/],
    //     'background-color': [/.*/],
    //     'font-size': [/.*/],
    //     'font-weight': [/.*/],
    //     'font-style': [/.*/],
    //     'text-decoration': [/.*/],
    //     'margin': [/.*/],
    //     'margin-top': [/.*/],
    //     'margin-bottom': [/.*/],
    //     'padding': [/.*/],
    //     'text-align': [/.*/],
    //   }
    // },
  });
};
