import 'dotenv/config';
import mongoose from 'mongoose';
import Pokemon from '../models/pokemon.js'; // AJOUTE BIEN LE .js A LA FIN
import { readFile } from 'fs/promises';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB pour le seed...');

    // Lire le JSON en mode ES Module
    const data = JSON.parse(
      await readFile(new URL('../data/pokemons.json', import.meta.url))
    );

    await Pokemon.deleteMany({});
    console.log('🗑️ Collection vidée.');

    await Pokemon.insertMany(data);
    console.log('🧬 151 Pokémon insérés avec succès !');

    await mongoose.connection.close();
    console.log('🔌 Connexion fermée.');
  } catch (error) {
    console.error('❌ Erreur pendant le seed :', error);
    process.exit(1);
  }
};

seedDatabase();