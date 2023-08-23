const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  parcelType: {
    type: String,
    required: true,
  },
  parcelWeight: {
    type: String,
    required: true,
  },
  parcelHeight: {
    type: String,
    required: true,
  },
  parcelWidth: {
    type: String,
    required: true,
  },
  parcelLength: {
    type: String,
    required: true,
  },
  parcelDescription: {
    type: String,

  },
  paymentMode: {
    type: String,
    required: true,
  },
  parcelPaymentCollection: {
    type: Number,
    // required: true,
    default:70
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Completed", "Cancelled"],
  },
  billImages: {
    type: [String],
  },

  parcelImages: {
    type: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: Number,
  },
  agentName: {
    type: String,
  },
  agentId: {
    type: String,
  },
  pickupDate:{
    type:Date
  },
  deliveryDate:{
    type:Date
  }
});

module.exports = mongoose.model("Booking", BookingSchema);
