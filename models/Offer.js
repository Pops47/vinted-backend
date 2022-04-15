const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  product_description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  product_price: {
    type: Number,
    required: true,
    max: 100000,
  },
  product_details: {
    type: Array,
    required: true,
  },
  product_image: {
    //Image du produit à vendre
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Offer;
