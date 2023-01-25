const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lowerLimit: {
    type: Number,
    required: true,
  },
  upperLimit: {
    type: Number,
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

module.exports = mongoose.model("Category", CategorySchema);
