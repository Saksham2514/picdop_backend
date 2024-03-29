const mongoose = require("mongoose");
const BookingSchema = require("./BookingSchema");

const TransactionSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: false,
      required: true,
      // true = successfull
    },
    role: {
      type: String,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// const TransactionSchema = new mongoose.Schema({
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref:"User"
//   },
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref:"User"
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: Boolean,
//     default: false,
//         // true = successfull
//   },

// },{
//     timestamps:true
// });

module.exports = mongoose.model("Transaction", TransactionSchema);
