const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    required: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
    avatar: {
      //Photo de profil ou avatar de l'utilisateur
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  newsletter: {
    type: Boolean,
    required: true,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
