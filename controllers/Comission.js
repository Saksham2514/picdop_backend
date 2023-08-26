const Comission = require("../model/ComissionSchema");
const comissionId = "64e9d0c0852a738ad91ad2df";
const { Client } = require("@googlemaps/google-maps-services-js");
const { addToWallet } = require("./User");
const User = require("../model/Users");

const client = new Client({});

const updateComission = (req, res) => {
  Comission.findOneAndUpdate(
    { _id: comissionId },
    {
      $set: {
        breakpoint: req.breakpoint,
        belowBreakpoint: booking.belowBreakpoint,
        aboveBreakpoint: booking.aboveBreakpoint,
      },
    },
    { new: true, setDefaultsOnInsert: true }
  ).exec((err, updatedCom) => {
    if (err) {
      res.send(err);
    } else res.json(updatedCom);
  });
};

const getComission = async (booking, res) => {
  const distance = await client
    .distancematrix({
      params: {
        origins: [booking.from],
        destinations: [booking.to],
        key: "AIzaSyA1LH44XBPiK9UvZ7CnXF1U4GfDciysenE",
      },
    })
    .then((r) => {
      console.log(r.data.rows[0]);
      return Math.round(r.data.rows[0].elements[0].distance.value / 1000);
    })
    .catch((err) => {
      console.log(err);
      //   return res.send(err);
    });
  console.log("working1");
  console.log(distance);
  const commissionAmount = await Comission.findOne({ _id: comissionId })
    .then((r) => {
      if (distance <= r.breakpoint) {
        return distance * r.belowBreakpoint;
      } else {
        let belowBreakCom = r.breakpoint * r.belowBreakpoint;
        let aboveBreakCom = (distance - r.breakpoint) * r.aboveBreakpoint;
        return belowBreakCom + aboveBreakCom;
      }
    })
    .catch((err) => {
      console.log(err);
      //   return res.send(err);
    });
  console.log("working2");
  console.log(commissionAmount);
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
        // res.send(err);
        console.log(err);
      } else {
        if (User == null) {
          res.send({ res: "This endpoint is only for Agent" });
        }
        res.send(User);
      }
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

module.exports = { updateComission, getComission };
