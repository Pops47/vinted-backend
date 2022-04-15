const express = require("express");
const Offer = require("../models/Offer");
const router = express.Router();

// Init cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//Import du middleware
const isAuthenticated = require("../middlewares/isAuthenticated");

//Route pour publier une offre
router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    //créer une nouvelle annonce sans la photo
    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { MARQUE: req.fields.brand },
        { SIZE: req.fields.size },
        { ETAT: req.fields.condition },
        { COULEUR: req.fields.color },
        { EMPLACEMENT: req.fields.city },
      ],
      owner: req.user._id, // ajouter l'utilisateur dans la requête
    });
    // récupérer l'url de la photo du produit, avec un chemin particulier contenant l'id de l'annonce
    if (req.files.picture) {
      const productPhotoUrl = await cloudinary.uploader.upload(
        req.files.picture.path,
        (options = {
          folder: `/vinted/offers`,
          public_id: `${req.fields.title} - ${newOffer._id}`,
        })
      );
      // ajouter une clé product_image à l'annonce avec l'url sécure
      newOffer.product_image.secure_url = productPhotoUrl.secure_url;
    }
    //sauvegarder la nouvelle annonce dans la BDD
    await newOffer.save();
    //envoyer les infos demandées
    const result = await Offer.findOne({ _id: newOffer._id }).populate(
      "owner",
      "account"
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
