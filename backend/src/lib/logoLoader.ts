import * as fs from 'fs';
import * as path from 'path';

export interface Logo {
  base64: string;
  mimeType: string;
}

export const loadedLogos: Map<string, Logo> = new Map<string, Logo>();

const LOGOS_DIR: string = path.join(__dirname, '../images/logos');

/**
 * Retourne le type MIME d'un fichier à partir de son extension
 * @param filePath Chemin du fichier
 * @returns type MIME sous forme de string
 */
export function getMimeType(filePath: string): string {
  if (!filePath) {
    return 'application/octet-stream';
  }

  const ext: string = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.svg': return 'image/svg+xml';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

export function loadLogos(): void {
  console.log(`[loadLogos] Début du chargement des logos depuis : ${LOGOS_DIR}`);
  
  try {
    const files: string[] = fs.readdirSync(LOGOS_DIR);
    console.log(`[loadLogos] Fichiers trouvés dans le dossier :`, files);

    if (files.length === 0) {
      console.warn(`[loadLogos] Le dossier des logos est vide ou aucun fichier n'a été détecté : ${LOGOS_DIR}`);
    }

    for (const file of files) {
      const filePath: string = path.join(LOGOS_DIR, file);
      const fileNameWithoutExt: string = path.parse(file).name.toLowerCase();
      const mimeType: string = getMimeType(filePath);

      console.log(`[loadLogos] Traitement du fichier: ${file}, Clé prévue: '${fileNameWithoutExt}', Type MIME: '${mimeType}'`);

      if (mimeType !== 'application/octet-stream') {
        try {
          const fileBuffer: Buffer = fs.readFileSync(filePath);
          const base64Data: string = fileBuffer.toString('base64');
          loadedLogos.set(fileNameWithoutExt, { base64: base64Data, mimeType });
          console.log(`[loadLogos] SUCCÈS : Logo '${fileNameWithoutExt}' chargé et ajouté à la map.`);
        } catch (readError: unknown) {
          if (readError instanceof Error) {
            console.error(`[loadLogos] ERREUR de lecture du fichier logo ${filePath}:`, readError.message);
          } else {
            console.error(`[loadLogos] ERREUR de lecture du fichier logo ${filePath}:`, readError);
          }
        }
      } else {
        console.warn(`[loadLogos] Type de fichier non supporté pour le logo : ${file} (ignoré).`);
      }
    }
  } catch (dirError: unknown) {
    if (dirError instanceof Error) {
      console.error(`[loadLogos] ERREUR GRAVE lors de la lecture du dossier des logos ${LOGOS_DIR}:`, dirError.message);
    } else {
      console.error(`[loadLogos] ERREUR GRAVE lors de la lecture du dossier des logos ${LOGOS_DIR}:`, dirError);
    }
    console.error("Assurez-vous que le dossier 'src/images/logos' existe et est accessible.");
  }

  console.log(`[loadLogos] FIN du chargement. Nombre total de logos chargés dans la map : ${loadedLogos.size}`);
  console.log(`[loadLogos] Contenu de la map (clés uniquement) :`, Array.from(loadedLogos.keys()));
}