// Fichier: config.js (BONNE PRATIQUE)
const config = {
    apiKey: process.env.API_KEY, // Variable d'environnement
    databaseUrl: process.env.DATABASE_URL
};

module.exports = config;