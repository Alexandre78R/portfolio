import * as fs from 'fs';
import * as path from 'path';

export const loadedLogos = new Map<string, { base64: string; mimeType: string }>();

const LOGOS_DIR = path.join(__dirname, '../images/logos'); 
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  console.log(`[getMimeType] Fichier: ${path.basename(filePath)}, Extension détectée: '${ext}'`);
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

export function loadLogos(): void {
  console.log(`[loadLogos] Début du chargement des logos depuis : ${LOGOS_DIR}`);
  try {
    const files = fs.readdirSync(LOGOS_DIR);
    console.log(`[loadLogos] Fichiers trouvés dans le dossier :`, files);

    if (files.length === 0) {
      console.warn(`[loadLogos] Le dossier des logos est vide ou aucun fichier n'a été détecté : ${LOGOS_DIR}`);
    }

    for (const file of files) {
      const filePath = path.join(LOGOS_DIR, file);
      const fileNameWithoutExt = path.parse(file).name.toLowerCase();
      const mimeType = getMimeType(filePath);

      console.log(`[loadLogos] Traitement du fichier: ${file}, Clé prévue: '${fileNameWithoutExt}', Type MIME: '${mimeType}'`);

      if (mimeType !== 'application/octet-stream') {
        try {
          const fileBuffer = fs.readFileSync(filePath);
          const base64Data = fileBuffer.toString('base64');
          loadedLogos.set(fileNameWithoutExt, { base64: base64Data, mimeType: mimeType });
          console.log(`[loadLogos] SUCCÈS : Logo '${fileNameWithoutExt}' chargé et ajouté à la map.`); 
        } catch (readError: any) { 
          console.error(`[loadLogos] ERREUR de lecture du fichier logo ${filePath}:`, readError.message || readError); 
        }
      } else {
        console.warn(`[loadLogos] Type de fichier non supporté pour le logo : ${file} (ignoré).`);
      }
    }
  } catch (dirError: any) {
    console.error(`[loadLogos] ERREUR GRAVE lors de la lecture du dossier des logos ${LOGOS_DIR}:`, dirError.message || dirError);
    console.error("Assurez-vous que le dossier 'src/images/logos' existe et est accessible.");
  }
  console.log(`[loadLogos] FIN du chargement. Nombre total de logos chargés dans la map : ${loadedLogos.size}`);
  console.log(`[loadLogos] Contenu de la map (clés uniquement) :`, Array.from(loadedLogos.keys())); 
}