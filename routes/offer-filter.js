const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

// Route avec filtres
router.get("/offers", async (req, res) => {
  try {
    // Filtre de nom et de prix
    const findFilter = {};
    if (req.query.title) {
      findFilter.product_name = new RegExp(`${req.query.title}`, "i");
    }
    if (req.query.priceMax) {
      findFilter.product_price = { $lte: req.query.priceMax };
    }
    if (req.query.priceMin) {
      if (!req.query.priceMax) {
        findFilter.product_price = {};
      }
      findFilter.product_price["$gte"] = req.query.priceMin;
    }
    //Filtre de pages
    const offersPerPage = 3; //arbitrairement
    let currentPage = 1;

    if (req.query.page) {
      //on vérifier que le nombre de page existe et qu'il est bien > 0
      if (req.query.page < 1) {
        res.status(400).json({
          message: "Le numéro de page doit être supérieur ou égal à 1",
        });
      } else {
        currentPage = req.query.page; // paramètre qui sera utilisé dans la fonction skip
      }
    }
    //Filtre de tri des prix par ordre croissant ou decroissant
    const sortFilter = {};
    if (req.query.sort) {
      sortFilter.product_price = req.query.sort.replace("price-", "");
    }

    // Résultat de la recherche:
    const offersFound = await Offer.find(findFilter)
      .limit(offersPerPage)
      .skip(offersPerPage * (currentPage - 1))
      .sort(sortFilter);

    const count = await Offer.countDocuments(findFilter);
    const result = { count: count, offers: offersFound };
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
