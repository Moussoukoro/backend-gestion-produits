const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Category = require('../model/CategoryModel');


// Créer une nouvelle catégorie 
router.post('/add', authMiddleware, async (req, res) => {
    try {
      const { nom, description } = req.body;
      const newCategory = new Category({ nom, description });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  // Récupérer toutes les catégories
router.get('/',authMiddleware, async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Récupérer une catégorie par ID
router.get('/:id',authMiddleware,async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Mettre à jour une catégorie
  router.put('/:id',authMiddleware,async (req, res) => {
    try {
      const { nom, description } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { nom, description },
        { new: true, runValidators: true }
      );
      if (!updatedCategory) return res.status(404).json({ message: 'Catégorie non trouvée' });
      res.json(updatedCategory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Supprimer une catégorie
  router.delete('/:id',authMiddleware,async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id);
      if (!deletedCategory) return res.status(404).json({ message: 'Catégorie non trouvée' });
      res.json({ message: 'Catégorie supprimée avec succès' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;
