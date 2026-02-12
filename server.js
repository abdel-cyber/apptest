const express = require('express');
const bodyParser = require('body-parser');
const tasksModule = require('./tasks');

const app = express();
app.use(bodyParser.json());

// --------------------
// Routes API
// --------------------

// GET /api/tasks - toutes les tâches
app.get('/api/tasks', (req, res) => {
    res.json(tasksModule.getAllTasks());
});

// GET /api/tasks/count - nombre de tâches (DOIT être avant /:id)
app.get('/api/tasks/count', (req, res) => {
    res.json({ count: tasksModule.getTasksCount() });
});

// GET /api/tasks/:id - tâche spécifique
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasksModule.getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
});

// POST /api/tasks - créer une tâche
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });
    const newTask = tasksModule.createTask({ title, completed });
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id - mettre à jour
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updated = tasksModule.updateTask(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(updated);
});

// DELETE /api/tasks/:id - supprimer
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = tasksModule.deleteTask(id);
    if (!deleted) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(deleted);
});

// --------------------
// Serveur
// --------------------
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// ⚠️ Export pour Jest
module.exports = { app, server, tasksModule };