import * as simpleIcons from 'simple-icons';

/**
 * Génère un SVG pour un badge de style Shields.io (flat-square) avec plus de personnalisation.
 *
 * @param label Le texte affiché à gauche du badge (ex: "Langage").
 * @param message Le texte affiché à droite du badge (ex: "JavaScript").
 * @param messageColor La couleur d'arrière-plan de la partie message (ex: "blue", "33FF66").
 * @param labelColor La couleur d'arrière-plan de la partie label (ex: "grey", "555"). Optionnel, par défaut #555.
 * @param logoSlug Le "slug" du logo SimpleIcons (ex: "github", "react"). Optionnel.
 * @param logoColor La couleur du logo. Optionnel, par défaut "white".
 * @param logoPosition Position du logo : 'left' ou 'right' (défaut 'left').
 * @returns La chaîne de caractères représentant le code SVG du badge.
 */
export function generateBadgeSvg(
  label: string,
  message: string,
  messageColor: string,
  labelColor: string = '555', // Nouvelle couleur par défaut pour le label
  logoSlug?: string,
  logoColor: string = 'white',
  logoPosition: 'left' | 'right' = 'left' // Nouvelle option de position du logo
): string {
  // Fonction utilitaire pour échapper le texte SVG
  const escapeSvgText = (text: string) =>
    text.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });

  const escapedLabel = escapeSvgText(label);
  const escapedMessage = escapeSvgText(message);

  const baseFontSize = 11;
  const padding = 10; // Espacement horizontal (gauche et droite pour le texte)
  const textY = (20 / 2) + (baseFontSize / 2) - 2; // Position Y pour centrer le texte verticalement

  let logoWidth = 0;
  let logoSvgContent = '';

  if (logoSlug) {
    const iconKey = `si${logoSlug.charAt(0).toUpperCase() + logoSlug.slice(1)}`;
    const icon = (simpleIcons as any)[iconKey];

    if (icon && icon.path) {
      logoSvgContent = icon.path;
      logoWidth = 14; // Largeur standard du logo
    } else {
      console.warn(`Logo '${logoSlug}' non trouvé ou chemin SVG manquant.`);
      logoWidth = 0;
    }
  }

  // Largeurs des segments de texte (approximations)
  const labelTextActualWidth = (escapedLabel.length * 6) + padding;
  const messageTextActualWidth = (escapedMessage.length * 6) + padding;

  // Calcul des largeurs finales des segments en fonction du logo et de sa position
  let labelSegmentWidth = labelTextActualWidth;
  let messageSegmentWidth = messageTextActualWidth;

  // Ajustement des largeurs de segment pour faire de la place au logo
  if (logoSvgContent) {
    if (logoPosition === 'left') {
      labelSegmentWidth += logoWidth + (padding / 2); // Ajoute l'espace du logo au segment label
    } else { // logoPosition === 'right'
      messageSegmentWidth += logoWidth + (padding / 2); // Ajoute l'espace du logo au segment message
    }
  }

  const totalWidth = labelSegmentWidth + messageSegmentWidth;
  const height = 20;

  // Positionnement du texte (X) - Calcul plus précis
  let labelTextX = (padding / 2) + (labelTextActualWidth - padding) / 2;
  let messageTextX = labelSegmentWidth + (padding / 2) + (messageTextActualWidth - padding) / 2;

  // Décalage du texte pour faire de la place au logo si il est dans le même segment
  if (logoSvgContent) {
    if (logoPosition === 'left') {
      labelTextX += (logoWidth + (padding / 2)) / 2; // Décale le texte du label vers la droite
    } else { // logoPosition === 'right'
      messageTextX -= (logoWidth + (padding / 2)) / 2; // Décale le texte du message vers la gauche
    }
  }

  // Positionnement du logo (X)
  let logoX = 0;
  if (logoSvgContent) {
    if (logoPosition === 'left') {
      logoX = padding / 2; // Logo au début du segment label
    } else { // logoPosition === 'right'
      logoX = labelSegmentWidth + messageSegmentWidth - logoWidth - (padding / 2); // Logo à la fin du segment message
    }
  }

  // **** CORRECTION CLÉ ICI ****
  // Utilise directement labelColor et messageColor sans préfixe '#',
  // car SVG peut gérer les noms de couleurs (red, white) et les hex codes (ex: #FF0000)
  // quand le # est déjà inclus dans l'hex code lui-même.
  const finalLabelColor = labelColor;
  const finalMessageColor = messageColor;

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
        <rect width="${labelSegmentWidth}" height="${height}" fill="${finalLabelColor}" /> <rect x="${labelSegmentWidth}" width="${messageSegmentWidth}" height="${height}" fill="${finalMessageColor}" /> <rect width="${totalWidth}" height="${height}" fill="url(#s)" />
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${baseFontSize}">
        ${logoSvgContent && logoPosition === 'left' ? `
        <image x="${logoX}" y="${(height - logoWidth) / 2}" width="${logoWidth}" height="${logoWidth}" xlink:href="data:image/svg+xml;base64,${Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='${logoColor}' d='${logoSvgContent}'/></svg>`).toString('base64')}" />
        ` : ''}
        <text x="${labelTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedLabel}</text>
        <text x="${labelTextX}" y="${textY-1}">${escapedLabel}</text>

        ${logoSvgContent && logoPosition === 'right' ? `
        <image x="${logoX}" y="${(height - logoWidth) / 2}" width="${logoWidth}" height="${logoWidth}" xlink:href="data:image/svg+xml;base64,${Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='${logoColor}' d='${logoSvgContent}'/></svg>`).toString('base64')}" />
        ` : ''}
        <text x="${messageTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedMessage}</text>
        <text x="${messageTextX}" y="${textY-1}">${escapedMessage}</text>
      </g>
    </svg>
  `;
}