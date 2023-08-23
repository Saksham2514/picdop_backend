const mongoose = require("mongoose");
const BookingSchema = require("./BookingSchema");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: true,
  },
  mapsLink: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  shopNumber: {
    type: String,
    required: true,
  },
  shopImages: {
    type: [String],
  },
  cardNumber: {
    type: String,
  },
  cardHolder: {
    type: String,
  },
  cardExpiry: {
    type: String,
    maxLength: 5,
  },
  cardCVV: {
    type: String,
    maxLength: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

UserSchema.pre("deleteOne", function (next) {
  // Remove all the docs that refers
  // console.log("working");
  const id = this._conditions._id;
  console.log("Entered Pre Remove with : " + id);
  mongoose
    .model("Booking")
    .deleteMany({ $or: [{ from: id }, { to: id }, { createdBy: id }] })
    .then((res) => {
      console.log(res);
      next();
    })
    .catch((err) => console.log(err));
});

module.exports = mongoose.model("User", UserSchema);
