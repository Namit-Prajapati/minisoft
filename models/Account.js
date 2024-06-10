// models/Account.js
const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  user: {
    name: String,
    mail: String,
    uuid: {
      type: String, // Changed from ObjectId to String
      required: true
    },
  },
  account: {
    number: { type: String, unique: true, match: /^\d{16}$/ },
    branch: String,
    bank: String,
  },
  balance: {
    number: String,
    currency: String,
  },
});

module.exports = mongoose.model("Account", AccountSchema);
