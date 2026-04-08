const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const kittens = await db.getKittensWithCurrentWeight();
    res.render('index', { kittens });
  } catch (err) {
    console.error('Error fetching kittens:', err);
    res.status(500).send('Database error');
  }
});

app.post('/kittens', async (req, res) => {
  try {
    const { name } = req.body;
    await db.createKitten(name.trim());
    res.redirect('/');
  } catch (err) {
    console.error('Error creating kitten:', err);
    res.status(500).send('Database error');
  }
});

app.post('/kittens/:id/weight', async (req, res) => {
  try {
    const { id } = req.params;
    const { weight } = req.body;
    await db.addWeight(parseInt(id), parseFloat(weight));
    res.redirect('/');
  } catch (err) {
    console.error('Error adding weight:', err);
    res.status(500).send('Database error');
  }
});

async function start() {
  try {
    await db.initTables();
    console.log('Database tables initialized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
