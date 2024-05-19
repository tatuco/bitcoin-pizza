const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(bodyParser.json())
app.post('/addPizza', (req, res) => {
    console.log(req.body)
    const { name, cookTime, type } = req.body;
    const addedTime = Date.now();
    const status = 1;
  
    db.run(`
      INSERT INTO pizzas (name, cookTime, type, addedTime, status)
      VALUES (?, ?, ?, ?, ?)`, [name, cookTime, type, addedTime, status], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
  });
  
  app.get('/pizzas', (req, res) => {
    db.all("SELECT * FROM pizzas WHERE status <> 2", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.post('/finishPizza', (req, res) => {
    const { id } = req.body;
  
    db.run(`
      UPDATE pizzas
      SET status = 2
      WHERE id = ?
    `, [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Pizza marked as finished' });
    });
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
