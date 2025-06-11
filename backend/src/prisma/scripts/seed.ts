import { PrismaClient } from '@prisma/client';
import readline from 'readline';
import { projectsData } from '../seed/projectsData';
import { skillsData } from '../seed/skillsData';
import { experiencesData } from '../seed/experiencesData';
import { educationsData } from '../seed/educationsData';

const prisma = new PrismaClient();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>(r => rl.question(q, r));

async function seed() {
  const answer = await ask("⚠️  This will reset and seed your database. Are you sure? (y/n): ");
  if (answer.toLowerCase() !== 'y') {
    console.log("❌ Seed cancelled.");
    rl.close();
    return;
  }
  console.log("⏳ Seeding database...");

  // Vide les tables pivot et principales
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  // Vide education et experience
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.user.deleteMany();

  // 1) Seed des catégories et des skills déclarés
  for (const cat of skillsData) {
    const catRec = await prisma.skillCategory.create({
      data: { categoryEN: cat.categoryEN, categoryFR: cat.categoryFR }
    });
    for (const sk of cat.skills) {
      await prisma.skill.create({
        data: {
          name: sk.name,
          image: sk.image,
          categoryId: catRec.id
        }
      });
    }
  }

  // 2) Seed des projects et création des liens project–skill
  for (const proj of projectsData) {
    const projRec = await prisma.project.create({
      data: {
        title: proj.title,
        descriptionEN: proj.descriptionEN,
        descriptionFR: proj.descriptionFR,
        typeDisplay: proj.typeDisplay,
        github: proj.github ?? null,
        contentDisplay: proj.contentDisplay,
      }
    });

    for (const sk of proj.skills) {
      // Recherche de la skill par nom
      let skillRec = await prisma.skill.findFirst({
        where: { name: sk.name }
      });

      if (!skillRec) {
        // Création de la catégorie "Others" si nécessaire
        let otherCat = await prisma.skillCategory.findFirst({
          where: { categoryEN: "Others" }
        });
        if (!otherCat) {
          otherCat = await prisma.skillCategory.create({
            data: { categoryEN: "Others", categoryFR: "Autres" }
          });
        }

        // Création de la skill manquante
        skillRec = await prisma.skill.create({
          data: {
            name: sk.name,
            image: sk.image,
            categoryId: otherCat.id
          }
        });
        console.log(`ℹ️ Created missing skill: ${sk.name}`);
      }

      // Création du lien project–skill
      await prisma.projectSkill.create({
        data: {
          projectId: projRec.id,
          skillId: skillRec.id
        }
      });
    }
  }

  // 3) Seed des educations
  for (const edu of educationsData) {
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
        month: edu.month,
        typeEN: edu.typeEN,
        typeFR: edu.typeFR,
      }
    });
  }

  // 4) Seed des experiences
  for (const exp of experiencesData) {
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
        month: exp.month,
        typeEN: exp.typeEN,
        typeFR: exp.typeFR,
      }
    });
  }

  console.log("✅ Database seeded successfully.");
  rl.close();
}

seed().catch(e => {
  console.error(e);
  rl.close();
});