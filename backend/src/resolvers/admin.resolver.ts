import { Resolver, Mutation, Authorized, Query } from "type-graphql";
import { UserRole } from "../entities/user.entity";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { BackupFileInfo, BackupFilesResponse, GlobalStats, GlobalStatsResponse, Response } from "../entities/response.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const execPromise = util.promisify(exec);

@Resolver()
export class AdminResolver {


  /**
   * Génère une sauvegarde de la base de données MySQL en utilisant mysqldump.
   * La sauvegarde est enregistrée dans le dossier 'data' à la racine du projet
   * avec un nom de fichier incluant un horodatage pour éviter d'écraser les précédentes.
   * @returns Un message indiquant le succès ou l'échec de l'opération.
   */
  @Authorized([UserRole.admin]) 
  @Mutation(() => Response)
  async generateDatabaseBackup(): Promise<Response> {
    const dataFolderPath = path.join(__dirname, "../data"); 

    try {

      if (!fs.existsSync(dataFolderPath)) {
        fs.mkdirSync(dataFolderPath, { recursive: true });
        console.log(`Dossier 'data' créé à: ${dataFolderPath}`);
      }

     //Générer un nom de fichier unique avec un horodatage
      const now = new Date();
      const timestamp = now.toISOString()
                            .replace(/[:.]/g, "") // Enlève les deux-points et points pour un nom de fichier valide
                            .replace("T", "_")   // Remplace 'T' par '_'
                            .split("+")[0]       // Enlève le fuseau horaire si présent
                            .split("-")[0]       // Enlève la partie des millisecondes si non gérée par replace(/[:.]/g, "")
                            .slice(0, 15);       // Limite pour bdd_YYYYMMDD_HHmmss

      // Utilisation d'un format plus simple pour le timestamp: YYYYMMDD_HHmmss
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); 
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const formattedTimestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
      const backupFileName = `bdd_${formattedTimestamp}.sql`;
      const backupFilePath = path.join(dataFolderPath, backupFileName);

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
        return { code: 500, message: `Sauvegarde terminée avec des erreurs: ${stderr}` };
      }
      if (stdout) {
        console.log(`mysqldump (stdout): ${stdout}`);
      }

      return { code: 200, message: `Database backup generated successfully at ${backupFilePath}` };

    } catch (error) {
      console.error("Erreur lors de la génération de la sauvegarde de la base de données:", error);
      return { code: 500, message: `Erreur lors de la génération de la sauvegarde de la base de données: ${error instanceof Error ? error.message : "Erreur inconnue"}` };
    }
  }

    /**
    * Récupère des statistiques globales sur le contenu de la base de données.
    * Seuls les administrateurs peuvent y accéder.
    */
  @Authorized([UserRole.admin])
  @Query(() => GlobalStatsResponse)
  async getGlobalStats(): Promise<GlobalStatsResponse> {
    try {

      const totalUsers = await prisma.user.count();
      const totalProjects = await prisma.project.count();
      const totalSkills = await prisma.skill.count();
      const totalEducations = await prisma.education.count();
      const totalExperiences = await prisma.experience.count();

      const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      });

      const usersByRoleMap = usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      }, {} as Record<UserRole, number>); 

      const stats: GlobalStats = {
        totalUsers,
        totalProjects,
        totalSkills,
        totalEducations,
        totalExperiences,
        usersByRoleAdmin: usersByRoleMap[UserRole.admin] || 0,
        usersByRoleEditor: usersByRoleMap[UserRole.editor] || 0,
        usersByRoleView: usersByRoleMap[UserRole.view] || 0,
      };

      return {
        code: 200,
        message: "Global statistics fetched successfully.",
        stats,
      };
    } catch (error) {
      console.error("Error fetching global stats:", error);
      return { code: 500, message: "Failed to fetch global statistics." };
    }
  }

  /**
 * Liste les fichiers de sauvegarde présents dans le dossier 'data'.
 * Seuls les administrateurs peuvent y accéder.
 * @return Un objet contenant le code de réponse, un message et la liste des fichiers de sauvegarde.
 * */

  @Authorized([UserRole.admin])
  @Query(() => BackupFilesResponse)
  async listBackupFiles(): Promise<BackupFilesResponse> {
    const dataFolderPath = path.join(__dirname, "../data"); 

    try {
      if (!fs.existsSync(dataFolderPath)) {
        return {
          code: 200,
          message: "Data folder does not exist. No backup files found.",
          files : [],
        };
      }

      const fileNames = await fs.promises.readdir(dataFolderPath);
      const filesInfo: BackupFileInfo[] = [];

      for (const fileName of fileNames) {
        const filePath = path.join(dataFolderPath, fileName);
        try {
          const stats = await fs.promises.stat(filePath);

          if (stats.isFile()) {
            filesInfo.push({
              fileName: fileName,
              sizeBytes: stats.size,
              createdAt: stats.birthtime, 
              modifiedAt: stats.mtime,
            });
          }
        } catch (fileStatError) {
          console.warn(`Could not get stats for file ${fileName}:`, fileStatError);

        }
      }

      return {
        code: 200,
        message: "Backup files listed successfully.",
        files : filesInfo,
      };

    } catch (error) {
      console.error("Error listing backup files:", error);
        return {
        code: 500,
        message: `Failed to list backup files: ${error instanceof Error ? error.message : "Unknown error"}`,
        files : [],
      };
    }
  }
}