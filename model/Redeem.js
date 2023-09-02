const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    agentID: {
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
