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
  // deductWallet,
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
  // getComission,
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
router.get("/users", auth(["agent", "user", "admin"]), getUsers);
router.post("/users/search", findUsers);
router.post("/users", createUser);
router.put("/users/:userID", auth(["admin", "agent", "user"]), updateUser);
router.delete("/users/:userID", auth(["admin"]), deleteUser);
// USer Routes end

// Booking Routes
router.get("/orders", auth(["admin", "agent", "user"]), getOrder);
router.get("/order/:userID", auth(["admin", "agent", "user"]), getOrderByUser);
router.post("/orders/search", auth(["admin", "agent", "user"]), findOrder);
router.post(
  "/orders/searchLimit",
  auth(["admin", "agent", "user"]),
  findOrderLimit
);
router.post("/orders", auth(["admin", "agent", "user"]), createOrder);
router.post("/income", auth(["admin", "agent", "user"]), getTotalIncome);
router.put("/orders/:orderID", auth(["admin", "agent", "user"]), updateOrder);
router.delete(
  "/orders/:orderID",
  auth(["admin", "agent", "user"]),
  deleteOrder
);

//Categories
router.get("/prices", auth(["admin", "agent", "user"]), getCategories);
router.post(
  "/prices/search",
  auth(["admin", "agent", "user"]),
  searchCategories
);
router.post("/prices", auth(["admin", "agent", "user"]), createCategory);
router.post(
  "/calculate/prices",
  auth(["admin", "agent", "user"]),
  calculatePrice
);
router.put(
  "/prices/:userID",
  auth(["admin", "agent", "user"]),
  updateCategories
);
router.delete(
  "/prices/:userID",
  auth(["admin", "agent", "user"]),
  deleteCategories
);

// Note
router.post("/getNotes", auth(["admin"]), getNotes);
router.post("/getNote", auth(["user"]), getANote);
router.post("/createNote", auth(["user"]), createNote);
router.delete("/deleteNote/:noteId", auth(["user"]), deleteNote);

// Wallet
router.post("/addToWallet", auth(["user"]), addToWallet);
// router.post("/deductWallet", deductWallet);

// Commision
router.put("/updateComission", auth(["admin"]), updateComission);
router.get("/getComissionValues", auth(["admin"]), getCommissionValues);
// router.post("/getComission", auth(["agent"]), getComission);

// Redeem
router.post("/findRedeemReq", auth(["agent", "admin"]), findRedeemReq);
router.post("/createredeemreq", auth(["agent"]), createRedeemReq);
router.put("/updateredeemreq", auth(["admin"]), updateRedeemReq);

// Bank Details
router.post("/updateBankDetails", auth(["agent"]), updateDetails);
router.post("/getBankDetails", auth(["agent", "admin"]), getBankDetails);

// Image upload
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

router.post("/getSummary", auth(["admin", "user", "agent"]), getSummary);

module.exports = router;
