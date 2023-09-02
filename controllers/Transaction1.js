const BookingSchema = require("../model/BookingSchema");
const Transaction = require("../model/Transaction");
const User = require("../model/Users");

const createTransaction = (req, res) => {
  Transaction.updateOne(
    {
      receiver: req?.body?.receiver,
      sender: req?.body?.sender,
      amount: req?.body?.amount,
      status: req?.body?.status,
    },
    {
      $set: {
        
        receiver: req?.body?.receiver,
        sender: req?.body?.sender,
        amount: req?.body?.amount,
        status: req?.body?.status,
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

const getTransactions = (req, res) => {
  Transaction.find()
    .exec((err, users) => {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
};

const findTransactions = async (req, res) => {
 
  // Transaction.find().exec((err,data)=>{
  //   res.send(data)
  // })

  const userTotals = await Transaction.aggregate([
    {
      $group: {
        _id: {
          receiver: "$receiver", // Group by the 'status' field
          // createdBy: "$createdBy" // Group by the 'createdBy' field
        },
        totalAmount: { $sum: "$amount" }, // Sum the 'totalAmount' field
      },
    },
    {
      $lookup: {
        from: "User", // The User model collection name
        localField: "receiver",
        foreignField: "_id",
        as: "user",
      },
    },
    // {
    //   $project: {
    //     _id: 0,
    //     status: "$_id.status",
    //     user: "$_id.createdBy",
    //     totalAmount: 1,
    //     parcelPaymentCollection: 1,
    //   },
    // },
  ]);

  res.json(userTotals)
};

const updateUser = (req, res) => {
  Transaction.findOneAndUpdate(
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
  Transaction.deleteOne({ _id: req.params.userID })
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
            // status: "$status", // Group by the 'status' field
            createdBy: "$createdBy", // Group by the 'createdBy' field
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
    console.log(userTotals);

    let fil = {};
    if (req?.body?.id) {
      fil = { _id: req?.body?.id };
    }

    const populatedUserTotals = await Transaction.populate(userTotals, {
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
    console.log(userTotals);

    const populatedUserTotals = await Transaction.populate(userTotals, {
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
  getTransactions,
  findTransactions,
  createTransaction,
  updateUser,
  deleteUser,
  adminEarnings,
  statusAnalysis,
};
