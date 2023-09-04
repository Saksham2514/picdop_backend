const { BSON } = require("bson");
const Booking = require("../model/BookingSchema");
const User = require("../model/Users");
const { getComission } = require("./Comission");
const { createTransaction } = require("./Transaction");

const createOrder = (req, res) => {
  req.body.role == "admin"
    ? createBooking(req, res, 0)
    : User.findOneAndUpdate(
        { _id: req.body.createdBy },
        {
          $inc: { wallet: -parseInt(req.body.parcelPaymentCollection) },
        },
        { new: true, setDefaultsOnInsert: true }
      )
        .then((usr) => {
          createBooking(req, res, usr.wallet);
        })
        .catch((err) => {
          res.send(err);
          console.log(err);
        });
};

const createBooking = (req, res, wallet) => {
  Booking.create(
    {
      from: req.body?.from,
      to: req.body?.to,
      parcelType: req.body?.parcelType,
      parcelWeight: req.body?.parcelWeight,
      parcelWidth: req.body?.parcelWeight,
      parcelHeight: req.body?.parcelHeight,
      parcelLength: req.body?.parcelLength,
      parcelDescription: req.body?.parcelDescription,
      paymentMode: req.body?.paymentMode,
      parcelPaymentCollection: parseInt(req.body?.parcelPaymentCollection),
      parcelImages: req.body?.parcelImages,
      billImages: req.body?.billImages,
      createdBy: req.body?.createdBy,
      otp: parseInt(
        (Math.floor(Math.random() * 999999) + 100000).toString().substring(0, 6)
      ),
    },
    (err, Booking) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        createTransaction(
          Booking.createdBy,
          Booking.parcelPaymentCollection,
          "Booking",
          req.body.role
        );
        res.json({ ...Booking, wallet: wallet });
      }
    }
  );
};

const getOrder = (req, res) => {
  Booking.find()
    .sort({ createdAt: -1 })
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};
const getAnOrder = (req, res) => {
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
const findOrderLimit = (req, res) => {
  Booking.find(req.body)
    .sort({ createdAt: -1 })
    .limit(5)
    .exec((err, BookingSchema) => {
      if (err) {
        res.send(err);
      }
      res.json(BookingSchema);
    });
};
const getTotalIncome = (req, res) => {
  red = function (k, v) {
    var i,
      sum = 0;
    for (i in v) {
      sum += v[i];
    }
    return sum;
  };
  map = function () {
    emit("parcelPymentCollection", this.parcelPaymentCollection);
  };

  res = Booking.mapReduce(map, red);

  // Booking.find(req.body)
  //   .sort({ createdAt: -1 })
  //   .exec((err, BookingSchema) => {
  //     if (err) {
  //       res.send(err);
  //     }
  //     res.json(BookingSchema);
  //   });
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

const updateOrder = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
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
        deliveryDate: req.body.deliveryDate,
      },
    },
    { new: true, setDefaultsOnInsert: true }
  );
  if (req.body.status === "Completed") {
    const populatedBooking = await User.find({
      $or: [
        { _id: new BSON.ObjectId(booking.from) },
        { _id: new BSON.ObjectId(booking.to) },
      ],
    })
      .select([
        "city",
        "line1",
        "line2",
        "pin",
        "showpName",
        "showpNumber",
        "state",
      ])
      .then((data) => {
        booking.from = `${data[0].line1}, ${data[0].line2}, ${data[0].city}, ${data[0].pin}, ${data[0].city}, ${data[0].state}`;
        booking.to = `${data[1].line1}, ${data[1].line2}, ${data[1].city}, ${data[1].pin}, ${data[1].city}, ${data[1].state}`;
        getComission(booking, res);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.send(booking);
  }
};

const deleteOrder = (req, res) => {
  Booking.deleteOne({ _id: req.params.orderID })
    .then(() => res.json({ message: "Order Deleted" }))
    .catch((err) => res.send(err));
};

module.exports = {
  getOrder,
  getAnOrder,
  getOrderByUser,
  findOrder,
  findOrderLimit,
  createOrder,
  updateOrder,
  deleteOrder,
  getTotalIncome,
};
