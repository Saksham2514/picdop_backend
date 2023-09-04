const BankDetail = require("../model/BankDetails");

const updateDetails = (req, res) => {
  const fields = {
    holderName: req.body.holderName,
    bankName: req.body.bankName,
    ifscCode: req.body.ifscCode,
    accountNumber: req.body.accountNumber,
    userID: req.body.userID,
    upi: req.body.upi,
  };

  return BankDetail.findOneAndUpdate(
    { userID: req.body.userID },
    {
      $set: fields,
    },
    { upsert: true }
  );
};

const getBankDetails = (req, res) => {
  BankDetail.findOne({ userID: req.body.userID })
    .then((bankDetails) => {
      res.send(bankDetails);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  updateDetails,
  getBankDetails,
};
