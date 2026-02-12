const request = require('supertest');
const { app, server } = require('../server');

// 🔒 Fermer le serveur après tous les tests
afterAll((done) => {
    server.close(done);
});

describe('API Tests - CRUD Operations', () => {

    // --------------------
    // GET /api/tasks
    // --------------------
    describe('GET /api/tasks', () => {
        it('devrait retourner toutes les tâches', async() => {
            const response = await request(app).get('/api/tasks');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('devrait retourner des tâches avec les bonnes propriétés', async() => {
            // Si aucune tâche existe, créer une tâche pour tester les propriétés
            if (!global.tasksCreated) {
                await request(app).post('/api/tasks').send({ title: 'Tâche test', completed: false });
                global.tasksCreated = true;
            }
            const response = await request(app).get('/api/tasks');
            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('completed');
        });
    });

    // --------------------
    // GET /api/tasks/:id
    // --------------------
    describe('GET /api/tasks/:id', () => {
        it('devrait retourner une tâche spécifique par ID', async() => {
            const response = await request(app).get('/api/tasks/1');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('title');
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const response = await request(app).get('/api/tasks/9999');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // --------------------
    // POST /api/tasks
    // --------------------
    describe('POST /api/tasks', () => {
        it('devrait créer une nouvelle tâche', async() => {
            const newTask = { title: 'Nouvelle tâche de test', completed: false };
            const response = await request(app).post('/api/tasks').send(newTask);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newTask.title);
            expect(response.body.completed).toBe(newTask.completed);
        });

        it('devrait retourner 400 si le titre est manquant', async() => {
            const response = await request(app).post('/api/tasks').send({ completed: false });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('devrait créer une tâche avec completed=false par défaut', async() => {
            const newTask = { title: 'Tâche sans completed' };
            const response = await request(app).post('/api/tasks').send(newTask);
            expect(response.status).toBe(201);
            expect(response.body.completed).toBe(false);
        });
    });

    // --------------------
    // PUT /api/tasks/:id
    // --------------------
    describe('PUT /api/tasks/:id', () => {
        it('devrait mettre à jour le titre d\'une tâche', async() => {
            const updatedData = { title: 'Titre mis à jour' };
            const response = await request(app).put('/api/tasks/1').send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
        });

        it('devrait mettre à jour le statut completed d\'une tâche', async() => {
            const updatedData = { completed: true };
            const response = await request(app).put('/api/tasks/2').send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.completed).toBe(true);
        });

        it('devrait mettre à jour plusieurs propriétés à la fois', async() => {
            const updatedData = { title: 'Titre et statut mis à jour', completed: true };
            const response = await request(app).put('/api/tasks/3').send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
            expect(response.body.completed).toBe(updatedData.completed);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const response = await request(app).put('/api/tasks/9999').send({ title: 'Test' });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // --------------------
    // DELETE /api/tasks/:id
    // --------------------
    describe('DELETE /api/tasks/:id', () => {
        it('devrait supprimer une tâche existante', async() => {
            const newTask = await request(app).post('/api/tasks').send({ title: 'Tâche à supprimer' });
            const taskId = newTask.body.id;

            const response = await request(app).delete(`/api/tasks/${taskId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', taskId);

            const checkResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(checkResponse.status).toBe(404);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const response = await request(app).delete('/api/tasks/9999');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // --------------------
    // Test d'intégration complet
    // --------------------
    describe('Integration Test - Full CRUD Cycle', () => {
        it('devrait effectuer un cycle CRUD complet', async() => {
            const createResponse = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche de test intégration', completed: false });
            expect(createResponse.status).toBe(201);
            const taskId = createResponse.body.id;

            const getResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.title).toBe('Tâche de test intégration');

            const updateResponse = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ title: 'Tâche modifiée', completed: true });
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.title).toBe('Tâche modifiée');
            expect(updateResponse.body.completed).toBe(true);

            const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);
            expect(deleteResponse.status).toBe(200);

            const finalGetResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(finalGetResponse.status).toBe(404);
        });
    });

    // --------------------
    // GET /api/tasks/count
    // --------------------
    describe('GET /api/tasks/count', () => {
        it('devrait retourner le nombre correct de tâches', async() => {
            // Réinitialiser / créer 2 tâches pour test
            await request(app).post('/api/tasks').send({ title: 'T1' });
            await request(app).post('/api/tasks').send({ title: 'T2' });

            const res = await request(app).get('/api/tasks/count');
            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
        });
    });
});