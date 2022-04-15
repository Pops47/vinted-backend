const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offer/:id", async (req, res) => {
  try {
    result = await Offer.findById(req.params.id).populate("owner", "account");
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
