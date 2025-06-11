import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>(r => rl.question(q, r));

async function cleanDatabase() {
  const answer = await ask("⚠️  This will PERMANENTLY delete ALL data and reset auto-increments from your database. Are you absolutely sure? (y/n): ");
  if (answer.toLowerCase() !== 'y') {
    console.log("❌ Database clean up cancelled.");
    rl.close();
    return;
  }
  console.log("⏳ Cleaning database and resetting auto-increments...");

  try {
    
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');


    console.log("Deleting data...");
    await prisma.projectSkill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.skillCategory.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.user.deleteMany();
    console.log("Data deleted.");

    console.log("Resetting auto-increments...");
    await prisma.$executeRawUnsafe('ALTER TABLE `Project` AUTO_INCREMENT = 1;');
    await prisma.$executeRawUnsafe('ALTER TABLE `SkillCategory` AUTO_INCREMENT = 1;');
    await prisma.$executeRawUnsafe('ALTER TABLE `Skill` AUTO_INCREMENT = 1;');
    

    await prisma.$executeRawUnsafe('ALTER TABLE `Education` AUTO_INCREMENT = 1;');
    await prisma.$executeRawUnsafe('ALTER TABLE `Experience` AUTO_INCREMENT = 1;');
    await prisma.$executeRawUnsafe('ALTER TABLE `User` AUTO_INCREMENT = 1;');
    console.log("Auto-increments reset.");

    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');

    console.log("✅ Database cleaned and auto-increments reset successfully. All data has been deleted and IDs will restart from 1.");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

cleanDatabase().catch(e => {
  console.error(e);
  rl.close();
});