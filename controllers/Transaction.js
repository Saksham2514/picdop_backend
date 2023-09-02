const { ObjectId } = require("bson");
const Transaction = require("../model/Transaction");
const timeFilters = {
  daily: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  weekly: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
  monthly: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
  yearly: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
};

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
  const daily = await getData(timeFilters.daily, "Booking", "user");
  daily.unshift("24 Hrs.");
  const weekly = await getData(timeFilters.weekly, "Booking", "user");
  weekly.unshift("7 Days");
  const monthly = await getData(timeFilters.monthly, "Booking", "user");
  monthly.unshift("30 Days");
  const yearly = await getData(timeFilters.yearly, "Booking", "user");
  yearly.unshift("365 Days");

  res.send([daily, weekly, monthly, yearly]);
};

const getAgentCommission = async (req, res) => {
  const daily = await getData(
    timeFilters.daily,
    "commission",
    "agent",
    req.body.userID
  );
  daily.unshift("24 Hrs.");
  const weekly = await getData(
    timeFilters.weekly,
    "commission",
    "agent",
    req.body.userID
  );
  weekly.unshift("7 Days");
  const monthly = await getData(
    timeFilters.monthly,
    "commission",
    "agent",
    req.body.userID
  );
  monthly.unshift("30 Days");
  const yearly = await getData(
    timeFilters.yearly,
    "commission",
    "agent",
    req.body.userID
  );
  yearly.unshift("365 Days");
  res.send([daily, weekly, monthly, yearly]);
};

const getUserExpend = async (req, res) => {
  const daily = await getData(
    timeFilters.daily,
    "Booking",
    "user",
    req.body.userID
  );
  daily.unshift("24 Hrs.");
  const weekly = await getData(
    timeFilters.weekly,
    "Booking",
    "user",
    req.body.userID
  );
  weekly.unshift("7 Days");
  const monthly = await getData(
    timeFilters.monthly,
    "Booking",
    "user",
    req.body.userID
  );
  monthly.unshift("30 Days");
  const yearly = await getData(
    timeFilters.yearly,
    "Booking",
    "user",
    req.body.userID
  );
  yearly.unshift("365 Days");
  res.send([daily, weekly, monthly, yearly]);
};

const getData = (timeFilter, type, role, id) => {
  const matchStage = {
    type: type,
    role: role,
    createdAt: {
      $gte: timeFilter,
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
