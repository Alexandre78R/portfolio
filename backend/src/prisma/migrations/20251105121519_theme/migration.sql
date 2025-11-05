-- CreateTable
CREATE TABLE `themes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `themes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
