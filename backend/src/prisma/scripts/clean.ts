import { PrismaClient } from "@prisma/client";
import readline, { Interface as ReadLineInterface } from "readline";

const prisma: PrismaClient = new PrismaClient();

const rl: ReadLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question: string): Promise<string> =>
  new Promise<string>((resolve: (answer: string) => void) => {
    rl.question(question, resolve);
  });

const cleanDatabase = async (): Promise<void> => {
  const answer: string = await ask(
    "⚠️  This will PERMANENTLY delete ALL data and reset auto-increments from your database. Are you absolutely sure? (y/n): "
  );

  if (answer.toLowerCase() !== "y") {
    console.log("❌ Database cleanup cancelled.");
    rl.close();
    return;
  }

  console.log("⏳ Cleaning database and resetting auto-increments...");

  try {
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");

    console.log("🗑️ Deleting data...");

    await prisma.projectSkill.deleteMany();
    await prisma.skillCategorySkill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.skillCategory.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.user.deleteMany();
    await prisma.theme.deleteMany();
    await prisma.social.deleteMany();
    await prisma.signature.deleteMany();

    console.log("✅ Data deleted.");

    console.log("🔁 Resetting auto-increments...");

    await prisma.$executeRawUnsafe(
      "ALTER TABLE `Project` AUTO_INCREMENT = 1;"
    );
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `SkillCategory` AUTO_INCREMENT = 1;"
    );
    await prisma.$executeRawUnsafe("ALTER TABLE `Skill` AUTO_INCREMENT = 1;");
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `SkillCategorySkill` AUTO_INCREMENT = 1;"
    );
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `Education` AUTO_INCREMENT = 1;"
    );
    await prisma.$executeRawUnsafe(
      "ALTER TABLE `Experience` AUTO_INCREMENT = 1;"
    );
    await prisma.$executeRawUnsafe("ALTER TABLE `User` AUTO_INCREMENT = 1;");
    await prisma.$executeRawUnsafe("ALTER TABLE `themes` AUTO_INCREMENT = 1;");
    await prisma.$executeRawUnsafe("ALTER TABLE `socials` AUTO_INCREMENT = 1;");
    await prisma.$executeRawUnsafe("ALTER TABLE `signature` AUTO_INCREMENT = 1;");
    
    console.log("✅ Auto-increments reset.");
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");

    console.log(
      "🎉 Database cleaned successfully. All data removed and IDs restarted from 1."
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error while cleaning database:", error.message);
    } else {
      console.error("❌ Unknown error while cleaning database:", error);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
};

cleanDatabase().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error("❌ Fatal error:", error.message);
  } else {
    console.error("❌ Fatal unknown error:", error);
  }
  rl.close();
});