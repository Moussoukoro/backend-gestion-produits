const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");
const router = express.Router();

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// inscription
router.post("/register", async (req, res) => {
    const { nom, prenom, numeroTelephone, adresse, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        nom,
        prenom,
        numeroTelephone,
        adresse,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(400).json({ error: err.message }); 
    }
  });
  

module.exports = router;
