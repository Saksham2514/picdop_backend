const router = require("express").Router();

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
} = require("./controllers/Booking");

router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
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

// router.get("/orders/:orderId", getAnOrder);

router.get("/order/:userID", getOrderByUser);

router.post("/orders/search", findOrder);

router.post("/orders", createOrder);

router.put("/orders/:orderID", updateOrder);
  

router.delete("/orders/:orderID", deleteOrder);

module.exports = router;