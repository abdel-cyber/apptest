let tasks = [
    { id: 1, title: 'Apprendre Node.js', completed: false },
    { id: 2, title: 'Créer une API REST', completed: false },
    { id: 3, title: 'Tester avec Jest', completed: false }
];

let nextId = 4;

// GET ALL
function getAllTasks() {
    return tasks;
}

// GET ONE
function getTaskById(id) {
    return tasks.find(t => t.id === id);
}

// ADD
function addTask(title, completed = false) {
    if (!title) throw new Error('Le titre est requis');

    const newTask = {
        id: nextId++,
        title,
        completed
    };

    tasks.push(newTask);
    return newTask;
}

// UPDATE
function updateTask(id, data) {
    const task = getTaskById(id);
    if (!task) throw new Error('Tâche non trouvée');

    if (data.title !== undefined) task.title = data.title;
    if (data.completed !== undefined) task.completed = data.completed;

    return task;
}

// DELETE
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tâche non trouvée');

    return tasks.splice(index, 1)[0];
}

// RESET (tests)
function resetTasks() {
    tasks = [];
    nextId = 1;
}

// 🔥 NOUVELLE FEATURE
function getTaskCount() {
    return tasks.length;
}

module.exports = {
    getAllTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    resetTasks,
    getTaskCount
};