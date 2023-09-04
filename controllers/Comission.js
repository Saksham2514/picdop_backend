const Comission = require("../model/ComissionSchema");
const comissionId = "64e9d0c0852a738ad91ad2df";
const { Client } = require("@googlemaps/google-maps-services-js");
const { addToWallet } = require("./User");
const User = require("../model/Users");
const { createTransaction } = require("./Transaction");

const client = new Client({});

const updateComission = (req, res) => {
  Comission.findOneAndUpdate(
    { _id: comissionId },
    {
      $set: req.body,
    },
    { new: true, setDefaultsOnInsert: true }
  ).exec((err, updatedCom) => {
    if (err) {
      res.send(err);
    } else res.json(updatedCom);
  });
};

const getCommissionValues = (req, res) => {
  Comission.findOne({ _id: comissionId })
    .then((commissions) => {
      res.send(commissions);
    })
    .catch((err) => {
      res.send(err);
    });
};

const getComission = async (booking, res) => {
  client
    .distancematrix({
      params: {
        origins: [booking.from],
        destinations: [booking.to],
        key: "AIzaSyA1LH44XBPiK9UvZ7CnXF1U4GfDciysenE",
      },
    })
    .then((r) => {
      const distance = Math.round(
        r.data.rows[0].elements[0].distance.value / 1000
      );
      Comission.findOne({ _id: comissionId })
        .then((r) => {
          let commissionAmount = r.belowBreakpoint;
          if (distance > r.breakpoint) {
            let aboveBreakCom = (distance - r.breakpoint) * r.aboveBreakpoint;
            commissionAmount = commissionAmount + aboveBreakCom;
          }
          User.findOneAndUpdate(
            { _id: booking.agentId, role: "agent" },
            {
              $inc: { wallet: parseInt(commissionAmount) },
            },
            { new: true, setDefaultsOnInsert: true }
          )
            .select(["wallet"])
            .exec((err, User) => {
              if (err) {
                res.status(404).send({ err: "User Wallet Error" });
              } else {
                if (User == null) {
                  res
                    .status(404)
                    .send({ res: "This endpoint is only for Agent" });
                }
                createTransaction(
                  User._id,
                  commissionAmount,
                  "commission",
                  "agent"
                )
                  .then(() => {
                    res.send(User);
                  })
                  .catch(() => {
                    res.status(404).send(err);
                  });
              }
            });
        })
        .catch((err) => {
          res.status(404).send({ err: "Commission Error" });
        });
    })
    .catch((err) => {
      res.status(404).send({ err: "Invalid address Error" });
    });
};

// const createComission = () => {
//   Comission.create(
//     {
//       breakpoint: 5,
//       belowBreakpoint: 10,
//       aboveBreakpoint: 9,
//     },
//     (err, comm) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(comm);
//       }
//     }
//   );
// };

module.exports = { updateComission, getComission, getCommissionValues };
