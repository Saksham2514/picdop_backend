const mongoose = require("mongoose");

const BankDetails = new mongoose.Schema(
  {
    holderName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    upi: {
      type: String,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BankDetails", BankDetails);
