const Booking = require("../model/BookingSchema");

const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage()
const upload = multer({storage:storage,dest:"uploads/"})

const createOrder = (req, res) => {
  Booking.create(
    {
      from: req.body.from,
      to: req.body.to,
      parcelType: req.body.parcelType,
      parcelWeight: req.body.parcelWeight,
      parcelWidth: req.body.parcelWeight,
      parcelHeight: req.body.parcelHeight,
      parcelLength: req.body.parcelLength,
      parcelDescription: req.body.parcelDescription,
      paymentMode: req.body.paymentMode,
      parcelPaymentCollection: req.body.parcelPaymentCollection,
      parcelImages: req.body.parcelImages,
      billImages: req.body.billImages,
      createdBy: req.body.createdBy,
      otp: Math.floor(Math.random() * 999999) + 100000,
    },
    (err, Booking) => {
      if (err) {
        res.send(err);
      } else res.json(Booking);
    }
  );
};

const getOrder = (req, res) => {
  Booking.find()
    .populate("from")
    .sort({ createdAt: -1 })
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};
const getAnOrder = (req, res) => {
  console.log(req.params);
  Booking.find({ _id: req.params.orderId })
    .sort({ createdAt: -1 })
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};
const findOrder = (req, res) => {
  Booking.find(req.body)
    .sort({ createdAt: -1 })
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};
const getOrderByUser = (req, res) => {
  // console.log(`{createdBy:${req.params.userID}}`)

  Booking.find({
    $or: [
      { from: req.params.userID },
      { to: req.params.userID },
      { createdBy: req.params.userID },
    ],
  })
    .sort({ createdAt: -1 })
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};

const updateOrder = (req, res) => {
  Booking.findOneAndUpdate(
    { _id: req.params.orderID },
    {
      $set: {
        from: req.body.from,
        to: req.body.to,
        parcelType: req.body.parcelType,
        parcelWeight: req.body.parcelWeight,
        parcelWidth: req.body.parcelWeight,
        parcelHeight: req.body.parcelHeight,
        parcelLength: req.body.parcelLength,
        parcelDescription: req.body.parcelDescription,
        paymentMode: req.body.paymentMode,
        parcelPaymentCollection: req.body.parcelPaymentCollection,
        parcelImages: req.body.parcelImages,
        billImages: req.body.billImages,
        createdBy: req.body.createdBy,
        otp: req.body.otp,
        status: req.body.status,
        agentName: req.body.agentName,
        agentId: req.body.agentId,
        pickupDate: req.body.pickupDate,
        deliveryDate: req.body.deliveryDate
      },
    },
    { new: true, setDefaultsOnInsert: true },
    (err, Booking) => {
      if (err) {
        res.send(err);
      } else res.json(Booking);
    }
  );
};

const deleteOrder = (req, res) => {
  Booking.deleteOne({ _id: req.params.orderID })
    .then(() => res.json({ message: "Order Deleted" }))
    .catch((err) => res.send(err));
};

const multiple = multer({
  storage: storage,
  dest:"uploads/",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("multiple");

const imgUpload = (req,res) => {
  console.log(req);
  multiple(req, res, (err) => {
    // console.log("Request for img upload recieved");
    if (req.body.files) {
      console.log(req.body.files)
    }
    if (req.files) {
      req.files.forEach((file) => {
        if (err instanceof multer.MulterError) {
          console.log(err);
          res.send(err);
        } else if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(file.path);
          res.send(file.path);
        }
      });
    }else{
      console.log("No file recieved");
      res.send("Files not send")
    }
  });
};

module.exports = {
  getOrder,
  getAnOrder,
  getOrderByUser,
  findOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  imgUpload
};
