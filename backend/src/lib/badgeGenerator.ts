
/**
 * Génère un SVG pour un badge de style Shields.io (flat-square) avec plus de personnalisation.
 *
 * @param label Le texte affiché à gauche du badge (ex: "Langage").
 * @param message Le texte affiché à droite du badge (ex: "JavaScript").
 * @param messageColor La couleur d'arrière-plan de la partie message (ex: "blue", "33FF66").
 * @param labelColor La couleur d'arrière-plan de la partie label (ex: "grey", "555"). Optionnel, par défaut #555.
 * @param logoData Objet contenant les données Base64 du logo et son type MIME. Optionnel.
 * Ex: { base64: "...", mimeType: "image/png" }
 * @param logoColor La couleur du logo (sera ignorée pour les images PNG/JPG, utile pour les SVG). Optionnel, par défaut "white".
 * @param logoPosition Position du logo : 'left' ou 'right' (défaut 'left').
 * @returns La chaîne de caractères représentant le code SVG du badge.
 */
export function generateBadgeSvg(
  label: string,
  message: string,
  messageColor: string,
  labelColor: string = '555',
  logoData?: { base64: string; mimeType: string },
  logoColor: string = 'white', 
  logoPosition: 'left' | 'right' = 'left'
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
  let logoHref = ''; // Contient la chaîne "data:image/xxx;base64,..."

  if (logoData && logoData.base64 && logoData.mimeType) {
    logoHref = `data:${logoData.mimeType};base64,${logoData.base64}`;
    logoWidth = 14; // Largeur standard du logo
    // Note: Pour les images raster (PNG/JPG), logoColor est ignoré ici.
    // Pour les SVG, la couleur peut être intégrée dans le SVG lui-même par logoLoader si nécessaire,
    // ou gérée par un remplacement si le SVG est simple (mais ce n'est plus le rôle de badgeGenerator).
  }

  // Largeurs des segments de texte (approximations)
  const labelTextActualWidth = (escapedLabel.length * 6) + padding;
  const messageTextActualWidth = (escapedMessage.length * 6) + padding;

  // Calcul des largeurs finales des segments en fonction du logo et de sa position
  let labelSegmentWidth = labelTextActualWidth;
  let messageSegmentWidth = messageTextActualWidth;

  // Ajustement des largeurs de segment pour faire de la place au logo
  if (logoHref) { // Utilise logoHref pour vérifier si un logo est présent
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
  if (logoHref) {
    if (logoPosition === 'left') {
      labelTextX += (logoWidth + (padding / 2)) / 2; // Décale le texte du label vers la droite
    } else { // logoPosition === 'right'
      messageTextX -= (logoWidth + (padding / 2)) / 2; // Décale le texte du message vers la gauche
    }
  }

  // Positionnement du logo (X)
  let logoX = 0;
  if (logoHref) {
    if (logoPosition === 'left') {
      logoX = padding / 2; // Logo au début du segment label
    } else { // logoPosition === 'right'
      logoX = labelSegmentWidth + messageSegmentWidth - logoWidth - (padding / 2); // Logo à la fin du segment message
    }
  }

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
        <rect width="${labelSegmentWidth}" height="${height}" fill="${finalLabelColor}" />
        <rect x="${labelSegmentWidth}" width="${messageSegmentWidth}" height="${height}" fill="${finalMessageColor}" />
        <rect width="${totalWidth}" height="${height}" fill="url(#s)" />
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${baseFontSize}">
        ${logoHref ? ` <image x="${logoX}" y="${(height - logoWidth) / 2}" width="${logoWidth}" height="${logoWidth}" xlink:href="${logoHref}" />
        ` : ''}
        <text x="${labelTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedLabel}</text>
        <text x="${labelTextX}" y="${textY-1}">${escapedLabel}</text>

        <text x="${messageTextX}" y="${textY}" fill="#010101" fill-opacity=".3">${escapedMessage}</text>
        <text x="${messageTextX}" y="${textY-1}">${escapedMessage}</text>
      </g>
    </svg>
  `;
}