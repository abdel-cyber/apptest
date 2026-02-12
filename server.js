const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const taskService = require('./tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

/* ======================
   ROUTES API
====================== */

// GET ALL
app.get('/api/tasks', (req, res) => {
    res.json(taskService.getAllTasks());
});

// GET ONE
app.get('/api/tasks/:id', (req, res) => {
    const task = taskService.getTaskById(parseInt(req.params.id));

    if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });

    res.json(task);
});

// POST
app.post('/api/tasks', (req, res) => {
    try {
        const task = taskService.addTask(req.body.title, req.body.completed);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT
app.put('/api/tasks/:id', (req, res) => {
    try {
        const task = taskService.updateTask(parseInt(req.params.id), req.body);
        res.json(task);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// DELETE
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const task = taskService.deleteTask(parseInt(req.params.id));
        res.json(task);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// 🔥 NOUVELLE ROUTE compteur
app.get('/api/tasks/count', (req, res) => {
    res.json({ count: taskService.getTaskCount() });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

module.exports = { app, server };