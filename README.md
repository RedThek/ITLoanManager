# 📦 IT Loan Manager (Gestionnaire de Prêt de Matériel IT)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

IT Loan Manager est une application web full-stack moderne conçue pour numériser l'inventaire et automatiser les flux d'emprunt et de restitution du matériel coûteux au sein du laboratoire d'informatique. Ce Minimum Viable Product (MVP) remplace la gestion papier sujette aux pertes et aux conflits par un flux d'approbation numérique fluide.

🔗 **Lien du projet en production :** [https://it-loan-manager.vercel.app](https://it-loan-manager.vercel.app)

---

## 📑 Table des Matières

- [📦 IT Loan Manager (Gestionnaire de Prêt de Matériel IT)](#-it-loan-manager-gestionnaire-de-prêt-de-matériel-it)
  - [📑 Table des Matières](#-table-des-matières)
  - [🎯 À propos du projet](#-à-propos-du-projet)
  - [🛠 Architecture et Technologies](#-architecture-et-technologies)
    - [Front-End (Interface Utilisateur)](#front-end-interface-utilisateur)
    - [Back-End (Logique Métier \& API)](#back-end-logique-métier--api)
  - [⚙️ Prérequis](#️-prérequis)
  - [🚀 Installation et Lancement (Local)](#-installation-et-lancement-local)
    - [1. Cloner le dépôt](#1-cloner-le-dépôt)
  - [🔐 Configuration de l'Environnement](#-configuration-de-lenvironnement)
  - [🛣️ Routes API](#️-routes-api)
    - [Auth (`/api/auth`)](#auth-apiauth)
    - [Équipements (`/api/equipments`)](#équipements-apiequipments)
    - [Prêts (`/api/loans`)](#prêts-apiloans)
    - [Administration (`/api/admin`)](#administration-apiadmin)
    - [Notifications (`/api/notifications`)](#notifications-apinotifications)
  - [Example de Requestes avec Postman ou ThunderClient](#example-de-requestes-avec-postman-ou-thunderclient)
  - [📂 Structure du Projet](#-structure-du-projet)
  - [🛡 Sécurité et Modélisation](#-sécurité-et-modélisation)
  - [🌍 Déploiement et CI/CD](#-déploiement-et-cicd)

---

## 🎯 À propos du projet

L'application propose deux parcours utilisateurs cloisonnés :

- **👩‍🎓 Espace Étudiant :** Consultation du catalogue en temps réel, vérification de la disponibilité, et soumission de demandes d'emprunt avec un matricule académique. Suivi du statut des demandes (En attente, Approuvée, Refusée).

- **👨‍💻 Espace Administrateur (Responsable Labo) :** Un tableau de bord divisé en deux onglets permettant la gestion complète du cycle de vie du matériel (CRUD sur l'inventaire) et l'arbitrage (approbation/rejet) des requêtes étudiantes.

---

## 🛠 Architecture et Technologies

Ce projet adopte une architecture logicielle séparée (Client/Serveur) respectant les principes **SOLID** et l'architecture **RESTful**.

### Front-End (Interface Utilisateur)

- **React.js & Vite :** Pour la construction d'une Single Page Application (SPA) ultra-rapide, modulaire, et dotée d'un routage dynamique (`react-router-dom`).

- **Axios :** Pour la communication asynchrone sécurisée avec l'API Back-End.

### Back-End (Logique Métier & API)

- **Node.js & Express.js :** Moteur d'exécution et framework minimaliste pour structurer les routes, contrôleurs, et intercepteurs (middlewares) HTTP.

- **Mongoose (ODM) :** Modélisation stricte des données avec schémas de validation et exécution des requêtes vers la base de données. L'architecture sépare l'inventaire physique des transactions de prêts.

---

## ⚙️ Prérequis

Avant de cloner le projet, assurez-vous d'avoir installé les outils suivants sur votre machine :

- **[Node.js](https://nodejs.org/en/download)** (v18 ou supérieur)

- **[NPM](https://www.npmjs.com/get-npm)**

- **[Git](https://www.git-scm.com)**

- **[MongoDB](http://www.xyz.com)**:
  - *Option locale :* Installez **MongoDB Community Server** pour héberger la base sur votre machine.
  - *Option Cloud :* Créez un cluster gratuit sur **MongoDB Atlas**.
  - *Outil indispensable :* **MongoDB Compass**, l'interface graphique (GUI) officielle pour visualiser vos collections et documents facilement.

---

## 🚀 Installation et Lancement (Local)

### 1. Cloner le dépôt

Si vous souhaitez contribuer, commencez par **Forker** le dépôt sur GitHub. Sinon, clonez-le directement:

- Cloner le dépôt localement

```bash
git clone https://github.com/RedThek/ITLoanManager.git
```

- Accéder au dossier du projet

```bash
cd itloanmanager
```

- Installation du Back-End

```bash
cd server
npm install
```

- Lancer le serveur de développement (port 5000)

```bash
npm run dev
```

- Installation du Front-End (Dans un nouveau terminal)

```bash
cd client
npm install
```

- Lancer le serveur de développement (port 5000)

```bash
npm run dev
```

## 🔐 Configuration de l'Environnement

Pour des raisons de sécurité, les identifiants et clés secrètes ne sont pas versionnés sur Git. Vous devez créer deux fichiers `.env` à la racine des dossiers `/server` et `/client`.

- Fichier `/server/.env`

```bash
PORT=5000
# Chaîne de connexion MongoDB (Local ou Atlas)
DATABASE_URL="mongodb://localhost:27017/gpmit"
# Clé secrète pour générer les signatures JWT (à générer aléatoirement)
JWT_SECRET="VOTRE_CLE_SECRETE_TRES_LONGUE_ICI"
```

- Fichier `/client/.env`

```bash
# URL de l'API Back-End (utile pour distinguer le local de la production)
VITE_API_URL="http://localhost:5000/api"
```

## 🛣️ Routes API

### Auth (`/api/auth`)

| Méthode | Route                     | Auth        | Description                       |
|---------|---------------------------|-------------|-----------------------------------|
| POST    | `/api/auth/register`      | ❌          | Créer un compte                   |
| POST    | `/api/auth/login`         | ❌          | Connexion (retourne JWT)          |
| POST    | `/api/auth/logout`        | ✅ JWT      | Déconnexion                       |
| POST    | `/api/auth/reset`         | ❌          | Réinitialisation mot de passe     |

### Équipements (`/api/equipments`)

| Méthode | Route                     | Auth        | Description                       |
|---------|---------------------------|-------------|-----------------------------------|
| GET     | `/api/equipments`         | ✅ JWT      | Lister tout le matériel           |
| POST    | `/api/equipments`         | ✅ ADMIN    | Créer un équipement               |

### Prêts (`/api/loans`)

| Méthode | Route                     | Auth        | Description                         |
|---------|---------------------------|-------------|-------------------------------------|
| GET     | `/api/loans`              | ✅ JWT      | Mes prêts (étudiant) / Tous (admin) |
| POST    | `/api/loans`              | ✅ STUDENT  | Soumettre une demande               |
| PATCH   | `/api/loans/:id/status`   | ✅ JWT      | Approuver / Refuser / Terminer      |
| GET     | `/api/loans/pending-count`| ✅ ADMIN    | Nombre de demandes en attente       |

### Administration (`/api/admin`)

| Méthode | Route                            | Auth        | Description                         |
|---------|----------------------------------|-------------|-------------------------------------|
| GET     | `/api/admin/users`               | ✅ ADMIN    | Lister les utilisateurs             |
| POST    | `/api/admin/users`               | ✅ ADMIN    | Créer étudiant ou admin             |
| PUT     | `/api/admin/users/:id`           | ✅ ADMIN    | Modifier un utilisateur             |
| DELETE  | `/api/admin/users/:id`           | ✅ ADMIN    | Supprimer un utilisateur            |
| PUT     | `/api/admin/equipments/:id`      | ✅ ADMIN    | Modifier un équipement              |
| DELETE  | `/api/admin/equipments/:id`      | ✅ ADMIN    | Supprimer un équipement             |
| GET     | `/api/admin/loans/overdue`       | ✅ ADMIN    | Prêts en retard                     |
| POST    | `/api/admin/loans/:loanId/alert` | ✅ ADMIN    | Envoyer alerte manuelle             |

### Notifications (`/api/notifications`)

| Méthode | Route                               | Auth        | Description                         |
|---------|-------------------------------------|-------------|-------------------------------------|
| GET     | `/api/notifications`                | ✅ JWT      | Toutes mes notifications            |
| GET     | `/api/notifications/unread-count`   | ✅ JWT      | Compteur non lus                    |
| PATCH   | `/api/notifications/:id/read`       | ✅ JWT      | Marquer comme lu                    |

## Example de Requestes avec Postman ou ThunderClient

## 📂 Structure du Projet

Le dépôt est un monorepo qui sépare strictement les responsabilités :

```bash
/itloanmanager
├── /client                 # Application Front-End (React)
│   ├── /public
│   ├── /src
│   │   ├── /assets
│   │   ├── /components     # Composants réutilisables (Cartes, Tableaux)
│   │   ├── /config
│   │   ├── /context        # État global (AuthContext)
│   │   ├── /hooks
│   │   ├── /pages          # Vues principales (Login, Dashboard)
│   │   └── /services       # Intercepteurs API Axios
│   │── App.jsx
│   │── main.jsx   
│   └── package.json
│
└── /server                 # Application Back-End (Node.js/Express)
    ├── /src
    │   ├── /config         # Connexion MongoDB
    │   ├── /controllers    # Logique de traitement des requêtes
    │   ├── /generated
    │   ├── /jobs
    │   ├── /middlewares    # Vérifications de sécurité (JWT, RBAC)
    │   ├── /models         # Schémas Mongoose (Equipment, Loan, User)
    │   ├── /repositories
    │   ├── /routes         # Définition des endpoints d'API
    │   ├── /scripts
    │   └── /services
    ├── /app.js
    └── package.json
```

## 🛡 Sécurité et Modélisation

La sécurité de cette application repose sur plusieurs piliers :

- **Cryptographie** : Les mots de passe des étudiants et administrateurs sont hachés avec Bcrypt avant toute persistance en base de données.

- **Authentification JWT** : Chaque connexion génère un JSON Web Token. Ce jeton est requis en en-tête (`Bearer Token`) pour interroger les routes protégées de l'API.

- **Contrôle d'Accès (RBAC)** : Un middleware spécifique valide le rôle (`ADMIN`) contenu dans le JWT avant d'autoriser toute opération critique de modification ou suppression (`PUT`, `DELETE`).

- **Cohérence Transactionnelle** : Côté backend, lorsqu'un administrateur valide une demande (PATCH `/api/loans/:id/status`), le contrôleur modifie consécutivement le statut du prêt et celui de l'équipement physique pour empêcher toute désynchronisation. Le back-end utilise la méthode Mongoose `populate('equipmentId')` pour lier les collections.

## 🌍 Déploiement et CI/CD

L'application intègre des workflows GitHub Actions pour l'Intégration et le Déploiement Continus (CI/CD). À chaque push sur la branche `main` :

1. **Front-End (Vercel)** : Vercel détecte automatiquement le changement via son intégration GitHub, compile le projet Vite, et déploie l'interface statique sur son réseau CDN mondial.

2. **Back-End (Render ou Railway)** : La plateforme PaaS télécharge le nouveau code, installe les modules Node.js de production, connecte la base MongoDB Atlas, et relance le serveur Express sans interruption de service.

*Fait avec ❤️ et JavaScript.*
