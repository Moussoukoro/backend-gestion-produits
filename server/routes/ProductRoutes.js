const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../model/ProductModel');

// Configuration pour stocker les images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Crée un nom de fichier unique
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// N'accepte que les images
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Le fichier doit être une image!'), false);
    }
  }
});

// Créer un nouveau produit
router.post('/add', authMiddleware, upload.single('image'), async (req, res) => {
    try {
      const { nom, description, prix, quantite, categories } = req.body;
      
      let parsedCategories = [];
      try {
        if (categories && categories.trim() !== '') {
          parsedCategories = JSON.parse(categories);
          
          if (!Array.isArray(parsedCategories)) {
            parsedCategories = [];
          }
          
          parsedCategories = parsedCategories.filter(id => id && typeof id === 'string');
        }
      } catch (e) {
        console.error("Erreur de parsing des catégories:", e);
        parsedCategories = [];
      }
      
      const newProduct = new Product({
        nom,
        description,
        prix: Number(prix),
        quantite: Number(quantite),
        categories: parsedCategories,
        image: req.file ? `/uploads/${req.file.filename}` : null
      });
      
      const savedProduct = await newProduct.save();
      
      
      const populatedProduct = await Product.findById(savedProduct._id).populate('categories');
      res.status(201).json(populatedProduct);
    } catch (err) {
      console.error("Erreur d'ajout de produit:", err);
      res.status(400).json({ error: err.message });
    }
  });

// Récupérer tous les produits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().populate('categories');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un produit par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categories');
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour un produit
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
      const { nom, description, prix, quantite, categories } = req.body;
      
      let parsedCategories = [];
      try {
        if (categories && categories.trim() !== '') {
          parsedCategories = JSON.parse(categories);
          
         
          if (!Array.isArray(parsedCategories)) {
            parsedCategories = [];
          }
          parsedCategories = parsedCategories.filter(id => id && typeof id === 'string');
        }
      } catch (e) {
        console.error("Erreur de parsing des catégories:", e);
        parsedCategories = [];
      }
      
      const updateData = {
        nom,
        description,
        prix: Number(prix),
        quantite: Number(quantite),
        categories: parsedCategories
      };
     
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
      
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).populate('categories');
      
      res.json(updatedProduct);
    } catch (err) {
      console.error("Erreur de mise à jour de produit:", err);
      res.status(400).json({ error: err.message });
    }
  });

// Supprimer un produit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;