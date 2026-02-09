const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Base de données en mémoire
let tasks = [
    { id: 1, title: 'Apprendre Node.js', completed: false },
    { id: 2, title: 'Créer une API REST', completed: false },
    { id: 3, title: 'Tester avec Jest', completed: false }
];

let nextId = 4;

// GET - Récupérer toutes les tâches
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// GET - Récupérer une tâche par ID
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ error: 'Tâche non trouvée' });
    }
});

// POST - Créer une nouvelle tâche
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Le titre est requis' });
    }

    const newTask = {
        id: nextId++,
        title,
        completed: completed || false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT - Mettre à jour une tâche
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    if (title !== undefined) {
        tasks[taskIndex].title = title;
    }

    if (completed !== undefined) {
        tasks[taskIndex].completed = completed;
    }

    res.json(tasks[taskIndex]);
});

// DELETE - Supprimer une tâche
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json(deletedTask);
});

// Route pour la page principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Export pour les tests
module.exports = { app, server };