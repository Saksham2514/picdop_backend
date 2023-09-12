const BookingSchema = require("../model/BookingSchema");
const User = require("../model/Users");
const jwt = require("jsonwebtoken");
const { createTransaction } = require("./Transaction");

const createUser = (req, res) => {
  User.updateOne(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      line1: req.body.line1,
      line2: req.body.line2,
      city: req.body.city,
      state: req.body.state,
      pin: req.body.pin,
      mapsLink: req.body.mapsLink,
      contact: req.body.contact,
      role: req.body.role ? req.body.role : "user",
      category: req.body.category,
      subCategory: req.body.subCategory,
      shopName: req.body.shopName,
      shopNumber: req.body.shopNumber,
      shopImages: req.body.shopImages,
      cardNumber: req.body.cardNumber,
      cardHolder: req.body.cardHolder,
      cardExpiry: req.body.cardExpiry,
      cardCVV: req.body.cardCVV,
    },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pin: req.body.pin,
        mapsLink: req.body.mapsLink,
        contact: req.body.contact,
        role: req.body.role ? req.body.role : "user",
        category: req.body.category,
        subCategory: req.body.subCategory,
        shopName: req.body.shopName,
        shopNumber: req.body.shopNumber,
        shopImages: req.body.shopImages,
        cardNumber: req.body.cardNumber,
        cardHolder: req.body.cardHolder,
        cardExpiry: req.body.cardExpiry,
        cardCVV: req.body.cardCVV,
      },
    },
    { upsert: true, setDefaultsOnInsert: true },
    (err, User) => {
      if (err) {
        res.send(err);
      } else res.json(User);
    }
  );
};

const getUsers = (req, res) => {
  User.find()
    .select([
      "-cardCVV",
      "-cardNumber",
      "-cardHolder",
      "-cardExpiry",
      "-password",
    ])
    .exec((err, users) => {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
};

const findUsers = async (req, res) => {
  generateToken = req.body.generate;
  User.find(req.body)
    .sort({ createdAt: -1 })
    .select([
      "name",
      "email",
      "contact",
      "shopNumber",
      "shopName",
      "role",
      "createdAt",
    ])
    // .select([
    //   "-cardCVV",
    //   "-cardNumber",
    //   "-cardHolder",
    //   "-cardExpiry",
    //   "-password",
    //   "-shopImage"
    // ])
    .exec((err, users) => {
      if (err) {
        res.send(err);
      }
      if (generateToken) {
        const token = jwt.sign(
          { role: users[0].role, userID: users[0]._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.json([...users, token]);
      } else {
        res.json(users);
      }
    });
};

const updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userID },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        pin: req.body.pin,
        mapsLink: req.body.mapsLink,
        contact: req.body.contact,
        role: req.body.role ? req.body.role : "user",
        category: req.body.category,
        subCategory: req.body.subCategory,
        shopName: req.body.shopName,
        shopNumber: req.body.shopNumber,
        shopImages: req.body.shopImages,
        cardNumber: req.body.cardNumber,
        cardHolder: req.body.cardHolder,
        cardExpiry: req.body.cardExpiry,
        cardCVV: req.body.cardCVV,
      },
    },
    { new: true, setDefaultsOnInsert: true }
  )
    .select([
      "-cardCVV",
      "-cardNumber",
      "-cardHolder",
      "-cardExpiry",
      "-password",
    ])
    .exec((err, User) => {
      if (err) {
        res.send(err);
      } else res.json(User);
    });
};

const addToWallet = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userID },
    {
      $inc: { wallet: parseInt(req.body.amount) },
    },
    { new: true, setDefaultsOnInsert: true }
  )
    .select(["wallet"])
    .exec((err, User) => {
      if (err) {
        res.send(err);
      } else {
        createTransaction(User._id, req.body.amount, "addWallet", "user");
        res.json(User);
      }
    });
};

const deductWallet = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userID },
    {
      $inc: { wallet: -req.body.amount },
    },
    { new: true, setDefaultsOnInsert: true }
  )
    .select(["wallet"])
    .exec((err, User) => {
      if (err) {
        res.send(err);
      } else {
        createTransaction(User._id, req.body.amount, "redeemWallet", "agent");
        res.json(User);
      }
    });
};

// const adminEarnings = (req, res) => {
//   BookingSchema.aggregate(
//     [
//       {
//         $match: {
//           $or: [
//             {
//               status: "Accepted",
//             },
//             {
//               status: "Completed",
//             },
//           ],
//         },
//       },
//       {
//         $group: {
//           _id: "$createdBy",
//           totalAmount: { $sum: "$parcelPaymentCollection" },
//         },
//       },
//     ],
//     function (err, result) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log(result);
//       res.json(result);
//       // Output will contain user data and the total sum of 'parcelPaymentCollection' for each user
//     }
//   );

//   // BookingSchema.find().sort({createdAt:-1}).select(['parcelPaymentCollection']).populate({select:"name",path:"createdBy"}).exec((err, users) => {
//   //   if (err) {
//   //     res.send(err);
//   //   }
//   //   res.json(users);
//   // });
// };

const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userID })
    .then(() => res.json({ message: "User Deleted" }))
    .catch((err) => res.send(err));
};

const adminEarnings = async (req, res) => {
  const filter = req?.body.status ? { status: req?.body.status } : {};

  try {
    const userTotals = await BookingSchema.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: {
            status: "$status", // Group by the 'status' field
            createdBy: "$createdBy", // Group by the 'createdBy' field
          },
          totalAmount: { $sum: "$parcelPaymentCollection" }, // Sum the 'totalAmount' field
          status: { $push: "$status" },
          createdAt: { $push: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "User", // The User model collection name
          localField: "_id.createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id.status",
          user: "$_id.createdBy",
          totalAmount: 1,
          parcelPaymentCollection: 1,
          createdAt: "$createdAt",
        },
      },
    ]);

    let fil = {};
    if (req?.body?.id) {
      fil = { _id: req?.body?.id };
    }

    const populatedUserTotals = await User.populate(userTotals, {
      path: "user",
      select: "name email", // Change to the actual field name in the User model,
      match: { ...fil },
    });

    let filtered = populatedUserTotals.filter(
      (doc) => doc?.user?.email !== undefined
    );
    res.json(filtered);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const statusAnalysis = async (req, res) => {
  try {
    const userTotals = await BookingSchema.aggregate([
      {
        $group: {
          _id: {
            status: "$status", // Group by the 'status' field
            // createdBy: "$createdBy" // Group by the 'createdBy' field
          },
          totalAmount: { $sum: "$parcelPaymentCollection" }, // Sum the 'totalAmount' field
        },
      },
      {
        $lookup: {
          from: "User", // The User model collection name
          localField: "_id.createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id.status",
          user: "$_id.createdBy",
          totalAmount: 1,
          parcelPaymentCollection: 1,
        },
      },
    ]);
    // console.log(userTotals);

    res.json(userTotals);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const adminEarningsWorking = async (req, res) => {
  const filter = req?.body.status ? { status: req?.body.status } : {};

  try {
    const userTotals = await BookingSchema.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: {
            _id: "$createdBy",
            status: "$status",
          },
          totalAmount: { $sum: "$parcelPaymentCollection" },
          status: { $addToSet: "$status" },
        },
      },
    ]);

    let fil = {};
    if (req?.body?.id) {
      fil = { _id: req?.body?.id };
    }

    const populatedUserTotals = await User.populate(userTotals, {
      path: "_id",
      select: "name email", // Change to the actual field name in the User model,
      match: { ...fil },
    });

    let filtered = populatedUserTotals.filter(
      (doc) => doc?._id?.email !== undefined
    );

    res.json(filtered);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getUsers,
  findUsers,
  createUser,
  updateUser,
  deleteUser,
  adminEarnings,
  statusAnalysis,
  addToWallet,
  deductWallet,
};
