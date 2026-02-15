// ✅ BONNE PRATIQUE - Utilisation de variables d'environnement
const config = {
    apiKey: process.env.API_KEY || 'your-api-key-here',
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost/todos'
};

module.exports = config;