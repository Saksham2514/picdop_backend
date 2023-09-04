const BankDetails = require("../model/BankDetails");
const Redeem = require("../model/Redeem");
const { updateDetails } = require("./BankDetail");
const { deductWallet, addToWallet } = require("./User");
const User = require("../model/Users");
const { createTransaction } = require("./Transaction");

const createRedeemReq = (req, res) => {
  updateDetails(req, res)
    .select("_id")
    .then((result) => {
      if (result._id) {
        Redeem.create(
          {
            status: "initiated",
            amount: req.body.amount,
            userID: req.body.userID,
            bankID: result._id,
          },
          (err, Req) => {
            if (err) {
              res.send(err);
            } else {
              deductWallet(req, res);
            }
          }
        );
      } else {
        res.send("User Bank Details Not found");
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

const findRedeemReq = async (req, res) => {
  const redeemData = await Redeem.find(req.body);
  if (!req.body?.userID) {
    try {
      const result = await BankDetails.populate(redeemData, {
        path: "bankID",
        select: ["accountNumber", "holderName", "bankName", "ifscCode", "upi"],
      });
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  } else {
    res.send(redeemData);
  }
};

const updateRedeemReq = (req, res) => {
  Redeem.findOneAndUpdate(
    { _id: req.body.redeemID },
    {
      $set: {
        status: req.body.status,
      },
    },
    (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        if (req.body.status === "rejected") {
          User.findOneAndUpdate(
            { _id: result.userID },
            {
              $inc: { wallet: parseInt(result.amount) },
            },
            { new: true, setDefaultsOnInsert: true }
          )
            .select(["wallet"])
            .exec((err, User) => {
              if (err) {
                res.send(err);
              } else {
                createTransaction(
                  User._id,
                  result.amount,
                  "redeemRefund",
                  "user"
                );
                res.send(result);
              }
            });
        } else {
          res.send(result);
        }
      }
    }
  );
};

module.exports = {
  findRedeemReq,
  createRedeemReq,
  updateRedeemReq,
};
