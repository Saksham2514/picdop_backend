const BankDetail = require("../model/BankDetails");

const updateDetails = (req, res) => {
  const fields = {
    holderName: req.body.holderName,
    bankName: req.body.bankName,
    ifscCode: req.body.ifscCode,
    accountNumber: req.body.accountNumber,
    userID: req.body.userID,
  };

  if (req.body.upi) fields.upi = req.body.upi;
  
  BankDetail.findOneAndUpdate(
    { userID: req.body.userID },
    {
      $set: fields,
    },
    { upsert: true }
  )
    .then((detail) => {
      console.log(detail);
    })
    .catch((err) => {
      console.log(err);
    });
};
