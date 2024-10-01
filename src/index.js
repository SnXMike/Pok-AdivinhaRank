const express = require('express');
// const mysql = require('mysql2');
const bodyParser = require('body-parser');
const scoresRoutes = require('./api/scores');

// Configuração do Express
const app = express();
const port = 3000;

// Configuração do body-parser
app.use(bodyParser.json());

// Configuração das rotas
app.use('/api/scores', scoresRoutes);

// Configuração da conexão com o MySQL
// const db = mysql.createConnection({
//   host: 'localhost', // Alterar se necessário
//   user: 'root', // Seu usuário MySQL
//   password: '', // Sua senha MySQL
//   database: 'pokemon' // Nome do banco de dados
// });

// // Conectando ao banco de dados
// db.connect(err => {
//   if (err) {
//     console.error('Erro ao conectar ao banco de dados:', err);
//     return;
//   }
//   console.log('Conectado ao banco de dados MySQL');
// });

// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor está funcionando');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Rota para salvar pontuação
app.post('/api/scores', (req, res) => {
    const { nome, pontuacao } = req.body;
    const sql = 'INSERT INTO ranking (nome, pontuacao) VALUES (?, ?)';
    db.query(sql, [nome, pontuacao], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao salvar pontuação' });
      }
      res.status(200).json({ message: 'Pontuação salva com sucesso' });
    });
  });
  
  // Rota para recuperar todas as pontuações
  app.get('/api/scores', (req, res) => {
    const sql = 'SELECT * FROM ranking ORDER BY ranking DESC';
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao recuperar pontuações' });
      }
      res.status(200).json(results);
    });
  });
  