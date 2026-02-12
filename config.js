// ⚠️ MAUVAISE PRATIQUE - NE JAMAIS FAIRE ÇA !
// Ce fichier contient des secrets en clair pour démontrer
// comment le pipeline CI/CD détecte et bloque ce type d'erreur

const config = {
  apiKey: "sk-abc123def456789",  // SECRET EN CLAIR! 
  databaseUrl: "mongodb://admin:password123@localhost/todos"
};

module.exports = config;
