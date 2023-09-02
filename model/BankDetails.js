const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    holderName: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Notes", NoteSchema);
