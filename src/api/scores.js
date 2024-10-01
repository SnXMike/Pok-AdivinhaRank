const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rota para salvar pontuação
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM ranking ORDER BY ranking DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao recuperar pontuações' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
