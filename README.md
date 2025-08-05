# Car Hire - Application de Location de Voitures

Une application web complète pour la gestion de location de voitures, développée avec Node.js et React.

## 🚗 Fonctionnalités

- **Authentification des utilisateurs** (inscription/connexion)
- **Gestion des voitures** (ajout, modification, suppression)
- **Système de réservation** en ligne
- **Interface d'administration** pour la gestion
- **Profils utilisateurs** personnalisés
- **Système de messages/contact**

## 🏗️ Architecture du Projet

Le projet est structuré en deux parties principales :

### Backend (`/back-end`)
- **Framework** : Node.js avec Express
- **Base de données** : MongoDB (avec Mongoose)
- **Authentification** : JWT (JSON Web Tokens)
- **Architecture** : MVC (Model-View-Controller)

### Frontend (`/front-end`)
- **Framework** : React avec Vite
- **Gestion d'état** : Redux Toolkit
- **Styling** : CSS moderne
- **Routing** : React Router

## 📦 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn
- MongoDB

### Installation du Backend
```bash
cd back-end
npm install
```

### Installation du Frontend
```bash
cd front-end
npm install
```

## 🚀 Démarrage

### Démarrer le serveur backend
```bash
cd back-end
npm start
```

### Démarrer l'application frontend
```bash
cd front-end
npm run dev
```

## 📂 Structure du Projet

```
car-hire/
├── back-end/
│   ├── config/          # Configuration de la base de données
│   ├── controllers/     # Contrôleurs de l'API
│   ├── middlewares/     # Middlewares (auth, roles)
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes de l'API
│   ├── services/        # Services métier
│   └── utils/           # Utilitaires
└── front-end/
    ├── src/
    │   ├── app/         # Configuration Redux
    │   ├── components/  # Composants réutilisables
    │   ├── pages/       # Pages de l'application
    │   └── utils/       # Utilitaires frontend
    └── public/          # Fichiers statiques
```

## 🔧 Configuration

1. Créez un fichier `.env` dans le dossier `back-end` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-hire
JWT_SECRET=votre_jwt_secret_ici
JWT_EXPIRE=7d
```

2. Configurez votre base de données MongoDB
3. Démarrez les deux serveurs (backend et frontend)

## 🛠️ Technologies Utilisées

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT pour l'authentification
- bcryptjs pour le hashage des mots de passe

### Frontend
- React 18
- Redux Toolkit
- React Router
- Vite (bundler)
- CSS moderne

## 👥 Fonctionnalités Utilisateur

- **Clients** : Peuvent parcourir les voitures, faire des réservations, gérer leur profil
- **Administrateurs** : Gestion complète des voitures, utilisateurs, réservations et messages

## 📱 Pages Disponibles

- **Accueil** : Présentation du service
- **Voitures** : Catalogue des véhicules disponibles
- **À propos** : Informations sur l'entreprise
- **Contact** : Formulaire de contact
- **Connexion/Inscription** : Authentification des utilisateurs
- **Réservation** : Processus de réservation
- **Admin Dashboard** : Interface d'administration

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**[Votre Nom]** - *Développeur Full Stack*

## 📞 Support

Pour toute question ou support, veuillez ouvrir une issue dans ce dépôt.
