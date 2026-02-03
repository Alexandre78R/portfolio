# 🚀 Portfolio Full-Stack

Portfolio professionnel développé avec **Next.js**, **TypeScript**, **GraphQL**, **Apollo**, **Node.js** et **MySQL**.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Tests](#-tests)
- [Structure du projet](#-structure-du-projet)
- [API GraphQL](#-api-graphql)
- [Déploiement](#-déploiement)

---

## ✨ Fonctionnalités

### 🌐 Frontend Public
- **Portfolio interactif** avec animations et thèmes personnalisables
- **Terminal intégré** pour une navigation originale
- **Support multilingue** (Français / Anglais)
- **Mode sombre/clair** automatique ou manuel
- **Section À propos** : Présentation personnelle dynamique
- **Projets** : Galerie de projets avec images, vidéos et détails techniques
- **Expériences** : Timeline des expériences professionnelles
- **Éducation** : Parcours académique
- **Compétences** : Compétences techniques organisées par catégorie
- **Contact** : Formulaire de contact avec captcha Google reCAPTCHA
- **Livre d'or** : Système de signatures avec validation admin
- **Téléchargement CV** : CV disponible

### 🔐 Panel d'Administration
- **Authentification sécurisée** avec JWT
- **Gestion des utilisateurs** : Création, modification, suppression avec rôles (Admin/User)
- **Gestion du contenu** :
  - Projets (avec upload d'images/vidéos)
  - Expériences
  - Éducation
  - Compétences et catégories e compétence
  - À propos
  - Thèmes personnalisés
  - Messages de contact
  - Signatures email
  - Traduction FR / EN par json  
- **Dashboard** : Statistiques en temps réel
  - Nombre total d'utilisateurs, projets, expériences, éducations
  - Répartition des rôles utilisateurs
  - Top 5 des compétences les plus utilisées
- **Sauvegarde/Restauration** : Backup automatique de la base de données
- **Upload de CV** : Gestion des CV 
- **Validation** : M

### 🛠️ Fonctionnalités Techniques
- **API GraphQL** avec Apollo Server
- **Upload de fichiers** (images, vidéos, PDF) jusqu'à 100MB
- **Authentification JWT** avec refresh tokens
- **Rate limiting** sur les endpoints sensibles
- **Validation côté serveur** avec class-validator
- **Tests unitaires et d'intégration** (Jest + React Testing Library)
- **TypeScript strict** pour le typage fort
- **ORM Prisma** pour la gestion de la base de données Mysql 
- **Docker** pour le déploiement
- **Middleware de sécurité** (CORS, helmet, DOc etc.)
- **REST** Quelques routes get  

---

## 🛠️ Technologies

### Frontend
- **Next.js 15** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Apollo Client** - Client GraphQL
- **Apollo Client upload** - Client GraphQL pour upload les fichiers
- **TailwindCSS** - Framework CSS utility-first
- **Redux Toolkit** - Gestion d'état
- **Framer Motion** - Animations
- **React Hook Form** - Gestion de formulaires
- **Jest & React Testing Library** - Tests
- **Codegen**
- **MUI** - Bibliothèque de composants React

### Backend
- **Node.js** - Environnement d'exécution
- **Express** - Framework web
- **TypeGraphQL** - Framework GraphQL avec TypeScript
- **Apollo Server** - Serveur GraphQL
- **Prisma** - ORM pour MySQL
- **MySQL 8** - Base de données relationnelle
- **JWT** - Authentification
- **Nodemailer** - Envoi d'emails
- **Multer** - Upload de fichiers
- **Jest** - Tests
- **Codegen**

### DevOps
- **Docker & Docker Compose** - Containerisation
- **GitHub Actions** - CI/CD
- **Ngnix** - Gestionnaire de processus Node.js
- **Caddy** - Gestionnaire de processus Node.js
---

## 📦 Prérequis

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Docker** et **Docker Compose** (pour le déploiement)
- **MySQL 8** (si exécution locale sans Docker)
- **Git**

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Alexandre78R/portfolio.git
cd portfolio
```

### 2. Installer les dépendances

#### Avec npm :
```bash
# Racine du projet
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..
```

#### Avec yarn :
```bash
# Racine du projet
yarn install

# Frontend
cd frontend
yarn install
cd ..

# Backend
cd backend
yarn install
cd ..
```

---

## ⚙️ Configuration

### 1. Variables d'environnement

#### **Racine du projet** (`.env`)

Copier le fichier d'exemple :
```bash
cp .env.sample .env
```

Configurer les variables :
```env
# API Configuration
NEXT_PUBLIC_API_TOKEN="votre_token_api"
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"

# JWT Secrets
JWT_SECRET="votre_secret_jwt_super_securise_minimum_32_caracteres"
NEXT_PUBLIC_JWT_SECRET="votre_secret_jwt_super_securise_minimum_32_caracteres"

# Environment
NODE_ENV="development"
```

#### **Backend** (`backend/.env`)

```bash
cd backend
cp .env.sample .env
```

Configurer :
```env
# Database
DATABASE_URL="mysql://root:root@localhost:3307/portfolio"

# JWT
JWT_SECRET="votre_secret_jwt_super_securise_minimum_32_caracteres"

# Email (Nodemailer)
EMAIL_USER="votre_email@gmail.com"
EMAIL_PASS="votre_mot_de_passe_app"
EMAIL_FROM="Portfolio <noreply@portfolio.com>"
EMAIL_TO="email_destination@gmail.com"

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY="votre_cle_secrete_recaptcha"

# Server
PORT=4000
NODE_ENV="development"

# Upload
MAX_FILE_SIZE=104857600  # 100MB en bytes
```

#### **Frontend** (`frontend/.env.local`)

```bash
cd frontend
cp .env.local.sample .env.local
```

Configurer :
```env
# API
NEXT_PUBLIC_API_URL="http://localhost:4000/graphql"

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="votre_cle_site_recaptcha"

# Environment
NODE_ENV="development"
```

---

## 🎯 Démarrage

### Option 1 : Avec Docker (Recommandé)

#### Démarrage complet :
```bash
# Construire et démarrer tous les services
docker-compose up --build

# En mode détaché (background)
docker-compose up -d --build
```

#### Arrêter les services :
```bash
docker-compose down

# Avec suppression des volumes
docker-compose down -v
```

**Accès :**
- Frontend : [http://localhost:3000](http://localhost:3000)
- Backend GraphQL : [http://localhost:4000/graphql](http://localhost:4000/graphql)
- Admin : [http://localhost:3000/admin/auth/login](http://localhost:3000/admin/auth/login)

---

### Option 2 : Développement local (sans Docker)

#### 1. Démarrer MySQL

```bash
# Avec Docker
docker run -d \
  --name portfolio-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=portfolio \
  -p 3307:3306 \
  mysql:8.0

# Ou utiliser votre installation locale MySQL
```

#### 2. Initialiser la base de données (Backend)

```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# Optionnel : Seed de données
npm run seed
```

#### 3. Démarrer le Backend

```bash
cd backend

# Mode développement avec hot-reload
npm run dev

# Mode production
npm run build
npm start
```

Backend disponible sur : [http://localhost:4000/graphql](http://localhost:4000/graphql)

#### 4. Démarrer le Frontend

```bash
cd frontend

# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

Frontend disponible sur : [http://localhost:3000](http://localhost:3000)

---

## 🧪 Tests

### Frontend

```bash
cd frontend

# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch

# Tests spécifiques
npm test -- __test__/components/Terminal.test.tsx
```

### Backend

```bash
cd backend

# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests spécifiques
npm test -- tests/resolvers/user.resolver.test.ts
```

**Statistiques des tests :**
- Frontend : 177 suites de tests / 1217 tests
- Backend : Tests d'intégration GraphQL

---

## 📁 Structure du projet

```
portfolio/
├── backend/                    # API GraphQL Node.js
│   ├── src/
│   │   ├── entities/          # Entités Prisma/TypeGraphQL
│   │   ├── resolvers/         # Resolvers GraphQL
│   │   ├── middlewares/       # Middlewares Express
│   │   ├── lib/               # Utilitaires
│   │   ├── mail/              # Templates emails
│   │   ├── prisma/            # Schema et migrations Prisma
│   │   └── index.ts           # Point d'entrée
│   ├── uploads/               # Fichiers uploadés
│   ├── backups/               # Sauvegardes DB
│   ├── doc/cv/                # CV en PDF
│   ├── tests/                 # Tests backend
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Application Next.js
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── AdminLayout/   # Panel admin
│   │   │   └── Terminal/      # Terminal intégré
│   │   ├── pages/             # Pages Next.js
│   │   │   ├── admin/         # Routes admin
│   │   │   └── index.tsx      # Page d'accueil
│   │   ├── context/           # Contextes React
│   │   ├── store/             # Redux store
│   │   ├── utils/             # Utilitaires
│   │   │   └── hooks/         # Hooks personnalisés
│   │   ├── requetes/          # Queries/Mutations GraphQL
│   │   ├── lang/              # Traductions (FR/EN)
│   │   └── styles/            # Styles globaux
│   ├── public/                # Assets statiques
│   ├── __test__/              # Tests frontend
│   ├── Dockerfile
│   ├── next.config.mjs
│   └── package.json
│
├── deployment/                 # Scripts de déploiement
│   ├── dev/
│   └── main/
├── docker-compose.yml         # Configuration Docker
├── .env.sample                # Exemple variables d'env
└── README.md
```

---

## 🔌 API GraphQL

### Endpoint
```
http://localhost:4000/graphql
```

### Authentification

Les requêtes protégées nécessitent un token JWT dans le header :
```http
Authorization: Bearer <votre_token_jwt>
```

### Exemples de requêtes

#### **Login**
```graphql
mutation Login {
  login(data: { email: "admin@example.com", password: "password" }) {
    token
    message
    code
  }
}
```

#### **Récupérer les projets**
```graphql
query GetProjects {
  listProjects {
    projects {
      id
      title
      description
      githubLink
      link
      images
      createdAt
    }
    message
    code
  }
}
```

#### **Créer un projet (Admin)**
```graphql
mutation CreateProject {
  createProject(data: {
    title: "Mon Projet"
    description: "Description du projet"
    githubLink: "https://github.com/user/repo"
    skillsIds: [1, 2, 3]
  }) {
    project { id title }
    message
    code
  }
}
```

#### **Upload d'image (Admin)**
```graphql
mutation UploadProjectMedia($file: Upload!) {
  uploadProjectMedia(projectId: 1, file: $file, type: "image") {
    url
    message
    code
  }
}
```

### Documentation complète

Accéder au **GraphQL Playground** :
```
http://localhost:4000/graphql
```

---

## 📝 Gestion des utilisateurs

### Créer le premier utilisateur admin


## 🌍 Déploiement

### Avec Docker Compose (Production)

```bash
# Construire et démarrer
docker-compose -f docker-compose.yml up -d --build

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart frontend
docker-compose restart backend
```

### Variables d'environnement en production

Modifier `.env` avec :
```env
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://votre-domaine.com/graphql"
DATABASE_URL="mysql://user:pass@db-host:3306/portfolio"
```

### Scripts de déploiement automatique

```bash
# Déploiement dev
cd deployment/dev
./fetch-and-deploy-dev.sh

# Déploiement production
cd deployment/main
./fetch-and-deploy-main.sh
```

---


### Port déjà utilisé

```bash
# Trouver le processus sur le port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Problème d'upload de fichiers

Vérifier dans `backend/.env` :
```env
MAX_FILE_SIZE=104857600  # 100MB
```

Et dans `frontend/next.config.mjs` :
```javascript
serverActions: {
  bodySizeLimit: '100mb'
}
```

### Erreur de migration Prisma

```bash
cd backend

# Reset de la base de données
npx prisma migrate reset

# Recréer les migrations
npx prisma migrate dev
```

---


## 👨‍💻 Auteur

**Alexandre78R**

- GitHub: [@Alexandre78R](https://github.com/Alexandre78R)
- Portfolio: [alexandre-renard.com](https://alexandre-renard.dev)
