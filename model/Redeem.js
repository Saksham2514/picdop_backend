const mongoose = require("mongoose");

const Redeem = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Redeem", Redeem);
