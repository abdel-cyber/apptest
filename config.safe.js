// ✅ BONNE PRATIQUE - Utilisation de variables d'environnement
// Ce fichier montre comment gérer correctement les secrets

const config = {
  apiKey: process.env.API_KEY || 'your-api-key-here',  // Variable d'environnement
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost/todos',
  port: process.env.PORT || 3000
};

module.exports = config;
