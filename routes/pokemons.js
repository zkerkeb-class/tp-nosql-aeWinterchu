import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// 6.B — STATISTIQUES (Agrégation)
// Important : Placer AVANT /:id
router.get('/stats', async (req, res) => {
  try {
    const stats = await Pokemon.aggregate([
      { $unwind: "$type" },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          averageHP: { $avg: "$base.HP" },
          maxAttack: { $max: "$base.Attack" }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL (Filtres, Tri, Pagination)
router.get('/', async (req, res) => {
  try {
    const { type, name, sort, page = 1, limit = 50 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (name) query["name.english"] = { $regex: name, $options: 'i' };

    let result = Pokemon.find(query);
    if (sort) result = result.sort(sort);
    else result = result.sort('id');

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const pokemons = await result.skip(skip).limit(limitNum);
    const total = await Pokemon.countDocuments(query);

    res.json({
      data: pokemons,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ONE
router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST (Protégé)
router.post('/', auth, async (req, res) => {
  try {
    const newPokemon = await Pokemon.create(req.body);
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT (Protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Pokemon.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE (Protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Pokemon.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;