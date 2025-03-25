import { Resolver, Mutation, Authorized, Query } from "type-graphql";
import { UserRole } from "../entities/user.entity";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import { GlobalStats, GlobalStatsResponse, Response } from "../entities/response.types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const dataFolderPath = path.join(__dirname, "../data");
    const backupFilePath = path.join(dataFolderPath, backupFileName);

    try {
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

    /**
    * Récupère des statistiques globales sur le contenu de la base de données.
    * Seuls les administrateurs peuvent y accéder.
    */
  @Authorized([UserRole.admin])
  @Query(() => GlobalStatsResponse) // Retourne un objet de statistiques globales
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
}