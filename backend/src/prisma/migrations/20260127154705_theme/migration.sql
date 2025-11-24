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
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

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
CREATE TABLE `SkillCategorySkill` (
    `categoryId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    INDEX `SkillCategorySkill_skillId_idx`(`skillId`),
    PRIMARY KEY (`categoryId`, `skillId`)
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

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'editor', 'view') NOT NULL DEFAULT 'view',
    `isPasswordChange` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `themes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `nameEN` VARCHAR(191) NOT NULL,
    `nameFR` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `scrollHandle` VARCHAR(191) NOT NULL,
    `scrollHandleHover` VARCHAR(191) NOT NULL,
    `primary` VARCHAR(191) NOT NULL,
    `secondary` VARCHAR(191) NOT NULL,
    `success` VARCHAR(191) NOT NULL,
    `error` VARCHAR(191) NOT NULL,
    `warn` VARCHAR(191) NOT NULL,
    `info` VARCHAR(191) NOT NULL,
    `grey` VARCHAR(191) NOT NULL,
    `placeholder` VARCHAR(191) NOT NULL,
    `footer` VARCHAR(191) NOT NULL,
    `admin` VARCHAR(191) NOT NULL,
    `textDefault` VARCHAR(191) NOT NULL,
    `text100` VARCHAR(191) NOT NULL,
    `text200` VARCHAR(191) NOT NULL,
    `text300` VARCHAR(191) NOT NULL,
    `textButton` VARCHAR(191) NOT NULL,
    `visible` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `themes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SkillCategorySkill` ADD CONSTRAINT `SkillCategorySkill_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `SkillCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillCategorySkill` ADD CONSTRAINT `SkillCategorySkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSkill` ADD CONSTRAINT `ProjectSkill_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectSkill` ADD CONSTRAINT `ProjectSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
