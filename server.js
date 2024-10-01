const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '',
  database: 'pokemon' 
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Rota para inserir um novo ranking
app.post('/ranking', (req, res) => {
  const { nome, pontuacao } = req.body;
  if (!nome || typeof pontuacao !== 'number') {
    return res.status(400).json({ error: 'Nome e pontuação são obrigatórios.' });
  }

  db.query('INSERT INTO ranking (nome, pontuacao) VALUES (?, ?)', [nome, pontuacao], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, nome, pontuacao });
  });
});

// Rota para obter todos os rankings
app.get('/ranking', (req, res) => {
  db.query('SELECT * FROM ranking ORDER BY pontuacao DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
