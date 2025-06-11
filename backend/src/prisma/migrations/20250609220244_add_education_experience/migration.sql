-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `descriptionEN` TEXT NOT NULL,
    `descriptionFR` TEXT NOT NULL,
    `typeDisplay` VARCHAR(191) NOT NULL,
    `github` VARCHAR(191) NULL,
    `contentDisplay` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryEN` VARCHAR(191) NOT NULL,
    `categoryFR` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectSkill` (
    `projectId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`projectId`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titleFR` VARCHAR(191) NOT NULL,
    `titleEN` VARCHAR(191) NOT NULL,
    `diplomaLevelEN` VARCHAR(191) NOT NULL,
    `diplomaLevelFR` VARCHAR(191) NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `startDateEN` VARCHAR(191) NOT NULL,
    `startDateFR` VARCHAR(191) NOT NULL,
    `endDateEN` VARCHAR(191) NOT NULL,
    `endDateFR` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `typeEN` VARCHAR(191) NOT NULL,
    `typeFR` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobEN` VARCHAR(191) NOT NULL,
    `jobFR` VARCHAR(191) NOT NULL,
    `business` VARCHAR(191) NOT NULL,
    `employmentContractEN` VARCHAR(191) NOT NULL,
    `employmentContractFR` VARCHAR(191) NOT NULL,
    `startDateEN` VARCHAR(191) NOT NULL,
    `startDateFR` VARCHAR(191) NOT NULL,
    `endDateEN` VARCHAR(191) NOT NULL,
    `endDateFR` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `typeEN` VARCHAR(191) NOT NULL,
    `typeFR` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Skill` ADD CONSTRAINT `Skill_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `SkillCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSkill` ADD CONSTRAINT `ProjectSkill_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSkill` ADD CONSTRAINT `ProjectSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
