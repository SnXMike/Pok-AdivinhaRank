const mysql = require('mysql2');

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
  host: 'localhost', // Alterar se necessário
  user: 'root', // Seu usuário MySQL
  password: '', // Sua senha MySQL
  database: 'pokemon' // Nome do banco de dados
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

module.exports = db;
