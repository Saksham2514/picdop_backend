const mongoose = require("mongoose");


const ComissionSchema = new mongoose.Schema({
  breakpoint: {
    type: Number,
    required: true,
  },
  belowBreakpoint: {
    type: Number,
    required: true,
  },
  aboveBreakpoint: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Comission", ComissionSchema);