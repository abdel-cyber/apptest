const request = require('supertest');
const { app, server, tasksModule } = require('../server');

afterAll((done) => server.close(done));

beforeEach(() => {
    tasksModule.resetTasks(); // réinitialiser les tâches avant chaque test
});

describe('API Tests - CRUD Operations', () => {

    describe('GET /api/tasks', () => {
        it('devrait retourner toutes les tâches', async() => {
            const response = await request(app).get('/api/tasks');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/tasks', () => {
        it('devrait créer une nouvelle tâche', async() => {
            const res = await request(app).post('/api/tasks').send({ title: 'Tâche 1' });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
        });

        it('devrait retourner 400 si titre manquant', async() => {
            const res = await request(app).post('/api/tasks').send({});
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/tasks/:id', () => {
        it('devrait retourner la tâche par ID', async() => {
            const task = tasksModule.createTask({ title: 'Tâche 1' });
            const res = await request(app).get(`/api/tasks/${task.id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', task.id);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const res = await request(app).get('/api/tasks/9999');
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('devrait mettre à jour une tâche', async() => {
            const task = tasksModule.createTask({ title: 'Old' });
            const res = await request(app).put(`/api/tasks/${task.id}`).send({ title: 'New', completed: true });
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('New');
            expect(res.body.completed).toBe(true);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const res = await request(app).put('/api/tasks/9999').send({ title: 'Test' });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('devrait supprimer une tâche', async() => {
            const task = tasksModule.createTask({ title: 'ToDelete' });
            const res = await request(app).delete(`/api/tasks/${task.id}`);
            expect(res.status).toBe(200);

            const check = await request(app).get(`/api/tasks/${task.id}`);
            expect(check.status).toBe(404);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const res = await request(app).delete('/api/tasks/9999');
            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/tasks/count', () => {
        it('devrait retourner le nombre correct de tâches', async() => {
            tasksModule.createTask({ title: 'T1' });
            tasksModule.createTask({ title: 'T2' });

            const res = await request(app).get('/api/tasks/count');
            expect(res.status).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });

});