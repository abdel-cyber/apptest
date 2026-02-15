// ⚠️ MAUVAISE PRATIQUE - SECRET EN CLAIR!
const config = {
    apiKey: "sk-abc123def456789",  // SECRET EN CLAIR! 
    databaseUrl: "mongodb://admin:password123@localhost/todos"
};

module.exports = config;