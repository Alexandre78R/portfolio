import { Resolver, Mutation, Authorized, Query, Arg, Float } from "type-graphql";
import { UserRole } from "../entities/user.entity";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { 
  BackupFilesResponse,
  BackupResponse,
  GlobalStats,
  GlobalStatsResponse,
  Response,
  UserRolePercent,
  TopSkillsResponse,
  TopSkillUsage,
} from "../types/response.types";
import { PrismaClient } from "@prisma/client";
import { promises as fsPromises } from 'fs';

const execPromise = util.promisify(exec);
export const dataFolderPath = path.join(__dirname, "../data");

@Resolver()
export class AdminResolver {

  constructor(private readonly db: PrismaClient = new PrismaClient()) {}
  
  private backupDir = path.resolve(__dirname, '../data')
  
  /**
   * Génère une sauvegarde de la base de données MySQL en utilisant mysqldump.
   * La sauvegarde est enregistrée dans le dossier 'data' à la racine du projet
   * avec un nom de fichier incluant un horodatage pour éviter d'écraser les précédentes.
   * @returns Un message indiquant le succès ou l'échec de l'opération.
   */
  @Authorized([UserRole.admin])
  @Mutation(() => BackupResponse)
  async generateDatabaseBackup(): Promise<BackupResponse> {
    const dataFolderPath = path.join(__dirname, "../data"); 

    try {
      if (!fs.existsSync(dataFolderPath)) {
        fs.mkdirSync(dataFolderPath, { recursive: true });
        console.log(`Dossier 'data' créé à: ${dataFolderPath}`);
      }

      const now = new Date();

      // Format timestamp simple : YYYYMMDD_HHmmss
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
        return {
          code: 500,
          message: `Sauvegarde terminée avec des erreurs: ${stderr}`,
          path: backupFilePath,
        };
      }
      if (stdout) {
        console.log(`mysqldump (stdout): ${stdout}`);
      }

      return {
        code: 200,
        message: `Database backup generated successfully at ${backupFilePath}`,
        path: backupFilePath,
      };

    } catch (error) {
      console.error("Erreur lors de la génération de la sauvegarde de la base de données:", error);
      return {
        code: 500,
        message: `Erreur lors de la génération de la sauvegarde de la base de données: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        path: "",
      };
    }
  }

    /**
    * Récupère des statistiques globales sur le contenu de la base de données.
    * Seuls les administrateurs peuvent y accéder.
    */
  @Query(() => GlobalStatsResponse)
  async getGlobalStats(): Promise<GlobalStatsResponse> {
    try {

      const totalUsers = await this.db.user.count();
      const totalProjects = await this.db.project.count();
      const totalSkills = await this.db.skill.count();
      const totalEducations = await this.db.education.count();
      const totalExperiences = await this.db.experience.count();

      const usersByRole = await this.db.user.groupBy({
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
  async listBackupFiles() {
    try {
      const files = await fsPromises.readdir(this.backupDir);
      const backupFiles = [];

      for (const file of files) {
        // console.log(files)
        try {
          const filePath = path.join(this.backupDir, file);
          const stats = await fsPromises.stat(filePath);

          if (stats.isFile()) {
            backupFiles.push({
              fileName: file,
              sizeBytes: stats.size,        
              modifiedAt: stats.mtime,        
              createdAt: stats.ctime,
            });
          }
        } catch (err) {
          console.warn(`Could not get stats for file ${file}:`, err);
          // Continue malgré l'erreur
        }
      }

      return {
        code: 200,
        message: `Backup files listed successfully (${backupFiles.length} files)`,
        files: backupFiles,
      };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // Dossier introuvable : renvoyer succès avec liste vide
        return {
          code: 200,
          message: 'Backup folder does not exist, no files found',
          files: [],
        };
      }
      console.error('Error listing backup files:', err);
      return {
        code: 500,
        message: `Failed to list backup files: ${err.message}`,
      };
    }
  }

    /**
   * Supprime un fichier de sauvegarde spécifique du dossier 'data'.
   * Seuls les administrateurs peuvent effectuer cette action.
   * @param fileName Le nom du fichier de sauvegarde à supprimer.
   * @returns Un message indiquant le succès ou l'échec de l'opération.
   */
  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteBackupFile(
    @Arg("fileName") fileName: string
  ): Promise<Response> {
    const filePathToDelete = path.join(dataFolderPath, fileName);

    try {
      const normalizedFilePath = path.normalize(filePathToDelete);
      if (!normalizedFilePath.startsWith(dataFolderPath + path.sep)) {
        return {
          code: 400,
          message: "Invalid file path. Cannot delete files outside the backup directory.",
        };
      }

      if (!fs.existsSync(filePathToDelete)) {
        return {
          code: 404,
          message: `Backup file '${fileName}' not found.`,
        };
      }

      await fs.promises.unlink(filePathToDelete);

      return {
        code: 200,
        message: `Backup file '${fileName}' deleted successfully.`,
      };

    } catch (error) {
      console.error(`Error deleting backup file '${fileName}':`, error);
      return {
        code: 500,
        message: `Failed to delete backup file '${fileName}': ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  @Query(() => Float)
  async getAverageSkillsPerProject(): Promise<number> {
    const totalProjects = await this.db.project.count();
    const totalProjectSkills = await this.db.projectSkill.count();

    return totalProjects > 0 ? totalProjectSkills / totalProjects : 0;
  }

  @Query(() => UserRolePercent)
  async getUsersRoleDistribution(): Promise<UserRolePercent> {
    const totalUsers = await this.db.user.count();

    const usersByRole = await this.db.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    const map = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      code: 200,
      message: "User role distribution fetched successfully.",
      admin: totalUsers > 0 ? (100 * (map[UserRole.admin] || 0)) / totalUsers : 0,
      editor: totalUsers > 0 ? (100 * (map[UserRole.editor] || 0)) / totalUsers : 0,
      view: totalUsers > 0 ? (100 * (map[UserRole.view] || 0)) / totalUsers : 0,
    };
  }

  @Query(() => TopSkillsResponse)
  async getTopUsedSkills(): Promise<TopSkillsResponse> {
    const topSkillCounts = await this.db.projectSkill.groupBy({
      by: ['skillId'],
      _count: { skillId: true },
      orderBy: { _count: { skillId: 'desc' } },
    });

    const skillIds = topSkillCounts.map(s => s.skillId);

    const skills = await this.db.skill.findMany({
      where: { id: { in: skillIds } },
    });

    const result: TopSkillUsage[] = topSkillCounts.map(item => {
      const skill = skills.find(s => s.id === item.skillId);
      return {
        id: item.skillId,
        name: skill?.name || "Unknown",
        usageCount: item._count.skillId,
      };
    });

    return {
      code: 200,
      message: "Top used skills fetched successfully.",
      skills: result,
    };
  }
}