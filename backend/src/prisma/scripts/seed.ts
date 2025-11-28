import {
  PrismaClient,
  SkillCategory,
  Skill,
  Project,
  Theme,
  SkillCategorySkill,
  Social,
} from "@prisma/client";
import readline from "readline";

import { projectsData } from "../seed/projectsData";
import { skillsData } from "../seed/skillsData";
import { experiencesData } from "../seed/experiencesData";
import { educationsData } from "../seed/educationsData";
import { themesData } from "../seed/themesData";
import { socialsData } from "../seed/socialsData";

import type {
  SkillCategoryData,
  SkillData,
  ProjectData,
  EducationData,
  ExperienceData,
} from "../../types/seed.types";

// Prisma client
const prisma: PrismaClient = new PrismaClient();

// Readline interface
const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask helper
const ask = (q: string): Promise<string> =>
  new Promise<string>((resolve) => rl.question(q, resolve));

/* =========================
 * Theme mapping
 * ========================= */

type ThemeSeedInput = Omit<Theme, "id">;

const mapThemeToPrisma = (
  theme: typeof themesData[keyof typeof themesData]
): ThemeSeedInput => ({
  name: theme.name,
  nameEN: theme.nameEN,
  nameFR: theme.nameFR,
  body: theme.colors.body,
  scrollHandle: theme.colors.scrollHandle,
  scrollHandleHover: theme.colors.scrollHandleHover,
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  success: theme.colors.success,
  error: theme.colors.error,
  warn: theme.colors.warn,
  info: theme.colors.info,
  grey: theme.colors.grey,
  placeholder: theme.colors.placeholder,
  footer: theme.colors.footer,
  admin: theme.colors.admin,

  textDefault: theme.colors.text.default,
  text100: theme.colors.text[100],
  text200: theme.colors.text[200],
  text300: theme.colors.text[300],
  textButton: theme.colors.text.button,

  visible: theme.colors.visible,
});

/* =========================
 * Seed function
 * ========================= */

async function seed(): Promise<void> {
  const answer: string = await ask(
    "⚠️  This will reset and seed your database. Are you sure? (y/n): "
  );

  if (answer.toLowerCase() !== "y") {
    console.log("❌ Seed cancelled.");
    rl.close();
    return;
  }

  console.log("⏳ Seeding database...");

  try {
    /* =========================
     * Cleanup
     * ========================= */

    await prisma.projectSkill.deleteMany();
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.skillCategory.deleteMany();
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.user.deleteMany();
    await prisma.theme.deleteMany();
    await prisma.social.deleteMany();

    /* =========================
     * Themes
     * ========================= */

    for (const key of Object.keys(themesData) as (keyof typeof themesData)[]) {
      const themeData = themesData[key];

      const createdTheme: Theme = await prisma.theme.create({
        data: mapThemeToPrisma(themeData),
      });

      console.log(`🎨 Theme seeded: ${createdTheme.name}`);
    }

    /* =========================
     * Skills and Categories
     * ========================= */

    for (const cat of skillsData as SkillCategoryData[]) {
      const catRec: SkillCategory = await prisma.skillCategory.create({
        data: {
          categoryEN: cat.categoryEN,
          categoryFR: cat.categoryFR,
        },
      });

      for (const sk of cat.skills as SkillData[]) {
        const skillRec: Skill = await prisma.skill.create({
          data: {
            name: sk.name,
            image: sk.image,
          },
        });

        // Create junction table record to link skill to category
        await prisma.skillCategorySkill.create({
          data: {
            categoryId: catRec.id,
            skillId: skillRec.id,
          },
        });
      }
    }

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
        let skillRec: Skill | null = await prisma.skill.findFirst({
          where: { name: sk.name },
        });

        if (!skillRec) {
          skillRec = await prisma.skill.create({
            data: {
              name: sk.name,
              image: sk.image,
            },
          });

          // Link to "Others" category
          let otherCat: SkillCategory | null =
            await prisma.skillCategory.findFirst({
              where: { categoryEN: "Others" },
            });

          if (!otherCat) {
            otherCat = await prisma.skillCategory.create({
              data: { categoryEN: "Others", categoryFR: "Autres" },
            });
          }

          await prisma.skillCategorySkill.create({
            data: {
              categoryId: otherCat.id,
              skillId: skillRec.id,
            },
          });

          console.log(`ℹ️ Created missing skill: ${sk.name}`);
        }

        await prisma.projectSkill.create({
          data: {
            projectId: projRec.id,
            skillId: skillRec.id,
          },
        });
      }
    }

    /* =========================
     * Educations
     * ========================= */

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

    /* =========================
     * Experiences
     * ========================= */

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

    /* =========================
     * Socials
     * ========================= */

    for (const social of socialsData) {
      const createdSocial: Social = await prisma.social.create({
        data: {
          title: social.title,
          url: social.url,
          tab: social.tab,
        },
      });
      console.log(`🔗 Social seeded: ${createdSocial.title}`);
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

seed().catch((e: unknown) => {
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(e);
  }
  rl.close();
});