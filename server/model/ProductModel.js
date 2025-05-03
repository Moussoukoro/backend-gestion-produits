const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  quantite: { type: Number, default: 0 },
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: [] 
  }],
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);