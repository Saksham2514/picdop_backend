const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fileSystem = require("fs");
const auth = require("./middlewares/Auth");
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
  adminEarnings,
  vendorEarnings,
  agentEarnings,
  statusAnalysis,
  addToWallet,
  deductWallet,
} = require("./controllers/User");

const {
  getOrder,
  getAnOrder,
  getOrderByUser,
  findOrder,
  findOrderLimit,
  createOrder,
  updateOrder,
  deleteOrder,
  imgUpload,
  getTotalIncome,
} = require("./controllers/Booking");

const {
  createNote,
  getNotes,
  getANote,
  deleteNote,
} = require("./controllers/Note");

const {
  getCategories,
  searchCategories,
  createCategory,
  updateCategories,
  deleteCategories,
  calculatePrice,
} = require("./controllers/Category");
// const {
//   createTransaction,
//   getTransactions,
//   findTransactions,
// } = require("./controllers/Transaction1");

const { getSummary } = require("./controllers/Transaction");

const {
  updateComission,
  getComission,
  getCommissionValues,
} = require("./controllers/Comission");

const {
  findRedeemReq,
  createRedeemReq,
  updateRedeemReq,
} = require("./controllers/Redeem");
const { updateDetails, getBankDetails } = require("./controllers/BankDetail");

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
router.post("/orders/searchLimit", findOrderLimit);

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

// Note
router.post("/getNotes", getNotes);

router.post("/getNote", getANote);

router.post("/createNote", createNote);

router.delete("/deleteNote/:noteId", deleteNote);
//Image Upload

// Wallet
router.post("/addToWallet", addToWallet);

router.post("/deductWallet", deductWallet);

// Commision
router.put("/updateComission", updateComission);
router.post("/getComission", getComission);
router.get("/getComissionValues", getCommissionValues);

// Redeem
router.post("/findRedeemReq", findRedeemReq);
router.post("/createredeemreq", createRedeemReq);
router.put("/updateredeemreq", updateRedeemReq);

// Bank Details
router.post("/updateBankDetails", updateDetails);
router.post("/getBankDetails", getBankDetails);

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

//ADMIN ANALYSIS

router.post("/admin/earnings", adminEarnings);
router.post("/admin/earnings/status", statusAnalysis);

// Transaction
// router.post("/admin/transaction/new", createTransaction);
// router.post("/admin/transaction/all", getTransactions);
// router.post("/admin/transaction/one", findTransactions);

router.post("/getSummary", getSummary);

module.exports = router;
