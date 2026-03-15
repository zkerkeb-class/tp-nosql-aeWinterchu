import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: {
    english: { type: String, required: true },
    french: { type: String, required: true },
    japanese: String,
    chinese: String
  },
  type: { type: [String], required: true },
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    SpecialAttack: Number,
    SpecialDefense: Number,
    Speed: Number
  }
});

export default mongoose.model('Pokemon', pokemonSchema);