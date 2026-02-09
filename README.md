# Application de Gestion de Tâches

Application Node.js complète avec backend Express et frontend HTML, incluant les 4 opérations CRUD (GET, POST, PUT, DELETE) et tests Jest.

## 📋 Fonctionnalités

- **GET** - Récupérer toutes les tâches ou une tâche spécifique
- **POST** - Créer une nouvelle tâche
- **PUT** - Mettre à jour une tâche existante
- **DELETE** - Supprimer une tâche

## 🚀 Installation

### Option 1 : Installation classique

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur :
```bash
npm start
```

3. Ouvrir http://localhost:3000

### Option 2 : Docker (recommandé)

#### Avec Docker :
```bash
# Construire l'image
docker build -t apptest .

# Lancer le conteneur
docker run -p 3000:3000 apptest
```

#### Avec Docker Compose :
```bash
# Construire et lancer
docker-compose up -d

# Arrêter
docker-compose down
```

## ▶️ Commandes

```bash
npm start       # Démarrer le serveur
npm run dev     # Mode développement (rechargement auto)
npm test        # Lancer les tests
```

## 🐳 Docker

### Commandes Docker utiles

```bash
# Construire l'image
docker build -t apptest .

# Lancer le conteneur
docker run -d -p 3000:3000 --name apptest-container apptest

# Voir les logs
docker logs apptest-container

# Arrêter le conteneur
docker stop apptest-container

# Supprimer le conteneur
docker rm apptest-container

# Supprimer l'image
docker rmi apptest
```

## 🧪 Tests

### Exécuter tous les tests
```bash
npm test
```

**14 tests passés avec succès ✅**
- Couverture de code : 98%

## 📁 Structure du projet

```
apptest/
├── server.js              # Serveur Express avec routes API
├── package.json           # Dépendances et scripts
├── Dockerfile            # Configuration Docker
├── docker-compose.yml    # Orchestration Docker
├── .dockerignore         # Fichiers exclus de l'image Docker
├── README.md             # Documentation
├── public/
│   └── index.html        # Interface utilisateur
└── tests/
    └── api.test.js       # Tests Jest pour l'API
```

## 🔌 API Endpoints

### GET /api/tasks
Récupère toutes les tâches

### GET /api/tasks/:id
Récupère une tâche spécifique

### POST /api/tasks
Crée une nouvelle tâche
```json
{
  "title": "Nouvelle tâche",
  "completed": false
}
```

### PUT /api/tasks/:id
Met à jour une tâche
```json
{
  "title": "Tâche modifiée",
  "completed": true
}
```

### DELETE /api/tasks/:id
Supprime une tâche

## 📦 Dépendances

### Production
- `express` - Framework web
- `body-parser` - Parser pour les requêtes HTTP

### Développement
- `jest` - Framework de tests
- `supertest` - Tests HTTP
- `nodemon` - Rechargement automatique
