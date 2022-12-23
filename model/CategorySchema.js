const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  limit: {
    type: String,
    required: true,
  },
  localPrice: {
    type: Number,
    required: true,
  },
  outCityPrice: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", CategorySchema);
