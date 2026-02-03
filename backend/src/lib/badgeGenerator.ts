export interface LogoData {
  base64: string;
  mimeType: string;
}

export type LogoPosition = 'left' | 'right';

/**
 * Génère un SVG pour un badge de style Shields.io (flat-square) avec plus de personnalisation.
 *
 * @param label Le texte affiché à gauche du badge.
 * @param message Le texte affiché à droite du badge.
 * @param messageColor La couleur du message (ex: "blue" ou "#33FF66").
 * @param labelColor La couleur du label (par défaut '#555').
 * @param logoData Données du logo à inclure (optionnel).
 * @param logoColor Couleur du logo (utile pour les SVG, optionnel, par défaut "white").
 * @param logoPosition Position du logo : 'left' ou 'right' (défaut 'left').
 * @returns La chaîne SVG complète du badge.
 */
export function generateBadgeSvg(
  label: string,
  message: string,
  messageColor: string,
  labelColor: string = '#555',
  logoData?: LogoData,
  logoColor: string = 'white',
  logoPosition: LogoPosition = 'left'
): string {
  const escapeSvgText = (text: string): string =>
    text.replace(/[<>&"']/g, (c: string) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });

  const escapedLabel: string = escapeSvgText(label);
  const escapedMessage: string = escapeSvgText(message);

  const baseFontSize: number = 11;
  const padding: number = 10;
  const height: number = 20;
  const textY: number = (height / 2) + (baseFontSize / 2) - 2;

  let logoWidth: number = 0;
  let logoHref: string = '';

  if (logoData?.base64 && logoData?.mimeType) {
    logoHref = `data:${logoData.mimeType};base64,${logoData.base64}`;
    logoWidth = 14;
  }

  const labelTextActualWidth: number = (escapedLabel.length * 6) + padding;
  const messageTextActualWidth: number = (escapedMessage.length * 6) + padding;

  let labelSegmentWidth: number = labelTextActualWidth;
  let messageSegmentWidth: number = messageTextActualWidth;

  if (logoHref) {
    if (logoPosition === 'left') labelSegmentWidth += logoWidth + (padding / 2);
    else messageSegmentWidth += logoWidth + (padding / 2);
  }

  const totalWidth: number = labelSegmentWidth + messageSegmentWidth;

  let labelTextX: number = (padding / 2) + (labelTextActualWidth - padding) / 2;
  let messageTextX: number = labelSegmentWidth + (padding / 2) + (messageTextActualWidth - padding) / 2;

  if (logoHref) {
    if (logoPosition === 'left') labelTextX += (logoWidth + (padding / 2)) / 2;
    else messageTextX -= (logoWidth + (padding / 2)) / 2;
  }

  let logoX: number = 0;
  if (logoHref) {
    logoX = logoPosition === 'left'
      ? padding / 2
      : labelSegmentWidth + messageSegmentWidth - logoWidth - (padding / 2);
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}">
      <linearGradient id="s" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
        <stop offset="1" stop-opacity=".1" />
      </linearGradient>
      <clipPath id="r">
        <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff" />
      </clipPath>
      <g clip-path="url(#r)">
        <rect width="${labelSegmentWidth}" height="${height}" fill="${labelColor}" />
        <rect x="${labelSegmentWidth}" width="${messageSegmentWidth}" height="${height}" fill="${messageColor}" />
        <rect width="${totalWidth}" height="${height}" fill="url(#s)" />
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${baseFontSize}">
        ${logoHref ? `<image x="${logoX}" y="${(height - logoWidth) / 2}" width="${logoWidth}" height="${logoWidth}" xlink:href="${logoHref}" />` : ''}
        <text x="${labelTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedLabel}</text>
        <text x="${labelTextX}" y="${textY - 1}">${escapedLabel}</text>
        <text x="${messageTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedMessage}</text>
        <text x="${messageTextX}" y="${textY - 1}">${escapedMessage}</text>
      </g>
    </svg>
  `;
}