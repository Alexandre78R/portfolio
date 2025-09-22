import { PrismaClient, SkillCategory, Skill, Project, ProjectSkill, Education, Experience, User } from '@prisma/client';
import readline from 'readline';
import { projectsData } from '../seed/projectsData';
import { skillsData } from '../seed/skillsData';
import { experiencesData } from '../seed/experiencesData';
import { educationsData } from '../seed/educationsData';
 import { SkillCategoryData, SkillData , ProjectData, EducationData, ExperienceData} from '../../types/seed.types';

// Prisma client
const prisma: PrismaClient = new PrismaClient();

// Readline interface
const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Pose une question à l'utilisateur
const ask = (q: string): Promise<string> =>
  new Promise<string>((resolve: (answer: string) => void) => rl.question(q, resolve));

/**
 * Fonction principale pour seed la base
 */
async function seed(): Promise<void> {
  const answer: string = await ask("⚠️  This will reset and seed your database. Are you sure? (y/n): ");
  if (answer.toLowerCase() !== 'y') {
    console.log("❌ Seed cancelled.");
    rl.close();
    return;
  }
  console.log("⏳ Seeding database...");

  try {
    // Vide les tables pivot et principales
    await prisma.projectSkill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.skillCategory.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.user.deleteMany();

    // Seed des catégories et skills
    for (const cat of skillsData as SkillCategoryData[]) {
      const catRec: SkillCategory = await prisma.skillCategory.create({
        data: { categoryEN: cat.categoryEN, categoryFR: cat.categoryFR },
      });

      for (const sk of cat.skills as SkillData[]) {
        await prisma.skill.create({
          data: {
            name: sk.name,
            image: sk.image,
            categoryId: catRec.id,
          },
        });
      }
    }

    // Seed des projets
    for (const proj of projectsData as ProjectData[]) {
      const projRec: Project = await prisma.project.create({
        data: {
          title: proj.title,
          descriptionEN: proj.descriptionEN,
          descriptionFR: proj.descriptionFR,
          typeDisplay: proj.typeDisplay,
          github: proj.github ?? null,
          contentDisplay: proj.contentDisplay || "",
        },
      });

      for (const sk of proj.skills as SkillData[]) {
        // Recherche de la skill
        let skillRec: Skill | null = await prisma.skill.findFirst({
          where: { name: sk.name },
        });

        if (!skillRec) {
          // Création catégorie "Others" si manquante
          let otherCat: SkillCategory | null = await prisma.skillCategory.findFirst({
            where: { categoryEN: "Others" },
          });
          if (!otherCat) {
            otherCat = await prisma.skillCategory.create({
              data: { categoryEN: "Others", categoryFR: "Autres" },
            });
          }

          // Création de la skill
          skillRec = await prisma.skill.create({
            data: {
              name: sk.name,
              image: sk.image,
              categoryId: otherCat.id,
            },
          });
          console.log(`ℹ️ Created missing skill: ${sk.name}`);
        }

        // Création lien project–skill
        await prisma.projectSkill.create({
          data: {
            projectId: projRec.id,
            skillId: skillRec.id,
          },
        });
      }
    }

    // Seed des educations
    for (const edu of educationsData as EducationData[]) {
      await prisma.education.create({
        data: {
          titleFR: edu.titleFR,
          titleEN: edu.titleEN,
          diplomaLevelEN: edu.diplomaLevelEN,
          diplomaLevelFR: edu.diplomaLevelFR,
          school: edu.school,
          location: edu.location,
          year: edu.year,
          startDateEN: edu.startDateEN,
          startDateFR: edu.startDateFR,
          endDateEN: edu.endDateEN,
          endDateFR: edu.endDateFR,
          month: edu.month !== undefined ? Number(edu.month) : 0,
          typeEN: edu.typeEN,
          typeFR: edu.typeFR,
        },
      });
    }

    // Seed des experiences
    for (const exp of experiencesData as ExperienceData[]) {
      await prisma.experience.create({
        data: {
          jobEN: exp.jobEN,
          jobFR: exp.jobFR,
          business: exp.business,
          employmentContractEN: exp.employmentContractEN,
          employmentContractFR: exp.employmentContractFR,
          startDateEN: exp.startDateEN,
          startDateFR: exp.startDateFR,
          endDateEN: exp.endDateEN,
          endDateFR: exp.endDateFR,
          month: exp.month !== undefined ? Number(exp.month) : 0,
          typeEN: exp.typeEN,
          typeFR: exp.typeFR,
        },
      });
    }

    console.log("✅ Database seeded successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error seeding database:", error.message);
    } else {
      console.error("❌ Unknown error seeding database:", error);
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Exécution
seed().catch((e: unknown) => {
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
  rl.close();
});