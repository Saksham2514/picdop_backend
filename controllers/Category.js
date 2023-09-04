const Category = require("../model/CategorySchema");
const Users = require("../model/Users");

const createCategory = (req, res) => {
  Category.updateOne(
    {
      name: req?.body?.name,
      upperLimit: req?.body?.upperLimit,
      lowerLimit: req?.body?.lowerLimit,
      localPrice: req?.body?.localPrice,
      outCityPrice: req?.body?.outCityPrice,
    },
    {
      $set: {
        name: req?.body?.name,
        lowerLimit: req?.body?.lowerLimit,
        upperLimit: req?.body?.upperLimit,
        localPrice: req?.body?.localPrice,
        outCityPrice: req?.body?.outCityPrice,
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
const calculatePrice = (req, res) => {
  Users.find({
    $or: [{ _id: req.body.from }, { _id: req.body.to }],
  })
    .select("city")
    .exec((err, Users) => {
      if (err) {
        res.send(err);
      } else {
        findPrice(
          Users[0]["city"] === Users[1]["city"],
          req.body.weight,
          req.body.height
        );
      }
    });
};

const findPrice = (sameCity, weight, height) => {
  Category.find({
    $or: [
      {
        $and: [
          { lowerLimit: { $gte: weight } },
          { upperLimit: { $lte: weight } },
        ],
      },
      {
        $and: [
          { lowerLimit: { $gte: height } },
          { upperLimit: { $lte: height } },
        ],
      },
    ],
  })
    .select(sameCity ? "localPrice" : "outCityPrice")
    .exec((err, User) => {
      if (err) {
        res.send(err);
      } else res.json(User);
    });
};

const getCategories = (req, res) => {
  Category.find().exec((err, users) => {
    if (err) {
      res.send(err);
    }
    res.json(users);
  });
};

const searchCategories = (req, res) => {
  Category.find(req.body.filters)
    .select(req.body.select)
    .sort({ createdAt: -1 })
    .exec((err, users) => {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
};

const updateCategories = (req, res) => {
  Category.findOneAndUpdate(
    { _id: req.params.userID },
    {
      $set: {
        name: req?.body?.name,
        upperLimit: req?.body?.upperLimit,
        lowerLimit: req?.body?.lowerLimit,
        localPrice: req?.body?.localPrice,
        outCityPrice: req?.body?.outCityPrice,
      },
    },
    { new: true, setDefaultsOnInsert: true }
  ).exec((err, User) => {
    if (err) {
      res.send(err);
    } else res.json(User);
  });
};

const deleteCategories = (req, res) => {
  Category.deleteOne({ _id: req.params.userID })
    .then(() => res.json({ message: "Category Deleted" }))
    .catch((err) => res.send(err));
};

module.exports = {
  getCategories,
  calculatePrice,
  searchCategories,
  createCategory,
  updateCategories,
  deleteCategories,
};
