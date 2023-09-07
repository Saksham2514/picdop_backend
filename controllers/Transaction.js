const { ObjectId } = require("bson");
const Transaction = require("../model/Transaction");

const createTransaction = (userID, amount, type, role) => {
  return Transaction.create({
    createdBy: userID,
    amount: amount,
    type: type,
    role: role,
  });
};

const getSummary = (req, res) => {
  if (req.body.role == "admin") {
    getAdminEarning(req, res);
  } else if (req.body.role == "agent") {
    getAgentCommission(req, res);
  } else {
    getUserExpend(req, res);
  }
};

const getAdminEarning = async (req, res) => {
  const daily = await getData(1, "Booking", "user");
  daily.unshift("24 Hrs.");
  const weekly = await getData(7, "Booking", "user");
  weekly.unshift("7 Days");
  const monthly = await getData(30, "Booking", "user");
  monthly.unshift("30 Days");
  const yearly = await getData(365, "Booking", "user");
  yearly.unshift("365 Days");

  res.send([daily, weekly, monthly, yearly]);
};

const getAgentCommission = async (req, res) => {
  const daily = await getData(1, "commission", "agent", req.body.userID);
  daily.unshift("24 Hrs.");
  const weekly = await getData(7, "commission", "agent", req.body.userID);
  weekly.unshift("7 Days");
  const monthly = await getData(30, "commission", "agent", req.body.userID);
  monthly.unshift("30 Days");
  const yearly = await getData(365, "commission", "agent", req.body.userID);
  yearly.unshift("365 Days");
  res.send([daily, weekly, monthly, yearly]);
};

const getUserExpend = async (req, res) => {
  const daily = await getData(1, "Booking", "user", req.body.userID);
  daily.unshift("24 Hrs.");
  const weekly = await getData(7, "Booking", "user", req.body.userID);
  weekly.unshift("7 Days");
  const monthly = await getData(30, "Booking", "user", req.body.userID);
  monthly.unshift("30 Days");
  const yearly = await getData(365, "Booking", "user", req.body.userID);
  yearly.unshift("365 Days");
  res.send([daily, weekly, monthly, yearly]);
};

const getData = (days, type, role, id) => {
  const matchStage = {
    type: type,
    role: role,
    createdAt: {
      $gte: new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  };

  if (id) {
    matchStage.createdBy = new ObjectId(id);
  }

  return Transaction.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      },
    },
  ]);
};

module.exports = {
  createTransaction,
  getSummary,
};
