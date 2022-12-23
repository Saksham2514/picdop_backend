const User = require("../model/Users");

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
      role: req.body.role ? req.body.role : "user" ,
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
        role: req.body.role ? req.body.role : "user" ,
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
    { upsert: true ,setDefaultsOnInsert: true},
    (err, User) => {
      if (err) {
        res.send(err);
      } else res.json(User);
    }
  );
};

const getUsers = (req, res) => {
  
  User.find().select(['-cardCVV','-cardNumber','-cardHolder','-cardExpiry','-password']).exec((err, users) => {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
};

const findUsers = (req, res) => {
  User.find(req.body).sort({createdAt:-1}).select(['-cardCVV','-cardNumber','-cardHolder','-cardExpiry','-password']).exec((err, users) => {
    if (err) {
      res.send(err);
    }
    res.json(users);
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
        role: req.body.role ? req.body.role : "user" ,
        category: req.body.category,
        subCategory: req.body.subCategory,
        shopName: req.body.shopName,
        shopNumber: req.body.shopNumber,
        cardNumber: req.body.cardNumber,
        cardHolder: req.body.cardHolder,
        cardExpiry: req.body.cardExpiry,
        cardCVV: req.body.cardCVV,
      },
    },
    { new: true,setDefaultsOnInsert:true }
  ).select(['-cardCVV','-cardNumber','-cardHolder','-cardExpiry','-password']).exec((err, User) => {
      if (err) {
        res.send(err);
      } else res.json(User);
    }
  );
};

const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userID })
    .then(() => res.json({ message: "User Deleted" }))
    .catch((err) => res.send(err));
};

module.exports = {
  getUsers,
  findUsers,
  createUser,
  updateUser,
  deleteUser,
};
