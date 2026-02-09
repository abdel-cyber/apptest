const request = require('supertest');
const { app, server } = require('../server');

// Fermer le serveur après tous les tests
afterAll((done) => {
    server.close(done);
});

describe('API Tests - CRUD Operations', () => {

    // Test GET - Récupérer toutes les tâches
    describe('GET /api/tasks', () => {
        it('devrait retourner toutes les tâches', async() => {
            const response = await request(app).get('/api/tasks');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('devrait retourner des tâches avec les bonnes propriétés', async() => {
            const response = await request(app).get('/api/tasks');

            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('title');
            expect(response.body[0]).toHaveProperty('completed');
        });
    });

    // Test GET - Récupérer une tâche par ID
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

    // Test POST - Créer une nouvelle tâche
    describe('POST /api/tasks', () => {
        it('devrait créer une nouvelle tâche', async() => {
            const newTask = {
                title: 'Nouvelle tâche de test',
                completed: false
            };

            const response = await request(app)
                .post('/api/tasks')
                .send(newTask);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newTask.title);
            expect(response.body.completed).toBe(newTask.completed);
        });

        it('devrait retourner 400 si le titre est manquant', async() => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ completed: false });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('devrait créer une tâche avec completed=false par défaut', async() => {
            const newTask = { title: 'Tâche sans completed' };

            const response = await request(app)
                .post('/api/tasks')
                .send(newTask);

            expect(response.status).toBe(201);
            expect(response.body.completed).toBe(false);
        });
    });

    // Test PUT - Mettre à jour une tâche
    describe('PUT /api/tasks/:id', () => {
        it('devrait mettre à jour le titre d\'une tâche', async() => {
            const updatedData = { title: 'Titre mis à jour' };

            const response = await request(app)
                .put('/api/tasks/1')
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
        });

        it('devrait mettre à jour le statut completed d\'une tâche', async() => {
            const updatedData = { completed: true };

            const response = await request(app)
                .put('/api/tasks/2')
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.completed).toBe(true);
        });

        it('devrait mettre à jour plusieurs propriétés à la fois', async() => {
            const updatedData = {
                title: 'Titre et statut mis à jour',
                completed: true
            };

            const response = await request(app)
                .put('/api/tasks/3')
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
            expect(response.body.completed).toBe(updatedData.completed);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const response = await request(app)
                .put('/api/tasks/9999')
                .send({ title: 'Test' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // Test DELETE - Supprimer une tâche
    describe('DELETE /api/tasks/:id', () => {
        it('devrait supprimer une tâche existante', async() => {
            // D'abord, créer une tâche à supprimer
            const newTask = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche à supprimer' });

            const taskId = newTask.body.id;

            // Supprimer la tâche
            const response = await request(app).delete(`/api/tasks/${taskId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', taskId);

            // Vérifier que la tâche n'existe plus
            const checkResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(checkResponse.status).toBe(404);
        });

        it('devrait retourner 404 pour un ID inexistant', async() => {
            const response = await request(app).delete('/api/tasks/9999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // Test d'intégration complet
    describe('Integration Test - Full CRUD Cycle', () => {
        it('devrait effectuer un cycle CRUD complet', async() => {
            // 1. POST - Créer une tâche
            const createResponse = await request(app)
                .post('/api/tasks')
                .send({ title: 'Tâche de test intégration', completed: false });

            expect(createResponse.status).toBe(201);
            const taskId = createResponse.body.id;

            // 2. GET - Récupérer la tâche créée
            const getResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.title).toBe('Tâche de test intégration');

            // 3. PUT - Mettre à jour la tâche
            const updateResponse = await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ title: 'Tâche modifiée', completed: true });

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.title).toBe('Tâche modifiée');
            expect(updateResponse.body.completed).toBe(true);

            // 4. DELETE - Supprimer la tâche
            const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);
            expect(deleteResponse.status).toBe(200);

            // 5. GET - Vérifier que la tâche n'existe plus
            const finalGetResponse = await request(app).get(`/api/tasks/${taskId}`);
            expect(finalGetResponse.status).toBe(404);
        });
    });
});