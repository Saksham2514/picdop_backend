const BankDetails = require("../model/BankDetails");
const Redeem = require("../model/Redeem");

const createRedeemReq = () => {
  Redeem.findOneAndUpdate(
    { _id, reqID },
    {
      $set: {
        status: req.body.product,
        amount: req.body.quantity,
        agentID: req.body.createdBy,
      },
    },
    { upsert: true },
    (err, Req) => {
      if (err) {
        res.send(err);
      } else res.json(Req);
    }
  );
};

const getRedeemReq = async (req, res) => {
  const redeemData = await Redeem.find();
  BankDetails.populate(redeemData, {
    path: "agentID",
    select: "accountNumber",
  });
};
