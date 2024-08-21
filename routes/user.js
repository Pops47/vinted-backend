const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

// Init cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY_PUBLIC,
  api_secret: process.env.CLOUD_API_KEY_SECRET,
});

//Route signUp
router.post("/user/signup", async (req, res) => {
  try {
    // Encryptage du password
    const password = req.fields.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);
    // création d'un nouvel utilisateur
    const newUser = new User({
      email: req.fields.email,
      account: {
        username: req.fields.username,
      },
      newsletter: req.fields.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });
    // ajout d'un avatar s'il est fourni
    if (req.files.avatar) {
      const avatarUrl = await cloudinary.uploader.upload(
        req.files.avatar.path,
        (options = {
          folder: `/vinted/avatars`,
          public_id: `${req.fields.username} - ${newUser._id}`,
        })
      );
      newUser.account.avatar.secure_url = avatarUrl.secure_url;
    }
    // sauvegarde du nouvel utilisateur
    await newUser.save();
    //renvoi des infos demandées
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: { username: newUser.account.username },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });
    if (user !== null) {
      const hash = SHA256(req.fields.password + user.salt).toString(encBase64);
      if (hash === user.hash) {
        res.json({
          _id: user._id,
          token: user.token,
          account: { username: user.account.username },
        });
      } else {
        res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "Unknown email" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
