const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// --------------------
// Stockage en mémoire
// --------------------
let tasks = [];
let nextId = 1;

// --------------------
// GET /api/tasks
// --------------------
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// --------------------
// GET /api/tasks/:id
// --------------------
app.get('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
    res.json(task);
});

// --------------------
// GET /api/tasks/count
// --------------------
app.get('/api/tasks/count', (req, res) => {
    res.json({ count: tasks.length });
});

// --------------------
// POST /api/tasks
// --------------------
app.post('/api/tasks', (req, res) => {
    const { title, completed = false } = req.body;
    if (!title) return res.status(400).json({ error: 'Le titre est requis' });

    const newTask = { id: nextId++, title, completed };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// --------------------
// PUT /api/tasks/:id
// --------------------
app.put('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    const { title, completed } = req.body;
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    res.json(task);
});

// --------------------
// DELETE /api/tasks/:id
// --------------------
app.delete('/api/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Tâche non trouvée' });

    const deletedTask = tasks.splice(index, 1)[0];
    res.json(deletedTask);
});

// --------------------
// Démarrage serveur
// --------------------
const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// ⚠️ Export pour Jest
module.exports = { app, server, tasks };