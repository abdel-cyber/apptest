// tasks.js

let tasks = [];
let nextId = 1;

// Retourner toutes les tâches
function getAllTasks() {
    return tasks;
}

// Ajouter une nouvelle tâche
function addTask({ title, completed = false }) {
    const newTask = { id: nextId++, title, completed };
    tasks.push(newTask);
    return newTask;
}

// Alias pour createTask (utilisé dans server.js)
function createTask(taskData) {
    return addTask(taskData);
}

// Récupérer une tâche par ID
function getTaskById(id) {
    return tasks.find(t => t.id === id) || null;
}

// Mettre à jour une tâche
function updateTask(id, updates) {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    if (updates.title !== undefined) task.title = updates.title;
    if (updates.completed !== undefined) task.completed = updates.completed;
    return task;
}

// Supprimer une tâche par ID
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    return tasks.splice(index, 1)[0];
}

// Réinitialiser les tâches (utile pour les tests)
function resetTasks() {
    tasks = [];
    nextId = 1;
}

// Nouvelle fonction : compter les tâches
function getTaskCount() {
    return tasks.length;
}

// Alias pour getTasksCount (utilisé dans server.js)
function getTasksCount() {
    return getTaskCount();
}

// Exporter toutes les fonctions
module.exports = {
    getAllTasks,
    addTask,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    resetTasks,
    getTaskCount,
    getTasksCount
};