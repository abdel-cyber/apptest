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

// Exporter toutes les fonctions
module.exports = {
    getAllTasks,
    addTask,
    deleteTask,
    resetTasks,
    getTaskCount // Nouvelle fonction exportée
};