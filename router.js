const router = require("express").Router();
const multer = require("multer");

let uploadedFileName ="";

const storage = multer.diskStorage({
  destination:"uploads/",
  filename: function(req,file,cb){
   const type = "."+file.mimetype.split("/")[1];
   uploadedFileName = file.originalname.split(type)[0]+ '-' + Date.now()+type;
    cb( null, file.originalname.split(type)[0]+ '-' + Date.now()+type );
  }
})
const upload = multer({storage})
// const upload = multer({ dest: "./uploads" });
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
} = require("./controllers/Booking");


router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

// User Routes
router.get("/users", getUsers);

router.post("/users/search", findUsers);

router.post("/users", createUser);

router.post("/test", upload.fields([{name:"shopImages",maxCount:5},{name:"billImages",maxCount:5},]) , function (req, res) {
  console.log(uploadedFileName, req.body);
  
  res.send(uploadedFileName);
});

router.put("/users/:userID", updateUser);

router.delete("/users/:userID", deleteUser);
// USer Routes end
// Booking Routs
router.get("/orders", getOrder);

router.get("/order/:userID", getOrderByUser);

router.post("/orders/search", findOrder);

router.post("/orders", createOrder);

router.put("/orders/:orderID", updateOrder);

router.delete("/orders/:orderID", deleteOrder);

module.exports = router;
