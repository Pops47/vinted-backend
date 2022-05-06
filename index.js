require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(formidable());

mongoose.connect(process.env.MONGODB_URI);

app.get("", (req, res) => {
  res.status(200).json({
    message: "Welcome to Vinted backend on Heroku server",
  });
});
// Import routes
const userRoutes = require("./routes/user"); // signUp and Login
app.use(userRoutes);

const offerPublishRoute = require("./routes/offer-publish"); // Publish an offer
app.use(offerPublishRoute);
const offerFilterRoute = require("./routes/offer-filter"); // Search an offer with filters
app.use(offerFilterRoute);
// const offerUpdate = require("./routes/offer-update"); //Update offer (pas terminée)
// app.use(offerUpdate);
const offerDelete = require("./routes/offer-delete"); //Delete offer
app.use(offerDelete);
const offerFindByIdRoute = require("./routes/offer-find-by-id"); // Search an offer with filters
app.use(offerFindByIdRoute);

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT, () => {
  console.log("Server started!");
});
