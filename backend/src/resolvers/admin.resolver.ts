import {
  Resolver,
  Mutation,
  Authorized,
  Query,
  Arg,
  Float,
} from "type-graphql";
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
  BackupFileInfo,
} from "../types/response.types";
import { PrismaClient } from "@prisma/client";

const execPromise = util.promisify(exec);

/**
 * 📁 Dossier UNIQUE pour les sauvegardes
 */
const BACKUP_DIR = path.join(process.cwd(), "backups");

@Resolver()
export class AdminResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  /* -------------------------------------------------------------------------- */
  /*                               BACKUP BDD                                   */
  /* -------------------------------------------------------------------------- */

  @Authorized([UserRole.admin])
  @Mutation(() => BackupResponse)
  async generateDatabaseBackup(): Promise<BackupResponse> {
    try {
      if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`📁 Backup directory created: ${BACKUP_DIR}`);
      }

      const now = new Date();
      const timestamp = `${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(
        now.getHours()
      ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      const fileName = `bdd_${timestamp}.sql`;
      const filePath = path.join(BACKUP_DIR, fileName);

      const dbUrl = process.env.DATABASE_URL;
      if (!dbUrl) {
        throw new Error("DATABASE_URL non défini");
      }

      const url = new URL(dbUrl);

      const command = `
        mysqldump
          -h ${url.hostname}
          -P ${url.port || "3306"}
          -u ${url.username}
          -p"${url.password}"
          ${url.pathname.slice(1)}
          > "${filePath}"
      `.replace(/\s+/g, " ");

      console.log(`🗄️ Starting database backup → ${filePath}`);

      await execPromise(command);

      return {
        code: 200,
        message: "Database backup generated successfully",
        path: fileName,
      };
    } catch (error) {
      console.error("❌ Backup generation error:", error);
      return {
        code: 500,
        message:
          error instanceof Error ? error.message : "Unknown backup error",
        path: "",
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           LISTE DES BACKUPS                                 */
  /* -------------------------------------------------------------------------- */

@Authorized([UserRole.admin])
@Query(() => BackupFilesResponse)
async listBackupFiles(): Promise<BackupFilesResponse> {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return {
        code: 200,
        message: "No backup directory found",
        files: [],
      };
    }

    const files = await fs.promises.readdir(BACKUP_DIR);

    const backupFiles: BackupFileInfo[] = [];

    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = await fs.promises.stat(filePath);

      if (!stats.isFile()) continue;

      backupFiles.push({
        fileName: file,
        sizeBytes: stats.size,
        modifiedAt: stats.mtime,
        createdAt: stats.ctime,
      });
    }

    return {
      code: 200,
      message: `Backup files listed successfully (${backupFiles.length})`,
      files: backupFiles,
    };
  } catch (error: any) {
    console.error("❌ Error listing backups:", error);
    return {
      code: 500,
      message: error.message,
      files: [],
    };
  }
}

  /* -------------------------------------------------------------------------- */
  /*                           SUPPRESSION BACKUP                                */
  /* -------------------------------------------------------------------------- */

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteBackupFile(
    @Arg("fileName") fileName: string
  ): Promise<Response> {
    try {
      const targetPath = path.normalize(path.join(BACKUP_DIR, fileName));

      if (!targetPath.startsWith(BACKUP_DIR + path.sep)) {
        return {
          code: 400,
          message: "Invalid file path",
        };
      }

      if (!fs.existsSync(targetPath)) {
        return {
          code: 404,
          message: "Backup file not found",
        };
      }

      await fs.promises.unlink(targetPath);

      return {
        code: 200,
        message: `Backup file '${fileName}' deleted successfully`,
      };
    } catch (error: any) {
      console.error("❌ Error deleting backup:", error);
      return {
        code: 500,
        message: error.message,
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              AUTRES QUERIES                                 */
  /* -------------------------------------------------------------------------- */

  @Query(() => GlobalStatsResponse)
  async getGlobalStats(): Promise<GlobalStatsResponse> {
    try {
      const totalUsers = await this.db.user.count();
      const totalProjects = await this.db.project.count();
      const totalSkills = await this.db.skill.count();
      const totalEducations = await this.db.education.count();
      const totalExperiences = await this.db.experience.count();

      const usersByRole = await this.db.user.groupBy({
        by: ["role"],
        _count: { id: true },
      });

      const map = usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.id;
        return acc;
      }, {} as Record<UserRole, number>);

      const stats: GlobalStats = {
        totalUsers,
        totalProjects,
        totalSkills,
        totalEducations,
        totalExperiences,
        usersByRoleAdmin: map[UserRole.admin] || 0,
        usersByRoleEditor: map[UserRole.editor] || 0,
        usersByRoleView: map[UserRole.view] || 0,
      };

      return {
        code: 200,
        message: "Global statistics fetched successfully",
        stats,
      };
    } catch (error) {
      console.error("❌ Global stats error:", error);
      return { code: 500, message: "Failed to fetch global statistics" };
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
      by: ["role"],
      _count: { id: true },
    });

    const map = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {} as Record<UserRole, number>);

    return {
      code: 200,
      message: "User role distribution fetched successfully",
      admin: totalUsers ? (100 * (map[UserRole.admin] || 0)) / totalUsers : 0,
      editor: totalUsers ? (100 * (map[UserRole.editor] || 0)) / totalUsers : 0,
      view: totalUsers ? (100 * (map[UserRole.view] || 0)) / totalUsers : 0,
    };
  }

  @Query(() => TopSkillsResponse)
  async getTopUsedSkills(): Promise<TopSkillsResponse> {
    const counts = await this.db.projectSkill.groupBy({
      by: ["skillId"],
      _count: { skillId: true },
      orderBy: { _count: { skillId: "desc" } },
    });

    const skills = await this.db.skill.findMany({
      where: { id: { in: counts.map((c) => c.skillId) } },
    });

    return {
      code: 200,
      message: "Top used skills fetched successfully",
      skills: counts.map((c) => ({
        id: c.skillId,
        name: skills.find((s) => s.id === c.skillId)?.name || "Unknown",
        usageCount: c._count.skillId,
      })),
    };
  }
}