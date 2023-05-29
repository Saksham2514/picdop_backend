const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fileSystem = require("fs");

let uploadedFileName = [];

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: function (req, file, cb) {
//     const uploadedName = Date.now() + file.originalname;
//     uploadedFileName.push(uploadedName);
//     cb(null, uploadedName);
//   },
// });
// const upload = multer({ storage });

const {
  getUsers,

  findUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("./controllers/User");

const {
  getOrder,
  getAnOrder,
  getOrderByUser,
  findOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  imgUpload,
  getTotalIncome,
} = require("./controllers/Booking");

const {
  getCategories,
  searchCategories,
  createCategory,
  updateCategories,
  deleteCategories,
  calculatePrice,
} = require("./controllers/Category");

router.get("/", (req, res) => {
  res.send("Working");
});

// User Routes
router.get("/users", getUsers);

router.post("/users/search", findUsers);

router.post("/users", createUser);

router.put("/users/:userID", updateUser);

router.delete("/users/:userID", deleteUser);
// USer Routes end

// Booking Routs
router.get("/orders", getOrder);

router.get("/order/:userID", getOrderByUser);

router.post("/orders/search", findOrder);

router.post("/orders", createOrder);
router.post("/income", getTotalIncome);

router.put("/orders/:orderID", updateOrder);

router.delete("/orders/:orderID", deleteOrder);

//Categories
router.get("/prices", getCategories);

router.post("/prices/search", searchCategories);

router.post("/prices", createCategory);
router.post("/calculate/prices", calculatePrice);

router.put("/prices/:userID", updateCategories);

router.delete("/prices/:userID", deleteCategories);

//Image Upload

// router.post(
//   "/test",
//   upload.fields([
//     { name: "shopImages", maxCount: 5 },
//     { name: "billImages", maxCount: 5 },
//     { name: "parcelImages", maxCount: 5 },
//   ]),
//   function (req, res) {
//     if (uploadedFileName.length === 0)
//       res.json({ stat: "error", message: "something went wrong" });
//     else {
//       res.json({ stat: "success", message: uploadedFileName });
//       uploadedFileName = [];
//     }
//   }
// );

module.exports = router;
