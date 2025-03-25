import { Resolver, Mutation, Authorized } from "type-graphql";
import { UserRole } from "../entities/user.entity";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { Response } from "../entities/response.types";

const execPromise = util.promisify(exec);

@Resolver()
export class AdminResolver {

/**
 * Génère une sauvegarde de la base de données MySQL en utilisant mysqldump.
 * La sauvegarde est enregistrée dans le dossier 'data' à la racine du projet.
 * @returns Un message indiquant le succès ou l'échec de l'opération.
 */

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async generateDatabaseBackup(): Promise<Response> {
    const backupFileName = "bdd.sql";
    const dataFolderPath = path.join(__dirname, "../data"); // Chemin vers le dossier 'data' à la racine du projet
    const backupFilePath = path.join(dataFolderPath, backupFileName);

    try {
      // 1. Vérifier et créer le dossier 'data' s'il n'existe pas
      if (!fs.existsSync(dataFolderPath)) {
        fs.mkdirSync(dataFolderPath, { recursive: true });
        console.log(`Dossier 'data' créé à: ${dataFolderPath}`);
      }

      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("DATABASE_URL non défini dans les variables d'environnement.");
      }

      const urlParts = new URL(dbUrl);
      const user = urlParts.username;
      const password = urlParts.password;
      const host = urlParts.hostname;
      const port = urlParts.port || "3306";
      const database = urlParts.pathname.substring(1); 

    
      const command = `mysqldump -h ${host} -P ${port} -u ${user} -p"${password}" ${database} > ${backupFilePath}`;

      console.log(`Début de la sauvegarde de la base de données vers: ${backupFilePath}`);

    
      const { stdout, stderr } = await execPromise(command);

      if (stderr) {
        console.error(`Erreur mysqldump (stderr): ${stderr}`);
      }
      if (stdout) {
        console.log(`mysqldump (stdout): ${stdout}`);
      }

    return { code: 200, message: `Database backup generated successfully at ${backupFilePath}` };

    } catch (error) {
      console.error("Erreur lors de la génération de la sauvegarde de la base de données:", error);
      return { code: 500, message: "Erreur lors de la génération de la sauvegarde de la base de données" };
    }
  }
}