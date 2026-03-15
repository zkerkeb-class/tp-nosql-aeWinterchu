import 'dotenv/config';
import express from 'express';
import connectDB from './db/connect.js';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js'; // <-- Nouveau

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/pokemons', pokemonsRouter);
app.use('/api/auth', authRouter); // <-- Nouveau

app.get('/', (req, res) => {
  res.send('<h1>API Pokémon & Auth opérationnelle</h1>');
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur : http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();