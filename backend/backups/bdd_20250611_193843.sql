/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for Linux (x86_64)
--
-- Host: host.docker.internal    Database: portfolio
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('3c58c8ac-d551-4898-98d1-aa4d53c01b5a','e041004077dd54df28c8b4277cb4782c0f87a09aa4e540f40e6a06484561ff07','2025-06-10 12:06:32.783','20250610120631_add_user_model',NULL,NULL,'2025-06-10 12:06:32.720',1),
('f747b402-4d40-44d6-94f5-6a7900ee360e','7f2e11ee6de60e0b34779f5ac5575247b781a6557f619e7082dcfdd7e8b8786e','2025-06-09 22:02:45.934','20250609220244_add_education_experience',NULL,NULL,'2025-06-09 22:02:44.992',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Education`
--

DROP TABLE IF EXISTS `Education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Education` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titleFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diplomaLevelEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `diplomaLevelFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `startDateEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDateFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDateEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDateFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` int NOT NULL,
  `typeEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Education`
--

LOCK TABLES `Education` WRITE;
/*!40000 ALTER TABLE `Education` DISABLE KEYS */;
INSERT INTO `Education` VALUES
(1,'Formation Développement web & mobile','Web & Mobile Development Training','Training','Formation','La Capsule Academy','Paris (75)',2019,'April 2019','Avril 2019','June 2019','Juin 2019',3,'Education','Éducation'),
(2,'Formation Développement web & web mobile','Web & Mobile Web Development Training','RNCP Level 5 (Associate Degree)','RNCP Level 5 (Bac +2)','Wild Code School','Paris (75)',2023,'February 2023','Février 2023','July 2023','Juillet 2023',5,'Education','Éducation'),
(3,'Alternance Concepteur Développeur d\'Applications','Apprenticeship Application Designer and Developer','RNCP Level 6 (Bachelor\'s/Master\'s degree equivalent)','RNCP Level 6 (Bac +3/4)','Wild Code School','Paris (75) (Remote)',2024,'September 2023','Septembre 2023','September 2024','Septembre 2024',12,'Education','Éducation');
/*!40000 ALTER TABLE `Education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Experience`
--

DROP TABLE IF EXISTS `Experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jobFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employmentContractEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employmentContractFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDateEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDateFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDateEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDateFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` int NOT NULL,
  `typeEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Experience`
--

LOCK TABLES `Experience` WRITE;
/*!40000 ALTER TABLE `Experience` DISABLE KEYS */;
INSERT INTO `Experience` VALUES
(1,'Teacher Assistant','Assistant pédagogique','La Capsule Academy','Internship','Stage','October 2019','Octobre 2019','December 2019','Décember 2019',3,'Experience','Expérience'),
(2,'JavaScript Developer','Développeur JavaScript','Cosy Business','Internship','Stage','January 2020','Janvier 2020','March 2020','Mars 2020',2,'Experience','Expérience'),
(3,'Teaching Assistant','Assistant d\'Enseignement','Wild Code School','Apprenticeship','Alternance','September 2023','Septembre 2023','September 2024','Septembre 2024',12,'Experience','Expérience');
/*!40000 ALTER TABLE `Experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Project`
--

DROP TABLE IF EXISTS `Project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionEN` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionFR` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `typeDisplay` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `github` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentDisplay` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Project`
--

LOCK TABLES `Project` WRITE;
/*!40000 ALTER TABLE `Project` DISABLE KEYS */;
INSERT INTO `Project` VALUES
(1,'Semantik','Semantik is an innovative SEO tool that allows you to identify the most frequently asked questions by internet users on Google. By simply entering your topic, you get a comprehensive list of these questions in one click. Use them to optimize the semantics of your content and meet SEO needs.','Semantik est un outil SEO qui vous permet d\'identifier les questions les plus posées par les internautes sur Google. En renseignant simplement votre thématique, vous obtenez en un clic une liste exhaustive de ces questions. Utilisez-les pour optimiser la sémantique de vos contenus et répondre aux besoins du SEO.','image',NULL,'Semantik.png'),
(2,'Fast News Application','Fast News is a mobile application that allows users to access a wide range of information and view it offline. We have developed a technology to capture full articles as compressed images.','Fast News  est une application mobile  qui permet d\'accéder à un large éventail d\'informations et de les consulter hors ligne. nous avons mis au point une technologie pour capturer les articles complets sous forme d\'images compressées.','video','https://github.com/thomassauveton/fastnews','fastNewsApplication.mp4'),
(3,'CV Hermione Granger','The creation of a small website themed around a fictional resume, highlighting the journey of the famous Hermione Granger at Hogwarts. The site creatively showcases Hermione Granger\'s academic journey, skills, and achievements in the magical world of Hogwarts.','La création d\'un petit site internet sur le thème d\'un CV fictif, mettant en lumière le parcours de la célèbre Hermione Granger à Poudlard.  Le site présente de manière imaginative le parcours scolaire, les compétences et les réalisations de Hermione Granger dans l\'univers magique de Poudlard.','video','https://github.com/Alexandre78R/CV-Hermione','hermione.mp4'),
(4,'NotesApp','NotesApp is a note-taking application with full authentication. An admin area is available to manage users. Users can log in, sign up, view notes, and benefit from password recovery and reset features.','NotesApp est une application de prise de notes avec une authentification complète. Espace de administrateur pour gérer les utilisateur, Les utilisateurs peuvent se connecter, s\'inscrire, consulter les notes, tout en bénéficiant de fonctionnalités de récupération et de réinitialisation du mot de passe.','image','https://github.com/Alexandre78R/NotesApp','NotesApp.png'),
(5,'Tchat','Tchat is a real-time chat application where users can send messages to each other instantly. The frontend is developed in React, while the backend uses Express and WebSocket to handle real-time communication.','Tchat est une application de chat en temps réel où les utilisateurs peuvent s\'envoyer des messages instantanément. Le frontend est développé en React, tandis que le backend utilise Express et WebSocket pour gérer la communication en temps réel.','image','https://github.com/Alexandre78R/tchat','Tchat.png'),
(6,'GuessWhat','GuessWhat is a quiz app that allows users to customize their player, choose their favorite themes, and set the number of questions as well as the time per question. GuessWhat offers personalized and flexible entertainment for quiz enthusiasts.','GuessWhat est une application de quiz qui permet aux utilisateurs de personnaliser leur joueur, de choisir leurs thèmes préférés, et de régler le nombre de questions ainsi que le temps par question. GuessWhat offre un divertissement personnalisé et flexible pour les passionnés de quiz.','video','https://github.com/Alexandre78R/Guess','guessWhatApp.mp4'),
(7,'Wonder Match','Wonder Match is an app for intrepid travelers, helping you choose your destination in a few simple steps: select desired continents, scroll through suggestions, then decide: Match or Pass. Explore activities, tourist sites, and selfie spots for perfectly planned vacations.','Wonder Match est une application pour les voyageurs intrépides, vous aide à choisir votre destination en quelques étapes simples : sélectionnez les continents désirés, faites défiler les suggestions, puis décidez : Match ou Pass. Explorez les activités, sites touristiques et spots pour selfies, pour des vacances parfaitement planifiées.','video','https://github.com/Alexandre78R/WonderMatch','wonderMatch.mp4'),
(8,'Makesense intranet','Makesense, founded in 2010, encourages sustainability and engagement through ecological and social projects. An intranet platform is needed to create, evaluate, and vote on projects. Administrators can manage users, posts, and roles, with decisions being made through a voting system based on the user\'s role.','Makesense, fondée en 2010, encourage la durabilité et l\'engagement à travers des projets écologiques et sociaux. Une plateforme intranet est nécessaire pour créer, évaluer et voter sur les projets. Les administrateurs peuvent gérer les utilisateurs, les publications et les rôles, les décisions étant prises par un système de vote basé sur le rôle de l\'utilisateur.','video','https://github.com/Alexandre78R/makesense-client','makesense.mp4'),
(9,'WildCodeHub','WildCodeHub is an online code development platform. Users can create, test, and share their code, with an intuitive interface and backup features. Social interactions are planned, and future developments will include support for new languages and real-time collaboration.','WildCodeHub est une plateforme de développement de code en ligne. Les utilisateurs peuvent créer, tester et partager leur code, avec une interface intuitive et des fonctionnalités de sauvegarde. Des interactions sociales sont prévues, et des évolutions incluront le support de nouveaux langages et la collaboration en temps réel.','video','https://github.com/WildCodeSchool/2309-wns-jaune-wild-code-hub','wildCodeHub.mp4'),
(10,'Portfolio','My Portfolio – A personal project built to showcase my background, skills, and projects. Developed with React, Next.js, and TypeScript on the frontend, and Express, GraphQL, and Prisma on the backend. Clean design with Tailwind CSS, for a site that reflects who I am: simple, clear, and efficient.','Mon Portfolio – Un projet personnel qui me permet de présenter mon parcours, mes compétences et mes projets. Conçu avec React, Next.js et TypeScript côté frontend, et un backend en Express, GraphQL et Prisma. Une interface soignée avec Tailwind, pour un site à mon image : simple, clair et efficace.','image','https://github.com/Alexandre78R/portfolio','Portfolio.png'),
(11,'DailyLog','DailyLog is a personal journaling application that allows users to record their daily moods and view related statistics. The main goal of this project is to practice and deepen Angular skills, while building a simple backend using Express, Prisma, and MySQL to manage the data.','DailyLog est une application de journal de bord personnel permettant d’enregistrer ses humeurs quotidiennes et de visualiser des statistiques associées. Le but principal de ce projet est de pratiquer et approfondir les compétences en Angular, tout en développant un backend simple avec Express, Prisma et MySQL pour gérer les données.','video','https://github.com/Alexandre78R/Project-DailyLog-Angular','dailyLog.mp4');
/*!40000 ALTER TABLE `Project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProjectSkill`
--

DROP TABLE IF EXISTS `ProjectSkill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProjectSkill` (
  `projectId` int NOT NULL,
  `skillId` int NOT NULL,
  PRIMARY KEY (`projectId`,`skillId`),
  KEY `ProjectSkill_skillId_fkey` (`skillId`),
  CONSTRAINT `ProjectSkill_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ProjectSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProjectSkill`
--

LOCK TABLES `ProjectSkill` WRITE;
/*!40000 ALTER TABLE `ProjectSkill` DISABLE KEYS */;
INSERT INTO `ProjectSkill` VALUES
(1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1),
(7,1),
(8,1),
(9,2),
(10,2),
(11,2),
(1,3),
(4,3),
(5,3),
(6,3),
(8,3),
(9,3),
(10,3),
(11,3),
(9,4),
(10,4),
(9,6),
(10,6),
(1,7),
(4,7),
(5,7),
(6,7),
(8,7),
(10,7),
(11,7),
(9,8),
(8,9),
(10,9),
(11,9),
(10,12),
(11,12),
(9,14),
(10,14),
(9,15),
(10,15),
(9,16),
(10,16),
(9,17),
(10,17),
(4,19),
(5,19),
(6,19),
(7,19),
(8,19),
(9,20),
(10,20),
(2,21),
(4,21),
(8,21),
(10,21),
(11,22),
(11,23),
(10,24),
(11,24),
(9,26),
(1,27),
(2,27),
(5,28),
(7,28),
(8,28),
(9,29),
(10,29),
(11,30),
(1,32),
(2,32),
(2,33),
(2,34),
(4,36),
(6,36),
(7,36),
(8,36),
(9,36),
(10,36),
(4,37),
(6,37),
(7,37),
(8,37),
(9,37),
(10,37),
(11,37),
(4,38),
(5,38),
(6,38),
(7,38),
(8,38),
(9,38),
(10,38),
(11,38),
(1,39),
(2,39),
(3,39),
(6,39),
(1,40),
(2,40),
(3,40),
(4,40),
(6,40);
/*!40000 ALTER TABLE `ProjectSkill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Skill`
--

DROP TABLE IF EXISTS `Skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Skill_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Skill_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `SkillCategory` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Skill`
--

LOCK TABLES `Skill` WRITE;
/*!40000 ALTER TABLE `Skill` DISABLE KEYS */;
INSERT INTO `Skill` VALUES
(1,'JavaScript','https://img.shields.io/badge/-JavaScript-efd81d?style=flat-square&logo=JavaScript&logoColor=white',1),
(2,'TypeScript','https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white',1),
(3,'Nodejs','https://img.shields.io/badge/-Nodejs-44883e?style=flat-square&logo=Node.js&logoColor=white',2),
(4,'Apollo GraphQL','https://img.shields.io/badge/-Apollo%20GraphQL-311C87?style=flat-square&logo=apollo-graphql&logoColor=white',2),
(5,'GraphQL','https://img.shields.io/badge/-GraphQL-E535AB?style=flat-square&logo=graphql&logoColor=white',2),
(6,'TypeGraphQL','https://img.shields.io/badge/-TypeGraphQL-5149B8?style=flat-square&logo=graphql&logoColor=white',2),
(7,'Express','https://img.shields.io/badge/-Express-000000?style=flat-square&logoColor=white',2),
(8,'PostgreSQL','https://img.shields.io/badge/-PostgreSQL-1D73DC?style=flat-square&logo=PostgreSQL&logoColor=white',3),
(9,'MySQL','https://img.shields.io/badge/-MySQL-F29111?style=flat-square&logo=MySQL&logoColor=white',3),
(10,'SQLite','https://img.shields.io/badge/-SQLite-1E8DBC?style=flat-square&logo=SQLite&logoColor=white',3),
(11,'MongoDB','https://img.shields.io/badge/-MongoDB-1DBA22?style=flat-square&logo=mongodb&logoColor=white',3),
(12,'Prisma','https://img.shields.io/badge/-Prisma-000000?style=flat-square&logo=Prisma&logoColor=white',3),
(13,'Knex.js','https://img.shields.io/badge/-Knex.js-E95602?style=flat-square&logo=Knex.js&logoColor=white',3),
(14,'Docker','https://img.shields.io/badge/-Docker-0db7ed?style=flat-square&logo=docker&logoColor=white',4),
(15,'Github Action','https://img.shields.io/badge/-Github%20Action-000000?style=flat-square&logo=github$&logoColor=white',4),
(16,'Caddy','https://img.shields.io/badge/-Caddy-26CFA7?style=flat-square&logo=caddy&logoColor=white',4),
(17,'Nginx','https://img.shields.io/badge/-Nginx-1EA718?style=flat-square&logo=nginx&logoColor=white',4),
(18,'Heroku','https://img.shields.io/badge/-Heroku-7B0FF5?style=flat-square&logo=heroku&logoColor=white',4),
(19,'React','https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white',5),
(20,'Next.js','https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white',5),
(21,'Redux','https://img.shields.io/badge/-Redux-8C1EB2?style=flat-square&logo=redux&logoColor=white',5),
(22,'Angular','https://img.shields.io/badge/-Angular-DD0031?style=flat-square&logo=angular&logoColor=white',5),
(23,'RxJS','https://img.shields.io/badge/-RxJS-B7178C?style=flat-square&logo=reactivex&logoColor=white',5),
(24,'Tailwind CSS','https://img.shields.io/badge/-Tailwind%20CSS-24CDCD?style=flat-square&logo=tailwindcss&logoColor=white',6),
(25,'MUI','https://img.shields.io/badge/-MUI-167FDC?style=flat-square&logo=mui&logoColor=white',6),
(26,'Chakra UI','https://img.shields.io/badge/-Chakra%20UI-36C5CA?style=flat-square&logo=chakra-ui&logoColor=white',6),
(27,'Bootstrap','https://img.shields.io/badge/-Bootstrap-a259ff?style=flat-square&logo=bootstrap&logoColor=white',6),
(28,'SASS','https://img.shields.io/badge/-SASS-CC69BF?style=flat-square&logo=sass&logoColor=white',6),
(29,'Jest','https://img.shields.io/badge/-Jest-FC958A?style=flat-square&logo=jest&logoColor=white',7),
(30,'Karma','https://img.shields.io/badge/-Karma-3A3A3A?style=flat-square&logo=karma&logoColor=white',7),
(31,'Cypress','https://img.shields.io/badge/-Cypress-1FC824?style=flat-square&logo=cypress&logoColor=white',7),
(32,'Puppeteer','https://img.shields.io/badge/-Puppeteer-1DB356?style=flat-square&logo=puppeteer&logoColor=white',7),
(33,'React Native','https://img.shields.io/badge/-React%20Native-45b8d8?style=flat-square&logo=react&logoColor=white',8),
(34,'Expo','https://img.shields.io/badge/Expo-000000?style=flat-square&logo=expo&logoColor=white',8),
(35,'NativeWind','https://img.shields.io/badge/NativeWind-45b8d8?style=flat-square&logo=react&logoColor=white',8),
(36,'Figma','https://img.shields.io/badge/-Figma-a259ff?style=flat-square&logo=Figma&logoColor=white',9),
(37,'Postman','https://img.shields.io/badge/-Postman-F66526?style=flat-square&logo=Postman&logoColor=white',9),
(38,'Git','https://img.shields.io/badge/-Git-F14E32?style=flat-square&logo=git&logoColor=white',9),
(39,'HTML5','https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',10),
(40,'CSS3','https://img.shields.io/badge/-CSS3-264de4?style=flat-square&logo=css3&logoColor=white',10);
/*!40000 ALTER TABLE `Skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SkillCategory`
--

DROP TABLE IF EXISTS `SkillCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `SkillCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryEN` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryFR` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SkillCategory`
--

LOCK TABLES `SkillCategory` WRITE;
/*!40000 ALTER TABLE `SkillCategory` DISABLE KEYS */;
INSERT INTO `SkillCategory` VALUES
(1,'Programming Languages','Langages de Programmation'),
(2,'Backend Development','Développement Backend'),
(3,'Database - Storage & Query','Base de données - Stockage et Requête'),
(4,'DevOps','DevOps'),
(5,'Frontend Frameworks & Libraries','Frameworks & Bibliothèques Frontend'),
(6,'UI Frameworks & Styling Tools','Frameworks UI & Outils de Style'),
(7,'Testing & Web Scraping','Tests & Scraping Web'),
(8,'Mobile App Development','Développement d\'Applications Mobiles'),
(9,'Tools','Outils'),
(10,'Markup & Styling Languages','Langages de Marquage & de Style');
/*!40000 ALTER TABLE `SkillCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','editor','view') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'view',
  `isPasswordChange` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 19:38:43
