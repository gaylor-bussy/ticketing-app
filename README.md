# Ticketing App

Application web de gestion de tickets développée avec **React**, **Node.js**, **Express** et **MySQL**.

Elle permet à différents utilisateurs (Utilisateur, Formateur, Manager et Technicien) de gérer des demande de réparations, de sa création jusqu'à sa validation.

---

# Fonctionnalités

## Utilisateur

- Créer une demande
- Consulter ses demandes
- Suivre leur état d'avancement

## Formateur

- Créer une demande
- Consulter les demandes
- Se positionner sur une demande
- Modifier la priorité
- Accéder à la messagerie

## Manager

- Créer une demande
- Consulter toutes les demandes
- Modifier la priorité
- Accepter ou refuser un positionnement
- Valider la réalisation d'une demande
- Accéder à la messagerie

## Technicien

- Créer une demande
- Consulter les demandes qui lui sont attribuées
- Accéder à la messagerie
- Suivre l'avancement de ses interventions

---

# Technologies utilisées

- PHP : 8.2.12
- React 18.react.dev
- xamp : v3.3.0
- Vite
- Tailwind CSS
- DaisyUI
- Node.js :v24.16.0
- Express :v11.17.0
- mysql :10.4.32-MariaDB
- JSON Web Token (JWT)

---

# Installation

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :

- xamp : v3.3.0
- Node.js
- npm
- MySQL

---

## Récupérer le projet

Clonez le dépôt GitHub :

```bash
git clone https://github.com/gaylor-bussy/ticketing-app.git
```

Ou téléchargez le projet au format **ZIP** depuis GitHub, puis décompressez-le.

---

## Base de données

Créez une base de données nommée :

```sql
ticketing
```

Importez ensuite le fichier SQL fourni avec le projet.

---

## Lancer l'application

**double-cliquer sur** :

```text
start.bat
```

Le script effectue automatiquement les opérations suivantes :

- Vérifie que Node.js est installé.
- Installe les dépendances du backend.
- Installe les dépendances du frontend.
- Crée le fichier `.env` si nécessaire.
- Lance le backend.
- Lance le frontend.
- Ouvre automatiquement l'application dans le navigateur.

---

# Accès à l'application

Frontend :

```text
http://localhost:5173
```

Backend :

```text
http://localhost:3000
```

---

# Structure du projet

```text
ticketing-app/
│
├── backend/
├── frontend/
├── database/
│   └── ticketing.sql
├── start.bat
└── README.md
```

---
