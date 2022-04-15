const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();
const Offer = require("../models/Offer");

router.delete("/offer/delete/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.params.id) {
      const currentOffer = await Offer.findById(req.params.id);
      if (req.user._id.toString() !== currentOffer.owner._id.toString()) {
        res.status(400).json({ message: "Unauthorized, not your offer" });
      } else {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Offer deleted" });
      }
    } else {
      res.status(400).json({ message: "id required" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
